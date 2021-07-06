'use strict'

/**
 * Read a document from Google Cloud Storage and then send the contents to a
 * Document AI processor
 */

const projectID = process.env.PROJECTID;
const processorID = process.env.PROCESSORID;
const dataset = process.env.DATASET;

import { BigQuery } from '@google-cloud/bigquery';
import { v1 } from '@google-cloud/documentai';
const { DocumentProcessorServiceClient } = v1;
import { Storage } from '@google-cloud/storage';
import { v4 as uuid } from 'uuid';
const client = new DocumentProcessorServiceClient();
const storage = new Storage();

import DocScope from './lap.mjs';
const docscope = new DocScope();

/**
 * A simple prototype to do a comparison of two integer ranges. This is used
 * to see if the start / end index of a form field are with in a certain paragraph text.
 */
Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

/**
 * A function to save data to BigQuery
 * 
 * @param {string} table The BigQuery table name to sve to
 * @param {object} records The object that matches the table schema with records to be saved
 */
async function saveData( table, records ) {
    if(!process.env.PROJECTID || !process.env.PROCESSORID|| !process.env.DATASET) {
        console.error('Missing project and/or document AI processor ID and/or BQ dataset name environment variables');
    }

    const bq = new BigQuery();

    await bq
        .dataset(dataset)
        .table(table)
        .insert(records, {
            createInsertId: true
        })
        .then( (resp) => {
            console.log(`Inserted document: ${resp}`);
        })
        .catch( (err) => {
            if(err.name === 'PartialFailureError') {
                throw err.response.insertErrors;
            }
        })
}

/**
 * Read and send a document to a single document AI processor.
 * 
 * @param {string} bucketName The name of the bucket to read the file from. This comes from the pub/sub message
 * @param {string} file The name of the file to read from. This comes from the pub/sub message
 */
async function processDocument(bucketName, file) {
    return new Promise( async (results, reject) => {
        /**
         * Construct the proper Document AI processor name
         */
        const name = `projects/${projectID}/locations/us/processors/${processorID}`;

        /**
         * A helpfer function to read a files contents from GCS and return a base64 encoded version.
         * 
         * @param {object} gcs An object that has two values. bucketName and file.
         */
        const readFile = (gcs) => {
            return new Promise( (res, rej) => {
                storage.bucket(gcs.bucketName).file(gcs.file).download( (err, contents) => {
                    if(err) rej(err);
                    res(contents.toString('base64'));
                });
            });
        };

        /**
         * A helper function that will return just the text value for element using it's start and end index.
         * 
         * @param {object} textAnchor The textAnchor object from the document AI API return.
         */
        const getText = textAnchor => {
            if(!textAnchor || !textAnchor.textSegments || textAnchor.textSegments.length === 0) {
                return '';
            }

            const startIndex = textAnchor.textSegments[0].startIndex || 0;
            const endIndex = textAnchor.textSegments[0].endIndex;

            return text.substring(startIndex, endIndex).replace(/\r?\n|\r/g, "").trim();
        };

        /**
         * A helper function that will look for a textSegments value with in provied paragraphs and return the paragraph the contained
         * the textSegment. This is used below for filled_checkboxes form fields so that we can save which "question" the checkbox was for
         * 
         * @param {object} textSegments The textSegments object from the document AI API return
         * @param {array} paragraphs An array of paragraph objects from the document AI API return
         */
        const getParagraph = (textSegments, paragraphs) => {
            const startIndex = parseInt(textSegments[0].startIndex);
            const endIndex = parseInt(textSegments[0].endIndex);

            for( const pg of paragraphs) {
                let pgStart = parseInt(pg.layout.textAnchor.textSegments[0].startIndex);
                let pgEnd = parseInt(pg.layout.textAnchor.textSegments[0].endIndex);

                if (startIndex.between(pgStart, pgEnd) && endIndex.between(pgStart, pgEnd)) {
                    return getText(pg.layout.textAnchor);
                }
            }
        };

        /**
         * A help function to parse parts of the document ai API
         * 
         * @param {object} entityData The entity object that contains the textAnchor ad confidence layer
         */
        const entityDataRecord = (entityData, pageData) => {
            let entityStartIndex = 0, entityEndIndex = 0;        

            if(entityData.textAnchor !== null && entityData.textAnchor.textSegments.length > 0) {
                entityStartIndex = entityData.textAnchor.textSegments[0].startIndex;
                entityEndIndex = entityData.textAnchor.textSegments[0].endIndex;
            }
            
            const normalizedVertices = entityData.boundingPoly.normalizedVertices;
            const vertices = [];

            for(const vert of normalizedVertices) {
                vertices.push(
                    {
                        x: (vert.x * pageData.width),
                        y: (vert.y * pageData.height)
                    }
                )
            }

            return {
                entity: getText(entityData.textAnchor),
                entityConf: entityData.confidence.toFixed(4),
                entityStartIndex: entityStartIndex,
                entityEndIndex: entityEndIndex,
                entityVertices: JSON.stringify(vertices)
            };
        }

        /**
         * Read the file from GCS storage using our helper function
         */
        const encodedImage = await readFile({bucketName, file});
        
        /**
         * Create the API request object. This is hard coded to be a PDF file for this demo
         */
        const request = {
            name,
            rawDocument: {
                content: encodedImage,
                mimeType: 'application/pdf',
            },
        };

        /**
         * Call and process the response from Document AI API
         */
        const [result] = await client.processDocument(request);
        const {document} = result;
        const {text} = document;
        console.log('Document Processed by DocAI');

        /**
         * DEBUG - Write API results to a file
         */
        /*const fs = require('fs');
        fs.writeFile('./api_results.json', JSON.stringify(document, null, ' '), (err) => {});
        return;*/

        /**
         * Start creating the objec that will store our values that need to be saved
         * into BigQuery
         */
        const docData = {
            doc_id: uuid(),
            name: file,
            num_pages: document.pages.length,
            mimeType: document.mimeType,
            text: document.text,
        };

        /**
         * Create an array that will now store all the table and form field entities to be saved into BigQuery
         */
        let documentEntities = [];
        docData.page = [];

        /**
         * Assuming there is pages to be processed
         */
        for (const page of document.pages) {
            /**
             * Test to make sure there are tables in the page then processes the tables on the page.
             * NOTE: The headerRows return for the test demo form was capturing incorrectly so this code
             * is hardcoded to assume the first row is the actual table header
             */
            if(page.tables && page.tables.length > 0) {
                console.log('Table found in Document, processing...');

                const table = page.tables[0];

                for(let i = 1; i < table.bodyRows.length; i++) {
                    for(let c = 0; c < table.bodyRows[i].cells.length; c++) {
                        const tableHeaderRecord = entityDataRecord(table.bodyRows[0].cells[c].layout, page.dimension);
                        const tableRecord = entityDataRecord(table.bodyRows[i].cells[c].layout, page.dimension);

                        docscope.addEntity(tableHeaderRecord, tableRecord, 'table');

                        documentEntities.push(
                            { 
                            entity_name: tableHeaderRecord.entity,
                            entity_value: tableRecord.entity,
                            value_type: 'table',
                            entity_name_confidence: tableHeaderRecord.entityConf,
                            entity_value_confidence: tableRecord.entityConf,
                            entity_name_start_index: tableHeaderRecord.entityStartIndex,
                            entity_name_end_index: tableHeaderRecord.entityEndIndex,
                            entity_value_start_index: tableRecord.entityStartIndex,
                            entity_value_end_index: tableRecord.entityEndIndex,
                            vertices: tableRecord.entityVertices,
                        });
                    }
                }
            }

            /**
             * Start processing the form fields from the form processor. This return object won't exist if using a generic document processor.
             */
            const {formFields, paragraphs} = page;

            for (const field of formFields) {
                const fieldNameRecord = entityDataRecord(field.fieldName, page.dimension);
                const fieldValueRecord = entityDataRecord(field.fieldValue, page.dimension);
                const question = (field.valueType === 'filled_checkbox') ? getParagraph(field.fieldName.textAnchor.textSegments, paragraphs) : '' ;
                
                docscope.addEntity(fieldNameRecord, fieldValueRecord, field.valueType);
                
                documentEntities.push(
                    {
                        entity_name: fieldNameRecord.entity,
                        entity_value: fieldValueRecord.entity,
                        entity_name_confidence: fieldNameRecord.entityConf,
                        entity_value_confidence: fieldValueRecord.entityConf,
                        entity_name_start_index: fieldNameRecord.entityStartIndex,
                        entity_name_end_index: fieldNameRecord.entityEndIndex,
                        entity_value_start_index: fieldValueRecord.entityStartIndex,
                        entity_value_end_index: fieldValueRecord.entityEndIndex,
                        vertices: fieldNameRecord.entityVertices,
                        value_type: field.valueType,
                        paragraph_text: question
                });
            }

            /**
             * Add the newly gathers tables and formFields to the object for saving into BigQuery
             */
            if(documentEntities.length > 0) {
                docData.page.push(
                    {
                        page_num: page.pageNumber,
                        page_width: page.dimension.width,
                        page_height: page.dimension.height,
                        page_dimension_unit: page.dimension.unit,
                        entities: documentEntities,
                    },
                );

                /**
                 * Re-set the object for the next page
                 */
                documentEntities = [];
            }
        }

        console.log('Processing Complete.');

        /**
         * Assuming we processed something in the document ai response, save the data to BigQuery
         */
        if(docData.page.length > 0) {
            try {
                await saveData('document_entities', docData);
            } catch(e) {
                const errors = [];
                e.forEach(err => {
                    err.errors.forEach(error => {
                        errors.push(`Column: ${error.location} - ${error.message}`);
                    });
                });

                reject(`Error saving document data to BigQuery: ${errors}`);
            }
        }

        if(docscope.docFound) {
            try {
                await saveData(docscope.docTable, docscope.doc);
            } catch(e) {
                const errors = [];
                e.forEach(err => {
                    err.errors.forEach(error => {
                        errors.push(`Column: ${error.location} - ${error.message}`);
                    });
                });

                reject(`Error saving lap document data: ${errors}`);
            }
        }

        results('Document processed');
        return;
    });
}

export default processDocument;
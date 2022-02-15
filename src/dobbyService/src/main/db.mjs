'use strict';

import {BigQuery} from '@google-cloud/bigquery';
const bq = new BigQuery();

/**
 * Read data from BigQuery for the file that was uploaded
 * @param {integer} docId The ID of the document to pull data for
 */
async function readData(docId) {
    const query = `SELECT
        doc_id,
        name,
        num_pages,
        entities.entity_name,
        entities.entity_value,
        entities.entity_name_confidence,
        entities.entity_value_confidence
        FROM \`${process.env.PROJECTID}.${process.env.DATASET}.document_entities\`,
        UNNEST(page) page, UNNEST(page.entities) entities
        WHERE doc_id= '${docId}'`;

    const options = {
        query: query,
        location: 'US',
    };

    const [job] = await bq.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    const results = {
        row_count: rows.length,
        rows: rows,
    };

    return results;
}

export default readData;

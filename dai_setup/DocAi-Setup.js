'use strict'

const {DocumentProcessorServiceClient} = require('@google-cloud/documentai').v1beta3;

const client = new DocumentProcessorServiceClient();

async function createDocAiProcessor() {
    const request = {
        parent: `projects/${process.env.PROJECT_ID}/locations/us`,
        processor: {
            type: 'FORM_PARSER_PROCESSOR',
            displayName: 'dai_demo_fp'
        }
    };

    try {
        const [response] = await client.createProcessor(request);
        console.log(`{ "processorId": "${response.name.split('/')[5]}" }`);
    }catch(err) {
       (err.code !== 6) ? console.error(`{ "error": "${err.details}"`) : console.log(' { "processorId": "" } ');

    }

    return;
}

createDocAiProcessor();
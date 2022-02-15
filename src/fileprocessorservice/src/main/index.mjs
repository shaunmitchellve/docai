'use strict';

/**
 * Seperated the file processor and the endpoint traffic management for
 * greater flexibility
 */
import processDocument from './doc_ai.mjs';
import express, {json} from 'express';
import { start } from '@google-cloud/debug-agent';
start({serviceContext: {enableCanary: false}});

const app = express();

const PORT = process.env.PORT || 8080;

app.use(json());

app.post('/', async (req, res) => {
    /**
     * Let's make sure that the message coming in is in the correct
     * pub/sub message format.
     */
    if (!req.body) {
        const msg = 'no Pub/Sub message received';
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return;
    }

    if (!req.body.message) {
        const msg = 'invalid Pub/Sub message format';
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return;
    }

    const pubSubMessage = req.body.message;
    const data = pubSubMessage.data ? JSON.parse(Buffer.from(pubSubMessage.data, 'base64').toString().trim()) : '';

    if (data.bucket && data.name) {
        try {
            const results = await processDocument(data.bucket, data.name);
            console.log(results);
            res.status(204).send();
            return;
        } catch (e) {
            console.error(e);
            res.status(400).send(`Document processing error: ${e}`);
            return;
        }
    } else {
        console.error(`error: pub/sub message didn't contain bucket and file name`);
        res.status(400).send('Bad Request in pub/sub message');
        return;
    }
});

app.listen(PORT, () => {
    console.log(`File Processor Service listening on port ${PORT}`);
});

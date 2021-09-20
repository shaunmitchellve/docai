'use strict';

import convertDocument from './convert.mjs';
import express from 'express';
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json( {limit: '6mb'} ));

app.post('/cutPages', async (req, res) => {
    const returnFiles = await convertDocument(req.body.file);
    res.status(200).send(returnFiles);
});

app.listen(PORT, () => {
    console.log(`PDF Converter listening on port ${PORT}`);
});

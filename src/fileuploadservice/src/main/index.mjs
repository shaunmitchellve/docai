'use strict'

import {Storage} from '@google-cloud/storage';
import express, {json} from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKETNAME);
const app = express();

const key = fs.readFileSync('./src/key.pem');
const cert = fs.readFileSync('./src/cert.pem');

const server = https.createServer({key: key, cert: cert}, app);

const PORT = process.env.PORT || 8080;

app.use(json());
app.use(cors());

app.get('/upload', async (req, res) => {
    console.log(req.file);
    res.status(200).send('gotit');
});

//server.listen(PORT, () => {
app.listen(PORT, () => {
    console.log(`File Upload Service listeing on ${PORT}`);
});
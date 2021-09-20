'use strict';

import express, {json} from 'express';
import cors from 'cors';
import multer from 'multer';
import uploadFile from './uploadFile.mjs';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const app = express();

const PORT = process.env.PORT || 8080;

app.disable('x-powered-by');
app.use(upload.single('file'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(json());
app.use(cors());

app.post('/upload', async (req, res) => {
    await uploadFile(req.file).then( (url) => {
        res.status(200).send(`{url: ${url}}`);
    }).catch( (err) => {
        const message = err.errors[0].message;
        console.error(message);
        res.status(err.code).send(message);
    });
});

app.listen(PORT, () => {
    console.log(`File Upload Service listeing on ${PORT}`);
});

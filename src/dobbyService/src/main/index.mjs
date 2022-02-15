'use strict';

import express, {json} from 'express';
import cors from 'cors';
import readData from './db.mjs';


const app = express();

const PORT = process.env.PORT || 8080;

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(json());
app.use(cors());

app.get('/file_data', async (req, res) => {
    try {
        const results = readData(req.doc_id);
        console.log(results);
        res.status(200).send(results);
    } catch (e) {
        console.error(e);
        res.status(400).send(e);
    }
});

app.listen(PORT, () => {
    console.log(`Dobby Service listeing on ${PORT}`);
});

'use strict';

import {Storage} from '@google-cloud/storage';
import {v4 as uuid} from 'uuid';
const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKETNAME);

const uploadFile = (file) => new Promise( (res, rej) => {
    const {originalname, buffer, mimetype} = file;

    const fileOptions = {
        contentType: mimetype,
        resumable: false,
        metadata: {
            file_id: uuid(),
        },
    };

    const blob = bucket.file(originalname.replace(/ /g, '_'));
    blob.save(buffer, {
        metadata: fileOptions,
    }).then( () => {
        const url = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;
        res(url);
    }).catch( (err) => {
        rej(err);
    });
});

export default uploadFile;

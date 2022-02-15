'use strict';

import {Storage} from '@google-cloud/storage';
import {v4 as uuid} from 'uuid';
const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKETNAME);

const uploadFile = (file) => new Promise( (res, rej) => {
    const {originalname, buffer, mimetype} = file;
    const fileId = uuid();

    const fileOptions = {
        contentType: mimetype,
        resumable: false,
        metadata: {
            file_id: fileId,
        },
    };

    const blob = bucket.file(originalname.replace(/ /g, '_'));
    blob.save(buffer, {
        metadata: fileOptions,
    }).then( () => {
        const url = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;
        const ret = {
            url: url,
            fileId: fileId,
        };

        res(JSON.stringify(ret));
    }).catch( (err) => {
        rej(err);
    });
});

export default uploadFile;

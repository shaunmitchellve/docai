'use strict';

import {Storage} from '@google-cloud/storage';
const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKETNAME);

const uploadFile = (file) => new Promise( (res, rej) => {
    const {originalname, buffer, mimetype} = file;

    const blob = bucket.file(originalname.replace(/ /g, '_'));
    blob.save(buffer, {
        contentType: mimetype,
        resumable: false,
    }).then( () => {
        const url = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;
        res(url);
    }).catch( (err) => {
        rej(err);
    });
});

export default uploadFile;

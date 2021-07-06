'use strict'

import gm from 'gm';
import { Storage } from '@google-cloud/storage';
import fs from 'fs';
const storage = new Storage();


function convertFile(bucketName, file) {
        return new Promise( async (results, reject) => {
        /**
         * A helpfer function to read a files contents from GCS and return a base64 encoded version.
         * 
         * @param {object} gcs An object that has two values. bucketName and file.
         */
        const readFile = (gcs) => {
            return new Promise( (res, rej) => {
                storage.bucket(gcs.bucketName).file(gcs.file).download( (err, contents) => {
                    if(err) rej(err);
                    res(contents);
                });
            });
        };

        /**
         * A helper function to read from the locally saved / converted image file and upload it to GCS
         * 
         * @param gcs AN object that has two values. bucketName to save to and filename to save as
         */
        const writeFile = (gcs) => {
            return new Promise( (res, rej) => {
                fs.createReadStream('./' + gcs.file)
                .pipe(storage.bucket(gcs.bucketName).file(gcs.file).createWriteStream())
                .on('error', (err) => rej(err))
                .on('finish', () => {
                    fs.unlinkSync('./' + gcs.file);
                    res('File uploaded to bucket');
                 } );
            });
        };

        /**
         * Use the gm library (and ghostscript / imagemagik by extension) to convert a pdf to a jpeg file
         * 
         * @param buffer The Buffer that is pulled from the GCS file
         * @param fileName The original filename to help gm determine that it's a PDF file
         * @param toFileName The new filename that will be used to write to local disk
         */
        const convert = (buffer, fileName, toFileName) => {
            return new Promise( (res, rej) => {
                gm(buffer, fileName)
                .density(350, 350)
                .write(toFileName, (er) => {
                    if(er) rej(er)
                    else res('File written');
                });
            });
        };

        /**
         * Read the file from GCS storage using our helper function
         */
        console.log('Reading file from bucket');
        let encodedImage;
        try {
            encodedImage = await readFile( {bucketName, file} );
        } catch(e) {
            console.error(e);
            reject(e);
        }

        console.log('Training file read from bucket');

        try {
            const imgName = file.substring(0, file.indexOf('.')) + '.jpeg';
            const buf = await convert(encodedImage, file, imgName);
            const res = await writeFile( {bucketName: process.env.WRITEBUCKET, file: imgName }, buf);
            results(res);
            return;
        } catch (e) {
            console.error(e);
            reject(e);
            return;
        }
    });
}

export default convertFile;
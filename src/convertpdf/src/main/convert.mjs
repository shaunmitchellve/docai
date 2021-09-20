'use strict';

import {PDFDocument} from 'pdf-lib';

/**
 * Convert a PDF document into single page PDF documents.
 * @param {object} fileData The file object that contains the name and file content.
 * @return  {array} An array containing the individual PDF one page documents. {fileName: '', content: BASE64_STRING }
 */
async function convertDocument(fileData) {
    const fileNameNoExt = fileData.name.substring(0, fileData.name.indexOf('.'));
    const returnDocs = [];

    const pdfDoc = await PDFDocument.load(fileData.content);

    for (let i = 0; i < pdfDoc.getPages().length; i++) {
        const newPDF = await PDFDocument.create();
        const [copiedPage] = await newPDF.copyPages(pdfDoc, [i]);
        newPDF.addPage(copiedPage);
        const pdfBytes = await newPDF.saveAsBase64();
        returnDocs.push({fileName: `${fileNameNoExt}-${i+1}.pdf`, content: pdfBytes});
    }

    return returnDocs;
}

export default convertDocument;

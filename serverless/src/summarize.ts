import { Context, Callback } from 'aws-lambda';

import { closeDbConnection, connectToDb } from './utils/mongoClient';
import { PaperRecord } from './utils/types';
import { downloadPdf, extractTextFromPdf } from './utils/pdf';
import { generateSummaries } from './utils/cohere';

const MAX_CHARACTERS = 50000;
const PAGES_TO_READ_FROM_PDF = 5;

export const lambdaHandler = async (event: any, context: Context, callback: Callback) => {
    console.log('Summarize Function Event');

    try {
        await connectToDb();

        const mongoRecord = event.detail.fullDocument as PaperRecord;

        console.log('Received document:', JSON.stringify(mongoRecord, null, 2));

        const pdfData = (await downloadPdf(mongoRecord.fileUrl)) as Uint8Array;

        const pdfTextContent = await extractTextFromPdf(pdfData, MAX_CHARACTERS, PAGES_TO_READ_FROM_PDF);

        if (!pdfTextContent) throw new Error('No text content extracted from the PDF');

        await generateSummaries(mongoRecord, pdfTextContent.substring(0, MAX_CHARACTERS));
    } catch (error) {
        console.error('An error occurred:', error);

        callback(error as Error, 'Error in the summarize function');
    } finally {
        // Close the database connection
        await closeDbConnection();
    }

    callback(null, 'Finished generating summaries and uploading data.');
};

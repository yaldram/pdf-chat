import { Context, Callback } from 'aws-lambda';

import { closeDbConnection, connectToDb } from './utils/mongoClient';
import { PaperRecord } from './utils/types';
import { downloadPdf, getDocumentsFromPdf } from './utils/pdf';
import { generateEmbeddings } from './utils/cohere';

export const lambdaHandler = async (event: any, context: Context, callback: Callback) => {
    console.log('Embedding Function Event');

    try {
        await connectToDb();

        const mongoRecord = event.detail.fullDocument as PaperRecord;

        console.log('Received event:', JSON.stringify(mongoRecord, null, 2));

        const pdfData = (await downloadPdf(mongoRecord.fileUrl)) as Uint8Array;

        const documents = await getDocumentsFromPdf(pdfData);

        if (!documents) throw new Error('Unable to generate any documents from the pdf');

        await generateEmbeddings(documents, mongoRecord);
    } catch (error) {
        console.error('An error occurred:', error);
        callback(error as Error, 'Error in the Embedding function');
    } finally {
        // Close the database connection
        await closeDbConnection();
    }

    // Signal that the function has completed successfully or with an error
    callback(null, 'Finished generating embeddings and uploading data.');
};

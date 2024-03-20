import { CohereClient } from 'cohere-ai';
import { Document } from 'langchain/document';

import { embeddingCollection, paperCollection } from './mongoClient';
import { CreateEmbeddingRecord, PaperRecord } from './types';
import { ObjectId } from 'mongodb';
import { SummarizeRequest } from 'cohere-ai/api';

if (!process.env.COHERE_API_KEY) {
    throw new Error('Missing COHERE_API_KEY env variable');
}

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

// Function to generate embeddings for the documents and save them to the database.
export async function generateEmbeddings(
    splittedDocuments: Document<Record<string, unknown>>[],
    paperRecord: PaperRecord,
    bacthSize = 10,
) {
    let counter = 0;

    while (counter < splittedDocuments.length) {
        const mongoRecords: CreateEmbeddingRecord[] = [];
        const batch = splittedDocuments.slice(counter, counter + bacthSize);

        const embedding = await cohere.embed({
            model: 'embed-english-v3.0',
            inputType: 'search_document',
            texts: batch.map(({ pageContent }) => pageContent),
        });

        const { texts, embeddings } = embedding;

        batch.forEach(({ metadata }, index) => {
            mongoRecords.push({
                text: texts[index],
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: embeddings type mismatch it is an number[]
                embedding: embeddings[index],
                pageNumber: metadata.page as number,
                // storing as string, vector search filters don't work on objectId type
                collectionId: paperRecord.collectionId,
                // storing as string, vector search filters don't work on objectId type
                paperId: paperRecord._id,
                paper: paperRecord,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });

        const result = await embeddingCollection.insertMany(mongoRecords, {
            ordered: true,
        });

        console.log('MongoDb inserted embeddings', result.insertedCount);

        counter += bacthSize;
    }
}

async function generateTextSummary({ text, additionalCommand, format = 'paragraph' }: SummarizeRequest) {
    const { summary } = await cohere.summarize({
        text: text,
        model: 'command',
        length: 'long',
        format,
        additionalCommand: additionalCommand,
    });

    return summary;
}

export async function generateSummaries(paperRecord: PaperRecord, textContent: string) {
    const promises = [];

    for (let i = 0; i < textContent.length; i += 10000) {
        const chunk = textContent.substring(i, i + 10000);
        promises.push(
            generateTextSummary({
                text: chunk,
                additionalCommand:
                    'that comprehensively covers all the key points, findings, methodologies, and conclusions mentioned in the text',
            }),
        );
    }

    // Wait for all promises to resolve
    const summaries = await Promise.all(promises);

    // Generate a summary of all the summaries
    const finalSummary = await generateTextSummary({
        text: summaries.join(' '),
        format: 'bullets',
        additionalCommand:
            'that compiles all the key points from the individual summaries into one cohesive and comprehensive summary.',
    });

    // add summaries and the finalSummary to the paper document
    await paperCollection.findOneAndUpdate(
        { _id: new ObjectId(paperRecord._id) },
        {
            $set: {
                summaries: summaries.map((summary) => ({ summary })),
                summary: finalSummary,
                updatedAt: new Date(),
            },
        },
    );
}

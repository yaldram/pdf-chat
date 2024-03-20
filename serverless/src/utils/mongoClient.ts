import { MongoClient, ServerApiVersion } from 'mongodb';

const DB_NAME = 'pdf-chat';
const PAPER_COLLECTION = 'papers';
const EMBEDDING_COLLECTION = 'embeddings';

const mongoClient = new MongoClient(process.env.MONGO_URI as string, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    },
});

export async function connectToDb() {
    try {
        await mongoClient.connect();
        await mongoClient.db(DB_NAME).command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
    }
}

export async function closeDbConnection() {
    try {
        await mongoClient.close();
    } catch (error) {
        console.log('Error closing MongoDB connection', error);
    }
}

export const paperCollection = mongoClient.db(DB_NAME).collection(PAPER_COLLECTION);

export const embeddingCollection = mongoClient.db(DB_NAME).collection(EMBEDDING_COLLECTION);

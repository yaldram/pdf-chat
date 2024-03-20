import FastifyPlugin from 'fastify-plugin';
import { MongoClient, ObjectId } from 'mongodb';

const DB_NAME = 'pdf-chat';

export type SearchOptions = {
  embeddings: number[];
  numCandidates: number;
  limit: number;
};

const mongoPlugin = FastifyPlugin(
  async function (fastify) {
    if (fastify.mongo) {
      throw new Error('fastify-mongodb has already registered');
    }

    try {
      // create the mongoclient
      const client = new MongoClient(fastify.secrets.MONGO_URI);

      // connect to mongo db
      await client.connect();
      fastify.log.info('connnected to mongodb successfully');

      // ping the database
      await client.db(DB_NAME).command({ ping: 1 });
      fastify.log.info(`pinged ${DB_NAME} database successfully`);

      // add onClose hook, for closing the database connection
      fastify.addHook('onClose', function closeMongoDb() {
        fastify.log.info('mongodb disconnected');
        return client.close();
      });

      const vectorSearch = async function <T>(
        searchOptions: SearchOptions,
        filterOptions?: object
      ) {
        const pipeline = [];

        pipeline.push({
          $vectorSearch: {
            queryVector: searchOptions.embeddings,
            path: 'embedding', // field name of the embedding in the collection
            numCandidates: searchOptions.numCandidates, // match with next 10 documents
            limit: searchOptions.limit, // return only top 5 results
            index: 'pdf-search', // name of our index
            ...(filterOptions && {
              filter: filterOptions,
            }),
          },
        });

        // Add the $project stage to the pipeline
        pipeline.push({
          $project: {
            embedding: 0,
          },
        });

        const documents = await fastify.mongo.db
          .collection('embeddings')
          .aggregate(pipeline)
          .toArray();

        return documents as T[];
      };

      if (!fastify.mongo) {
        fastify.decorate('mongo', {
          db: client.db(DB_NAME),
          ObjectId,
          vectorSearch,
        });
      }
    } catch (error) {
      fastify.log.error(`Error connecting to mongodb: ${error}`);
      throw new Error('Unable to connect to mongodb');
    }
  },
  {
    name: 'mongodb-plugin',
    dependencies: ['env-plugin'],
  }
);

export default mongoPlugin;

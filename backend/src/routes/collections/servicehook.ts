import FastifyPlugin from 'fastify-plugin';

import type { CreateCollectionInput } from './schema';

const collectionServicePlugin = FastifyPlugin(
  async function collectionService(fastify) {
    const collection = fastify.mongo.db.collection('collections');

    fastify.addHook('onRequest', fastify.authenticate);

    fastify.decorate('collectionService', {
      list: function (userId: string) {
        return collection
          .find({ userId: new fastify.mongo.ObjectId(userId) })
          .sort({ createdAt: -1 })
          .toArray();
      },

      details: function (collectionId: string, userId: string) {
        return collection.findOne({
          _id: new fastify.mongo.ObjectId(collectionId),
          userId: new fastify.mongo.ObjectId(userId),
        });
      },

      create: function (
        collectionInput: CreateCollectionInput,
        userId: string
      ) {
        return collection.insertOne({
          ...collectionInput,
          paperIds: [],
          userId: new fastify.mongo.ObjectId(userId),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      },
    });
  },
  {
    encapsulate: true,
    dependencies: ['mongodb-plugin'],
    name: 'collection-service',
  }
);

export default collectionServicePlugin;

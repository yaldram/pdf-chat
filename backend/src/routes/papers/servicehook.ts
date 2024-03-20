import FastifyPlugin from 'fastify-plugin';

import { CreatePaperInput } from './schemas';

const paperServicePlugin = FastifyPlugin(
  async function paperService(fastify) {
    const paper = fastify.mongo.db.collection('papers');
    const collections = fastify.mongo.db.collection('collections');

    fastify.addHook('onRequest', fastify.authenticate);

    fastify.decorate('paperService', {
      list: function () {
        return paper.find().sort({ createdAt: -1 }).toArray();
      },

      paperById: function (paperId: string) {
        return paper.findOne({ _id: new fastify.mongo.ObjectId(paperId) });
      },

      create: async function (paperInput: CreatePaperInput, userId: string) {
        const newPaper = await paper.insertOne({
          ...paperInput,
          collectionId: new fastify.mongo.ObjectId(paperInput.collectionId),
          userId: new fastify.mongo.ObjectId(userId),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        if (newPaper.acknowledged) {
          await collections.updateOne(
            { _id: new fastify.mongo.ObjectId(paperInput.collectionId) },
            { $push: { paperIds: newPaper.insertedId } }
          );
        }

        return newPaper;
      },

      listCollectionPaper: function (collectionId: string) {
        return paper
          .find({
            collectionId: new fastify.mongo.ObjectId(collectionId),
          })
          .sort({ createdAt: -1 })
          .toArray();
      },
    });
  },
  {
    encapsulate: true,
    dependencies: ['mongodb-plugin', 's3-plugin'],
    name: 'paper-service',
  }
);

export default paperServicePlugin;

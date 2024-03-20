import { FastifyInstance, FastifyRequest } from 'fastify';

import { $ref, CreateCollectionInput } from './schema';

const collectionControllerPlugin = async function collectionController(
  fastify: FastifyInstance
) {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async function listCollection(request: FastifyRequest) {
      const collections = await fastify.collectionService.list(request.user.id);

      return { status: true, statusCode: 200, data: collections };
    },
  }),
    fastify.route({
      method: 'GET',
      url: '/:collectionId',
      handler: async function collectionDetails(
        request: FastifyRequest<{
          Params: { collectionId: string };
        }>
      ) {
        const collections = await fastify.collectionService.details(
          request.params.collectionId,
          request.user.id
        );

        return { status: true, statusCode: 200, data: collections };
      },
    }),
    fastify.route({
      method: 'POST',
      url: '/',
      schema: {
        body: $ref('createCollectionSchema'),
      },
      handler: async function addCollection(
        request: FastifyRequest<{
          Body: CreateCollectionInput;
        }>
      ) {
        const collection = await fastify.collectionService.create(
          request.body,
          request.user.id
        );

        if (!collection.acknowledged)
          return {
            status: false,
            statusCode: 400,
            message: 'Unable to create the collection',
          };

        return {
          status: true,
          statusCode: 201,
          data: { _id: collection.insertedId, ...request.body },
        };
      },
    });
};

export default collectionControllerPlugin;

import { FastifyInstance, FastifyRequest } from 'fastify';

import { $ref, CreatePaperInput, CreateSignedUrlInput } from './schemas';

const paperControllerPlugin = async function paperController(
  fastify: FastifyInstance
) {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async function listPaper() {
      const papers = await fastify.paperService.list();

      return { status: true, statusCode: 200, data: papers };
    },
  }),
    fastify.route({
      method: 'GET',
      url: '/paper/:paperId',
      handler: async function getPaper(
        request: FastifyRequest<{
          Params: { paperId: string };
        }>
      ) {
        const papers = await fastify.paperService.paperById(
          request.params.paperId
        );

        return { status: true, statusCode: 200, data: papers };
      },
    }),
    fastify.route({
      method: 'POST',
      url: '/',
      schema: {
        body: $ref('createPaperSchema'),
      },
      handler: async function addPaper(
        request: FastifyRequest<{
          Body: CreatePaperInput;
        }>
      ) {
        const paper = await fastify.paperService.create(
          request.body,
          request.user.id
        );

        if (!paper.acknowledged)
          return {
            status: false,
            statusCode: 400,
            message: 'Unable to create the paper',
          };

        return {
          status: true,
          statusCode: 201,
          data: { _id: paper.insertedId, ...request.body },
        };
      },
    }),
    fastify.route({
      method: 'GET',
      url: '/:collectionId',
      handler: async function listCollectionPaper(
        request: FastifyRequest<{
          Params: { collectionId: string };
        }>
      ) {
        const papers = await fastify.paperService.listCollectionPaper(
          request.params.collectionId
        );

        return { status: true, statusCode: 200, data: papers };
      },
    }),
    fastify.route({
      method: 'POST',
      url: '/signed-url',
      schema: {
        body: $ref('createSignedUrlSchema'),
      },
      handler: async function listCollectionPaper(
        request: FastifyRequest<{
          Body: CreateSignedUrlInput;
        }>
      ) {
        const { filename, contentType } = request.body;

        const signedUrl = await fastify.s3.generateSignedUrl(
          filename,
          contentType
        );

        return { status: true, statusCode: 200, data: signedUrl };
      },
    });
};

export default paperControllerPlugin;

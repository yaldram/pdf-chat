import { FastifyInstance, FastifyRequest } from 'fastify';

import { $ref, type ChatInput } from './schmea';

const chatControllerPlugin = async function chatController(
  fastify: FastifyInstance
) {
  fastify.route({
    method: 'POST',
    url: '/paper',
    schema: {
      body: $ref('chatSchema'),
    },
    handler: async function chat(
      request: FastifyRequest<{
        Body: ChatInput;
      }>
    ) {
      return fastify.chatService.generatePaperChatResponse(request.body);
    },
  }),
    fastify.route({
      method: 'POST',
      url: '/collection',
      schema: {
        body: $ref('chatSchema'),
      },
      handler: async function chat(
        request: FastifyRequest<{
          Body: ChatInput;
        }>
      ) {
        return fastify.chatService.generateCollectionChatResponse(request.body);
      },
    }),
    fastify.route({
      method: 'POST',
      url: '/knowledge-base',
      schema: {
        body: $ref('chatSchema'),
      },
      handler: async function chat(
        request: FastifyRequest<{
          Body: ChatInput;
        }>
      ) {
        return fastify.chatService.generateKnoweldgeBaseChatResponse(
          request.body
        );
      },
    });
};

export default chatControllerPlugin;

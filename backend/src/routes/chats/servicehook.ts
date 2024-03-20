import FastifyPlugin from 'fastify-plugin';

import type { ChatInput } from './schmea';

const chatServicePlugin = FastifyPlugin(async function chatService(fastify) {
  fastify.decorate('chatService', {
    generatePaperChatResponse: async function (payload: ChatInput) {
      return fastify.chat.generateChatResponse(
        payload,
        {
          searchQueriesTopN: 2,
          relevantDocumentsTopN: 3,
          rerankDocumentsTopN: 2,
        },
        {
          paperId: {
            $eq: payload.resourceId,
          },
        }
      );
    },

    generateCollectionChatResponse: async function (payload: ChatInput) {
      return fastify.chat.generateChatResponse(
        payload,
        {
          searchQueriesTopN: 2,
          relevantDocumentsTopN: 5,
          rerankDocumentsTopN: 3,
        },
        {
          collectionId: {
            $eq: payload.resourceId,
          },
        }
      );
    },

    generateKnoweldgeBaseChatResponse: async function (payload: ChatInput) {
      return fastify.chat.generateChatResponse(payload, {
        searchQueriesTopN: 3,
        relevantDocumentsTopN: 10,
        rerankDocumentsTopN: 5,
      });
    },
  });
});

export default chatServicePlugin;

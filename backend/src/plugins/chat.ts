import FastifyPlugin from 'fastify-plugin';
import type { ChatDocument } from 'cohere-ai/api';

import type {
  GetRelevantQueriesArgs,
  RelevantDocument,
  RerankArgs,
  RetrieveDocumentsArgs,
} from '../routes/chats/types';
import { ChatInput } from '../routes/chats/schmea';

const chatPlugin = FastifyPlugin(
  async function (fastify) {
    if (fastify.chat) {
      throw new Error('chat has already been registered.');
    }

    try {
      const getRelevantQueries = async function ({
        userQuery,
        topN = 0,
      }: GetRelevantQueriesArgs) {
        const { searchQueries } = await fastify.cohere.chat({
          message: userQuery,
          searchQueriesOnly: true,
        });

        if (searchQueries && searchQueries.length > 0) {
          const relevantQueries = searchQueries.map((query) => query.text);

          return topN > 0 ? relevantQueries.slice(0, topN) : relevantQueries;
        }
      };

      const retrieveDocuments = async function ({
        userQuery,
        filter,
        topN = 5,
      }: RetrieveDocumentsArgs) {
        const queryEmbedding = await fastify.cohere.embedQuery(userQuery);

        const documents = await fastify.mongo.vectorSearch({
          embeddings: queryEmbedding,
          numCandidates: 10,
          limit: topN,
          ...(filter && {
            filter,
          }),
        });

        return documents.map(({ text, pageNumber }) => ({
          text,
          pageNumber: pageNumber.toString(),
        }));
      };

      const generateChatResponse = async function (
        { userQuery, conversationId, resourceId }: ChatInput,
        {
          searchQueriesTopN,
          rerankDocumentsTopN,
          relevantDocumentsTopN,
        }: RerankArgs,
        documentFilter?: object
      ) {
        const relevantQueries = await getRelevantQueries({
          userQuery,
          topN: searchQueriesTopN,
        });

        if (!relevantQueries) return 'Please ask relevant questions.';

        const documents: RelevantDocument[] = [];

        const relevantDocumentsPromises = relevantQueries.map(
          (relevantQuery) => {
            return retrieveDocuments({
              userQuery: relevantQuery,
              topN: relevantDocumentsTopN,
              filter: documentFilter,
            });
          }
        );

        // Execute all promises concurrently and collect the results
        const relevantDocumentsArray = await Promise.all(
          relevantDocumentsPromises
        );

        // Flatten the array of arrays into a single array of documents
        documents.push(...relevantDocumentsArray.flat());

        const rerankedDocuments = await fastify.cohere.rerankDocuments({
          documents,
          query: userQuery,
          topN: rerankDocumentsTopN,
        });

        console.log('Re-ranked documents', rerankedDocuments);

        const chatResponse = await fastify.cohere.chat({
          message: userQuery,
          documents: rerankedDocuments as ChatDocument[],
          conversationId,
        });

        console.log('CHAT RESPONSE', chatResponse);

        return chatResponse.text.replace(/\n/g, ' ');
      };

      if (!fastify.chat) {
        fastify.decorate('chat', {
          generateChatResponse,
        });
      }
    } catch (error) {
      fastify.log.error(`Error creating chat plugin: ${error}`);
      throw new Error('Unable to create chat plugin');
    }
  },
  {
    name: 'chat-plugin',
    dependencies: ['env-plugin', 'mongodb-plugin', 'cohere-plugin'],
  }
);

export default chatPlugin;

import FastifyPlugin from 'fastify-plugin';
import { CohereClient } from 'cohere-ai';

import type {
  ChatRequest,
  EmbedRequest,
  RerankRequest,
  RerankRequestDocumentsItem,
} from 'cohere-ai/api';

const coherePlugin = FastifyPlugin(
  async function (fastify) {
    if (fastify.cohere) {
      throw new Error('cohere has already been registered.');
    }

    try {
      // create the cohere client
      const cohere = new CohereClient({
        token: fastify.secrets.COHERE_API_KEY,
      });

      const chat = (options: ChatRequest) => cohere.chat(options);

      const createEmbeddings = (options: EmbedRequest) => {
        return cohere.embed({
          model: 'embed-english-v3.0',
          inputType: 'search_query',
          ...options,
        });
      };

      const rerankDocuments = async function <T>(
        options: RerankRequest
      ): Promise<T[]> {
        const rerankResponse = await cohere.rerank({
          query: options.query,
          model: 'rerank-english-v2.0',
          topN: 3,
          returnDocuments: true,
          documents:
            options.documents as unknown as RerankRequestDocumentsItem[],
        });

        const relevantIndexes: number[] = rerankResponse.results.map(
          (result) => result.index
        );

        const finalDocuments = relevantIndexes.map(
          (index) => options.documents[index]
        ) as T[];

        return finalDocuments;
      };

      const embedQuery = async function (userQuery: string) {
        const embeddResponse = await createEmbeddings({
          texts: [userQuery],
        });

        // @ts-ignore: we get an array of numbers
        return embeddResponse.embeddings[0] as number[];
      };

      if (!fastify.cohere) {
        fastify.decorate('cohere', {
          chat,
          createEmbeddings,
          embedQuery,
          rerankDocuments,
        });
      }
    } catch (error) {
      fastify.log.error(`Error creating cohere client: ${error}`);
      throw new Error('Unable to create cohere client');
    }
  },
  {
    name: 'cohere-plugin',
    dependencies: ['env-plugin'],
  }
);

export default coherePlugin;

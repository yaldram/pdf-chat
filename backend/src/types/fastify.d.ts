import type { Db, Document, InsertOneResult, ObjectId, WithId } from 'mongodb';
import type {
  ChatRequest,
  EmbedRequest,
  EmbedResponse,
  NonStreamedChatResponse,
  RerankRequest,
  RerankResponse,
} from 'cohere-ai/api';

import { CreateCollectionInput } from '../collections/schema';
import { BinaryLike } from 'crypto';

declare module 'fastify' {
  export interface FastifyInstance {
    mongo: {
      db: Db;
      ObjectId: typeof ObjectId;
      vectorSearch: <T>(
        searchOptions: SearchOptions,
        filterOptions?: object
      ) => Promise<T[]>;
    };
    cohere: {
      chat: (options: ChatRequest) => Promise<NonStreamedChatResponse>;
      createEmbeddings: (options: EmbedRequest) => Promise<EmbedResponse>;
      embedQuery: (userQuery: string) => Promise<number[]>;
      rerankDocuments: <T>(options: RerankRequest) => Promise<T[]>;
    };
    chat: {
      generateChatResponse: (
        chatInput: ChatInput,
        rerankArgs: RerankArgs,
        documentFilter?: object
      ) => Promise<string>;
    };
    s3: {
      generateSignedUrl: (
        filename: string,
        contentType: string
      ) => Promise<string>;
    };

    secrets: {
      NODE_ENV: string;
      PORT: string;
      MONGO_URI: string;
      JWT_SECRET: string;
      JWT_EXPIRE_IN: string;
      AWS_REGION: string;
      AWS_ACCOUNT_ID: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_BUCKET_NAME: string;
      COHERE_API_KEY: string;
    };

    // services
    collectionService: {
      list: (userId: string) => Promise<WithId<Document>[]>;
      create: (
        collectionInput: CreateCollectionInput,
        userId: string
      ) => Promise<InsertOneResult<Document>>;
      details: (
        collectionId: string,
        userId: string
      ) => Promise<WithId<Document> | null>;
    };
    paperService: {
      list: () => Promise<WithId<Document>[]>;
      create: (
        collectionInput: CreatePaperInput,
        userId: string
      ) => Promise<InsertOneResult<Document>>;
      listCollectionPaper: (
        collectionId: string
      ) => Promise<WithId<Document>[]>;
      paperById: (paperId: string) => Promise<WithId<Document> | null>;
    };
    chatService: {
      generatePaperChatResponse: (payload: ChatInput) => Promise<string>;
      generateCollectionChatResponse: (payload: ChatInput) => Promise<string>;
      generateKnoweldgeBaseChatResponse: (
        payload: ChatInput
      ) => Promise<string>;
    };
    authService: {
      getUser: (username: string) => Promise<WithId<Document> | null>;
      createUser: (username: any) => Promise<ObjectId>;
    };
  }
}

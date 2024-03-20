import FastifyPlugin from 'fastify-plugin';
import FastifyEnv from '@fastify/env';

const envPlugin = FastifyPlugin(
  function (fastify, options, next) {
    fastify.register(FastifyEnv, {
      // add 'secrets' property to the instance
      confKey: 'secrets',
      dotenv: {
        path: '.env',
      },
      schema: {
        type: 'object',
        required: ['MONGO_URI'],
        properties: {
          NODE_ENV: {
            type: 'string',
            default: 'development',
          },
          PORT: {
            type: 'integer',
            default: 8000,
          },
          MONGO_URI: {
            type: 'string',
          },
          JWT_SECRET: {
            type: 'string',
          },
          JWT_EXPIRE_IN: {
            type: 'number',
            default: 3600, // 1 hour
          },
          AWS_REGION: {
            type: 'string',
            default: 'ap-south-1',
          },
          AWS_ACCOUNT_ID: {
            type: 'string',
          },
          AWS_ACCESS_KEY_ID: {
            type: 'string',
          },
          AWS_SECRET_ACCESS_KEY: {
            type: 'string',
          },
          AWS_BUCKET_NAME: {
            type: 'string',
            default: 'yaldram-pdf-chat',
          },
          COHERE_API_KEY: {
            type: 'string',
          },
        },
      },
    });

    next();
  },
  {
    name: 'env-plugin',
  }
);

export default envPlugin;

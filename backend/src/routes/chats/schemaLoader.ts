import FastifyPlugin from 'fastify-plugin';

import { chatSchemas } from './schmea';

const chatSchemaLoaderPlugin = FastifyPlugin(
  function chatSchema(fastify, options, next) {
    for (const schema of chatSchemas) {
      fastify.addSchema(schema);
    }

    next();
  }
);

export default chatSchemaLoaderPlugin;

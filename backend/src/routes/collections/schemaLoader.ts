import FastifyPlugin from 'fastify-plugin';

import { collectionSchemas } from './schema';

const collectionSchemaPlugin = FastifyPlugin(
  function collectionSchema(fastify, options, next) {
    for (const schema of collectionSchemas) {
      fastify.addSchema(schema);
    }

    next();
  }
);

export default collectionSchemaPlugin;

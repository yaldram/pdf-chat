import FastifyPlugin from 'fastify-plugin';

import { authSchemas } from './schema';

const authSchemaLoaderPlugin = FastifyPlugin(
  function authSchema(fastify, options, next) {
    for (const schema of authSchemas) {
      fastify.addSchema(schema);
    }

    next();
  }
);

export default authSchemaLoaderPlugin;

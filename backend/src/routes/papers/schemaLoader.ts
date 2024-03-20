import FastifyPlugin from 'fastify-plugin';

import { paperSchemas } from './schemas';

const paperSchemaPlugin = FastifyPlugin(
  function paperSchema(fastify, options, next) {
    for (const schema of paperSchemas) {
      fastify.addSchema(schema);
    }

    next();
  }
);

export default paperSchemaPlugin;

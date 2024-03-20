import Fastify from 'fastify';
import FastifyAutoload from '@fastify/autoload';
import { join } from 'node:path';

import { fastifyOptions } from './configs/fastify';

const fastify = Fastify(fastifyOptions);

// load all the schemas
fastify.register(FastifyAutoload, {
  dir: join(__dirname, 'routes'),
  indexPattern: /^schemaLoader\.ts$/i,
});

// load all the plugins
fastify.register(FastifyAutoload, {
  dir: join(__dirname, 'plugins'),
  // don't load files with .no-load.ts extension
  ignorePattern: /.*.no-load\.ts/,
  indexPattern: /^no$/i,
  options: {},
});

fastify.register(FastifyAutoload, {
  dir: join(__dirname, 'routes'),
  // only load the .route.ts files
  indexPattern: /.*controller(\.js|\.ts)$/i,
  // don't load other files
  ignorePattern: /.*\.ts/,
  // load the auto hook files
  autoHooksPattern: /.*hook(\.js|\.ts)$/i,
  autoHooks: true,
  cascadeHooks: true,
  options: {},
});

process.on('SIGINT', async function close() {
  fastify.log.info('Received SIGINT, closing the server');
  await fastify.close();
  process.exit(0);
});

// process.on('SIGTERM', async function close() {
//   fastify.log.info('Received SIGTERM, closing the server')
//   await fastify.close()
//   process.exit(0);
// });

fastify
  .listen({
    port: 8000,
  })
  .catch((error) => {
    fastify.log.error(`Error starting the server: ${error}`);
    process.exit(1);
  });

import FastifyPlugin from 'fastify-plugin';
import FastifyCors from '@fastify/cors';

const corsPlugin = FastifyPlugin(function (fastify, options, next) {
  fastify.register(FastifyCors, {
    origin: true,
    credentials: true,
  });

  next();
});

export default corsPlugin;

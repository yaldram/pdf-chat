import FastifyPlugin from 'fastify-plugin';
import FastifySensible from '@fastify/sensible';

const sensiblePlugin = FastifyPlugin(function (fastify, options, next) {
  fastify.register(FastifySensible);

  next();
});

export default sensiblePlugin;

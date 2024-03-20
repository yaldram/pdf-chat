import FastifyPlugin from 'fastify-plugin';
import FastifyCookie from '@fastify/cookie';

const cookiePlugin = FastifyPlugin(
  async function authenticationPlugin(fastify) {
    // register fastify Cookie
    fastify.register(FastifyCookie);
  },
  {
    name: 'cookie-plugin',
  }
);

export default cookiePlugin;

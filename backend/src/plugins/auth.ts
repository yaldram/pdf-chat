import FastifyPlugin from 'fastify-plugin';
import FastifyJwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

const authPlugin = FastifyPlugin(
  async function authenticationPlugin(fastify) {
    const revokedTokens = new Map();

    fastify.register(FastifyJwt, {
      secret: fastify.secrets.JWT_SECRET,
      trusted: function isTrusted(request, decodedToken) {
        return !revokedTokens.has(decodedToken.jti);
      },
      cookie: {
        cookieName: 'Authentication',
        signed: false,
      },
    });

    fastify.decorate(
      'authenticate',
      async function authenticate(
        request: FastifyRequest,
        reply: FastifyReply
      ) {
        try {
          await request.jwtVerify();
          return true;
        } catch (err) {
          reply.send(err);
        }
      }
    );

    fastify.decorateRequest('generateToken', async function (user: any) {
      const token = await fastify.jwt.sign(
        {
          id: String(user._id),
          username: user.username,
          fullname: user.fullname,
        },
        {
          jti: String(Date.now()),
          expiresIn: fastify.secrets.JWT_EXPIRE_IN,
        }
      );

      return token;
    });
  },
  {
    name: 'auth-plugin',
    dependencies: ['env-plugin'],
  }
);

export default authPlugin;

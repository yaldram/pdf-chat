import { FastifyInstance, FastifyRequest } from 'fastify';

import { $ref, LoginInput, RegisterInput } from './schema';
import { generateHash } from './utils';

const authControllerPlugin = async function authController(
  fastify: FastifyInstance
) {
  fastify.route({
    method: 'POST',
    url: '/register',
    schema: {
      body: $ref('registerSchema'),
    },
    handler: async function chat(
      request: FastifyRequest<{
        Body: RegisterInput;
      }>,
      reply
    ) {
      const existingUser = await fastify.authService.getUser(
        request.body.username
      );

      if (existingUser) {
        const err = new Error('User already registered');
        err.statusCode = 409;
        throw err;
      }

      const { hash, salt } = await generateHash(request.body.password);

      try {
        const newUserId = await fastify.authService.createUser({
          fullname: request.body.fullname,
          username: request.body.username,
          salt,
          hash,
        });

        request.log.info({ userId: newUserId }, 'User registered');
        reply.code(201);
        return { registered: true };
      } catch (error) {
        request.log.error(error, 'Failed to register user');
        reply.code(500);
        return { registered: false };
      }
    },
  }),
    fastify.route({
      method: 'POST',
      url: '/login',
      schema: {
        body: $ref('loginSchema'),
      },
      handler: async function authenticateHandler(
        request: FastifyRequest<{
          Body: LoginInput;
        }>,
        reply
      ) {
        const user = await fastify.authService.getUser(request.body.username);

        if (!user) {
          // if we return 404, an attacker can use this to find out which users are registered
          const err = new Error('Wrong credentials provided');
          err.statusCode = 401;
          throw err;
        }

        const { hash } = await generateHash(request.body.password, user.salt);

        if (hash !== user.hash) {
          const err = new Error('Wrong credentials provided');
          err.statusCode = 401;
          throw err;
        }

        const token = await request.generateToken(user);

        reply.setCookie('Authentication', token, {
          httpOnly: true,
          path: '/',
          maxAge: Number(fastify.secrets.JWT_EXPIRE_IN),
        });

        return { status: true, statusCode: 200, data: user };
      },
    }),
    fastify.route({
      method: 'GET',
      url: '/authenticate',
      preHandler: function (request, reply, done) {
        return fastify.authenticate(request, reply);
      },
      handler: async function authenticateHandler(
        request: FastifyRequest,
        reply
      ) {
        return { status: true, statusCode: 200, data: request.user };
      },
    }),
    fastify.route({
      method: 'POST',
      url: '/logout',
      handler: async function logoutHandler(request: FastifyRequest, reply) {
        reply.setCookie('Authentication', '', {
          httpOnly: true,
          path: '/',
          maxAge: 0,
        });

        reply.status(200);
      },
    });
};

export default authControllerPlugin;

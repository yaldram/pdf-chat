import FastifyPlugin from 'fastify-plugin';

const errorHandlerPlugin = FastifyPlugin(function (fastify, options, next) {
  // log every request that the server receives
  fastify.addHook('onRequest', async function (request) {
    request.log.info({ request }, 'incoming request');
  });

  // log every request and response that the server sends out
  fastify.addHook('onResponse', async function (request, response) {
    request.log.info({ request, response }, 'request completed');
  });

  // Handle global errors
  fastify.setErrorHandler(function globalErrorHandler(error, request, reply) {
    if (reply.statusCode >= 500) {
      request.log.error({ request, res: reply, error }, error?.message);
      reply.send(
        new Error(
          `Fatal error. Contact the support team with id: ${request.id}`
        )
      );
      return;
    }

    // log the request and response
    request.log.info({ request, response: reply, error }, error?.message);
    reply.send(error);
    return;
  });

  next();
});

export default errorHandlerPlugin;

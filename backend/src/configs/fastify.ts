import { randomUUID } from 'node:crypto';

import type { FastifyReply, FastifyServerOptions } from 'fastify';

export const fastifyOptions: FastifyServerOptions = {
  disableRequestLogging: true,
  // rename default reqId to requestId
  requestIdLogLabel: 'requestId',

  // will run only if x-request-id is not present
  genReqId(request) {
    return randomUUID();
  },

  logger: {
    level: 'info',
    timestamp() {
      const dateString = new Date(Date.now()).toISOString();
      return `,"@timestamp":"${dateString}"`;
    },

    redact: {
      censor: '***',
      paths: [
        'req.headers.authorization',
        'req.body.password',
        'req.body.email',
      ],
    },

    serializers: {
      request: function (request) {
        const shouldLogBody = request.routeOptions.config.logBody === true;

        return {
          method: request.method,
          url: request.url, // todo/12345
          routeUrl: request.routeOptions.url, // todo/:todoId
          version: request.headers?.['accept-version'],
          user: request.user?.id,
          headers: request.headers,
          body: shouldLogBody ? request.body : undefined,
          hostname: request.hostname,
          remoteAddress: request.ip,
          remotePort: request.socket?.remotePort,
        };
      },

      response: function (reply: FastifyReply) {
        return {
          statusCode: reply.statusCode,
          responseTime: reply.elapsedTime ? reply.elapsedTime : '',
        };
      },
    },
  },
};

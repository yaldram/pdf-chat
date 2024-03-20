import FastifyPlugin from 'fastify-plugin';

const authServicePlugin = FastifyPlugin(async function authService(fastify) {
  const users = fastify.mongo.db.collection('users');

  fastify.decorate('authService', {
    getUser: function (username: string) {
      return users.findOne({ username });
    },

    createUser: async function (user) {
      const newUser = await users.insertOne(user);
      return newUser.insertedId;
    },
  });
});

export default authServicePlugin;

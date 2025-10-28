import fastifyPlugin from 'fastify-plugin';
import fastifyMongo from '@fastify/mongodb';
import { FastifyInstance } from 'fastify';

async function mongoDBConnection(fastify: FastifyInstance) {
  fastify.register(fastifyMongo, {
    url: process.env.MONGODB_URI,
    forceClose: true,
  })
}

export default fastifyPlugin(mongoDBConnection);
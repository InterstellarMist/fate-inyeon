import Fastify, { FastifyInstance } from 'fastify';
import { registerCors } from './plugins/cors';
import { registerExampleRoutes } from './routes/example';

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await registerCors(fastify);

  // Register routes
  await fastify.register(registerExampleRoutes);

  return fastify;
}


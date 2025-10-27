import { FastifyInstance } from 'fastify';
import corsPlugin from '@fastify/cors';

const allowedOrigins = process.env.CLIENT_URL || 'http://localhost:5173';

export async function registerCors(fastify: FastifyInstance) {
  await fastify.register(corsPlugin, {
    origin: allowedOrigins,
    credentials: true,
  });
}
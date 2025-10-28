import { FastifyInstance } from 'fastify';
import corsPlugin from '@fastify/cors';

export async function registerCors(fastify: FastifyInstance) {
  const allowedOrigins = process.env.CLIENT_URL || 'http://localhost:5173';
  await fastify.register(corsPlugin, {
    origin: allowedOrigins,
    credentials: true,
  });
}
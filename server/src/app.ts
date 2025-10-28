import Fastify, { FastifyInstance } from "fastify";
import { registerCors } from "@/plugins/cors.js";
import { registerExampleRoutes } from "@/routes/example.js";
import mongodbConnector from "@/plugins/mongodb-connector.js";
import { mongoDBroutes } from "@/routes/mongodb.js";
import { registerJwt } from "@/plugins/jwt.js";
import { accountRoutes } from "@/routes/account.js";

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(mongodbConnector);
  await registerCors(fastify);
  await registerJwt(fastify);

  // Register routes
  await fastify.register(accountRoutes);
  await fastify.register(registerExampleRoutes);
  await fastify.register(mongoDBroutes);

  return fastify;
}

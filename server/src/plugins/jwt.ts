import { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

export async function registerJwt(fastify: FastifyInstance) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  fastify.register(fastifyJwt, {
    secret: secret,
  });

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        return;
      } catch (err) {
        reply.status(401).send({ error: "Unauthorized" });
      }
    }
  );
}

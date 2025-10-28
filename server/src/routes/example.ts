import { FastifyInstance } from "fastify";

export async function registerExampleRoutes(fastify: FastifyInstance) {
  // Example route demonstrating Fastify's TypeScript support
  fastify.get<{
    Reply: { message: string; timestamp: number };
  }>("/api/hello", async (_request, _reply) => {
    return {
      message: "Hello from Fastify with TypeScript!",
      timestamp: Date.now(),
    };
  });

  // Example POST route with type-safe request body
  fastify.post<{
    Body: { name: string; age: number };
    Reply: { success: boolean; data: { name: string; age: number } };
  }>("/api/user", async (request, _reply) => {
    const { name, age } = request.body;

    return {
      success: true,
      data: { name, age },
    };
  });
}

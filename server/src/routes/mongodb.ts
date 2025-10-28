import { FastifyInstance } from "fastify";

export async function mongoDBroutes(fastify: FastifyInstance) {
  const db = fastify.mongo.client.db("fate-inyeon");
  const collection = db.collection("users");

  fastify.get("/api/mongodb/test", async (_request, reply) => {
    const result = await collection?.find({}).toArray();
    if (!result)
      return reply.status(500).send({ error: "Failed to fetch data" });
    return reply.status(200).send(result);
  });

  fastify.get<{ Params: { id: string } }>(
    "/api/users/:id",
    async (request, reply) => {
      const { id } = request.params;
      console.log("id", id);
      const result = await collection?.findOne({ userId: Number(id) });
      if (!result) return reply.status(404).send({ error: "User not found" });
      return reply.status(200).send(result);
    }
  );
}

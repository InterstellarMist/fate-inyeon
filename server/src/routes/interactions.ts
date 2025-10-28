import { FastifyInstance } from "fastify";
import { MatchDocument, ProfileDocument } from "@/types/dbTypes";
import { ObjectId } from "@fastify/mongodb";

export async function interactionsRoutes(fastify: FastifyInstance) {
  const db = fastify.mongo.client.db("fate-inyeon");
  const profiles = db.collection<ProfileDocument>("profiles");
  const matchesCollection = db.collection<MatchDocument>("matches");

  // Get potential matches
  // TODO: age preferences
  fastify.get(
    "/api/candidates",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = (request.user as { accountId: string }).accountId;
      const profile = await profiles.findOne({
        accountId: new ObjectId(accountId),
      });
      if (!profile)
        return reply.status(404).send({ error: "Profile not found" });
      const matches = await profiles
        .find({
          accountId: { $ne: new ObjectId(accountId) },
          preferences: { $elemMatch: { gender: profile.gender } },
        })
        .toArray();
      if (!matches)
        return reply.status(404).send({ error: "No matches found" });
      return reply.status(200).send(matches);
    }
  );

  // Get matches
  fastify.get(
    "/api/matches",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = (request.user as { accountId: string }).accountId;
      const matches = await matchesCollection
        .find({ profiles: { $elemMatch: { $eq: new ObjectId(accountId) } } })
        .toArray();
      if (!matches)
        return reply.status(404).send({ error: "No matches found" });
      return reply.status(200).send(matches);
    }
  );

  // Like a candidate
  fastify.post(
    "/api/candidates/:candidateId/like",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = (request.user as { accountId: string }).accountId;
      const { candidateId } = request.params as { candidateId: string };

      const updatedProfile = await profiles.updateOne(
        { accountId: new ObjectId(accountId) },
        { $push: { likes: new ObjectId(candidateId) } }
      );
      if (!updatedProfile)
        return reply.status(500).send({ error: "Failed to like candidate" });

      // Check for a match
      const candidate = await profiles.findOne({
        accountId: new ObjectId(candidateId),
      });
      if (!candidate)
        return reply.status(404).send({ error: "Candidate not found" });
      if (candidate.likes?.includes(new ObjectId(accountId))) {
        await matchesCollection.insertOne({
          profiles: [new ObjectId(accountId), new ObjectId(candidateId)],
        });
        const profile = await profiles.findOne({
          accountId: new ObjectId(accountId),
        });
        if (!profile)
          return reply.status(404).send({ error: "Profile not found" });

        return reply.status(200).send({
          message: "Match found",
          match: {
            profile1: profile.name,
            profile2: candidate.name,
          },
        });
      } else {
        return reply.status(200).send({ message: "No match found" });
      }
    }
  );

  // Dislike a candidate
  fastify.post(
    "/api/candidates/:candidateId/dislike",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = (request.user as { accountId: string }).accountId;
      const { candidateId } = request.params as { candidateId: string };

      const updatedProfile = await profiles.updateOne(
        { accountId: new ObjectId(accountId) },
        { $push: { dislikes: new ObjectId(candidateId) } }
      );
      if (!updatedProfile)
        return reply.status(500).send({ error: "Failed to dislike candidate" });
      return reply.status(200).send(updatedProfile);
    }
  );

  // Unmatch a match
  fastify.delete(
    "/api/matches/:matchId",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = (request.user as { accountId: string }).accountId;
      const { matchId } = request.params as { matchId: string };
      const match = await matchesCollection.findOne({
        _id: new ObjectId(matchId),
      });
      if (!match) return reply.status(404).send({ error: "Match not found" });
      if (!match.profiles.includes(new ObjectId(accountId)))
        return reply
          .status(401)
          .send({ error: "You are not part of this match" });

      const otherProfile = match.profiles.find(
        (profile) => profile.toString() !== new ObjectId(accountId).toString()
      );
      if (!otherProfile)
        return reply.status(404).send({ error: "Other profile not found" });

      // Remove likes
      await profiles.updateOne(
        { accountId: new ObjectId(accountId) },
        { $pull: { likes: new ObjectId(otherProfile) } }
      );
      await profiles.updateOne(
        { accountId: new ObjectId(otherProfile) },
        { $pull: { likes: new ObjectId(accountId) } }
      );

      await matchesCollection.deleteOne({
        _id: new ObjectId(matchId),
        profiles: { $elemMatch: { $eq: new ObjectId(accountId) } },
      });

      return reply.status(200).send({ message: "Match unmatched" });
    }
  );
}

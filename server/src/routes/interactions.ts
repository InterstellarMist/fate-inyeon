import { FastifyInstance } from "fastify";
import { MatchDocument, ProfileDocument } from "@/types/dbTypes";
import { ObjectId } from "@fastify/mongodb";

// TODO: create db response wrapper function
export async function interactionsRoutes(fastify: FastifyInstance) {
  const db = fastify.mongo.client.db("fate-inyeon");
  const profiles = db.collection<ProfileDocument>("profiles");
  const matchesCollection = db.collection<MatchDocument>("matches");

  // Get potential matches
  // TODO: age preferences, randomize matches
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
      const excludeIds = [
        new ObjectId(accountId),
        ...(profile.likes ?? []),
        ...(profile.dislikes ?? []),
      ];
      const matches = await profiles
        .find({
          accountId: { $nin: excludeIds },
          gender: profile.preferences.gender,
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

  // TODO: Add like probability
  // Like a candidate
  fastify.post<{ Params: { candidateId: string } }>(
    "/api/candidates/like/:candidateId",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = new ObjectId(
        (request.user as { accountId: string }).accountId
      );
      const candidateId = new ObjectId(request.params.candidateId);

      // Check if candidate is already liked by accountId
      const liked = await profiles.findOne({
        accountId: accountId,
        likes: { $elemMatch: { $eq: candidateId } },
      });
      if (liked)
        return reply.status(200).send({ message: "Candidate already liked" });

      // Like candidate
      const updatedProfile = await profiles.updateOne(
        { accountId: accountId },
        { $push: { likes: candidateId } }
      );
      if (!updatedProfile)
        return reply.status(500).send({ error: "Failed to like candidate" });

      // Check for a match
      const candidate = await profiles.findOne({
        accountId: candidateId,
      });
      if (!candidate)
        return reply.status(404).send({ error: "Candidate not found" });
      console.log(candidate.likes, accountId);
      console.log(candidate.likes?.some((id) => id.equals(accountId)));
      if (candidate.likes?.some((id) => id.equals(accountId))) {
        await matchesCollection.insertOne({
          profiles: [accountId, candidateId],
        });
        const profile = await profiles.findOne({
          accountId: accountId,
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
        return reply
          .status(200)
          .send({ message: "Liked candidate successfully" });
      }
    }
  );

  // Dislike a candidate
  fastify.post<{ Params: { candidateId: string } }>(
    "/api/candidates/dislike/:candidateId",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = new ObjectId(
        (request.user as { accountId: string }).accountId
      );
      const candidateId = new ObjectId(request.params.candidateId);

      // Check if candidate is already disliked by accountId
      const disliked = await profiles.findOne({
        accountId: accountId,
        dislikes: { $elemMatch: { $eq: candidateId } },
      });
      if (disliked)
        return reply
          .status(200)
          .send({ message: "Candidate already disliked" });

      // check if candidate is already liked by accountId
      const liked = await profiles.findOne({
        accountId: accountId,
        likes: { $elemMatch: { $eq: candidateId } },
      });
      if (liked) {
        const unliked = await profiles.updateOne(
          { accountId: accountId },
          { $pull: { likes: candidateId } }
        );
        if (!unliked)
          return reply
            .status(500)
            .send({ error: "Failed to unlike candidate" });
      }

      // Dislike candidate
      const updatedProfile = await profiles.updateOne(
        { accountId: accountId },
        { $push: { dislikes: candidateId } }
      );
      if (!updatedProfile)
        return reply.status(500).send({ error: "Failed to dislike candidate" });
      return reply
        .status(200)
        .send({ message: "Disliked candidate successfully" });
    }
  );

  // Unmatch a match
  fastify.delete<{ Params: { matchId: string } }>(
    "/api/matches/unmatch/:matchId",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = new ObjectId(
        (request.user as { accountId: string }).accountId
      );
      const matchId = new ObjectId(request.params.matchId);

      // Check if match exists
      const match = await matchesCollection.findOne({
        _id: matchId,
      });
      if (!match) return reply.status(404).send({ error: "Match not found" });
      if (!match.profiles.some((id) => id.equals(accountId)))
        return reply
          .status(401)
          .send({ error: "You are not part of this match" });

      // Find other profile
      const otherProfile = match.profiles.find(
        (profile) => !profile.equals(accountId)
      );
      if (!otherProfile)
        return reply.status(404).send({ error: "Other profile not found" });

      // Remove likes
      await profiles.updateOne(
        { accountId: accountId },
        { $pull: { likes: otherProfile } }
      );
      await profiles.updateOne(
        { accountId: otherProfile },
        { $pull: { likes: accountId } }
      );

      const deleted = await matchesCollection.deleteOne({
        _id: matchId,
        profiles: { $elemMatch: { $eq: accountId } },
      });
      if (!deleted)
        return reply.status(500).send({ error: "Failed to delete match" });

      return reply
        .status(200)
        .send({ message: "Match unmatched successfully" });
    }
  );
}

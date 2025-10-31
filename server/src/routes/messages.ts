import { FastifyInstance } from "fastify";
import { ObjectId } from "@fastify/mongodb";
import { ProfileDocument } from "@/types/dbTypes";
// Note: jsonwebtoken is already a dependency (used by @fastify/jwt internally)
// We import it directly because we need to sign with TALKJS_SECRET_KEY,
// not the JWT_SECRET that fastify.jwt.sign() uses
import jwt from "jsonwebtoken";

export async function messagesRoutes(fastify: FastifyInstance) {
  const db = fastify.mongo.client.db("fate-inyeon");
  const profiles = db.collection<ProfileDocument>("profiles");

  // Generate TalkJS token for authenticated user
  fastify.get(
    "/api/talkjs/token",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = (request.user as { accountId: string }).accountId;
      const secretKey = process.env.TALKJS_SECRET_KEY;

      if (!secretKey) {
        return reply
          .status(500)
          .send({ error: "TalkJS Secret Key not configured" });
      }

      // Optionally fetch profile to include name in token
      const profile = await profiles.findOne({
        accountId: new ObjectId(accountId),
      });

      // Generate TalkJS JWT token
      // TalkJS requires specific token format:
      // - tokenType: "user"
      // - iss (issuer): App ID
      // - sub (subject): User ID (userId)
      // - exp (expiration): Token expiry time
      const appId = process.env.TALKJS_APP_ID;
      if (!appId) {
        return reply
          .status(500)
          .send({ error: "TalkJS App ID not configured" });
      }

      // TalkJS token payload format
      const tokenPayload = {
        tokenType: "user" as const,
        iss: appId, // Issuer: App ID (must match your TalkJS App ID)
        sub: accountId.toString(), // Subject: User ID (unique identifier)
        name: profile?.name || accountId.toString(),
      };

      // Sign token with secret key
      // Note: Make sure TALKJS_SECRET_KEY matches the secret in your TalkJS dashboard
      const talkjsToken = jwt.sign(tokenPayload, secretKey, {
        expiresIn: "24h",
        algorithm: "HS256",
      });

      // Log for debugging (remove in production)
      console.log("TalkJS Token generated:", {
        appId,
        userId: accountId.toString(),
        tokenLength: talkjsToken.length,
        secretKeyPrefix: secretKey.substring(0, 10) + "...",
      });

      return reply.status(200).send({ token: talkjsToken });
    }
  );
}

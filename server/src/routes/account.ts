import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { AccountDocument, Profile, ProfileDocument } from "@/types/dbTypes";
import { ObjectId } from "@fastify/mongodb";

export async function accountRoutes(fastify: FastifyInstance) {
  const db = fastify.mongo.client.db("fate-inyeon");
  const accounts = db.collection<AccountDocument>("accounts");
  const profiles = db.collection<ProfileDocument>("profiles");

  // Signup
  fastify.post<{ Body: AccountDocument }>(
    "/api/users/signup",
    async (request, reply) => {
      const { email, password } = request.body;
      const account = await accounts.findOne({ email });
      if (account)
        return reply.status(401).send({ error: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAccount = await accounts.insertOne({
        email,
        password: hashedPassword,
      });
      if (!newAccount)
        return reply.status(500).send({ error: "Failed to create user" });
      const token = fastify.jwt.sign(
        { accountId: newAccount.insertedId },
        { expiresIn: "1h" }
      );
      if (!token)
        return reply.status(500).send({ error: "Failed to create token" });
      return reply.status(200).send({ token });
    }
  );

  // Login
  fastify.post<{ Body: AccountDocument }>(
    "/api/users/login",
    async (request, reply) => {
      const { email, password } = request.body;
      const account = await accounts.findOne({ email });
      if (!account)
        return reply.status(401).send({ error: "Invalid credentials" });

      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid)
        return reply.status(401).send({ error: "Invalid credentials" });

      const token = fastify.jwt.sign(
        { accountId: account._id },
        { expiresIn: "12h" }
      );
      if (!token)
        return reply.status(500).send({ error: "Failed to create token" });
      return reply.status(200).send({ token });
    }
  );

  // Create user profile
  fastify.post<{ Body: Profile }>(
    "/api/users/new-profile",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = (request.user as { accountId: string }).accountId;
      const {
        name,
        age,
        gender,
        location,
        bio,
        picture,
        birthday,
        preferences,
      } = request.body;

      const profile = await profiles.findOne({
        accountId: new ObjectId(accountId),
      });
      if (profile)
        return reply.status(401).send({ error: "Profile already exists" });

      const newProfile = await profiles.insertOne({
        accountId: new ObjectId(accountId),
        name,
        age,
        gender,
        location,
        bio,
        picture,
        birthday,
        preferences,
      });
      if (!newProfile)
        return reply.status(500).send({ error: "Failed to create profile" });
      return reply.status(200).send(newProfile);
    }
  );

  // Get personal profile
  fastify.get(
    "/api/users/my-profile",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = (request.user as { accountId: string }).accountId;
      console.log("accountId", accountId);
      const profile = await profiles.findOne({
        accountId: new ObjectId(accountId),
      });
      if (!profile)
        return reply.status(401).send({ error: "Profile not found" });
      return reply.status(200).send(profile);
    }
  );

  // Update personal profile
  fastify.put<{ Body: Profile }>(
    "/api/users/edit-profile",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const accountId = (request.user as { accountId: string }).accountId;
      const profile = await profiles.findOne({
        accountId: new ObjectId(accountId),
      });
      if (!profile)
        return reply.status(401).send({ error: "Profile not found" });

      const updatedProfile = await profiles.updateOne(
        { accountId: new ObjectId(accountId) },
        { $set: request.body }
      );
      if (!updatedProfile)
        return reply.status(500).send({ error: "Failed to update profile" });
      return reply.status(200).send(updatedProfile);
    }
  );
}

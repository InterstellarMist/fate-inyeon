import { ObjectId } from "@fastify/mongodb";

export interface AccountDocument {
  email: string;
  password: string;
}

export interface Preferences {
  gender: string;
  age: [number, number];
}

export interface Profile {
  accountId: ObjectId;
  name: string;
  age: number;
  gender: string;
  location: string;
  bio: string;
  picture: string;
  birthday: string;
  preferences: Preferences;
}

export interface ProfileDocument extends Profile {
  likes?: ObjectId[];
  dislikes?: ObjectId[];
}

export interface MatchDocument {
  profiles: ObjectId[];
}

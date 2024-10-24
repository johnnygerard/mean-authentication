import { MongoClient, ServerApiVersion } from "mongodb";
import ms from "ms";
import { MONGODB_CONNECTION_URL } from "../constants/env.js";
import type { User } from "../models/user.js";

/**
 * MongoDB Atlas client instance
 *
 * Note that TLS is enabled by default.
 * @see https://www.mongodb.com/docs/atlas/reference/faq/security/
 */
export const mongoClient = new MongoClient(MONGODB_CONNECTION_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

await mongoClient.connect();

// Log database latency
const now = Date.now();
await mongoClient.db("admin").command({ ping: 1 });
console.log(
  "Connected to Atlas!",
  `- Latency: ${ms(Date.now() - now, { long: true })}`,
);

export const database = mongoClient.db("app");
export const users = database.collection<User>("users");

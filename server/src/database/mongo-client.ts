import { MongoClient, ServerApiVersion } from "mongodb";
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
console.log("MongoDB Atlas connection established!");

// Measure and log database latency
const TIMER_LABEL = "Database latency";
console.time(TIMER_LABEL);
await mongoClient.db("admin").command({ ping: 1 });
console.timeEnd(TIMER_LABEL);

export const database = mongoClient.db("app");
export const users = database.collection<User>("users");

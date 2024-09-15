import { MongoClient, ServerApiVersion } from "mongodb";
import type { User } from "../models/user.js";
import { MONGODB_CONNECTION_URL } from "../load-env.js";

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
const now = Date.now();
await mongoClient.db("admin").command({ ping: 1 });
console.log(`Database latency: ${Date.now() - now}ms`);

export const database = mongoClient.db("app");
export const users = database.collection<User>("users");

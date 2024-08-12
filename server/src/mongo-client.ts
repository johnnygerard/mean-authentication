import { env } from "node:process";
import { MongoClient, ServerApiVersion } from "mongodb";
import type { User } from "./models/user.js";

if (!env.CONNECTION_STRING) {
  throw new Error("CONNECTION_STRING is not set");
}

export const mongoClient = new MongoClient(env.CONNECTION_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

await mongoClient.connect();
const now = Date.now();
await mongoClient.db("admin").command({ ping: 1 });
console.log("Database connection established!");
console.log(`Database latency: ${Date.now() - now}ms`);

export const database = mongoClient.db("app");
export const users = database.collection<User>("users");

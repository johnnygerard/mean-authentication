import { MongoClient, ServerApiVersion } from "mongodb";
import type { User } from "../models/user.js";
import { CONNECTION_STRING } from "../load-env.js";

export const client = new MongoClient(CONNECTION_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

await client.connect();
const now = Date.now();
await client.db("admin").command({ ping: 1 });
console.log("Database connection established!");
console.log(`Database latency: ${Date.now() - now}ms`);

export const database = client.db("app");
export const users = database.collection<User>("users");
export const sessions = database.collection<{ _id: string }>("sessions");

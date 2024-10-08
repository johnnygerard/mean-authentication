import type { User } from "../models/user.js";
import { mongoClient } from "./mongo-client.js";

const indexName = await mongoClient
  .db("app")
  .collection<User>("users")
  .createIndex({ username: 1 }, { unique: true });

console.log(`Index created: ${indexName}`);
await mongoClient.close();

import { client } from "./client.js";
import type { User } from "../models/user.js";

const indexName = await client
  .db("app")
  .collection<User>("users")
  .createIndex({ username: 1 }, { unique: true });

console.log(`Index created: ${indexName}`);
await client.close();

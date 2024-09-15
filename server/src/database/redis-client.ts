import { createClient } from "redis";
import { REDIS_CONNECTION_URL } from "../load-env.js";

export const redisClient = createClient({ url: REDIS_CONNECTION_URL });

redisClient.on("error", (e) => {
  console.error("Redis client error:", e);
});

await redisClient.connect();
console.log("Connected to Redis!");

// Log session store latency
const now = Date.now();
await redisClient.ping();
console.log(`Session store latency: ${Date.now() - now}ms`);

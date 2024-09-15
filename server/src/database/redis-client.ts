import { REDIS_ENDPOINT, REDIS_PASSWORD } from "../load-env.js";
import { createClient } from "redis";

const [host, port] = REDIS_ENDPOINT.split(":");
export const redisClient = createClient({
  password: REDIS_PASSWORD,
  socket: {
    host,
    port: parseInt(port, 10),
  },
});

redisClient.on("error", (e) => {
  console.error("Redis client error:", e);
});

await redisClient.connect();
console.log("Connected to Redis!");

// Log session store latency
const now = Date.now();
await redisClient.ping();
console.log(`Session store latency: ${Date.now() - now}ms`);

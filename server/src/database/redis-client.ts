import { createClient } from "redis";
import { REDIS_CONNECTION_URL } from "../load-env.js";

/**
 * Redis Cloud client instance
 *
 * Note that TLS is not enabled by default.
 * @see https://redis.io/docs/latest/operate/rc/security/database-security/tls-ssl/
 */
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

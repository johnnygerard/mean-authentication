import { createClient } from "redis";
import { REDIS_CONNECTION_URL } from "../constants/env.js";

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
const TIMER_LABEL = "Session store latency";
console.time(TIMER_LABEL);
await redisClient.ping();
console.timeEnd(TIMER_LABEL);

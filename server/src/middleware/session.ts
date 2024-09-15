import session from "express-session";
import { randomBytes } from "node:crypto";
import type { CookieOptions } from "express";
import ms from "ms";
import {
  isProduction,
  REDIS_ENDPOINT,
  REDIS_PASSWORD,
  SESSION_SECRET_1,
} from "../load-env.js";
import RedisStore from "connect-redis";
import { createClient } from "redis";

// The optimal entropy depends on multiple factors (see link below).
// https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length
const ENTROPY = 64;
const ID_BYTE_SIZE = ENTROPY / 8;
const ENCODING = "base64url";
export const SESSION_LIFETIME = "2 days";

// Session cookie signing keys (HMAC-256):
// - Rotate keys periodically by prepending the new key to the array
// - Use at least 256 bits of entropy for each key
// See https://github.com/expressjs/session?tab=readme-ov-file#secret
const keys = [SESSION_SECRET_1];

export const sessionCookie = {
  name: "id",
  options: {
    httpOnly: true,
    maxAge: ms(SESSION_LIFETIME),
    sameSite: "strict",
    secure: isProduction,
  } as CookieOptions,
};

const generateSessionId = (): string => {
  return randomBytes(ID_BYTE_SIZE).toString(ENCODING);
};

const [host, port] = REDIS_ENDPOINT.split(":");
const redisClient = createClient({
  password: REDIS_PASSWORD,
  socket: {
    host,
    port: parseInt(port, 10),
  },
});

redisClient.on("error", (e) => {
  console.error("Redis client error:", e);
});

const now = Date.now();
await redisClient.connect();
console.log("Connected to Redis!");
console.log(`Cache latency: ${Date.now() - now}ms`);

/**
 * Session middleware
 * @see https://github.com/expressjs/session
 */
export default session({
  cookie: sessionCookie.options,
  genid: generateSessionId,
  name: sessionCookie.name,
  proxy: undefined, // Use "trust proxy" setting
  resave: false,
  rolling: false,
  saveUninitialized: false,
  secret: keys,
  store: new RedisStore({ client: redisClient }),
  unset: "destroy",
});

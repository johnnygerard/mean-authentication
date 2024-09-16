import session from "express-session";
import { randomBytes } from "node:crypto";
import type { CookieOptions } from "express";
import ms from "ms";
import { isProduction, SESSION_SECRET_1 } from "../load-env.js";
import RedisStore from "connect-redis";
import { redisClient } from "../database/redis-client.js";

const BYTES_OF_ENTROPY = 8; // 64 bits

/**
 * Generate a session ID
 *
 * The minimum recommended session ID entropy is 64 bits.
 * @returns A random and likely unique session ID
 * @see https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length
 */
const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(BYTES_OF_ENTROPY).toString("base64url");

  return `${timestamp}-${random}`;
};

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

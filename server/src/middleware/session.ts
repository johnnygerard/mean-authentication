import RedisStore from "connect-redis";
import type { CookieOptions } from "express";
import session from "express-session";
import ms from "ms";
import { randomUUID } from "node:crypto";
import { isProduction, SESSION_SECRET_1 } from "../constants/env.js";
import { redisClient } from "../database/redis-client.js";

/**
 * Generate a new session ID
 *
 * This implementation uses UUIDv4 which provides 122 bits of entropy and is
 * augmented with a timestamp to reduce the chance of collisions even further.
 *
 * @returns A random and likely unique session ID
 * @see https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length
 * @see https://www.rfc-editor.org/rfc/rfc9562#name-uuid-version-4
 */
const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = randomUUID();

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

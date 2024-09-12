import session from "express-session";
import { randomBytes } from "node:crypto";
import type { CookieOptions } from "express";
import ms from "ms";
import { env } from "node:process";
import connectMongoDBSession from "connect-mongodb-session";
import { sessions } from "../database/client.js";

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
if (!env.SESSION_SECRET_1) throw new Error("SESSION_SECRET_1 is not set");
const keys = [env.SESSION_SECRET_1];

export const sessionCookie = {
  name: "id",
  options: {
    httpOnly: true,
    maxAge: ms(SESSION_LIFETIME),
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
  } as CookieOptions,
};

export const generateSessionId = async (): Promise<string> => {
  const sessionId = randomBytes(ID_BYTE_SIZE).toString(ENCODING);

  // Query the database to enforce session ID uniqueness
  const count = await sessions.countDocuments({ _id: sessionId });
  return count ? generateSessionId() : sessionId;
};

if (!env.CONNECTION_STRING) {
  throw new Error("CONNECTION_STRING is not set");
}

const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: env.CONNECTION_STRING,
  databaseName: "app",
  collection: "sessions",
  expires: ms(SESSION_LIFETIME),
});

store.on("error", (e) => {
  console.error("MongoDB session store error:", e);
});

/**
 * Session middleware
 * @see https://github.com/expressjs/session
 */
export default session({
  cookie: sessionCookie.options,
  genid: (req) => req.sessionID,
  name: sessionCookie.name,
  proxy: undefined, // Use "trust proxy" setting
  resave: false,
  rolling: false,
  saveUninitialized: false,
  secret: keys,
  store,
  unset: "destroy",
});
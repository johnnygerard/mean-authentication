import type { CookieOptions } from "express-session";
import session, { MemoryStore } from "express-session";
import { randomBytes } from "node:crypto";
import type { Request } from "express";
import ms from "ms";
import { env } from "node:process";

// The optimal entropy depends on multiple factors (see link below).
// https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length
const ENTROPY = 64;
const ID_BYTE_SIZE = ENTROPY / 8;
const ENCODING = "base64url";
const SESSION_LIFETIME = "1 day";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: ms(SESSION_LIFETIME),
  sameSite: "strict",
  secure: env.NODE_ENV === "production",
};

const generateSessionId = (req: Request): string => {
  return randomBytes(ID_BYTE_SIZE).toString(ENCODING);
};

/**
 * Session middleware
 * @see https://github.com/expressjs/session
 */
export default session({
  cookie: cookieOptions,
  genid: generateSessionId,
  name: "id",
  proxy: undefined, // Use "trust proxy" setting
  resave: false,
  rolling: false,
  saveUninitialized: false,
  secret: "temporary-secret", // TODO Use environment variable
  store: new MemoryStore(), // TODO Use production store
  unset: "destroy",
});

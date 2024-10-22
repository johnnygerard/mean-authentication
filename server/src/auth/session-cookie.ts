import type { CookieOptions } from "express";
import ms from "ms";
import { Buffer } from "node:buffer";
import { isProduction, SESSION_SECRETS } from "../constants/env.js";
import { SESSION_MAX_TTL } from "../constants/security.js";
import { decrypt, encrypt } from "../crypto/aes.js";
import type { JsonObjectId } from "../types/json-object-id.js";

type UserId = JsonObjectId;
type SessionId = string;

type CookieName = typeof COOKIE_NAME;
type CookieValue = string;
type CookieArgs = [CookieName, CookieValue, CookieOptions];

const COOKIE_ENCODING = "base64url";
const COOKIE_NAME = "id";
const SEPARATOR = ":";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: ms(SESSION_MAX_TTL),
  path: "/api/user", // Only send the session cookie to private endpoints
  sameSite: "strict",
  secure: isProduction,
};

/**
 * Symmetric keys used to encrypt and decrypt session cookies.
 *
 * Encryption always uses the first key, while decryption tries each key in order.
 */
const keys = SESSION_SECRETS.split(",").map((key) => Buffer.from(key));

/**
 * Generate an encrypted session cookie from the user ID and session ID.
 * @param userId - The user ID
 * @param sessionId - The session ID
 * @returns Arguments for `res.cookie`
 * @see https://expressjs.com/en/4x/api.html#res.cookie
 */
export const generateSessionCookie = async (
  userId: UserId,
  sessionId: SessionId,
): Promise<CookieArgs> => {
  const value = [userId, sessionId].join(SEPARATOR);
  const encrypted = await encrypt(Buffer.from(value), keys[0]);

  return [COOKIE_NAME, encrypted.toString(COOKIE_ENCODING), cookieOptions];
};

/**
 * Parse a session cookie into the user ID and session ID.
 * @param value - The session cookie value
 * @returns The user ID and session ID, or `null` if the cookie is invalid
 */
export const parseSessionCookie = (
  value: CookieValue,
): [UserId, SessionId] | null => {
  for (const key of keys) {
    let decrypted: Buffer;

    try {
      decrypted = decrypt(Buffer.from(value, COOKIE_ENCODING), key);
    } catch (e) {
      continue;
    }

    return decrypted.toString().split(SEPARATOR) as [UserId, SessionId];
  }

  return null;
};

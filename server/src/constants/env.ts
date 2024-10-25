import { Buffer } from "node:buffer";
import { env } from "node:process";

export const isProduction = env["NODE_ENV"] === "production";
export const isRateLimiterDisabled =
  !isProduction && env["ENABLE_RATE_LIMITER"] === undefined;
export const port = parseInt(env["PORT"] ?? "3000", 10);

/**
 * Retrieve a variable value from the environment.
 * @param key - Variable name
 * @param fallback - Variable value to use in non-production environments
 * @returns The variable value in production or the fallback value in other environments
 * @throws {Error} if the variable is empty or unset in production
 */
const getVar = (key: string, fallback: string): string => {
  if (!isProduction) return fallback;
  const value = env[key];
  if (value) return value;

  const state = value === "" ? "empty" : "not set";
  throw new Error(`Environment variable ${key} is ${state}`);
};

export const ARGON2_SECRET = getVar("ARGON2_SECRET", "argon2-secret");

/**
 * Comma-separated list of session secrets to secure session cookies.
 *
 * Main requirements:
 * - Secrets must be rotated periodically.
 * - Secrets must be encoded in base64.
 * - Secret byte length must be exactly 16 for use with AES-128.
 *
 * The following command can be used to generate a new cryptographically secure
 * secret:
 * ```sh
 * openssl rand -base64 16
 * ```
 *
 * @example
 * // Assume a max TTL of 10 days and a rotation period of 30 days
 * // Day 0
 * SESSION_SECRETS=secret1
 * // Day 30
 * SESSION_SECRETS=secret2,secret1
 * // Day 40
 * SESSION_SECRETS=secret2
 * // Keep rotating...
 */
export const SESSION_SECRETS = getVar(
  "SESSION_SECRETS",
  Buffer.from("session-secret-1").toString("base64"),
);

export const MONGODB_CONNECTION_URL = getVar(
  "MONGODB_CONNECTION_URL",
  "mongodb://localhost:27017/?directConnection=true",
);

export const REDIS_CONNECTION_URL = getVar(
  "REDIS_CONNECTION_URL",
  "redis://localhost:6379",
);

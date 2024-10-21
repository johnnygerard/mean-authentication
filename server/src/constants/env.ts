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
export const SESSION_SECRET_1 = getVar("SESSION_SECRET_1", "session-secret-1");

/**
 * Comma-separated list of session secrets to secure session cookies while
 * allowing for secret rotation.
 *
 * The first secret is always used to secure new session cookies.
 * Subsequent secrets are used in order if verification fails with the first secret.
 * Old secrets must be removed after the maximum session timeout has passed.
 * @example
 * SESSION_SECRETS=old_secret
 * SESSION_SECRETS=new_secret,old_secret
 */
export const SESSION_SECRETS = getVar("SESSION_SECRETS", "session-secret");

export const MONGODB_CONNECTION_URL = getVar(
  "MONGODB_CONNECTION_URL",
  "mongodb://localhost:27017/?directConnection=true",
);

export const REDIS_CONNECTION_URL = getVar(
  "REDIS_CONNECTION_URL",
  "redis://localhost:6379",
);

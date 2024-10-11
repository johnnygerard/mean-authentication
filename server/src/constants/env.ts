import { env } from "node:process";

export const isProduction = env["NODE_ENV"] === "production";
export const isRateLimiterDisabled =
  !isProduction && env["DISABLE_RATE_LIMITER"] === "true";
export const port = parseInt(env["PORT"] ?? "3000", 10);

/**
 * Retrieve a variable from the production environment.
 * @param key - Variable name
 * @returns The variable value in production or `null` in other environments
 * @throws {Error} if the variable value is falsy in production
 */
const getProdVar = (key: string): string | null => {
  if (!isProduction) return null;
  const value = env[key];
  if (value) return value;

  const state = value === "" ? "empty" : "not set";
  throw new Error(`Environment variable ${key} is ${state}`);
};

export const ARGON2_SECRET = getProdVar("ARGON2_SECRET");
export const SESSION_SECRET_1 = getProdVar("SESSION_SECRET_1");
export const MONGODB_CONNECTION_URL = getProdVar("MONGODB_CONNECTION_URL");
export const REDIS_CONNECTION_URL = getProdVar("REDIS_CONNECTION_URL");

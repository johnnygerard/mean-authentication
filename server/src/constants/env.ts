import { env } from "node:process";

/**
 * Retrieve and validate an environment variable
 * @param key - Environment variable name
 * @returns The value of the environment variable
 * @throws {Error} if the environment variable is empty or not set
 */
const requireVariable = (key: string): string => {
  const value = env[key];
  if (value) return value;

  const state = value === "" ? "empty" : "not set";
  throw new Error(`Environment variable ${key} is ${state}`);
};

export const ARGON2_SECRET = requireVariable("ARGON2_SECRET");
export const SESSION_SECRET_1 = requireVariable("SESSION_SECRET_1");
export const MONGODB_CONNECTION_URL = requireVariable("MONGODB_CONNECTION_URL");
export const REDIS_CONNECTION_URL = requireVariable("REDIS_CONNECTION_URL");

export const isProduction = env["NODE_ENV"] === "production";
export const isRateLimiterDisabled =
  !isProduction && env["DISABLE_RATE_LIMITER"] === "true";
export const port = parseInt(env["PORT"] ?? "3000", 10);

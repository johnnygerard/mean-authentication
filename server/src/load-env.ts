import { env } from "node:process";

const requireVariable = (key: string): string => {
  const value = env[key];
  if (!value) throw new Error(`${key} is empty or unset`);
  return value;
};

export const ARGON2_SECRET = requireVariable("ARGON2_SECRET");
export const SESSION_SECRET_1 = requireVariable("SESSION_SECRET_1");
export const MONGODB_CONNECTION_URL = requireVariable("MONGODB_CONNECTION_URL");
export const REDIS_CONNECTION_URL = requireVariable("REDIS_CONNECTION_URL");

export const isProduction = env["NODE_ENV"] === "production";
export const port = parseInt(env["PORT"] ?? "3000", 10);

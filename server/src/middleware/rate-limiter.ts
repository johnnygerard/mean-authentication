import rateLimit from "express-rate-limit";
import type { RequestHandler } from "express";
import { isProduction } from "../load-env.js";

/**
 * Rate limiter middleware factory
 * @param limit - Maximum number of allowed requests
 * @param windowMs - Time frame in milliseconds for which requests are checked
 * @see https://express-rate-limit.mintlify.app/reference/configuration
 */
export const rateLimiter = (limit: number, windowMs: number): RequestHandler =>
  rateLimit({
    limit,
    windowMs,
    standardHeaders: true,
    legacyHeaders: false,
    // Disable rate limiting in non-production environments
    skip: isProduction ? undefined : () => true,
  });

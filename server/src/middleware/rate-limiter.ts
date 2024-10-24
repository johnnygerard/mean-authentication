// Draft 6: https://www.ietf.org/archive/id/draft-ietf-httpapi-ratelimit-headers-06.html
// Draft 7: https://www.ietf.org/archive/id/draft-ietf-httpapi-ratelimit-headers-07.html
import type { RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import ms from "ms";
import { OutgoingHttpHeaders } from "node:http";
import { RedisStore } from "rate-limit-redis";
import { parseRateLimit } from "ratelimit-header-parser";
import { isRateLimiterDisabled } from "../constants/env.js";
import { TOO_MANY_REQUESTS } from "../constants/http-status-code.js";
import { redisClient } from "../database/redis-client.js";

const MESSAGE = "Sorry, you have made too many requests.";

const formatRateLimit = (headers: OutgoingHttpHeaders): string => {
  const rateLimitDetails = parseRateLimit(headers, { reset: "seconds" });

  if (rateLimitDetails === undefined) {
    console.error("Rate limiting headers not found:", headers);
  } else if (rateLimitDetails.reset === undefined) {
    console.error("Failed to parse reset field:", headers);
  } else {
    const resetDate = rateLimitDetails.reset;
    const delta = resetDate.valueOf() - Date.now();

    return `${MESSAGE} Please try again in ${ms(delta, { long: true })}.`;
  }

  return `${MESSAGE} Please try again later.`;
};

/**
 * Rate limiter middleware factory.
 *
 * The factory uses Redis as a store for synchronization across processes and
 * servers. If performance is deemed more important, the built-in memory store
 * can be used instead.
 * @param limit - Maximum number of allowed requests
 * @param windowMs - Time frame in milliseconds for which requests are checked
 * @see https://express-rate-limit.mintlify.app/reference/configuration
 * @see https://github.com/express-rate-limit/rate-limit-redis
 */
export const rateLimiter = (limit: number, windowMs: number): RequestHandler =>
  rateLimit({
    limit,
    windowMs,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isRateLimiterDisabled,
    statusCode: TOO_MANY_REQUESTS,
    handler: (req, res, next, options) => {
      const message = formatRateLimit(res.getHeaders());
      res.status(options.statusCode).json(message);
    },
    keyGenerator: (req) => {
      return req.session?.userId ?? req.ip ?? "";
    },
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
  });

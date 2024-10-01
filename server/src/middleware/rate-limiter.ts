// Draft 6: https://www.ietf.org/archive/id/draft-ietf-httpapi-ratelimit-headers-06.html
// Draft 7: https://www.ietf.org/archive/id/draft-ietf-httpapi-ratelimit-headers-07.html
import type { RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import ms from "ms";
import { OutgoingHttpHeaders } from "node:http";
import { parseRateLimit } from "ratelimit-header-parser";
import { isRateLimiterDisabled } from "../constants/env.js";
import { TOO_MANY_REQUESTS } from "../constants/http-status-code.js";

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
    skip: () => isRateLimiterDisabled,
    statusCode: TOO_MANY_REQUESTS,
    handler: (req, res, next, options) => {
      const message = formatRateLimit(res.getHeaders());
      res.status(options.statusCode).json(message);
    },
  });

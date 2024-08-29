import { HttpHeaders } from "@angular/common/http";
import { HeadersObject, parseRateLimit } from "ratelimit-header-parser";
import ms from "ms";

// This converter is required because the current rate limit parser uses the
// Fetch API which is different from Angular's HTTP client API.
// See https://github.com/express-rate-limit/ratelimit-header-parser
const toHeadersObject = (headers: HttpHeaders): HeadersObject => {
  const dict: Record<string, string | string[]> = {};

  for (const key of headers.keys()) {
    const values = headers.getAll(key)!;
    dict[key] = values.length === 1 ? values[0] : values;
  }

  return dict;
};

export const formatRateLimit = (headers: HttpHeaders): string => {
  let message = "Sorry, you have made too many requests.";
  const rateLimitDetails = parseRateLimit(toHeadersObject(headers));

  if (rateLimitDetails?.reset) {
    const resetDate = rateLimitDetails.reset;
    const delta = resetDate.valueOf() - Date.now();

    message += ` Please try again in ${ms(delta, { long: true })}.`;
  } else {
    message += " Please try again later.";
  }

  return message;
};

import cors from "cors";
import ms from "ms";
import { NO_CONTENT } from "../constants/http-status-code.js";
import { CSRF_HEADER } from "./csrf.js";

const rateLimitingHeaders = [
  "ratelimit-policy",
  "ratelimit-limit",
  "ratelimit-remaining",
  "ratelimit-reset",
  "retry-after",
];

/**
 * CORS configuration middleware
 * @see https://github.com/expressjs/cors?tab=readme-ov-file#configuration-options
 */
export default cors({
  allowedHeaders: ["Content-Type", CSRF_HEADER],
  exposedHeaders: rateLimitingHeaders,
  maxAge: ms("1 hour") / 1000,
  methods: ["GET", "POST", "DELETE"],
  optionsSuccessStatus: NO_CONTENT,
  origin: "https://mean-authentication.app.jgerard.dev",
  preflightContinue: false,
  credentials: true, // Include cookies in cross-origin requests
});

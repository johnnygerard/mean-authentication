import cors from "cors";
import { NO_CONTENT } from "../http-status-code.js";

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
  allowedHeaders: "Content-Type",
  exposedHeaders: rateLimitingHeaders,
  maxAge: 86400,
  methods: ["GET", "POST", "DELETE"],
  optionsSuccessStatus: NO_CONTENT,
  origin: "https://mean-authentication.app.jgerard.dev",
  preflightContinue: false,
  credentials: true, // Include cookies in cross-origin requests
});

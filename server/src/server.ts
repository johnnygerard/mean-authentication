import cookieParser from "cookie-parser";
import type { ErrorRequestHandler } from "express";
import express from "express";
import { isProduction, port } from "./constants/env.js";
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "./constants/http-status-code.js";
import cors from "./middleware/cors.js";
import { csrf } from "./middleware/csrf.js";
import { isAuthenticated } from "./middleware/is-authenticated.js";
import { session } from "./middleware/session.js";
import privateRouter from "./routes/private.js";
import publicRouter from "./routes/public.js";

const app = express();

// Trust requests from Heroku's load balancer
app.set("trust proxy", 1);

const middleware = [
  cookieParser(),
  // ajv specialized JSON parsers are used instead of `express.json`
  // If the request has a JSON payload, `express.text` will parse it as a raw string.
  // @see https://ajv.js.org/guide/getting-started.html#parsing-and-serializing-json
  express.text({
    type: "application/json",
  }),
];

if (isProduction) middleware.unshift(cors); // Enable CORS

app.use("/api", middleware, publicRouter);
app.use("/api/user", session, isAuthenticated, csrf, privateRouter);

// Final catch-all controller
app.use((req, res) => {
  res.status(NOT_FOUND).end();
});

// Global error handler
app.use(((e, req, res, next) => {
  // Delegate to default error handler if headers have already been sent
  // See https://expressjs.com/en/guide/error-handling.html
  if (res.headersSent) {
    next(e);
    return;
  }

  console.error(e);
  res.status(INTERNAL_SERVER_ERROR).end();
}) as ErrorRequestHandler);

// Start the server
if (isProduction) {
  // Omitted host defaults to 0.0.0.0 or [::] if IPv6 is supported
  app.listen(port, () => {
    console.log("Express server listening on port", port);
  });
} else {
  const HOST = "localhost";

  app.listen(port, HOST, () => {
    console.log(`Express server listening at http://${HOST}:${port}`);
  });
}

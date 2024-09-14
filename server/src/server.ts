import type { ErrorRequestHandler } from "express";
import express from "express";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "./http-status-code.js";
import publicRouter from "./routes/public.js";
import privateRouter from "./routes/private.js";
import session from "./middleware/session.js";
import cors from "./middleware/cors.js";
import { isAuthenticated } from "./middleware/is-authenticated.js";
import { csrf } from "./middleware/csrf.js";
import { isProduction, port } from "./load-env.js";

const app = express();

// Trust requests from Heroku's load balancer
app.set("trust proxy", 1);

const middleware = [
  express.json(), // Parse JSON requests
  session, // Load session
];

if (isProduction) middleware.unshift(cors); // Enable CORS

app.use("/api", middleware, publicRouter);
app.use("/api/user", isAuthenticated, csrf, privateRouter);

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

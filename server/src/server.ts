import type { ErrorRequestHandler } from "express";
import express from "express";
import { env } from "node:process";
import {
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  NOT_FOUND,
} from "./http-status-code.js";
import cors from "cors";
import publicRouter from "./routes/public.js";
import cookieParser from "cookie-parser";
import { ApiError } from "./types/api-error.class.js";

const CLIENT_ORIGIN = "https://mean-authentication.app.jgerard.dev";
const PORT: number = parseInt(env.PORT ?? "3000", 10);
const app = express();

// Enable CORS for the Angular client
app.use(
  cors({
    allowedHeaders: "Content-Type",
    maxAge: 86400,
    methods: "POST",
    optionsSuccessStatus: NO_CONTENT,
    origin: env.HEROKU_ENV === "production" ? CLIENT_ORIGIN : "*",
    preflightContinue: false,
    credentials: true, // Include cookies in cross-origin requests
  }),
);

// Parse HTTP cookies
app.use(cookieParser());

// Parse JSON requests
app.use(express.json());

// Mount public router
app.use(publicRouter);

// Global error handler
app.use(((e, req, res, next) => {
  // Delegate to default error handler if headers have already been sent
  // See https://expressjs.com/en/guide/error-handling.html
  if (res.headersSent) {
    next(e);
    return;
  }

  console.error(e);
  res.status(INTERNAL_SERVER_ERROR).json(ApiError.UNEXPECTED_ERROR);
}) as ErrorRequestHandler);

// Final catch-all controller
app.use((req, res) => {
  res.status(NOT_FOUND).end();
});

if (env.NODE_ENV === "production") {
  // Omitted host defaults to 0.0.0.0 or [::] if IPv6 is supported
  app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
  });
} else {
  const HOST = "localhost";

  app.listen(PORT, HOST, () => {
    console.log(`Server listening at http://${HOST}:${PORT}`);
  });
}

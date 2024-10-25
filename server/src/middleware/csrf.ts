import { RequestHandler } from "express";
import { FORBIDDEN } from "../constants/http-status-code.js";

export const CSRF_HEADER = "X-CSRF-Token";
export const safeMethods = ["GET", "HEAD", "OPTIONS", "TRACE"];

export const csrf: RequestHandler = (req, res, next) => {
  if (safeMethods.includes(req.method)) {
    next();
    return;
  }

  const clientToken = req.get(CSRF_HEADER);
  const serverToken = req.user!.session.clientSession.csrfToken;

  if (clientToken === serverToken) {
    next();
    return;
  }

  console.error("Invalid or missing CSRF token");
  res.status(FORBIDDEN).end();
};

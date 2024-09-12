import { RequestHandler } from "express";
import { UNAUTHORIZED } from "../http-status-code.js";

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session.user) {
    next();
    return;
  }

  res.status(UNAUTHORIZED).end();
};

import { RequestHandler } from "express";
import { UNAUTHORIZED } from "../constants/http-status-code.js";
import { ApiError } from "../types/api-error.enum.js";

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.user) {
    next();
    return;
  }

  res.status(UNAUTHORIZED).json(ApiError.UNAUTHENTICATED);
};

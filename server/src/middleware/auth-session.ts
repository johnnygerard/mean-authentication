import { RequestHandler } from "express";
import { FORBIDDEN } from "../http-status-code.js";
import { UserSession, validateJwt } from "../auth/session.js";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ApiError } from "../types/api-error.class.js";

declare module "express-serve-static-core" {
  interface Request {
    session: UserSession;
  }
}

export const authSession: RequestHandler = async (req, res, next) => {
  try {
    // Check if the request has a session cookie
    const jwt = req.cookies.session;

    if (typeof jwt !== "string") {
      res.status(FORBIDDEN).json(ApiError.NO_SESSION_COOKIE);
      return;
    }

    // Validate JWT and attach session to request
    req.session = await validateJwt(jwt);

    next();
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      res.status(FORBIDDEN).json(ApiError.TOKEN_EXPIRED);
      return;
    }

    if (e instanceof JsonWebTokenError) {
      res.status(FORBIDDEN).json(ApiError.INVALID_TOKEN);
      return;
    }

    next(e);
  }
};

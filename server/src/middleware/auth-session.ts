import { RequestHandler } from "express";
import { FORBIDDEN } from "../http-status-code.js";
import { UserSession, validateJwt } from "../auth/session.js";
import jsonwebtoken from "jsonwebtoken";
import { ApiError } from "../types/api-error.class.js";
import { ErrorCode } from "../error-code.enum.js";

const { JsonWebTokenError, TokenExpiredError } = jsonwebtoken;

declare module "express-serve-static-core" {
  interface Request {
    session: UserSession;
  }
}

export const authSession: RequestHandler = async (req, res, next) => {
  try {
    // Check if the request has a session cookie
    const jwt = req.cookies.session;

    // Handle missing session cookie
    if (typeof jwt !== "string") {
      res.status(FORBIDDEN).json(new ApiError(ErrorCode.UNAUTHENTICATED));
      return;
    }

    // Validate JWT and attach session to request
    req.session = await validateJwt(jwt);

    next();
  } catch (e) {
    // Handle expired or invalid JWT
    if (e instanceof JsonWebTokenError) {
      res.status(FORBIDDEN).json(new ApiError(ErrorCode.UNAUTHENTICATED));
      return;
    }

    next(e);
  }
};

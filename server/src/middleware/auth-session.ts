import { RequestHandler } from "express";
import { FORBIDDEN } from "../http-status-code.js";
import { UserSession, validateJwt } from "../auth/session.js";
import jsonwebtoken from "jsonwebtoken";

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

    if (typeof jwt !== "string") {
      res.status(FORBIDDEN).json({ error: "Session token not found" });
      return;
    }

    // Validate JWT and attach session to request
    req.session = await validateJwt(jwt);

    next();
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      res.status(FORBIDDEN).json({ error: "Session token expired" });
      return;
    }

    if (e instanceof JsonWebTokenError) {
      res.status(FORBIDDEN).json({ error: "Invalid session token" });
      return;
    }

    next(e);
  }
};

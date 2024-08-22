import { RequestHandler } from "express";
import { OK } from "../http-status-code.js";
import { validateJwt } from "../auth/session.js";
import jsonwebtoken from "jsonwebtoken";

const { JsonWebTokenError } = jsonwebtoken;

export const authStatus: RequestHandler = async (req, res, next) => {
  try {
    const jwt = req.cookies.session;

    if (typeof jwt !== "string") {
      res.status(OK).json({ isAuthenticated: false });
      return;
    }

    await validateJwt(jwt);
    res.status(OK).json({ isAuthenticated: true });
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      res.status(OK).json({ isAuthenticated: false });
      return;
    }

    next(e);
  }
};

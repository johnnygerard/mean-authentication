import { RequestHandler } from "express";
import { NO_CONTENT } from "../http-status-code.js";
import { jwtCookieOptions } from "../auth/session.js";

export const deleteSession: RequestHandler = (req, res) => {
  res.clearCookie("session", { ...jwtCookieOptions, maxAge: 0 });
  res.status(NO_CONTENT).end();
};

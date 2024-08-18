import { RequestHandler } from "express";
import { jwtCookieOptions } from "../auth/session.js";
import { NO_CONTENT } from "../http-status-code.js";

export const deleteSession: RequestHandler = (req, res) => {
  res.clearCookie("session", jwtCookieOptions);
  res.status(NO_CONTENT).end();
};

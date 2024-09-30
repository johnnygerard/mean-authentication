import { RequestHandler } from "express";
import { NO_CONTENT } from "../constants/http-status-code.js";
import { sessionCookie } from "../middleware/session.js";

export const deleteSession: RequestHandler = (req, res, next) => {
  req.session.destroy((e) => {
    if (e) {
      next(e);
      return;
    }

    res.clearCookie(sessionCookie.name, {
      ...sessionCookie.options,
      maxAge: 0,
    });

    res.status(NO_CONTENT).end();
  });
};

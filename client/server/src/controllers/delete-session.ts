import { RequestHandler } from "express";
import { NO_CONTENT } from "../http-status-code";
import { sessionCookie } from "../middleware/session";

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

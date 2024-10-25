import { RequestHandler } from "express";
import { NO_CONTENT } from "../constants/http-status-code.js";
import { sessionStore } from "../session/redis-session-store.js";
import {
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "../session/session-cookie.js";

export const deleteAllSessions: RequestHandler = async (req, res, next) => {
  try {
    await sessionStore.deleteAll(req.user!.id);

    res.clearCookie(SESSION_COOKIE_NAME, {
      ...sessionCookieOptions,
      maxAge: 0,
    });

    res.status(NO_CONTENT).end();
  } catch (e) {
    next(e);
  }
};

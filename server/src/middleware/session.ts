import { RequestHandler } from "express";
import { sessionStore } from "../session/redis-session-store.js";
import {
  parseSessionCookie,
  SESSION_COOKIE_NAME,
} from "../session/session-cookie.js";

export const session: RequestHandler = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies[SESSION_COOKIE_NAME];

    if (typeof sessionCookie === "string") {
      const cookie = parseSessionCookie(sessionCookie);

      if (cookie) {
        const [userId, sessionId] = cookie;
        const session = await sessionStore.read(userId, sessionId);

        if (session) {
          req.user = {
            id: userId,
            session,
            sessionId,
          };
        }
      }
    }

    next();
  } catch (e) {
    next(e);
  }
};

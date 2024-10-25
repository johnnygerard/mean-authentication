import { RequestHandler } from "express";
import { sessionStore } from "../session/redis-session-store.js";
import {
  COOKIE_NAME as SESSION_COOKIE_NAME,
  parseSessionCookie,
} from "../session/session-cookie.js";

export const session: RequestHandler = async (req, res, next) => {
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
};

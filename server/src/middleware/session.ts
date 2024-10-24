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
    if (cookie) req.session = await sessionStore.read(...cookie);
  }

  next();
};

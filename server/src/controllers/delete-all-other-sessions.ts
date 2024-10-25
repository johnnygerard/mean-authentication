import { RequestHandler } from "express";
import { NO_CONTENT } from "../constants/http-status-code.js";
import { sessionStore } from "../session/redis-session-store.js";

export const deleteAllOtherSessions: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    await sessionStore.deleteAllOther(req.user!.id, req.user!.sessionId);
    res.status(NO_CONTENT).end();
  } catch (e) {
    next(e);
  }
};

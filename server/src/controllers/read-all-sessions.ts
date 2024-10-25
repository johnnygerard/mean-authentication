import { RequestHandler } from "express";
import { OK } from "../constants/http-status-code.js";
import { sessionStore } from "../session/redis-session-store.js";

export const readAllSessions: RequestHandler = async (req, res, next) => {
  try {
    const sessions = await sessionStore.readAll(req.user!.id);
    res.status(OK).json(sessions);
  } catch (e) {
    next(e);
  }
};

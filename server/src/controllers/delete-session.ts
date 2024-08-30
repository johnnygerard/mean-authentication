import { RequestHandler } from "express";
import { NO_CONTENT } from "../http-status-code.js";

export const deleteSession: RequestHandler = (req, res) => {
  // TODO Clear session cookie and database session

  res.status(NO_CONTENT).end();
};

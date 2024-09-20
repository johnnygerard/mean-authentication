import { RequestHandler } from "express";
import { users } from "../database/mongo-client.js";
import { NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http-status-code.js";
import { ObjectId } from "mongodb";

export const readAccount: RequestHandler = async (req, res, next) => {
  try {
    const sessionUser = req.session.user;

    if (sessionUser === undefined) {
      res.status(UNAUTHORIZED).end();
      return;
    }

    const user = await users.findOne(
      { _id: new ObjectId(sessionUser._id) },
      { projection: { _id: 0, password: 0 } },
    );

    if (user === null) {
      res.status(NOT_FOUND).end();
      return;
    }

    res.status(OK).json(user);
  } catch (e) {
    next(e);
  }
};

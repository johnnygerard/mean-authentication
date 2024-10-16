import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { NOT_FOUND, OK } from "../constants/http-status-code.js";
import { users } from "../database/mongo-client.js";

export const readAccount: RequestHandler = async (req, res, next) => {
  try {
    const user = await users.findOne(
      { _id: new ObjectId(req.session.user!._id) },
      { projection: { _id: 0, password: 0 } },
    );

    if (user === null) {
      res.status(NOT_FOUND).end();
      return;
    }

    res.set("Cache-Control", "no-store");
    res.status(OK).json(user);
  } catch (e) {
    next(e);
  }
};

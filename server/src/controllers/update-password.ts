import type { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { hashPassword } from "../auth/password-hashing.js";
import { isLeakedPassword } from "../auth/pwned-passwords-api.js";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
} from "../constants/http-status-code.js";
import { PASSWORD_MAX_LENGTH } from "../constants/password.js";
import { users } from "../database/mongo-client.js";
import { isValidPassword } from "../validation/password.js";
import { USERNAME_MAX_LENGTH } from "../validation/username.js";

export const updatePassword: RequestHandler = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, username } = req.body;

    if (
      typeof oldPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof username !== "string"
    ) {
      res.status(BAD_REQUEST).json("Invalid payload structure");
      return;
    }

    if (
      newPassword.length > PASSWORD_MAX_LENGTH ||
      oldPassword.length > PASSWORD_MAX_LENGTH ||
      username.length > USERNAME_MAX_LENGTH
    ) {
      res.status(BAD_REQUEST).json("Maximum input size exceeded");
      return;
    }

    const isLeakedPasswordPromise = isLeakedPassword(newPassword);
    const digestPromise = hashPassword(newPassword);
    const isPasswordStrongPromise = isValidPassword(
      newPassword,
      oldPassword,
      username,
    );

    if (!(await isPasswordStrongPromise)) {
      res.status(BAD_REQUEST).json("Weak password");
      return;
    }

    if (await isLeakedPasswordPromise) {
      res.status(BAD_REQUEST).json("Your password was leaked in a data breach");
      return;
    }

    const result = await users.updateOne(
      { _id: new ObjectId(req.user!.id) },
      { $set: { password: await digestPromise } },
    );

    if (result.modifiedCount !== 1) {
      res.status(INTERNAL_SERVER_ERROR).json("Failed to update password");
      return;
    }

    res.status(NO_CONTENT).end();
  } catch (e) {
    next(e);
  }
};

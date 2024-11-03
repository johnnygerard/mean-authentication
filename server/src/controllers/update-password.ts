import type { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { isLeakedPassword } from "../auth/is-leaked-password.js";
import { hashPassword, verifyPassword } from "../auth/password-hashing.js";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  UNAUTHORIZED,
} from "../constants/http-status-code.js";
import { users } from "../database/mongo-client.js";
import { ApiError } from "../types/api-error.enum.js";
import { parseNewPassword } from "../validation/ajv/new-password.js";
import { isValidPassword } from "../validation/password.js";

export const updatePassword: RequestHandler = async (req, res, next) => {
  try {
    const _id = new ObjectId(req.user!.id);
    const credentials = parseNewPassword(req.body);

    if (!credentials) {
      res.status(BAD_REQUEST).json(ApiError.VALIDATION_MISMATCH);
      return;
    }

    const { oldPassword, newPassword } = credentials;

    const [digest, isLeaked, isValid, user] = await Promise.all([
      hashPassword(newPassword),
      isLeakedPassword(newPassword),
      isValidPassword(newPassword, oldPassword),
      users.findOne({ _id }, { projection: { password: 1 } }),
    ]);

    if (!isValid) {
      res.status(BAD_REQUEST).json(ApiError.VALIDATION_MISMATCH);
      return;
    }

    if (isLeaked) {
      res.status(BAD_REQUEST).json(ApiError.LEAKED_PASSWORD);
      return;
    }

    if (!user) {
      console.error(`User not found (ID: ${req.user!.id})`);
      res.status(INTERNAL_SERVER_ERROR).json(ApiError.DATABASE_ERROR);
      return;
    }

    const matches = await verifyPassword(user.password, oldPassword);

    if (!matches) {
      res.status(UNAUTHORIZED).json(ApiError.WRONG_PASSWORD);
      return;
    }

    const updateResult = await users.updateOne(
      { _id },
      { $set: { password: digest } },
    );

    if (updateResult.modifiedCount !== 1) {
      console.error("Failed to update password", updateResult);
      res.status(INTERNAL_SERVER_ERROR).json(ApiError.DATABASE_ERROR);
      return;
    }

    res.status(NO_CONTENT).end();
  } catch (e) {
    next(e);
  }
};

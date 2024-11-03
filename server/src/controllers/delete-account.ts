import { RequestHandler, Response } from "express";
import { ObjectId } from "mongodb";
import { verifyPassword } from "../auth/password-hashing.js";
import {
  BAD_REQUEST,
  NO_CONTENT,
  UNAUTHORIZED,
} from "../constants/http-status-code.js";
import { users } from "../database/mongo-client.js";
import { ApiError } from "../types/api-error.enum.js";
import { parsePassword } from "../validation/ajv/password.js";

export const deleteAccount: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const _id = new ObjectId(userId);
    const credentials = parsePassword(req.body);

    if (!credentials) {
      res.status(BAD_REQUEST).json(ApiError.VALIDATION_MISMATCH);
      return;
    }

    const { password } = credentials;
    const user = await users.findOne({ _id }, { projection: { password: 1 } });

    if (!user) {
      handleDeletionFailure(res, userId);
      return;
    }

    const matches = await verifyPassword(user.password, password);

    if (!matches) {
      res.status(UNAUTHORIZED).json(ApiError.WRONG_PASSWORD);
      return;
    }

    const { deletedCount } = await users.deleteOne({ _id });

    if (deletedCount === 0) {
      handleDeletionFailure(res, userId);
      return;
    }

    // Delete all sessions in next middleware
    next();
  } catch (e) {
    next(e);
  }
};

/**
 * Handle account deletion failure
 *
 * An HTTP success response is sent to prevent user enumeration.
 * @param res - Response
 * @param userId - User ID
 */
const handleDeletionFailure = (res: Response, userId: string): void => {
  console.error(`Failed to delete account: user not found (ID: ${userId})`);
  res.status(NO_CONTENT).end();
};

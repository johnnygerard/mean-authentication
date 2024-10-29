import { RequestHandler, Response } from "express";
import { ObjectId } from "mongodb";
import { verifyPassword } from "../auth/password-hashing.js";
import {
  BAD_REQUEST,
  NO_CONTENT,
  UNAUTHORIZED,
} from "../constants/http-status-code.js";
import { PASSWORD_MAX_LENGTH } from "../constants/password.js";
import { users } from "../database/mongo-client.js";
import { ApiError } from "../types/api-error.enum.js";

export const deleteAccount: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const _id = new ObjectId(userId);
    const { password } = req.body;

    if (typeof password !== "string" || password.length > PASSWORD_MAX_LENGTH) {
      res.status(BAD_REQUEST).json("Invalid password");
      return;
    }

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

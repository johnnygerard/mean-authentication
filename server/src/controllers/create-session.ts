import type { RequestHandler } from "express";
import { BAD_REQUEST, CREATED, FORBIDDEN } from "../http-status-code.js";
import { USERNAME_MAX_LENGTH } from "./create-account.js";
import { PASSWORD_MAX_LENGTH, verifyPassword } from "../auth/password.js";
import { users } from "../mongo-client.js";
import { createJwt, jwtCookieOptions } from "../auth/session.js";
import { ApiError } from "../types/api-error.class.js";
import { ErrorCode } from "../error-code.enum.js";

export const createSession: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate username
    if (typeof username !== "string" || username.length > USERNAME_MAX_LENGTH) {
      res
        .status(BAD_REQUEST)
        .json(new ApiError(ErrorCode.VALIDATION_MISMATCH, "Invalid username"));
      return;
    }

    // Validate password
    if (typeof password !== "string" || password.length > PASSWORD_MAX_LENGTH) {
      res
        .status(BAD_REQUEST)
        .json(new ApiError(ErrorCode.VALIDATION_MISMATCH, "Invalid password"));
      return;
    }

    // Retrieve user from database
    const user = await users.findOne(
      { username },
      { projection: { _id: 0, password: 1, id: 1 } },
    );

    // Check if user exists
    if (!user) {
      res.status(FORBIDDEN).end();
      return;
    }

    // Verify password
    const matches = await verifyPassword(user.password, password);

    if (!matches) {
      res.status(FORBIDDEN).end();
      return;
    }

    // Set session cookie with JWT
    res.cookie(
      "session",
      await createJwt({ username, userId: user.id }),
      jwtCookieOptions,
    );

    res.status(CREATED).end();
  } catch (e) {
    next(e);
  }
};

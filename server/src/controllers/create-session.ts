import type { RequestHandler } from "express";
import { generateCSRFToken } from "../auth/csrf.js";
import { verifyPassword } from "../auth/password-hashing.js";
import {
  BAD_REQUEST,
  CREATED,
  UNAUTHORIZED,
} from "../constants/http-status-code.js";
import { PASSWORD_MAX_LENGTH } from "../constants/password.js";
import { users } from "../database/mongo-client.js";
import { ApiError } from "../types/api-error.enum.js";
import { ClientSession } from "../types/client-session.js";
import {
  usernameHasValidType,
  usernameHasValidValue,
} from "../validation/username.js";

export const createSession: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!usernameHasValidType(username) || !usernameHasValidValue(username)) {
      res.status(BAD_REQUEST).json("Invalid username");
      return;
    }

    if (typeof password !== "string" || password.length > PASSWORD_MAX_LENGTH) {
      res.status(BAD_REQUEST).json("Invalid password");
      return;
    }

    // Retrieve user from database
    const user = await users.findOne(
      { username },
      { projection: { password: 1 } },
    );

    // Check if user exists
    if (!user) {
      res.status(UNAUTHORIZED).json(ApiError.BAD_CREDENTIALS);
      return;
    }

    // Verify password
    const matches = await verifyPassword(user.password, password);

    if (!matches) {
      res.status(UNAUTHORIZED).json(ApiError.BAD_CREDENTIALS);
      return;
    }

    // Create session
    req.session.regenerate((e) => {
      if (e) {
        next(e);
        return;
      }

      const clientSession: ClientSession = {
        csrfToken: generateCSRFToken(),
        username,
      };
      req.session.user = { _id: user._id.toJSON(), clientSession };
      res.status(CREATED).json(clientSession);
    });
  } catch (e) {
    next(e);
  }
};

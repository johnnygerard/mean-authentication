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
import { sessionStore } from "../session/redis-session-store.js";
import { generateSessionCookie } from "../session/session-cookie.js";
import { ApiError } from "../types/api-error.enum.js";
import { ServerSession } from "../types/server-session.js";
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

    const userId = user._id.toJSON();
    const session: ServerSession = {
      clientSession: {
        csrfToken: generateCSRFToken(),
        username,
      },
    };

    const sessionId = await sessionStore.create(session, userId);
    res.cookie(...(await generateSessionCookie(userId, sessionId)));
    res.status(CREATED).json(session.clientSession);
  } catch (e) {
    next(e);
  }
};

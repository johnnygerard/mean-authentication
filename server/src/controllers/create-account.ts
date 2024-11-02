import type { RequestHandler } from "express";
import { generateCSRFToken } from "../auth/csrf.js";
import { hashPassword } from "../auth/password-hashing.js";
import { isLeakedPassword } from "../auth/pwned-passwords-api.js";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
} from "../constants/http-status-code.js";
import { users } from "../database/mongo-client.js";
import { User } from "../models/user.js";
import { sessionStore } from "../session/redis-session-store.js";
import { generateSessionCookie } from "../session/session-cookie.js";
import { ApiError } from "../types/api-error.enum.js";
import { ServerSession } from "../types/server-session.js";
import { parseCredentials } from "../validation/ajv/credentials.js";
import { isValidPassword } from "../validation/password.js";
import { isValidUsername } from "../validation/username.js";

const isUsernameTaken = async (username: string): Promise<boolean> => {
  const user = await users.findOne({ username }, { projection: { _id: 1 } });
  return user !== null;
};

export const createAccount: RequestHandler = async (req, res, next) => {
  try {
    const credentials = parseCredentials(req.body);

    if (!credentials) {
      res.status(BAD_REQUEST).json(ApiError.VALIDATION_MISMATCH);
      return;
    }

    const { username, password } = credentials;

    if (!isValidUsername(username)) {
      res.status(BAD_REQUEST).json(ApiError.VALIDATION_MISMATCH);
      return;
    }

    // Ensure username is unique
    if (await isUsernameTaken(username)) {
      res.status(CONFLICT).end();
      return;
    }

    if (!(await isValidPassword(password, username))) {
      res.status(BAD_REQUEST).json(ApiError.VALIDATION_MISMATCH);
      return;
    }

    if (await isLeakedPassword(password)) {
      res.status(BAD_REQUEST).json(ApiError.LEAKED_PASSWORD);
      return;
    }

    // Hash password
    const digest = await hashPassword(password);

    // Create user
    const user = new User(username, digest);

    // Save user
    const { insertedId } = await users.insertOne(user);

    const userId = insertedId.toJSON();
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

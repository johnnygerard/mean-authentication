import type { RequestHandler } from "express";
import { generateCSRFToken } from "../auth/csrf.js";
import { hashPassword } from "../auth/password-hashing.js";
import { isPasswordExposed } from "../auth/pwned-passwords-api.js";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
} from "../constants/http-status-code.js";
import { users } from "../database/mongo-client.js";
import { User } from "../models/user.js";
import { ClientSession } from "../types/client-session.js";
import { isPasswordStrong } from "../validation/password.js";
import {
  usernameHasValidType,
  usernameHasValidValue,
} from "../validation/username.js";

const isUsernameTaken = async (username: string): Promise<boolean> => {
  const reply = await users.findOne({ username }, { projection: { _id: 1 } });
  return reply !== null;
};

export const createAccount: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!usernameHasValidType(username) || !usernameHasValidValue(username)) {
      res.status(BAD_REQUEST).json("Invalid username");
      return;
    }

    // Ensure username is unique
    if (await isUsernameTaken(username)) {
      res.status(CONFLICT).end();
      return;
    }

    if (typeof password !== "string" || !isPasswordStrong(password, username)) {
      res.status(BAD_REQUEST).json("Invalid password");
      return;
    }

    if (await isPasswordExposed(password)) {
      res.status(BAD_REQUEST).json("Your password was leaked in a data breach");
      return;
    }

    // Hash password
    const digest = await hashPassword(password);

    // Create user
    const user = new User(username, digest);

    // Save user
    const { insertedId } = await users.insertOne(user);

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
      req.session.user = { _id: insertedId.toJSON(), clientSession };
      res.status(CREATED).json(clientSession);
    });
  } catch (e) {
    next(e);
  }
};

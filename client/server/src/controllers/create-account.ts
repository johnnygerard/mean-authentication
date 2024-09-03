import type { RequestHandler } from "express";
import { BAD_REQUEST, CONFLICT, CREATED } from "../http-status-code";
import { hashPassword, isPasswordValid } from "../auth/password";
import { User } from "../models/user";
import { users } from "../mongo-client";

export const USERNAME_MAX_LENGTH = 100;

/**
 * Check a username for validity.
 *
 * Validity constraints:
 * - Length: between 1 and 100 characters
 * - Characters: all Unicode codepoints outside the "Other" general category
 * @param username - Unvalidated username
 * @returns Whether the username is valid
 * @see https://unicode.org/reports/tr18/#General_Category_Property
 */
const isUsernameValid = (username: string): boolean =>
  username.length <= USERNAME_MAX_LENGTH && /^\P{C}+$/u.test(username);

const isUsernameTaken = async (username: string): Promise<boolean> => {
  const reply = await users.findOne({ username }, { projection: { _id: 1 } });
  return reply !== null;
};

export const createAccount: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate username
    if (typeof username !== "string" || !isUsernameValid(username)) {
      res.status(BAD_REQUEST).json({ error: "Invalid username" });
      return;
    }

    // Ensure username is unique
    if (await isUsernameTaken(username)) {
      res.status(CONFLICT).end();
      return;
    }

    // Validate password
    if (typeof password !== "string" || !isPasswordValid(password, username)) {
      res.status(BAD_REQUEST).json({ error: "Invalid password" });
      return;
    }

    // Hash password
    const digest = await hashPassword(password);

    // Create user
    const user = new User(username, digest);

    // Save user
    await users.insertOne(user);

    // Create session
    req.session.regenerate((e) => {
      if (e) {
        next(e);
        return;
      }

      req.session.user = { username };
      res.status(CREATED).json(req.session.user);
    });
  } catch (e) {
    next(e);
  }
};

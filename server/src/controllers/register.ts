import type { RequestHandler } from "express";
import { BAD_REQUEST, NO_CONTENT } from "../http-status-code.js";
import { hashPassword, isPasswordValid } from "../auth/password.js";
import { User } from "../models/user.js";
import { users } from "../mongo-client.js";
import { createJwt, jwtCookieOptions } from "../auth/session.js";

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

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate username
    if (typeof username !== "string" || !isUsernameValid(username)) {
      res
        .status(BAD_REQUEST)
        .json({ error: "Client-side validation bypassed" });
      return;
    }

    // Ensure username is unique
    if (await isUsernameTaken(username)) {
      res.status(BAD_REQUEST).json({ error: "Username is already taken" });
      return;
    }

    // Validate password
    if (typeof password !== "string" || !isPasswordValid(password, username)) {
      res
        .status(BAD_REQUEST)
        .json({ error: "Client-side validation bypassed" });
      return;
    }

    // Hash password
    const digest = await hashPassword(password);

    // Create user
    const user = new User(username, digest);

    // Save user
    await users.insertOne(user);

    // Create user session
    res.cookie(
      "session",
      await createJwt({ username, userId: user.id }),
      jwtCookieOptions,
    );

    res.status(NO_CONTENT).end();
  } catch (e) {
    next(e);
  }
};

import type { RequestHandler } from "express";
import { BAD_REQUEST, CREATED } from "../http-status-code.js";
import { hashPassword, isPasswordValid } from "../auth/password.js";
import { User } from "../models/user.js";
import { users } from "../mongo-client.js";

// Only exclude Unicode characters in the "Other" general category
// See https://unicode.org/reports/tr18/#General_Category_Property
const USERNAME_REGEX = /^\P{C}{1,100}$/u;

const isUsernameTaken = async (username: string): Promise<boolean> => {
  const reply = await users.findOne({ username }, { projection: { _id: 1 } });
  return reply !== null;
};

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate username
    if (typeof username !== "string" || !USERNAME_REGEX.test(username)) {
      res.status(BAD_REQUEST).json({ error: "Invalid username" });
      return;
    }

    // Ensure username is unique
    if (await isUsernameTaken(username)) {
      res.status(BAD_REQUEST).json({ error: "Username is already taken" });
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
    const reply = await users.insertOne(user);
    console.log(reply);
    res.status(CREATED).end();
  } catch (e) {
    next(e);
  }
};

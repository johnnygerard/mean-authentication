import type { RequestHandler } from "express";
import { BAD_REQUEST, CREATED, UNAUTHORIZED } from "../http-status-code.js";
import { USERNAME_MAX_LENGTH } from "./create-account.js";
import { PASSWORD_MAX_LENGTH, verifyPassword } from "../auth/password.js";
import { users } from "../mongo-client.js";

export const createSession: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate username
    if (typeof username !== "string" || username.length > USERNAME_MAX_LENGTH) {
      res.status(BAD_REQUEST).json({ error: "Invalid username" });
      return;
    }

    // Validate password
    if (typeof password !== "string" || password.length > PASSWORD_MAX_LENGTH) {
      res.status(BAD_REQUEST).json({ error: "Invalid password" });
      return;
    }

    // Retrieve user from database
    const user = await users.findOne(
      { username },
      { projection: { _id: 0, password: 1 } },
    );

    // Check if user exists
    if (!user) {
      res.status(UNAUTHORIZED).end();
      return;
    }

    // Verify password
    const matches = await verifyPassword(user.password, password);

    if (!matches) {
      res.status(UNAUTHORIZED).end();
      return;
    }

    // Create session
    req.session.regenerate((e) => {
      if (e) {
        next(e);
        return;
      }

      req.session.user = { username };
      res.status(CREATED).end();
    });
  } catch (e) {
    next(e);
  }
};

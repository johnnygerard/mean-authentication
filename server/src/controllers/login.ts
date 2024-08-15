import type { RequestHandler } from "express";
import { BAD_REQUEST, OK } from "../http-status-code.js";
import { USERNAME_MAX_LENGTH } from "./register.js";
import { PASSWORD_MAX_LENGTH, verifyPassword } from "../auth/password.js";
import { users } from "../mongo-client.js";
import { createJwt, jwtCookieOptions } from "../auth/session.js";

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Type and length validation
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      username.length > USERNAME_MAX_LENGTH ||
      password.length > PASSWORD_MAX_LENGTH
    ) {
      res.status(BAD_REQUEST).json({ error: "Client-side validation failure" });
      return;
    }

    // Retrieve user from database
    const user = await users.findOne(
      { username },
      { projection: { _id: 0, password: 1, id: 1 } },
    );

    // Check if user exists
    if (!user) {
      res.status(BAD_REQUEST).json({ error: "Invalid credentials" });
      return;
    }

    // Verify password
    const matches = await verifyPassword(user.password, password);

    if (!matches) {
      res.status(BAD_REQUEST).json({ error: "Invalid credentials" });
      return;
    }

    // Set session cookie with JWT
    res.cookie(
      "session",
      await createJwt({ username, userId: user.id }),
      jwtCookieOptions,
    );

    res.status(OK).end();
  } catch (e) {
    next(e);
  }
};

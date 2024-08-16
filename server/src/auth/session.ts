// jsonwebtoken documentation:
// https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#readme
import { Buffer } from "node:buffer";
import { env } from "node:process";
import type { Algorithm, VerifyErrors } from "jsonwebtoken";
import jsonwebtoken from "jsonwebtoken";
import { CookieOptions } from "express";
import ms from "ms";

if (!env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
const secret: Buffer = Buffer.from(env.JWT_SECRET, "base64");
const AUDIENCE = "mean-authentication.app.jgerard.dev";
const ISSUER = "api.mean-authentication.app.jgerard.dev";
const SESSION_LIFETIME = "1h";
const SIGNATURE_ALGORITHM: Algorithm = "HS256";

export type UserSession = {
  username: string;
  userId: string;
};

/**
 * Generate a signed JWT for the given user.
 * @param session - User session data to be stored in the token payload
 * @returns JSON web token
 * @throws {Error} if token signing fails
 */
export const createJwt = (session: UserSession): Promise<string> =>
  new Promise((resolve, reject) => {
    jsonwebtoken.sign(
      { username: session.username },
      secret,
      {
        algorithm: SIGNATURE_ALGORITHM,
        audience: AUDIENCE,
        expiresIn: SESSION_LIFETIME,
        issuer: ISSUER,
        subject: session.userId,
      },
      (err, token) => {
        if (token) resolve(token);
        else reject(err);
      },
    );
  });

/**
 * Validate a JWT
 * @param token - JSON web token
 * @returns JWT payload
 * @throws {VerifyErrors} if token is invalid
 */
export const validateJwt = (token: string): Promise<UserSession> =>
  new Promise((resolve, reject) => {
    jsonwebtoken.verify(
      token,
      secret,
      {
        algorithms: [SIGNATURE_ALGORITHM],
        audience: AUDIENCE,
        issuer: ISSUER,
      },
      (err, payload) => {
        if (typeof payload === "string")
          reject(new Error("Unexpected payload type"));
        else if (payload) {
          const { username, sub } = payload;
          if (typeof username === "string" && typeof sub === "string")
            resolve({ username, userId: sub });
          else reject(new Error("Unexpected payload"));
        } else reject(err);
      },
    );
  });

export const jwtCookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: ms(SESSION_LIFETIME),
  secure: true,
  sameSite: "strict",
};

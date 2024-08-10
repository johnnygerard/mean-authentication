// jsonwebtoken documentation:
// https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#readme
import { Buffer } from "node:buffer";
import { env } from "node:process";
import type { Algorithm, JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

if (!env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
const secret: Buffer = Buffer.from(env.JWT_SECRET, "base64");
const AUDIENCE = "mean-authentication.app.jgerard.dev";
const ISSUER = "api.mean-authentication.app.jgerard.dev";
const SIGNATURE_ALGORITHM: Algorithm = "HS256";

/**
 * Generate a signed JWT for the given user.
 * @param username - Username
 * @param userId - User ID
 * @returns JSON web token
 * @throws {Error} if token signing fails
 */
export const createJwt = (username: string, userId: string): Promise<string> =>
  new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      secret,
      {
        algorithm: SIGNATURE_ALGORITHM,
        audience: AUDIENCE,
        expiresIn: "1h",
        issuer: ISSUER,
        subject: userId,
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
 * @throws {jwt.VerifyErrors} if token is invalid
 */
export const validateJwt = (token: string): Promise<JwtPayload> =>
  new Promise((resolve, reject) => {
    jwt.verify(
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
        else if (payload) resolve(payload);
        else reject(err);
      },
    );
  });

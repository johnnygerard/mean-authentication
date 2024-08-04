import { Buffer } from "node:buffer";
import { env } from "node:process";
import argon2 from "argon2";

const getSecret = (): Buffer => {
  if (env.ARGON2_SECRET) return Buffer.from(env.ARGON2_SECRET);
  throw Error("ARGON2_SECRET is not set");
};

/**
 * Hash a password with Argon2
 *
 * The specified algorithm and its parameters follow OWASP recommendations.
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> =>
  argon2.hash(password, {
    memoryCost: 12288, // 12MB
    parallelism: 1,
    secret: getSecret(),
    timeCost: 3,
    type: argon2.argon2id,
  });

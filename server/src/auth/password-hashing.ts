// Argon2 reference implementation: https://github.com/P-H-C/phc-winner-argon2
import argon2 from "argon2";
// Argon2 Node.js bindings: https://github.com/ranisalt/node-argon2
import { Buffer } from "node:buffer";
import { ARGON2_SECRET } from "../constants/env.js";

const secret = Buffer.from(ARGON2_SECRET);

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
    secret,
    timeCost: 3,
    type: argon2.argon2id,
  });

/**
 * Verify a password against a digest
 *
 * The digest contains the salt and the parameters used to hash the password.
 * @param digest - Hashed password
 * @param password - Plain text password
 * @returns Whether the password matches the digest
 */
export const verifyPassword = async (
  digest: string,
  password: string,
): Promise<boolean> => argon2.verify(digest, password, { secret });

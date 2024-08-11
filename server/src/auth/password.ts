// Argon2 reference implementation: https://github.com/P-H-C/phc-winner-argon2
// Argon2 Node.js bindings: https://github.com/ranisalt/node-argon2
import { Buffer } from "node:buffer";
import { env } from "node:process";
import argon2 from "argon2";
import zxcvbn from "zxcvbn";

if (!env.ARGON2_SECRET) throw Error("ARGON2_SECRET is not set");
const secret = Buffer.from(env.ARGON2_SECRET);
export const MAX_LENGTH = 64;

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

/**
 * Check if a password is strong enough
 *
 * Uses the `zxcvbn` library to check the password strength.
 * The strength score (0-4) is based on the estimated number of guesses needed to crack the password.
 * @param password - Plain text password
 * @param userInputs - User inputs (e.g. username) to include in dictionary checks
 * @returns Whether the password is strong enough
 * @see https://github.com/dropbox/zxcvbn?tab=readme-ov-file#readme
 */
export const isPasswordValid = (
  password: string,
  ...userInputs: string[]
): boolean => {
  // Validate password length
  if (password.length > MAX_LENGTH) return false;
  const result = zxcvbn(password, userInputs);
  return result.score >= 3;
};

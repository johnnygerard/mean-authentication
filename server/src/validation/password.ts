import zxcvbn from "zxcvbn";
import { ZXCVBN_MIN_SCORE } from "../constants/password.js";
import { readFile } from "node:fs/promises";
import { APP_NAME } from "../constants/app.js";

/**
 * Application-specific vocabulary for password strength validation
 * @see https://relatedwords.org/relatedto/authentication
 */
const text = await readFile("src/validation/app-dictionary.txt", "utf-8");
export const appDictionary = text.split("\n");

appDictionary.push(APP_NAME);

/**
 * Check if the password is strong enough.
 * @param password - Plaintext password
 * @param userInputs - Any strings that could be used in a dictionary attack
 * @returns ZXCVBN result
 * @see https://github.com/dropbox/zxcvbn?tab=readme-ov-file#readme
 */
export const passwordIsStrong = (
  password: string,
  ...userInputs: string[]
): boolean => {
  const result = zxcvbn(password, userInputs.concat(appDictionary));
  return result.score >= ZXCVBN_MIN_SCORE;
};

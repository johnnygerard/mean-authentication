import { readFile } from "node:fs/promises";
import { Piscina } from "piscina";
import { APP_NAME } from "../constants/app.js";
import { PASSWORD_MAX_LENGTH, ZXCVBN_MIN_SCORE } from "../constants/password.js";

/**
 * Application-specific vocabulary for password strength validation
 * @see https://relatedwords.org/relatedto/authentication
 */
const text = await readFile("data/app-dictionary.txt", "utf-8");
export const appDictionary = text.split("\n");

appDictionary.push(APP_NAME);

/**
 * Validate the password strength.
 *
 * To prevent DoS attacks, passwords whose length exceeds the limit are treated
 * as invalid.
 * @param password - Plaintext password
 * @param userInputs - Any strings that could be used in a dictionary attack
 * @returns `true` if the password is strong enough, `false` otherwise
 * @see https://github.com/dropbox/zxcvbn?tab=readme-ov-file#readme
 */
export const isValidPassword = async (
  password: string,
  ...userInputs: string[]
): Promise<boolean> => {
  if (password.length > PASSWORD_MAX_LENGTH) return false;

  const piscina = new Piscina({
    filename: new URL("zxcvbn.worker.js", import.meta.url).href,
  });

  const result = await piscina.run([
    password,
    userInputs.concat(appDictionary),
  ]);

  return result.score >= ZXCVBN_MIN_SCORE;
};

import type { ZXCVBNResult } from "zxcvbn";
import type { ZXCVBN } from "../types/zxcvbn.js";
import { appDictionary } from "./app-dictionary.js";

// @see https://github.com/dropbox/zxcvbn?tab=readme-ov-file#runtime-latency
export const PASSWORD_MAX_LENGTH = 100;

export const passwordHasValidType = (password: unknown): password is string => {
  return typeof password === "string";
};

/**
 * Get ZXCVBN result for the password
 * @param zxcvbn - ZXCVBN function
 * @param password - Plaintext password
 * @param userInputs - User inputs (e.g. username) to include in dictionary checks
 * @returns ZXCVBN result
 * @see https://github.com/dropbox/zxcvbn?tab=readme-ov-file#readme
 */
export const getZXCVBNResult = (
  zxcvbn: ZXCVBN,
  password: string,
  ...userInputs: string[]
): ZXCVBNResult => {
  return zxcvbn(password, userInputs.concat(appDictionary));
};

export const passwordIsStrong = (zxcvbnResult: ZXCVBNResult): boolean => {
  return zxcvbnResult.score >= 3;
};

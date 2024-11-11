import { faker } from "@faker-js/faker";
import { readFile } from "node:fs/promises";
import { PASSWORD_MAX_LENGTH } from "../constants/password.js";

const leakedPasswords = (
  await readFile(
    new URL("../../data/test/NordVPN.txt", import.meta.url),
    "utf-8",
  )
)
  .split("\n")
  .filter((line) => line && line.length <= PASSWORD_MAX_LENGTH);

/**
 * Get a random leaked password.
 *
 * Source: NordVPN data breach.
 * @see https://github.com/danielmiessler/SecLists/blob/master/Passwords/Leaked-Databases/NordVPN.txt
 */
export const getLeakedPassword = (): string => {
  return faker.helpers.arrayElement(leakedPasswords);
};

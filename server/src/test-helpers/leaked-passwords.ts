import { faker } from "@faker-js/faker";
import { readFile } from "node:fs/promises";

const leakedPasswords = (
  await readFile(
    new URL("../../data/test/NordVPN.txt", import.meta.url),
    "utf-8",
  )
).split("\n");

/**
 * Get a random leaked password.
 *
 * Source: NordVPN data breach.
 * @see https://github.com/danielmiessler/SecLists/blob/master/Passwords/Leaked-Databases/NordVPN.txt
 */
export const getLeakedPassword = (): string => {
  return faker.helpers.arrayElement(leakedPasswords);
};

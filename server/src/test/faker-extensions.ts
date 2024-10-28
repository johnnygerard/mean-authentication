import { faker } from "@faker-js/faker";
import { Buffer } from "node:buffer";
import { PASSWORD_MAX_LENGTH } from "../constants/password.js";

/**
 * Generate fake credentials (username and password)
 */
export const getFakeCredentials = (): {
  username: string;
  password: string;
} => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
});

/**
 * Generate a fake password with random length and characters.
 */
export const getFakePassword = (): string => {
  const length = faker.number.int({ min: 0, max: PASSWORD_MAX_LENGTH });
  return faker.internet.password({ length });
};

/**
 * Generate a random buffer
 *
 * When invoked without arguments, the buffer has a random byte length between
 * one byte and one kilobyte (inclusive).
 * @param length - Buffer length
 * @returns Random buffer
 */
export const getRandomBuffer = (length?: number): Buffer => {
  const count = length ?? faker.number.int({ min: 1, max: 1024 });
  const integers = faker.helpers.multiple(getRandomByte, { count });

  return Buffer.from(integers);
};

const getRandomByte = (): number => faker.number.int({ max: 255 });

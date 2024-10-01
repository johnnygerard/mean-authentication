import { faker } from "@faker-js/faker";

import { PASSWORD_MAX_LENGTH } from "../constants/password.js";
import { hashPassword, verifyPassword } from "./password-hashing.js";

/**
 * Generate a fake password with random length and characters.
 */
const getPassword = (): string => {
  const length = faker.number.int({ max: PASSWORD_MAX_LENGTH });
  return faker.internet.password({ length });
};

describe("Password Hashing", () => {
  let password: string;

  beforeEach(() => {
    password = getPassword();
  });

  describe("The hashPassword function", () => {
    it("should produce a digest", async () => {
      const digest = await hashPassword(password);
      expect(typeof digest).toBe("string");
    });

    it("should not produce the same digest for the same password", async () => {
      // This is expected because a unique salt is stored in each digest
      const digest1 = await hashPassword(password);
      const digest2 = await hashPassword(password);

      expect(digest1).not.toBe(digest2);
    });

    it("should produce a digest with Argon2id", async () => {
      const digest = await hashPassword(password);
      expect(digest).toContain("$argon2id$");
    });
  });

  describe("The verifyPassword function", () => {
    it("should return true for a matching password", async () => {
      const digest = await hashPassword(password);
      await expectAsync(verifyPassword(digest, password)).toBeResolvedTo(true);
    });

    it("should return false for a non-matching password", async () => {
      const digest = await hashPassword(password);

      await expectAsync(verifyPassword(digest, getPassword())).toBeResolvedTo(
        false,
      );
    });
  });
});

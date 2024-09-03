import { faker } from "@faker-js/faker";
import {
  hashPassword,
  isPasswordValid,
  PASSWORD_MAX_LENGTH,
  verifyPassword,
} from "./password.js";
import { cpuUsage } from "node:process";

const getRandomPassword = (length?: number): string => {
  const options = {
    length: faker.number.int({ min: length ?? 8, max: length ?? 64 }),
  };
  return faker.internet.password(options);
};

describe("password module", () => {
  let password: string;

  beforeEach(() => {
    password = getRandomPassword();
  });

  describe("hashPassword", () => {
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

  describe("verifyPassword", () => {
    it("should return true for a matching password", async () => {
      const digest = await hashPassword(password);
      const matches = await verifyPassword(digest, password);

      expect(matches).toBeTrue();
    });

    it("should return false for a non-matching password", async () => {
      const digest = await hashPassword(password);
      const matches = await verifyPassword(digest, getRandomPassword());

      expect(matches).toBeFalse();
    });
  });

  describe("isPasswordValid", () => {
    it("should return true for a strong password", () => {
      const username = faker.internet.userName();
      const password = "F4`j84ZjMLNm[B~d";

      expect(isPasswordValid(password, username)).toBeTrue();
    });

    it("should return false for a weak password", () => {
      const username = faker.internet.userName();
      // Reusing the username in the password is vulnerable to dictionary attacks
      // while adding LUDS characters is not enough to make it strong
      const password = username + "aB1@";

      expect(isPasswordValid(password, username)).toBeFalse();
    });

    it("should allow long passwords (at least 64 characters)", () => {
      const password = getRandomPassword(64);

      expect(isPasswordValid(password)).toBeTrue();
    });

    it("should instantly reject very long passwords", () => {
      const password = getRandomPassword(1000);
      const startUsage = cpuUsage();

      expect(isPasswordValid(password)).toBeFalse();

      const usage = cpuUsage(startUsage);
      const latency = (usage.user + usage.system) / 1000;
      expect(latency).toBeLessThan(10); // Should be almost instantaneous
    });

    it("should take less than 100ms to validate a password", () => {
      const password = getRandomPassword(PASSWORD_MAX_LENGTH);
      const startUsage = cpuUsage();
      isPasswordValid(password);

      const usage = cpuUsage(startUsage);
      const latency = (usage.user + usage.system) / 1000;
      expect(latency).toBeLessThan(100);
    });
  });
});

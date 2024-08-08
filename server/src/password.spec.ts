import { faker } from "@faker-js/faker";
import { hashPassword, verifyPassword } from "./password.js";

const getRandomPassword = (): string => {
  const length: number = faker.number.int({ min: 8, max: 64 });
  return faker.internet.password({ length });
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
});

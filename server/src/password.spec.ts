import { faker } from "@faker-js/faker";
import { hashPassword, verifyPassword } from "./password.js";

const getRandomPassword = (): string => {
  const length: number = faker.number.int({ min: 8, max: 64 });
  return faker.internet.password({ length });
};

describe("Password", () => {
  let password: string;

  beforeEach(() => {
    password = getRandomPassword();
  });

  it("should hash a password", async () => {
    const digest = await hashPassword(password);

    expect(typeof digest).toBe("string");
  });

  it("should verify a password against a digest", async () => {
    const digest = await hashPassword(password);
    const matches = await verifyPassword(digest, password);

    expect(matches).toBe(true);
  });
});

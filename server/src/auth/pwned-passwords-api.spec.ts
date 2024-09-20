import { passwordIsExposed } from "./pwned-passwords-api.js";
import { faker } from "@faker-js/faker";
import { leakedPasswords } from "../test/leaked-passwords.js";

describe("The isPasswordExposed function", () => {
  it("should return true for a leaked password", async () => {
    const password = getLeakedPassword();
    await expectAsync(passwordIsExposed(password)).toBeResolvedTo(true);
  });

  it("should return false for a secure password", async () => {
    const password = faker.internet.password();
    await expectAsync(passwordIsExposed(password)).toBeResolvedTo(false);
  });
});

const getLeakedPassword = (): string => {
  const index = faker.number.int({ max: leakedPasswords.length - 1 });
  return leakedPasswords[index];
};

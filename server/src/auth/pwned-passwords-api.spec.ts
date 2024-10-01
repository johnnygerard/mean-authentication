import { isPasswordExposed } from "./pwned-passwords-api.js";
import { faker } from "@faker-js/faker";
import { getLeakedPassword } from "../test/leaked-passwords.js";

describe("The isPasswordExposed function", () => {
  it("should return true for a leaked password", async () => {
    const password = getLeakedPassword();
    await expectAsync(isPasswordExposed(password)).toBeResolvedTo(true);
  });

  it("should return false for a secure password", async () => {
    const password = faker.internet.password();
    await expectAsync(isPasswordExposed(password)).toBeResolvedTo(false);
  });
});

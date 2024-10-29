import { faker } from "@faker-js/faker";
import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { getLeakedPassword } from "../test-helpers/leaked-passwords.js";
import { isPasswordExposed } from "./pwned-passwords-api.js";

suite("The isPasswordExposed function", () => {
  test("returns true for a leaked password", async () => {
    const password = getLeakedPassword();
    const isExposed = await isPasswordExposed(password);
    assert(isExposed, `Password "${password}" is not exposed`);
  });

  test("returns false for a secure password", async () => {
    const password = faker.internet.password();
    const isExposed = await isPasswordExposed(password);
    assert(!isExposed, `Password "${password}" is exposed`);
  });
});

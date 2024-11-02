import { faker } from "@faker-js/faker";
import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { getLeakedPassword } from "../test-helpers/leaked-passwords.js";
import { isLeakedPassword } from "./pwned-passwords-api.js";

suite("The isLeakedPassword function", () => {
  test("returns true for a leaked password", async () => {
    const password = getLeakedPassword();
    const isLeaked = await isLeakedPassword(password);
    assert(isLeaked, `Password "${password}" is not leaked`);
  });

  test("returns false for a non-leaked password", async () => {
    const password = faker.internet.password();
    const isLeaked = await isLeakedPassword(password);
    assert(!isLeaked, `Password "${password}" is leaked`);
  });
});

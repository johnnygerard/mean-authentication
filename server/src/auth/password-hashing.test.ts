import assert from "node:assert/strict";
import { beforeEach, suite, test } from "node:test";
import { getFakePassword } from "../test-helpers/faker-extensions.js";
import { hashPassword, verifyPassword } from "./password-hashing.js";

suite("The hashPassword function", () => {
  let password: string;

  beforeEach(() => {
    password = getFakePassword();
  });

  test("returns a digest", async () => {
    const digest = await hashPassword(password);
    assert(digest);
  });

  test("returns an Argon2id digest", async () => {
    const digest = await hashPassword(password);
    assert.match(digest, /^\$argon2id\$/);
  });

  test("does not return the same digest for the same password", async () => {
    // This is expected because a unique salt is stored in each digest
    const digest1 = await hashPassword(password);
    const digest2 = await hashPassword(password);
    assert.notEqual(digest1, digest2);
  });
});

suite("The verifyPassword function", () => {
  let password: string;

  beforeEach(() => {
    password = getFakePassword();
  });

  test("returns true for a matching password", async () => {
    const digest = await hashPassword(password);
    const matches = await verifyPassword(digest, password);
    assert(matches);
  });

  test("returns false for a non-matching password", async () => {
    const digest = await hashPassword(password);
    const matches = await verifyPassword(digest, getFakePassword());
    assert(!matches);
  });
});

import { faker } from "@faker-js/faker";
import { CookieOptions } from "express";
import assert from "node:assert/strict";
import { beforeEach, suite, test } from "node:test";
import {
  generateSessionCookie,
  parseSessionCookie,
  SESSION_COOKIE_NAME,
} from "./session-cookie.js";

suite("The session cookie module", () => {
  let userId: string;
  let sessionId: string;
  let cookieName: typeof SESSION_COOKIE_NAME;
  let cookieValue: string;
  let cookieOptions: CookieOptions;

  beforeEach(async () => {
    userId = faker.database.mongodbObjectId();
    sessionId = faker.string.uuid();
    [cookieName, cookieValue, cookieOptions] = await generateSessionCookie(
      userId,
      sessionId,
    );
  });

  test("generates a session cookie", () => {
    assert.equal(cookieName, SESSION_COOKIE_NAME);
    assert.equal(typeof cookieValue, "string");
    assert(cookieOptions.httpOnly);
    assert.equal(cookieOptions.sameSite, "strict");
  });

  test("parses a session cookie", () => {
    const result = parseSessionCookie(cookieValue);

    if (result === null) throw new Error("Failed to parse session cookie");

    assert.equal(result[0], userId);
    assert.equal(result[1], sessionId);
  });
});

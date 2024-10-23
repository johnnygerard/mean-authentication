import { faker } from "@faker-js/faker";
import { CookieOptions } from "express";
import { generateSessionCookie, parseSessionCookie } from "./session-cookie.js";

fdescribe("The session cookie", () => {
  let userId: string;
  let sessionId: string;
  let cookieName: "id";
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

  it("should generate a session cookie", () => {
    expect(cookieName).toBe("id");
    expect(typeof cookieValue).toBe("string");
    expect(cookieOptions.httpOnly).toBeTrue();
    expect(cookieOptions.sameSite).toBe("strict");
  });

  it("should parse a session cookie", () => {
    const result = parseSessionCookie(cookieValue);

    if (result === null) throw new Error("Failed to parse session cookie");

    expect(result[0]).toBe(userId);
    expect(result[1]).toBe(sessionId);
  });
});

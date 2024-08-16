import { request } from "../test-utils.js";
import { OK } from "../http-status-code.js";
import { faker } from "@faker-js/faker";
import { createJwt } from "../auth/session.js";

describe("authStatus controller", () => {
  it("should return true if there is a valid session cookie", async () => {
    // Create valid session cookie
    const token = await createJwt({
      username: faker.internet.userName(),
      userId: faker.string.uuid(),
    });

    const { statusCode, payload } = await request("GET", "/auth-status", null, {
      Cookie: `session=${token}`,
    });

    expect(statusCode).toBe(OK);
    expect(JSON.parse(payload).isAuthenticated).toBeTrue();
  });

  it("should return false if there is no session cookie", async () => {
    const { statusCode, payload } = await request("GET", "/auth-status");

    expect(statusCode).toBe(OK);
    expect(JSON.parse(payload).isAuthenticated).toBeFalse();
  });

  it("should return false if the session cookie is invalid", async () => {
    // Create valid session cookie
    const token = await createJwt({
      username: faker.internet.userName(),
      userId: faker.string.uuid(),
    });

    // Set signature algorithm to "none" and remove the signature
    const tokenPayload = token.split(".")[1];
    const badHeader = Buffer.from(
      JSON.stringify({ alg: "none", typ: "JWT" }),
    ).toString("base64url");
    const badToken = [badHeader, tokenPayload, ""].join(".");

    const { statusCode, payload } = await request("GET", "/auth-status", null, {
      Cookie: `session=${badToken}`,
    });

    expect(statusCode).toBe(OK);
    expect(JSON.parse(payload).isAuthenticated).toBeFalse();
  });
});

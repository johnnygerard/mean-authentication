import { faker } from "@faker-js/faker";
import { request } from "../test-utils.js";
import { BAD_REQUEST, NO_CONTENT } from "../http-status-code.js";
import { users } from "../mongo-client.js";

describe("Login Controller", () => {
  afterAll(async () => {
    await users.deleteMany();
  });

  it("should create a new authentication session", async () => {
    const credentials = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    await request("POST", "/register", credentials);

    const { statusCode, headers, payload } = await request(
      "POST",
      "/login",
      credentials,
    );

    expect(statusCode).toBe(NO_CONTENT);

    expect(headers["set-cookie"]).toBeDefined();
    const setCookieHeaders = headers["set-cookie"] as string[];
    expect(setCookieHeaders).toHaveSize(1);
    expect(setCookieHeaders[0]).toMatch(/^session=/);

    expect(payload).toBe("");
  });

  it("should not log in non-existing user", async () => {
    const { statusCode } = await request("POST", "/login", {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });

    expect(statusCode).toBe(BAD_REQUEST);
  });

  it("should not log in user with incorrect password", async () => {
    const username = faker.internet.userName();
    const password = faker.internet.password();

    await request("POST", "/register", { username, password });

    const { statusCode } = await request("POST", "/login", {
      username,
      password: faker.internet.password(),
    });

    expect(statusCode).toBe(BAD_REQUEST);
  });
});

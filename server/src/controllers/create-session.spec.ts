import { faker } from "@faker-js/faker";
import { request } from "../test-utils.js";
import { CREATED, FORBIDDEN } from "../http-status-code.js";
import { users } from "../mongo-client.js";

describe("createSession controller", () => {
  const REQUEST_LINE = "POST /session";

  afterAll(async () => {
    await users.deleteMany();
  });

  it("should create a new authentication session", async () => {
    const payload = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    await request("POST /account", { payload });
    const response = await request(REQUEST_LINE, { payload });

    expect(response.statusCode).toBe(CREATED);

    expect(response.headers["set-cookie"]).toBeDefined();
    const setCookieHeaders = response.headers["set-cookie"] as string[];
    expect(setCookieHeaders).toHaveSize(1);
    expect(setCookieHeaders[0]).toMatch(/^session=/);

    expect(response.payload).toBe("");
  });

  it("should not log in non-existing user", async () => {
    const payload = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
    const { statusCode } = await request(REQUEST_LINE, { payload });

    expect(statusCode).toBe(FORBIDDEN);
  });

  it("should not log in user with incorrect password", async () => {
    const payload = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    await request("POST /account", { payload });

    payload.password = faker.internet.password();
    const { statusCode } = await request(REQUEST_LINE, { payload });

    expect(statusCode).toBe(FORBIDDEN);
  });
});

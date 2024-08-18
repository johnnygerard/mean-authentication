import { faker } from "@faker-js/faker";
import { request } from "../test-utils.js";
import { CREATED, FORBIDDEN } from "../http-status-code.js";
import { users } from "../mongo-client.js";

const METHOD = "POST";
const PATH = "/session";

describe("createSession controller", () => {
  afterAll(async () => {
    await users.deleteMany();
  });

  it("should create a new authentication session", async () => {
    const credentials = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    await request("POST", "/account", credentials);

    const { statusCode, headers, payload } = await request(
      METHOD,
      PATH,
      credentials,
    );

    expect(statusCode).toBe(CREATED);

    expect(headers["set-cookie"]).toBeDefined();
    const setCookieHeaders = headers["set-cookie"] as string[];
    expect(setCookieHeaders).toHaveSize(1);
    expect(setCookieHeaders[0]).toMatch(/^session=/);

    expect(payload).toBe("");
  });

  it("should not log in non-existing user", async () => {
    const { statusCode } = await request(METHOD, PATH, {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });

    expect(statusCode).toBe(FORBIDDEN);
  });

  it("should not log in user with incorrect password", async () => {
    const username = faker.internet.userName();
    const password = faker.internet.password();

    await request("POST", "/account", { username, password });

    const { statusCode } = await request(METHOD, PATH, {
      username,
      password: faker.internet.password(),
    });

    expect(statusCode).toBe(FORBIDDEN);
  });
});

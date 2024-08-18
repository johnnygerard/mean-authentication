import { faker } from "@faker-js/faker";
import { request } from "../test-utils.js";
import { BAD_REQUEST, NO_CONTENT } from "../http-status-code.js";
import { users } from "../mongo-client.js";
import { ErrorCode } from "../error-code.enum.js";

const METHOD = "POST";
const PATH = "/account";

describe("createAccount controller", () => {
  afterAll(async () => {
    await users.deleteMany();
  });

  it("should register a new user", async () => {
    const username = faker.internet.userName();
    const { statusCode, payload } = await request(METHOD, PATH, {
      username,
      password: faker.internet.password(),
    });

    expect(statusCode).toBe(NO_CONTENT);
    expect(payload).toBe("");

    // Retrieve new user from database
    const user = await users.findOne({ username });
    expect(user).not.toBeNull();
  });

  it("should not register a user with an existing username", async () => {
    const credentials = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    await request(METHOD, PATH, credentials);
    const { statusCode, payload } = await request(METHOD, PATH, credentials);

    expect(statusCode).toBe(BAD_REQUEST);
    expect(JSON.parse(payload).code).toBe(ErrorCode.DUPLICATE_USERNAME);
  });

  it("should not register a user with an invalid username", async () => {
    const { statusCode } = await request(METHOD, PATH, {
      username: "John\u0000Doe", // Control characters not allowed
      password: faker.internet.password(),
    });

    expect(statusCode).toBe(BAD_REQUEST);
  });

  it("should not register a user with an invalid password", async () => {
    const username = faker.internet.userName();
    const { statusCode } = await request(METHOD, PATH, {
      username,
      password: username + "aA@8", // Weak passwords not allowed
    });

    expect(statusCode).toBe(BAD_REQUEST);
  });
});

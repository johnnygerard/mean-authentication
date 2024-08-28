import { faker } from "@faker-js/faker";
import { request } from "../test-utils.js";
import { BAD_REQUEST, CONFLICT, CREATED } from "../http-status-code.js";
import { users } from "../mongo-client.js";

describe("createAccount controller", () => {
  const REQUEST_LINE = "POST /account";

  afterAll(async () => {
    await users.deleteMany();
  });

  it("should register a new user", async () => {
    const payload = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    const response = await request(REQUEST_LINE, { payload });

    expect(response.statusCode).toBe(CREATED);
    expect(response.payload).toBe("");

    // Retrieve new user from database
    const user = await users.findOne({ username: payload.username });
    expect(user).not.toBeNull();
  });

  it("should not register a user with an existing username", async () => {
    const payload = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    await request(REQUEST_LINE, { payload });
    const { statusCode } = await request(REQUEST_LINE, { payload });

    expect(statusCode).toBe(CONFLICT);
  });

  it("should not register a user with an invalid username", async () => {
    const payload = {
      username: "John\u0000Doe", // Control characters not allowed
      password: faker.internet.password(),
    };

    const { statusCode } = await request(REQUEST_LINE, { payload });

    expect(statusCode).toBe(BAD_REQUEST);
  });

  it("should not register a user with an invalid password", async () => {
    const username = faker.internet.userName();
    const payload = {
      username,
      password: username + "aA@8", // Weak passwords not allowed
    };

    const { statusCode } = await request(REQUEST_LINE, { payload });

    expect(statusCode).toBe(BAD_REQUEST);
  });
});

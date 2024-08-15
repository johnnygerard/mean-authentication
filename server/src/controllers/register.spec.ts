import { faker } from "@faker-js/faker";
import { request } from "../test-utils.js";
import { BAD_REQUEST, CREATED } from "../http-status-code.js";
import { users } from "../mongo-client.js";

describe("Register Controller", () => {
  afterAll(async () => {
    await users.deleteMany();
  });

  it("should register a new user", async () => {
    const username = faker.internet.userName();
    const { statusCode, payload } = await request("POST", "/register", {
      username,
      password: faker.internet.password(),
    });

    expect(statusCode).toBe(CREATED);
    expect(payload).toBe("");

    // Retrieve new user from database
    const user = await users.findOne({ username });
    expect(user).not.toBeNull();
  });

  it("should not register a user with an existing username", async () => {
    const payload = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    await request("POST", "/register", payload);
    const { statusCode } = await request("POST", "/register", payload);

    expect(statusCode).toBe(BAD_REQUEST);
  });

  it("should not register a user with an invalid username", async () => {
    const { statusCode } = await request("POST", "/register", {
      username: "John\u0000Doe", // Control characters not allowed
      password: faker.internet.password(),
    });

    expect(statusCode).toBe(BAD_REQUEST);
  });

  it("should not register a user with an invalid password", async () => {
    const username = faker.internet.userName();
    const { statusCode } = await request("POST", "/register", {
      username,
      password: username + "aA@8", // Weak passwords not allowed
    });

    expect(statusCode).toBe(BAD_REQUEST);
  });
});

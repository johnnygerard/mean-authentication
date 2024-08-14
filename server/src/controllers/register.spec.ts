import { faker } from "@faker-js/faker";
import { request } from "../test-utils.js";
import { CREATED } from "../http-status-code.js";
import { mongoClient, users } from "../mongo-client.js";

describe("Register Controller", () => {
  afterAll(async () => {
    await users.deleteMany();
    await mongoClient.close();
  });

  it("should register a new user", async () => {
    const { statusCode, payload } = await request("POST", "/register", {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });

    expect(statusCode).toBe(CREATED);
    expect(payload).toBe("");
  });
});

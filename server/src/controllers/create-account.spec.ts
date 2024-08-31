import { faker } from "@faker-js/faker";
import { request } from "../test-utils.js";
import { BAD_REQUEST, CONFLICT, CREATED } from "../http-status-code.js";
import { users } from "../mongo-client.js";
import express from "express";
import { createAccount } from "./create-account.js";
import type { AddressInfo, Server } from "node:net";
import session from "../auth/session.js";

describe("createAccount controller", () => {
  const POST_ACCOUNT = "POST /account";
  let port: number;
  let server: Server;

  beforeAll(() => {
    const app = express();
    app.use(express.json());
    app.use(session);
    app.post("/account", createAccount);
    server = app.listen();
    port = (server.address() as AddressInfo).port;
  });

  afterAll(async () => {
    server.close();
    await users.deleteMany();
  });

  it("should register a new user", async () => {
    const payload = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    const response = await request(POST_ACCOUNT, { payload, port });

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

    await request(POST_ACCOUNT, { payload, port });
    const { statusCode } = await request(POST_ACCOUNT, { payload, port });

    expect(statusCode).toBe(CONFLICT);
  });

  it("should not register a user with an invalid username", async () => {
    const payload = {
      username: "John\u0000Doe", // Control characters not allowed
      password: faker.internet.password(),
    };

    const { statusCode } = await request(POST_ACCOUNT, { payload, port });

    expect(statusCode).toBe(BAD_REQUEST);
  });

  it("should not register a user with an invalid password", async () => {
    const username = faker.internet.userName();
    const payload = {
      username,
      password: username + "aA@8", // Weak passwords not allowed
    };

    const { statusCode } = await request(POST_ACCOUNT, { payload, port });

    expect(statusCode).toBe(BAD_REQUEST);
  });
});

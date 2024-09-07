import { faker } from "@faker-js/faker";
import { request } from "../test-utils.js";
import { CREATED, UNAUTHORIZED } from "../http-status-code.js";
import { users } from "../database/client.js";
import express from "express";
import { createSession } from "./create-session.js";
import { createAccount } from "./create-account.js";
import type { AddressInfo, Server } from "node:net";
import session from "../middleware/session.js";

describe("createSession controller", () => {
  const POST_SESSION = "POST /session";
  const POST_ACCOUNT = "POST /account";
  let port: number;
  let server: Server;

  beforeAll(() => {
    const app = express();
    app.use(express.json());
    app.use(session);
    app.post("/session", createSession);
    app.post("/account", createAccount);
    server = app.listen();
    port = (server.address() as AddressInfo).port;
  });

  afterAll(async () => {
    server.close();
    await users.deleteMany();
  });

  it("should create a new authentication session", async () => {
    const payload = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    await request(POST_ACCOUNT, { payload, port });
    const response = await request(POST_SESSION, { payload, port });

    expect(response.statusCode).toBe(CREATED);

    expect(response.headers["set-cookie"]).toBeDefined();
    const setCookieHeaders = response.headers["set-cookie"] as string[];
    expect(setCookieHeaders).toHaveSize(1);
    expect(setCookieHeaders[0]).toMatch(/^id=/);

    expect(JSON.parse(response.payload)).toEqual({
      username: payload.username,
    });
  });

  it("should not log in non-existing user", async () => {
    const payload = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
    const { statusCode } = await request(POST_SESSION, { payload, port });

    expect(statusCode).toBe(UNAUTHORIZED);
  });

  it("should not log in user with incorrect password", async () => {
    const payload = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    await request(POST_ACCOUNT, { payload, port });

    payload.password = faker.internet.password();
    const { statusCode } = await request(POST_SESSION, { payload, port });

    expect(statusCode).toBe(UNAUTHORIZED);
  });
});

import { AddressInfo, Server } from "node:net";
import express from "express";
import { rateLimiter } from "./rate-limiter";
import ms from "ms";
import { OK, TOO_MANY_REQUESTS } from "../http-status-code";
import { request } from "../test-utils";

describe("Rate limiter middleware", () => {
  const GET = "GET /";
  const LIMIT = 5;
  let port: number;
  let server: Server;

  beforeEach(() => {
    const app = express();
    app.use(rateLimiter(LIMIT, ms("1m")));
    app.get("/", (req, res) => {
      res.status(OK).end();
    });
    server = app.listen();
    port = (server.address() as AddressInfo).port;
  });

  afterAll(() => server.close());

  it("should allow requests up to the limit", async () => {
    for (let i = 0; i < LIMIT; i++) {
      const { statusCode } = await request(GET, { port });
      expect(statusCode).toBe(OK);
    }
  });

  it("should block requests beyond the limit", async () => {
    for (let i = 0; i < LIMIT; i++) {
      await request(GET, { port });
    }

    const { statusCode } = await request(GET, { port });
    expect(statusCode).toBe(TOO_MANY_REQUESTS);
  });
});

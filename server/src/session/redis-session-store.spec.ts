import { faker } from "@faker-js/faker";
import { SESSION_MAX_TTL } from "../constants/security.js";
import { redisClient } from "../database/redis-client.js";
import { getRandomBuffer } from "../test/faker-extensions.js";
import { ServerSession } from "../types/server-session.js";
import { sessionStore } from "./redis-session-store.js";

describe("The Redis session store", () => {
  let userId: string;
  let session: ServerSession;

  beforeEach(() => {
    userId = faker.database.mongodbObjectId();
    session = {
      userId,
      clientSession: {
        username: faker.internet.userName(),
        csrfToken: getRandomBuffer(32).toString("base64url"),
      },
    };
  });

  it("should create a new session", async () => {
    await expectAsync(sessionStore.create(session, userId)).toBeResolved();
  });

  it("should read the created session", async () => {
    const sessionId = await sessionStore.create(session, userId);
    await expectAsync(sessionStore.read(userId, sessionId)).toBeResolvedTo(
      session,
    );
  });

  it("should delete the created session", async () => {
    const sessionId = await sessionStore.create(session, userId);

    await expectAsync(sessionStore.read(userId, sessionId)).toBeResolvedTo(
      session,
    );
    await sessionStore.delete(userId, sessionId);
    await expectAsync(sessionStore.read(userId, sessionId)).toBeResolvedTo(
      null,
    );
  });

  it("should set a TTL on the created session", async () => {
    const sessionId = await sessionStore.create(session, userId);

    const result = await redisClient.hpTTL(
      sessionStore.KEY_PREFIX + userId,
      sessionId,
    );

    if (result === null) throw new Error("Session TTL not set");
    expect(result[0]).toBeCloseTo(SESSION_MAX_TTL, -2); // within 100ms
  });
});

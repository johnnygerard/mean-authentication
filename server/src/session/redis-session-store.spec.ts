import { faker } from "@faker-js/faker";
import { SESSION_MAX_TTL } from "../constants/security.js";
import { redisClient } from "../database/redis-client.js";
import { getRandomBuffer } from "../test-helpers/faker-extensions.js";
import { ServerSession } from "../types/server-session.js";
import { sessionStore } from "./redis-session-store.js";

const getFakeSession = (): ServerSession => ({
  clientSession: {
    username: faker.internet.userName(),
    csrfToken: getRandomBuffer(32).toString("base64url"),
  },
});

describe("The Redis session store", () => {
  let userId: string;
  let session: ServerSession;

  beforeEach(() => {
    userId = faker.database.mongodbObjectId();
    session = getFakeSession();
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

  it("should read all sessions of a user", async () => {
    const sessions: Record<string, ServerSession> = {};

    for (let i = 0; i < 5; i++) {
      const session = getFakeSession();
      const sessionId = await sessionStore.create(session, userId);

      sessions[sessionId] = session;
    }

    await expectAsync(sessionStore.readAll(userId)).toBeResolvedTo(sessions);
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

  it("should delete all sessions of a user", async () => {
    const sessionCount = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < sessionCount; i++)
      await sessionStore.create(getFakeSession(), userId);

    await sessionStore.deleteAll(userId);
    await expectAsync(sessionStore.readAll(userId)).toBeResolvedTo({});
  });

  it("should delete all sessions of a user except one", async () => {
    const sessionCount = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < sessionCount; i++)
      await sessionStore.create(getFakeSession(), userId);

    const sessionId = await sessionStore.create(session, userId);

    await sessionStore.deleteAllOther(userId, sessionId);
    await expectAsync(sessionStore.readAll(userId)).toBeResolvedTo({
      [sessionId]: session,
    });
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

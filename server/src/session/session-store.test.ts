import { faker } from "@faker-js/faker";
import assert from "node:assert/strict";
import { beforeEach, suite, test } from "node:test";
import { getFakeSession } from "../test-helpers/faker-extensions.js";
import { ServerSession } from "../types/server-session.js";
import { sessionStore } from "./redis-session-store.js";

suite("The Redis session store", () => {
  let userId: string;
  let session: ServerSession;

  beforeEach(() => {
    userId = faker.database.mongodbObjectId();
    session = getFakeSession();
  });

  test("creates a new session", async () => {
    assert(await sessionStore.create(session, userId));
  });

  test("reads the created session", async () => {
    const sessionId = await sessionStore.create(session, userId);
    assert.deepEqual(await sessionStore.read(userId, sessionId), session);
  });

  test("reads all sessions of a user", async () => {
    const sessions: Record<string, ServerSession> = {};

    for (let i = 0; i < 5; i++) {
      const session = getFakeSession();
      const sessionId = await sessionStore.create(session, userId);

      sessions[sessionId] = session;
    }

    assert.deepEqual(await sessionStore.readAll(userId), sessions);
  });

  test("deletes the created session", async () => {
    const sessionId = await sessionStore.create(session, userId);

    assert(await sessionStore.read(userId, sessionId));
    await sessionStore.delete(userId, sessionId);
    assert.equal(await sessionStore.read(userId, sessionId), null);
  });

  test("deletes all sessions of a user", async () => {
    const sessionCount = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < sessionCount; i++)
      await sessionStore.create(getFakeSession(), userId);

    await sessionStore.deleteAll(userId);
    assert.deepEqual(await sessionStore.readAll(userId), {});
  });

  test("deletes all sessions of a user except one", async () => {
    const sessionCount = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < sessionCount; i++)
      await sessionStore.create(getFakeSession(), userId);

    const sessionId = await sessionStore.create(session, userId);

    await sessionStore.deleteAllOther(userId, sessionId);
    assert.deepEqual(await sessionStore.readAll(userId), {
      [sessionId]: session,
    });
  });
});

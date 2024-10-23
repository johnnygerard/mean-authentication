import { faker } from "@faker-js/faker";
import { getRandomBuffer } from "../test/faker-extensions.js";
import { ServerSession } from "../types/server-session.js";
import { RedisSessionStore } from "./redis-session-store.js";

describe("The Redis session store", () => {
  let userId: string;
  let session: ServerSession;
  let store: RedisSessionStore;

  beforeEach(() => {
    userId = faker.database.mongodbObjectId();
    session = {
      userId,
      clientSession: {
        username: faker.internet.userName(),
        csrfToken: getRandomBuffer(32).toString("base64url"),
      },
    };
    store = new RedisSessionStore();
  });

  it("should create a new session", async () => {
    await expectAsync(store.create(session, userId)).toBeResolved();
  });

  it("should read the created session", async () => {
    const sessionId = await store.create(session, userId);
    await expectAsync(store.read(userId, sessionId)).toBeResolvedTo(session);
  });

  it("should delete the created session", async () => {
    const sessionId = await store.create(session, userId);

    await expectAsync(store.read(userId, sessionId)).toBeResolvedTo(session);
    await store.delete(userId, sessionId);
    await expectAsync(store.read(userId, sessionId)).toBeResolvedTo(null);
  });
});

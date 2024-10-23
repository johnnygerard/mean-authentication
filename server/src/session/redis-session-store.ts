import { redisClient } from "../database/redis-client.js";
import { ServerSession } from "../types/server-session.js";
import { SessionStore } from "./session-store.js";

const KEY_PREFIX = "sessions:";
const getKey = (userId: string): string => {
  return KEY_PREFIX + userId;
};

export class RedisSessionStore extends SessionStore {
  async create(session: ServerSession, userId: string): Promise<string> {
    for (let i = 0; i < 5; i++) {
      const sessionId = this.generateSessionId();
      const isCreated = await redisClient.hSetNX(
        getKey(userId),
        sessionId,
        JSON.stringify(session),
      );

      if (isCreated) return sessionId;
    }

    throw new Error("Failed to create a new session");
  }

  async read(userId: string, sessionId: string): Promise<ServerSession | null> {
    const session = await redisClient.hGet(getKey(userId), sessionId);
    return session === undefined ? null : JSON.parse(session);
  }

  async delete(userId: string, sessionId: string): Promise<void> {
    await redisClient.hDel(getKey(userId), sessionId);
  }
}

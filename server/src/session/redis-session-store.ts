import ms from "ms";
import { SESSION_MAX_TTL } from "../constants/security.js";
import { redisClient } from "../database/redis-client.js";
import { ServerSession } from "../types/server-session.js";
import { SessionStore } from "./session-store.js";

const KEY_PREFIX = "sessions:";
const getKey = (userId: string): string => {
  return KEY_PREFIX + userId;
};

export class RedisSessionStore extends SessionStore {
  async create(session: ServerSession, userId: string): Promise<string> {
    const jsonSession = JSON.stringify(session);
    const key = getKey(userId);

    for (let i = 0; i < 5; i++) {
      const sessionId = this.generateSessionId();
      const isCreated = await redisClient.hSetNX(key, sessionId, jsonSession);

      if (isCreated) {
        await redisClient.hpExpire(key, sessionId, ms(SESSION_MAX_TTL));
        return sessionId;
      }
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

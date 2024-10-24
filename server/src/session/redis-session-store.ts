import ms from "ms";
import { SESSION_MAX_TTL } from "../constants/security.js";
import { redisClient } from "../database/redis-client.js";
import { ServerSession } from "../types/server-session.js";
import { SessionStore } from "./session-store.js";

export class RedisSessionStore extends SessionStore {
  static readonly KEY_PREFIX = "sessions:";

  async create(session: ServerSession, userId: string): Promise<string> {
    const jsonSession = JSON.stringify(session);
    const key = this.#getKey(userId);

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
    const key = this.#getKey(userId);
    const session = await redisClient.hGet(key, sessionId);
    return session === undefined ? null : JSON.parse(session);
  }

  async delete(userId: string, sessionId: string): Promise<void> {
    const key = this.#getKey(userId);
    await redisClient.hDel(key, sessionId);
  }

  #getKey(userId: string): string {
    return RedisSessionStore.KEY_PREFIX + userId;
  }
}

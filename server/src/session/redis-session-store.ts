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
      const isSuccess = await redisClient.eval(
        `
        local key = KEYS[1]
        local sessionId = ARGV[1]
        local jsonSession = ARGV[2]
        local ttl = tonumber(ARGV[3])
  
        if redis.call("HSETNX", key, sessionId, jsonSession) == 0 then
          return false
        end
        
        redis.call("HPEXPIRE", key, ttl, "FIELDS", 1, sessionId)
        return true`,
        {
          keys: [key],
          arguments: [sessionId, jsonSession, ms(SESSION_MAX_TTL).toString()],
        },
      );

      if (isSuccess) return sessionId;
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

import { randomBytes } from "node:crypto";
import { SESSION_ID_ENTROPY } from "../constants/security.js";
import { ServerSession } from "../types/server-session.js";

/**
 * Session store abstraction.
 *
 * Sessions belonging to the same user are grouped by user ID.
 */
export abstract class SessionStore {
  /**
   * Create a new user session.
   * @param session - The initial session data
   * @param userId - The user ID
   * @returns The generated session ID
   */
  abstract create(session: ServerSession, userId: string): Promise<string>;

  /**
   * Read a user session.
   * @param userId - The user ID
   * @param sessionId - The session ID
   * @returns The session data or null if not found or expired
   */
  abstract read(
    userId: string,
    sessionId: string,
  ): Promise<ServerSession | null>;

  /**
   * Read all sessions of a user.
   * @param userId - The user ID
   * @returns All user sessions keyed by session ID
   */
  abstract readAll(userId: string): Promise<Record<string, ServerSession>>;

  /**
   * Delete a user session.
   *
   * This method always returns successfully, even if the session does not exist.
   * @param userId - The user ID
   * @param sessionId - The session ID
   */
  abstract delete(userId: string, sessionId: string): Promise<void>;

  /**
   * Delete all sessions of a user.
   * @param userId - The user ID
   */
  abstract deleteAll(userId: string): Promise<void>;

  /**
   * Generate a new session ID.
   * @returns A random and likely unique session ID
   */
  protected generateSessionId(): string {
    return randomBytes(SESSION_ID_ENTROPY).toString("base64url");
  }
}

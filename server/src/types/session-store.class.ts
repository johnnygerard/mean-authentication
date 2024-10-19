import { ServerSession } from "./server-session.js";

/**
 * Session store abstraction.
 *
 * Sessions belonging to the same user are grouped by a parent key that should be
 * distinct from the user ID to limit information disclosure.
 */
export abstract class SessionStore {
  /**
   * Create a new user session.
   * @param session - The initial session data
   * @param parentKey - The session's parent key
   * @returns The generated session ID
   */
  abstract add(session: ServerSession, parentKey: string): Promise<string>;

  /**
   * Read a user session.
   * @param parentKey - The session's parent key
   * @param id - The session ID
   * @returns The session data or null if not found or expired
   */
  abstract get(parentKey: string, id: string): Promise<ServerSession | null>;

  /**
   * Delete a user session.
   *
   * This method always returns successfully, even if the session does not exist.
   * @param parentKey - The session's parent key
   * @param id - The session ID
   */
  abstract delete(parentKey: string, id: string): Promise<void>;
}

import ms from "ms";

/**
 * Session ID entropy in bytes.
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#session-id-entropy
 * @see https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length
 */
export const SESSION_ID_ENTROPY = 8; // 64 bits

/**
 * Maximum session TTL in milliseconds.
 */
export const SESSION_MAX_TTL = ms("10 days");

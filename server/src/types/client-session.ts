/**
 * Encapsulate user session data stored in the client.
 *
 * This data should not be sensitive, as it is more exposed and potentially
 * vulnerable to XSS attacks.
 */
export type ClientSession = {
  csrfToken: string;
  username: string;
};

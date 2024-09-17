import { hash } from "node:crypto";
import axios from "axios";
import ms from "ms";

/**
 * Check if a password has been exposed in a data breach.
 *
 * This function queries the Pwned Passwords API using the k-Anonymity model
 * (only a partial digest of the password is sent).
 * @param password - Plaintext password
 * @returns `true` if the password has been exposed, `false` otherwise.
 * @throws {AxiosError} If the HTTP status code is not in the 2xx range or
 * something else fails.
 * @see https://haveibeenpwned.com/API/v3#PwnedPasswords
 */
export const isPasswordPwned = async (password: string): Promise<boolean> => {
  const digest = hash("sha1", password).toUpperCase();
  const partialDigest = digest.slice(0, 5);
  const digestSuffix = digest.slice(partialDigest.length);

  const response = await axios({
    method: "GET",
    baseURL: "https://api.pwnedpasswords.com",
    url: `/rang/${partialDigest}`,
    responseType: "text",
    responseEncoding: "utf8",
    maxContentLength: 2 ** 20, // 1 MB
    maxRedirects: 0,
    signal: AbortSignal.timeout(ms("1 second")), // Handle connection timeout
    timeout: ms("1 second"), // Handle response timeout
  });

  const text = response.data as string;
  for (const line of text.split("\r\n"))
    if (line.toUpperCase().startsWith(digestSuffix)) return true;

  return false;
};

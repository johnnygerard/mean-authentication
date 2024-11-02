import ms from "ms";
import { hash } from "node:crypto";
import { OK } from "../constants/http-status-code.js";

/**
 * Check if the password has been exposed in a data breach.
 *
 * This function queries the Pwned Passwords API using the k-Anonymity model
 * (only a partial digest of the hashed password is sent).
 * @param password - Plaintext password
 * @returns `false` if the password is not leaked or the API server did not
 * reply in time with the 200 status code, `true` if the password is leaked.
 * @see https://haveibeenpwned.com/API/v3#PwnedPasswords
 */
export const isLeakedPassword = async (password: string): Promise<boolean> => {
  try {
    const digest = hash("sha1", password);
    const partialDigest = digest.slice(0, 5);
    const digestSuffix = digest.slice(partialDigest.length);
    const validator = new RegExp(`^${digestSuffix}`, "i");
    const url = `https://api.pwnedpasswords.com/range/${partialDigest}`;

    const response = await fetch(url, {
      headers: {
        Accept: "text/plain",
      },
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(ms("1 second")), // Abort request on timeout
    });

    if (response.status !== OK) {
      console.error(
        "Unexpected status code from Pwned Passwords API:",
        response.status,
      );
      return false;
    }

    const text = await response.text();

    return text
      .split("\r\n")
      .some((line: string): boolean => validator.test(line));
  } catch (e) {
    console.error("Pwned Passwords API request failed", e);
    return false;
  }
};

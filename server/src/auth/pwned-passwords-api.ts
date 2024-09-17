import { hash } from "node:crypto";
import type { AxiosResponse } from "axios";
import axios, { AxiosError } from "axios";
import ms from "ms";
import { OK } from "../http-status-code.js";

/**
 * Check if the password has been exposed in a data breach.
 *
 * This function queries the Pwned Passwords API using the k-Anonymity model
 * (only a partial digest of the hashed password is sent).
 * @param password - Plaintext password
 * @returns `false` if the password is not exposed or the API server did not
 * reply with the 200 status code, `true` if the password is exposed.
 * @see https://haveibeenpwned.com/API/v3#PwnedPasswords
 */
export const isPasswordExposed = async (password: string): Promise<boolean> => {
  const digest = hash("sha1", password).toUpperCase();
  const partialDigest = digest.slice(0, 5);
  const digestSuffix = digest.slice(partialDigest.length);
  let response: AxiosResponse;

  try {
    response = await axios({
      method: "GET",
      baseURL: "https://api.pwnedpasswords.com",
      url: `/range/${partialDigest}`,
      responseType: "text",
      responseEncoding: "utf8",
      maxContentLength: 2 ** 20, // 1 MB
      maxRedirects: 0,
      signal: AbortSignal.timeout(ms("1 second")), // Handle connection timeout
      timeout: ms("1 second"), // Handle response timeout
      validateStatus: (status: number): boolean => status === OK,
    });
  } catch (e) {
    console.error(e);
    if (e instanceof AxiosError) return false;
    throw e;
  }

  const text = response.data as string;
  for (const line of text.split("\r\n"))
    if (line.toUpperCase().startsWith(digestSuffix)) return true;

  return false;
};

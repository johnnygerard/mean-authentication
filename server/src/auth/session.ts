import crypto from "node:crypto";
import { promisify } from "node:util";

const randomBytes = promisify(crypto.randomBytes);

// The optimal entropy depends on multiple factors (see link below).
// https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length
const ENTROPY = 64;
const ID_BYTE_SIZE = ENTROPY / 8;
const ENCODING = "base64url";

export const generateSessionId = async (): Promise<string> => {
  const buffer = await randomBytes(ID_BYTE_SIZE);
  return buffer.toString(ENCODING);
};

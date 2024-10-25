import { randomBytes } from "node:crypto";

const CSRF_TOKEN_ENTROPY = 32; // 256 bits
const ENCODING = "base64url";

export const generateCSRFToken = (): string => {
  return randomBytes(CSRF_TOKEN_ENTROPY).toString(ENCODING);
};

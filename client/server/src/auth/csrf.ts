import { randomBytes } from "node:crypto";

const CSRF_TOKEN_ENTROPY = 256;
const CSRF_TOKEN_BYTE_SIZE = CSRF_TOKEN_ENTROPY / 8;
const ENCODING = "base64url";

export const generateCSRFToken = (): string => {
  return randomBytes(CSRF_TOKEN_BYTE_SIZE).toString(ENCODING);
};

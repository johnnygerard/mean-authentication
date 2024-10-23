/**
 * AES encryption and decryption
 *
 * Code derived from: Alessandro, Segala. Essential Cryptography for JavaScript Developers, 2022.
 * @see https://github.com/PacktPublishing/Essential-Cryptography-for-JavaScript-Developers/blob/main/ch4-symmetric-encryption/aes-256-gcm.js
 */
import { Buffer } from "node:buffer";
import type { CipherGCMTypes } from "node:crypto";
import crypto from "node:crypto";
import { promisify } from "node:util";

const randomBytes = promisify(crypto.randomBytes);

const ALGORITHM: CipherGCMTypes = "aes-128-gcm";
const IV_LENGTH = 12;
const DEFAULT_AUTH_TAG_LENGTH = 16;
export const KEY_LENGTH = 16; // 128-bit key

/**
 * Encrypt data using AES-GCM
 * @param data - Data to encrypt
 * @param key - Symmetric key
 * @returns Encrypted data
 */
export const encrypt = async (data: Buffer, key: Buffer): Promise<Buffer> => {
  const iv = await randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag(); // Must be called after cipher.final()

  return Buffer.concat([iv, tag, encrypted]);
};

/**
 * Decrypt data using AES-GCM
 * @param data - Data to decrypt
 * @param key - Symmetric key
 * @returns Decrypted data
 */
export const decrypt = (data: Buffer, key: Buffer): Buffer => {
  const iv = data.subarray(0, IV_LENGTH);
  const tag = data.subarray(IV_LENGTH, IV_LENGTH + DEFAULT_AUTH_TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + DEFAULT_AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};

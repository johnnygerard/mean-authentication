import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { beforeEach, suite, test } from "node:test";
import { getRandomBuffer } from "../test-helpers/faker-extensions.js";
import { decrypt, encrypt, KEY_LENGTH } from "./aes.js";

suite("AES module", () => {
  let data: Buffer;
  let key: Buffer;
  let encrypted: Buffer;

  beforeEach(async () => {
    data = getRandomBuffer();
    key = getRandomBuffer(KEY_LENGTH);
    encrypted = await encrypt(data, key);
  });

  test("successfully encrypts data", () => {
    assert(!data.equals(encrypted));
  });

  test("successfully decrypts encrypted data", () => {
    const decrypted = decrypt(encrypted, key);
    assert(data.equals(decrypted));
  });

  test("throws an error when decrypting with an incorrect key", () => {
    const incorrectKey = getRandomBuffer(KEY_LENGTH);
    assert.throws(() => decrypt(encrypted, incorrectKey));
  });

  test("encrypts the same data differently each time", async () => {
    const other = await encrypt(data, key);
    assert(!encrypted.equals(other));
  });

  test("throws when decrypting tampered data", () => {
    encrypted[encrypted.length - 1] += 1;
    assert.throws(() => decrypt(encrypted, key));
  });

  test("throws when the encryption key length is invalid", async () => {
    const shortKey = getRandomBuffer(KEY_LENGTH - 1);
    const longKey = getRandomBuffer(KEY_LENGTH + 1);

    assert.rejects(() => encrypt(data, shortKey));
    assert.rejects(() => encrypt(data, longKey));
  });
});

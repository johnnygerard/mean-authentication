import { Buffer } from "node:buffer";
import { getRandomBuffer } from "../test/faker-extensions.js";
import { decrypt, encrypt } from "./aes.js";

const KEY_LENGTH = 16; // 128-bit key

describe("AES encryption and decryption", () => {
  let data: Buffer;
  let key: Buffer;
  let encrypted: Buffer;

  beforeEach(async () => {
    data = getRandomBuffer();
    key = getRandomBuffer(KEY_LENGTH);
    encrypted = await encrypt(data, key);
  });

  it("should successfully encrypt data", () => {
    expect(data.equals(encrypted)).toBeFalse();
  });

  it("should successfully decrypt encrypted data", () => {
    const decrypted = decrypt(encrypted, key);
    expect(data.equals(decrypted)).toBeTrue();
  });

  it("should throw an error when decrypting with an incorrect key", () => {
    const incorrectKey = getRandomBuffer(KEY_LENGTH);
    expect(() => decrypt(encrypted, incorrectKey)).toThrow();
  });

  it("should encrypt the same data differently each time", async () => {
    const other = await encrypt(data, key);
    expect(encrypted.equals(other)).toBeFalse();
  });

  it("should throw when decrypting tampered data", () => {
    encrypted[encrypted.length - 1] += 1;
    expect(() => decrypt(encrypted, key)).toThrow();
  });

  it("should throw when the encryption key length is invalid", async () => {
    const shortKey = getRandomBuffer(KEY_LENGTH - 1);
    const longKey = getRandomBuffer(KEY_LENGTH + 1);

    await expectAsync(encrypt(data, shortKey)).toBeRejected();
    await expectAsync(encrypt(data, longKey)).toBeRejected();
  });
});

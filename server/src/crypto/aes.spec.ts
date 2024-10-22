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

  it("should successfully encrypt data", async () => {
    expect(data.equals(encrypted)).toBeFalse();
  });

  it("should successfully decrypt encrypted data", async () => {
    const decrypted = decrypt(encrypted, key);
    expect(data.equals(decrypted)).toBeTrue();
  });

  it("should throw an error when decrypting with an incorrect key", async () => {
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
});

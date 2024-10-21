import { getRandomBuffer } from "../test/faker-extensions.js";
import { decrypt, encrypt } from "./aes.js";

const KEY_LENGTH = 16; // 128-bit key

describe("AES encryption and decryption", () => {
  it("should encrypt and decrypt data", async () => {
    const data = getRandomBuffer();
    const key = getRandomBuffer(KEY_LENGTH);
    const encrypted = await encrypt(data, key);
    const decrypted = decrypt(encrypted, key);

    expect(data.equals(encrypted)).toBeFalse();
    expect(data.equals(decrypted)).toBeTrue();
  });

  it("should throw an error when decrypting with an incorrect key", async () => {
    const data = getRandomBuffer();
    const key = getRandomBuffer(KEY_LENGTH);
    const encrypted = await encrypt(data, key);
    const incorrectKey = getRandomBuffer(KEY_LENGTH);

    expect(() => decrypt(encrypted, incorrectKey)).toThrow();
  });

  it("should encrypt the same data differently each time", async () => {
    const data = getRandomBuffer();
    const key = getRandomBuffer(KEY_LENGTH);
    const encrypted1 = await encrypt(data, key);
    const encrypted2 = await encrypt(data, key);

    expect(encrypted1.equals(encrypted2)).toBeFalse();
  });
});

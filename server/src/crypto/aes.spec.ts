import { faker } from "@faker-js/faker";
import { Buffer } from "node:buffer";
import crypto from "node:crypto";
import { promisify } from "node:util";
import { decrypt, encrypt } from "./aes.js";

const randomBytes = promisify(crypto.randomBytes);

fdescribe("AES encryption and decryption", () => {
  it("should encrypt and decrypt data", async () => {
    const data = getRandomBuffer();
    const key = await randomBytes(16); // 128-bit key
    const encrypted = await encrypt(data, key);
    const decrypted = decrypt(encrypted, key);

    expect(data.equals(encrypted)).toBeFalse();
    expect(data.equals(decrypted)).toBeTrue();
  });
});

const getRandomBuffer = (): Buffer => {
  const count = faker.number.int({ min: 1, max: 1024 });
  return Buffer.from(faker.helpers.multiple(getRandomByte, { count }));
};

const getRandomByte = (): number => faker.number.int({ max: 255 });

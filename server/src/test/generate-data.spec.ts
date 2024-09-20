import { hash } from "node:crypto";
import { faker } from "@faker-js/faker";

// This file is intended for test data generation only
fdescribe("Test data generation", () => {
  it("should generate SHA-1 hashes", () => {
    for (let i = 0; i < 10; i++) {
      const input = faker.internet.password();
      const digest = hash("sha1", input);

      console.log(`["${input}", "${digest}"],`);
    }
  });
});

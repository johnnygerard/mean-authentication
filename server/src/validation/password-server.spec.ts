import { faker } from "@faker-js/faker";
import { passwordIsStrong } from "./password-server.js";

describe("The passwordIsStrong function", () => {
  it("should return true for a strong password", () => {
    const username = faker.internet.userName();
    const password = faker.internet.password({ length: 20 });

    expect(passwordIsStrong(password, username)).toBeTrue();
  });

  it("should return false for a weak password", () => {
    const username = faker.internet.userName();
    // Reusing the username in the password is vulnerable to dictionary attacks
    // while adding LUDS characters is not enough to make it strong
    const password = username + "aB1@";

    expect(passwordIsStrong(password, username)).toBeFalse();
  });
});

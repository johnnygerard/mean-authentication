import { faker } from "@faker-js/faker";
import { appDictionary, isPasswordStrong } from "./password.js";
import { PASSWORD_MAX_LENGTH } from "../constants/password.js";

describe("The isPasswordStrong function", () => {
  it("should return true for a strong password", () => {
    const username = faker.internet.userName();
    const password = faker.internet.password({ length: 20 });

    expect(isPasswordStrong(password, username)).toBeTrue();
  });

  it("should return false for a weak password", () => {
    const username = faker.internet.userName();
    // Reusing the username in the password is vulnerable to dictionary attacks
    // while adding LUDS characters is not enough to make it strong
    const password = username + "aB1@";

    expect(isPasswordStrong(password, username)).toBeFalse();
  });

  it("should have a valid dictionary", () => {
    appDictionary.forEach((line, index) => {
      let error: string;

      switch (true) {
        case !line:
          error = "is empty";
          break;
        case line.length > PASSWORD_MAX_LENGTH:
          error = "exceeds password max length";
          break;
        case /[^\x20-\x7E]/.test(line):
          error = "contains non-ASCII or control characters";
          break;
        case / {2}/.test(line):
          error = "contains consecutive spaces";
          break;
        case /^ | $/.test(line):
          error = "contains a leading or trailing space";
          break;
        default:
          return;
      }

      throw new Error(`Line ${index + 1} ${error}`);
    });
  });
});

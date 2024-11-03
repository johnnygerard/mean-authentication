import { faker } from "@faker-js/faker";
import { expect, Locator } from "@playwright/test";
import { PASSWORD_MAX_LENGTH } from "_server/constants/password";
import { test } from "../fixtures";

test.describe("Password validation", () => {
  let username: string;
  let passwordInput: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/register");

    const form = page.getByTestId("register-form");
    const usernameInput = form.getByTestId("username");
    username = faker.internet.userName();
    passwordInput = form.getByTestId("password");

    await usernameInput.fill(username);
  });

  test("Password is required", async ({ page }) => {
    const randomChar = faker.string.alpha();
    const required = page.getByText(/required/i);

    await expect(required).not.toBeVisible();
    await page.keyboard.press("Enter");
    await expect(required).toBeVisible();

    await passwordInput.press(randomChar);
    await expect(required).not.toBeVisible();
  });

  test("Password is truncated to the maximum length", async () => {
    const length = PASSWORD_MAX_LENGTH + 1;
    const password = faker.internet.password({ length });
    const truncated = password.slice(0, PASSWORD_MAX_LENGTH);

    await passwordInput.fill(password);
    await expect(passwordInput).toHaveValue(truncated);
  });

  test("Password strength is validated", async () => {
    // This password fulfills typical strength requirements of most validators
    // despite being vulnerable to dictionary attacks.
    const lowercase = faker.string.alpha({ casing: "lower" });
    const uppercase = faker.string.alpha({ casing: "upper" });
    const digit = faker.string.numeric();
    const symbol = faker.string.symbol();
    const weakPassword = username + lowercase + uppercase + digit + symbol;
    const strongPassword = faker.internet.password({ length: 20 });

    await passwordInput.fill(strongPassword);
    await expect(passwordInput).toHaveClass(/ng-valid/);

    await passwordInput.fill(weakPassword);
    await expect(passwordInput).toHaveClass(/ng-invalid/);
  });
});

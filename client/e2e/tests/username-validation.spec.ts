import { faker } from "@faker-js/faker";
import { expect, Locator } from "@playwright/test";
import { test } from "../fixtures";

test.describe("Username validation", () => {
  let usernameInput: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
    const form = page.getByTestId("register-form");
    usernameInput = form.getByTestId("username");
  });

  test("Username is required", async ({ page }) => {
    const field = page.getByTestId("username-field");
    const pattern = /required/i;

    await usernameInput.focus();
    await expect(field).not.toHaveText(pattern);
    await page.keyboard.press("Enter");
    await expect(field).toHaveText(pattern);

    await usernameInput.press(faker.string.alpha());
    await expect(field).not.toHaveText(pattern);
  });

  test("Username does not contain invalid characters", async () => {
    await usernameInput.fill("\u0000");
    await expect(usernameInput).toHaveClass(/ng-invalid/);

    await usernameInput.fill(faker.internet.userName());
    await expect(usernameInput).toHaveClass(/ng-valid/);
  });
});

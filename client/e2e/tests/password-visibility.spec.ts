import { faker } from "@faker-js/faker";
import { expect, Locator, test } from "@playwright/test";

test.describe("Password visibility", () => {
  let passwordInput: Locator;
  let toggle: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
    const form = page.getByTestId("register-form");
    passwordInput = form.getByTestId("password");
    toggle = form.getByTestId("visibility-toggle");
    await passwordInput.fill(faker.internet.password());
  });

  test("The password is hidden by default.", async () => {
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("The password's visibility can be toggled.", async () => {
    await toggle.press("Enter");
    await expect(passwordInput).toHaveAttribute("type", "text");

    await toggle.press("Enter");
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  // Test skipped because of https://github.com/microsoft/playwright/issues/33057
  test.skip("The toggle button retains focus when clicked on.", async () => {
    await toggle.click();
    await expect(toggle).toBeFocused();
  });

  test("The toggle button is keyboard-accessible.", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(passwordInput).toHaveAttribute("type", "text");

    await page.keyboard.press("Space");
    await expect(passwordInput).toHaveAttribute("type", "password");
  });
});

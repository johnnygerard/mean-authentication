import { faker } from "@faker-js/faker";
import { expect, Locator, test } from "@playwright/test";

let password: Locator;
let toggle: Locator;

test.beforeEach(async ({ page }) => {
  await page.goto("/register");
  const form = page.getByTestId("register-form");
  password = form.getByTestId("password");
  toggle = form.getByTestId("visibility-toggle");
  await password.fill(faker.internet.password());
});

test("The password is hidden by default.", async () => {
  await expect(password).toHaveAttribute("type", "password");
});

test("The password's visibility can be toggled.", async () => {
  await toggle.click();
  await expect(password).toHaveAttribute("type", "text");

  await toggle.click();
  await expect(password).toHaveAttribute("type", "password");
});

test("The toggle button retains focus when clicked on.", async () => {
  await toggle.click();
  await expect(toggle).toBeFocused();
});

test("The toggle button is keyboard-accessible.", async ({ page }) => {
  await password.press("Tab");
  const toggle = page.locator(":focus");

  await toggle.press("Enter");
  await expect(password).toHaveAttribute("type", "text");

  await toggle.press("Space");
  await expect(password).toHaveAttribute("type", "password");
});

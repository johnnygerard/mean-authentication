import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { CONFLICT } from "_server/constants/http-status-code";
import { globalCredentials } from "../global-credentials";
import { registerUser } from "../register-user.function";

test.describe("User registration", () => {
  const REGISTER = "/register";
  const REDIRECT = "/";

  test("User registration is successful", async ({ page }) => {
    const username = faker.internet.userName();

    await test.step("Form submission is successful", async () => {
      await registerUser(page, { username });
    });

    await test.step("User is redirected", async () => {
      await page.waitForURL(REDIRECT);
    });

    await test.step("User is logged in", async () => {
      await expect(page.getByTestId("logout-button")).toBeVisible();
      await expect(page.getByText(username)).toBeVisible();
    });

    await test.step("Navigation to registration page is blocked", async () => {
      await page.goto(REGISTER);
      await page.waitForURL(REDIRECT);
    });
  });

  test("User cannot reuse a registered username", async ({ page }) => {
    const username = globalCredentials.username;
    await registerUser(page, { username }, CONFLICT);
  });
});

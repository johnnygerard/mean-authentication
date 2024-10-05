import { expect, test } from "@playwright/test";
import { UNAUTHORIZED } from "_server/constants/http-status-code";
import { globalCredentials } from "../global-credentials";
import { logInUser } from "../log-in-user.function";

test.describe("User login", () => {
  const { username, password } = globalCredentials;

  test("User login is successful", async ({ page }) => {
    const expectUserToBeLoggedIn = async (): Promise<void> => {
      await expect(page.getByTestId("logout-button")).toBeVisible();
      await expect(page.getByText(username)).toBeVisible();
    };

    await test.step("Form submission is successful", async () => {
      await logInUser(page, globalCredentials);
      await expectUserToBeLoggedIn();
    });

    await test.step("User is redirected", async () => {
      await page.waitForURL("/");
    });

    await test.step("User session is preserved across reloads", async () => {
      await page.reload();
      await expectUserToBeLoggedIn();
    });
  });

  test("User cannot log in without a registered username", async ({ page }) => {
    const user = { username: username.toUpperCase(), password };
    await logInUser(page, user, UNAUTHORIZED);
  });

  test("User cannot log in with an incorrect password", async ({ page }) => {
    const user = { username, password: password.toUpperCase() };
    await logInUser(page, user, UNAUTHORIZED);
  });
});

import { expect, test } from "@playwright/test";
import { NO_CONTENT } from "_server/constants/http-status-code";
import { globalCredentials } from "../global-credentials";
import { logInUser } from "../log-in-user.function";

test.describe("User logout", () => {
  test("User logout is successful", async ({ page }) => {
    await logInUser(page, globalCredentials);
    await page.goto("/account"); // Visit a private page for the redirect test
    const responsePromise = page.waitForResponse("/api/user/session");
    const logoutButton = page.getByTestId("logout-button");
    await logoutButton.click();

    await responsePromise.then((response) => {
      expect(response.request().method()).toBe("DELETE");
      expect(response.status()).toBe(NO_CONTENT);
    });

    await expect(logoutButton).not.toBeVisible();

    await test.step("User is redirected", async () => {
      await expect(page).toHaveURL("/");
    });
  });
});

import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { TOO_MANY_REQUESTS } from "_server/constants/http-status-code";

// This test should be run separately. To run it:
// - Replace `describe.skip` with `describe.only`
// - Run `npm run serve:rate-limited` to start the server with rate limiting
test.describe.skip("Rate limiter", () => {
  test("Requests above the rate limit are blocked", async ({ page }) => {
    // Simulate a password brute force attack
    await page.goto("/sign-in");

    const form = page.getByTestId("login-form");
    const usernameInput = form.getByTestId("username");
    const passwordInput = form.getByTestId("password");

    const tryToLogin = async (loginAttempts = 0): Promise<void> => {
      if (loginAttempts === 20)
        throw new Error(`Test failed after ${loginAttempts} attempts`);

      const responsePromise = page.waitForResponse("/api/session");

      await passwordInput.fill(faker.internet.password());
      await page.keyboard.press("Enter");

      if ((await responsePromise).status() !== TOO_MANY_REQUESTS)
        await tryToLogin(loginAttempts + 1);
    };

    await usernameInput.fill(faker.internet.userName());
    await tryToLogin();
  });
});

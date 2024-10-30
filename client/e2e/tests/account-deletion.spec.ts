import { faker } from "@faker-js/faker";
import { expect, Locator, test } from "@playwright/test";
import { NO_CONTENT } from "_server/constants/http-status-code";
import { getResponsePredicate } from "../extensions";
import { registerUser } from "../register-user.function";

test.describe("Account deletion", () => {
  let deleteAccountButton: Locator;
  let passwordInput: Locator;
  let password: string;

  test.beforeEach(async ({ page }) => {
    deleteAccountButton = page.getByTestId("delete-account-button");
    passwordInput = page.getByTestId("password");
    password = faker.internet.password();

    await registerUser(page, { password });
    await page.goto("/user/account");
  });

  test("User successfully deletes their account", async ({ page }) => {
    const responsePromise = page.waitForResponse(
      getResponsePredicate("DELETE", "/api/user/account"),
    );

    await test.step("Form submission is successful", async () => {
      // Open dialog and submit form
      await deleteAccountButton.press("Enter");
      await passwordInput.fill(password);
      await page.keyboard.press("Enter");

      const response = await responsePromise;
      expect(response.status()).toBe(NO_CONTENT);
    });

    await test.step("User is redirected", async () => {
      await expect(page).toHaveURL("/");
    });

    await test.step("Success message is displayed", async () => {
      await expect(
        page.getByText(/account has been successfully deleted/),
      ).toBeVisible();
    });
  });
});

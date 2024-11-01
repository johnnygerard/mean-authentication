import { expect, test } from "@playwright/test";
import { getFakeCredentials } from "_server/test-helpers/faker-extensions";
import { UserMessage } from "../../src/app/types/user-message.enum";
import { logInUser } from "../log-in-user.function";
import { registerUser } from "../register-user.function";

test.describe("Session revocation", () => {
  let credentials: { username: string; password: string };

  test.beforeEach(async ({ browser, page }) => {
    const context = await browser.newContext();
    credentials = getFakeCredentials();

    await registerUser(await context.newPage(), credentials);
    await logInUser(page, credentials);
  });

  [
    {
      title: "User successfully revokes all sessions",
      shouldLogOut: true,
    },
    {
      title: "User successfully revokes all other sessions",
      shouldLogOut: false,
    },
  ].forEach(({ title, shouldLogOut }) => {
    test(title, async ({ page }) => {
      const sessionCount = page.getByTestId("session-count");
      const cancelButton = page.getByTestId("cancel-button");
      const confirmButton = page.getByTestId("confirm-button");
      const deleteButton = page.getByTestId(
        shouldLogOut
          ? "delete-all-sessions-button"
          : "delete-all-other-sessions-button",
      );

      await test.step("The session count displays the correct value", async () => {
        await page.goto("/user/sessions");
        await expect(sessionCount).toHaveText("2");
      });

      await test.step("User successfully opens the dialog", async () => {
        await deleteButton.press("Enter");
        await expect(cancelButton).toBeFocused();
      });

      await test.step("User successfully confirms the dialog action", async () => {
        await confirmButton.press("Enter");
      });

      await test.step("User sees the success message", async () => {
        await expect(
          page.getByText(
            shouldLogOut
              ? UserMessage.DELETE_ALL_SESSIONS_SUCCESS
              : UserMessage.DELETE_ALL_OTHER_SESSIONS_SUCCESS,
          ),
        ).toBeVisible();
      });

      await test.step("User sees the updated session count", async () => {
        if (shouldLogOut) {
          await logInUser(page, credentials);
          await page.goto("/user/sessions");
        } else {
          await page.reload();
        }

        await expect(sessionCount).toHaveText("1");
      });
    });
  });
});

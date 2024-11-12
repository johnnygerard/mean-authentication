import { faker } from "@faker-js/faker";
import { expect } from "@playwright/test";
import {
  BAD_REQUEST,
  NO_CONTENT,
  UNAUTHORIZED,
} from "_server/constants/http-status-code";
import { getFakeCredentials } from "_server/test-helpers/faker-extensions";
import { getStrongLeakedPassword } from "_server/test-helpers/leaked-passwords";
import { ApiError } from "_server/types/api-error.enum";
import { UserMessage } from "../../src/app/types/user-message.enum";
import { ValidationError } from "../../src/app/types/validation-error.enum";
import { getResponsePredicate } from "../extensions";
import { test } from "../fixtures";
import { logInUserViaApi } from "../log-in-user.function";
import { registerUser } from "../register-user.function";

test("Password update", async ({ page, request }) => {
  const endpoint = ["PUT", "/api/user/password"] as const;
  const credentials = getFakeCredentials();
  const oldPassword = credentials.password;
  let newPassword: string;
  const form = page.getByTestId("update-password-form");
  const oldPasswordField = form.getByTestId("old-password");
  const newPasswordField = form.getByTestId("new-password");
  const confirmationField = form.getByTestId("confirm-new-password");
  const oldPasswordInput = oldPasswordField.getByTestId("password");
  const newPasswordInput = newPasswordField.getByTestId("password");
  const confirmationInput = confirmationField.getByTestId("password");

  const fillForm = async (
    oldPassword: string,
    newPassword: string,
    confirmation = newPassword,
  ): Promise<void> => {
    await oldPasswordInput.fill(oldPassword);
    await newPasswordInput.fill(newPassword);
    await confirmationInput.fill(confirmation);
  };

  await registerUser(page, credentials);
  await page.goto("/.well-known/change-password");

  await test.step("User cannot reuse old password", async () => {
    await fillForm(oldPassword, oldPassword);
    await expect(newPasswordField).toContainText(ValidationError.SAME_PASSWORD);
  });

  await test.step("User must confirm new password", async () => {
    const newPassword = faker.internet.password();

    await fillForm(oldPassword, newPassword);
    await page.keyboard.press("Space");

    await expect(confirmationField).toContainText(
      ValidationError.PASSWORD_MISMATCH,
    );
  });

  await test.step("User cannot use a weak password", async () => {
    const newPassword = faker.internet.password({ length: 5 });

    await fillForm(oldPassword, newPassword);

    await expect(newPasswordField).toContainText(
      ValidationError.PASSWORD_STRENGTH,
    );
  });

  await test.step("User cannot use a leaked password", async () => {
    const newPassword = getStrongLeakedPassword();
    const responsePromise = page.waitForResponse(
      getResponsePredicate(...endpoint),
    );

    await fillForm(oldPassword, newPassword);
    await expect(form).toHaveClass(/ng-valid/); // Wait for validation to complete
    await page.keyboard.press("Enter");

    const response = await responsePromise;
    expect(response.status()).toBe(BAD_REQUEST);
    expect(await response.json()).toBe(ApiError.LEAKED_PASSWORD);
  });

  await test.step("Form submission is successful", async () => {
    newPassword = faker.internet.password();
    const responsePromise = page.waitForResponse(
      getResponsePredicate(...endpoint),
    );

    await fillForm(oldPassword, newPassword);
    await expect(form).toHaveClass(/ng-valid/); // Wait for validation to complete
    await page.keyboard.press("Enter");

    const response = await responsePromise;
    expect(response.status()).toBe(NO_CONTENT);
  });

  await test.step("Success message is displayed", async () => {
    await expect(
      page.getByText(UserMessage.PASSWORD_UPDATE_SUCCESS),
    ).toBeVisible();
  });

  await test.step("User cannot log in with the old password", async () => {
    await logInUserViaApi(request, credentials, UNAUTHORIZED);
  });

  await test.step("User can log in with the new password", async () => {
    await logInUserViaApi(request, { ...credentials, password: newPassword });
  });
});

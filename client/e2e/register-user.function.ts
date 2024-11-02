import { faker } from "@faker-js/faker";
import { expect, Page } from "@playwright/test";
import { CREATED } from "_server/constants/http-status-code";
import { Credentials } from "_server/validation/ajv/credentials";

/**
 * Fill out and submit the registration form while verifying the response status.
 * @param page - The registration page
 * @param credentials - The user's credentials to register with
 * @param expectedStatus - The expected response status code
 */
export const registerUser = async (
  page: Page,
  credentials?: Partial<Credentials>,
  expectedStatus = CREATED,
): Promise<void> => {
  await page.goto("/register");

  const username = credentials?.username ?? faker.internet.userName();
  const password = credentials?.password ?? faker.internet.password();
  const form = page.getByTestId("register-form");
  const usernameInput = form.getByTestId("username");
  const passwordInput = form.getByTestId("password");
  const responsePromise = page.waitForResponse("/api/account");

  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await page.keyboard.press("Enter");

  await responsePromise.then((response) => {
    expect(response.request().method()).toBe("POST");
    expect(response.status()).toBe(expectedStatus);
    return response.finished();
  });
};

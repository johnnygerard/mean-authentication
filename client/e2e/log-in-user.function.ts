import { expect, Page } from "@playwright/test";
import { CREATED } from "_server/constants/http-status-code";

/**
 * Fill out and submit the login form while verifying the response status.
 * @param page - The login page
 * @param credentials - The user's login credentials
 * @param expectedStatus - The expected response status code
 */
export const logInUser = async (
  page: Page,
  credentials: {
    username: string;
    password: string;
  },
  expectedStatus = CREATED,
): Promise<void> => {
  await page.goto("/sign-in");

  const { username, password } = credentials;
  const form = page.getByTestId("login-form");
  const usernameInput = form.getByTestId("username");
  const passwordInput = form.getByTestId("password");
  const responsePromise = page.waitForResponse("/api/session");

  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await page.keyboard.press("Enter");

  await responsePromise.then((response) => {
    expect(response.request().method()).toBe("POST");
    expect(response.status()).toBe(expectedStatus);
    return response.finished();
  });
};

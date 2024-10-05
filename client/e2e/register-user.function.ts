import { faker } from "@faker-js/faker";
import { expect, Page } from "@playwright/test";
import { CREATED } from "_server/constants/http-status-code";

export const registerUser = async (
  page: Page,
  user?: Partial<{
    username: string;
    password: string;
  }>,
  expectedStatus = CREATED,
): Promise<void> => {
  await page.goto("/register");

  const username = user?.username ?? faker.internet.userName();
  const password = user?.password ?? faker.internet.password();
  const form = page.getByTestId("register-form");
  const usernameInput = form.getByTestId("username");
  const passwordInput = form.getByTestId("password");
  const responsePromise = page.waitForResponse("/api/account");

  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await passwordInput.press("Enter");

  await responsePromise.then((response) => {
    expect(response.request().method()).toBe("POST");
    expect(response.status()).toBe(expectedStatus);
    return response.finished();
  });
};

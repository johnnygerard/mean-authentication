import { test } from "@playwright/test";
import { globalCredentials } from "./global-credentials";
import { registerUser } from "./register-user.function";

test("Register a new user", async ({ page }) => {
  await registerUser(page, globalCredentials);
});

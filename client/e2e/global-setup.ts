import { test as setup } from "@playwright/test";
import { globalUser } from "./global-user";
import { registerUser } from "./register-user.function";

setup("Register a new user", async ({ page }) => {
  await registerUser(page, globalUser);
});

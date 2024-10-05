import { test } from "@playwright/test";
import { globalUser } from "./global-user";
import { registerUser } from "./register-user.function";

test("Register a new user", async ({ page }) => {
  await registerUser(page, globalUser);
});

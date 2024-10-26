import { test } from "@playwright/test";
import ms from "ms";
import child_process from "node:child_process";
import { promisify } from "node:util";
import { globalCredentials } from "./global-credentials";
import { registerUser } from "./register-user.function";

const exec = promisify(child_process.exec);

test("Global setup", async ({ page }) => {
  test.setTimeout(ms("30 seconds"));

  // Ensure the databases are in their initial state
  await exec("docker compose down --volumes");
  await exec("docker compose up --detach");

  await exec("npm run wait:servers");
  await registerUser(page, globalCredentials);
});

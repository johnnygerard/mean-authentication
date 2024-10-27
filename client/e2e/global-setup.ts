import { test } from "@playwright/test";
import ms from "ms";
import child_process from "node:child_process";
import { promisify } from "node:util";
import { globalCredentials } from "./global-credentials";
import { registerUser } from "./register-user.function";

const exec = promisify(child_process.exec);

test("Global setup", async ({ page }) => {
  test.setTimeout(ms("20 seconds"));
  await exec("docker compose up --detach");

  console.log("Waiting for servers to be ready...");
  await exec("npm run wait:servers");
  console.log("Servers are ready ✔");

  await registerUser(page, globalCredentials);
  console.log("Global setup complete ✔");
});

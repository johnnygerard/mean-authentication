import { test } from "@playwright/test";
import child_process from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(child_process.exec);

test("Global teardown", async () => {
  await exec("docker compose down --volumes");
  console.log("Global teardown complete ✔");
});

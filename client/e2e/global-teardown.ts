import { test } from "@playwright/test";

test("Delete all user accounts", async ({ playwright }) => {
  const request = await playwright.request.newContext({
    baseURL: "http://localhost:3001",
  });

  await request.post("/teardown");
});

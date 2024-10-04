import { test as teardown } from "@playwright/test";

teardown("Delete all user accounts", async ({ playwright }) => {
  const request = await playwright.request.newContext({
    baseURL: "http://localhost:3001",
  });

  await request.post("/teardown");
});

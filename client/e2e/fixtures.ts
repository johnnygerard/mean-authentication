import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    // Disable Angular animations (see `app.config.ts`)
    await page.emulateMedia({ reducedMotion: "reduce" });
    await use(page);
  },
});

import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end configuration.
 *
 * The previous version of this file called `createlovableConfig(...)`, a helper
 * that was never imported and does not exist in node_modules, so any attempt to
 * run Playwright failed before a single test was collected. This replaces it
 * with a plain Playwright config.
 *
 * `webServer` starts the normal dev server, which is deliberate: the dev server
 * is where the local editor and the content writer exist, so these tests can
 * cover the real authoring flow. Nothing here commits or pushes anything.
 */
const PORT = 8080;
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Reuse a server the developer already has running; start one otherwise.
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

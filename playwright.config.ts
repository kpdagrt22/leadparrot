import { defineConfig, devices } from "@playwright/test";

/**
 * Basic E2E config for the LeadParrot happy path.
 * Runs against the local dev server in DEMO mode (no Supabase keys required),
 * which uses the in-memory mock data layer so the flow works offline.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  // Dev-mode compiles routes on first hit, which can exceed the 5s default.
  timeout: 60_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    navigationTimeout: 30_000,
    actionTimeout: 20_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      LEADPARROT_DEMO: "1",
    },
  },
});

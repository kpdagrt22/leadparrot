import { test, expect } from "@playwright/test";

/**
 * Happy-path E2E against the app in DEMO mode (LEADPARROT_DEMO=1, set by the
 * Playwright webServer config). No Supabase / AI keys required — the in-memory
 * store and mock AI provider make the whole flow run offline.
 *
 * Flow: enter demo → projects → score a manual post → see lead → generate &
 * copy a reply draft.
 *
 * Prereq: `npx playwright install chromium`.
 */
test("discover → score → reply happy path", async ({ page }) => {
  // 1. Landing → demo workspace
  await page.goto("/login");
  await page.getByRole("link", { name: /enter demo workspace/i }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  // 2. Projects
  await page.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/app\/projects$/);
  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();

  // 3. Open the seeded project's sources
  await page.getByRole("link", { name: "Sources" }).first().click();
  await expect(page).toHaveURL(/\/sources$/);

  // 4. Score a manual post
  await page.getByLabel("Post title").fill("Looking for a proposal tool for freelancers");
  await page
    .getByLabel("Post text")
    .fill("Anyone recommend a proposal tool with templates and e-signatures? Budget is flexible.");
  await page.getByRole("button", { name: /score this post/i }).click();

  // Redirects to the new lead detail page
  await expect(page).toHaveURL(/\/app\/leads\//, { timeout: 15000 });
  await expect(page.getByRole("heading", { name: /AI scores/i })).toBeVisible();

  // 5. Generate a reply draft
  await page.getByRole("button", { name: /generate reply draft/i }).click();
  await expect(page.getByRole("button", { name: /copy reply/i })).toBeVisible({ timeout: 15000 });

  // 6. Copy it (marks the draft as copied)
  await page.getByRole("button", { name: /copy reply/i }).click();
  await expect(page.getByText(/copied/i).first()).toBeVisible();
});

test("lead inbox lists scored leads", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: /enter demo workspace/i }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.getByRole("link", { name: "Lead inbox", exact: true }).click();
  await expect(page).toHaveURL(/\/app\/leads/);
  await expect(page.getByRole("heading", { name: "Lead inbox" })).toBeVisible();
  // Seeded high-intent leads should be present.
  await expect(page.getByText(/PandaDoc/i).first()).toBeVisible();
});

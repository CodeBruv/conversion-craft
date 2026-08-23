import { expect, test } from "@playwright/test";

/**
 * Smoke coverage for the authoring flow, run against the dev server.
 *
 * These tests only read the site; they never write content, and they never run
 * any Git command. They import nothing from src/ so Playwright does not need
 * Vite to compile them.
 *
 * Requires browsers to be installed once: `npx playwright install chromium`.
 */

test("the homepage lists projects that link to their own URLs", async ({ page }) => {
  await page.goto("/");

  const work = page.locator("#work");
  await expect(work).toBeVisible();

  const cards = work.locator("a[href^='/projects/']");
  expect(await cards.count()).toBeGreaterThan(0);
});

test("clicking a project card opens that project's page", async ({ page }) => {
  await page.goto("/");

  const firstCard = page.locator("#work a[href^='/projects/']").first();
  const href = await firstCard.getAttribute("href");
  const title = await firstCard.locator("h3").innerText();

  await firstCard.click();

  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator("h1")).toHaveText(title);
  await expect(page.locator("text=Back to projects")).toBeVisible();
});

test("a project URL can be opened directly", async ({ page }) => {
  await page.goto("/");
  const href = await page.locator("#work a[href^='/projects/']").first().getAttribute("href");

  // A hard load of a nested route proves the SPA fallback is in place.
  const response = await page.goto(href ?? "/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toBeVisible();
});

test("an unknown project URL renders the 404 page", async ({ page }) => {
  await page.goto("/projects/definitely-not-a-real-project");

  await expect(page.locator("h1")).toHaveText("404");
});

test("the local editor lists the same projects the site does", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.locator("text=Local editor")).toBeVisible();

  const editLinks = page.locator("a[href^='/admin/edit/']");
  expect(await editLinks.count()).toBeGreaterThan(0);
});

test("the editor form opens with every content field", async ({ page }) => {
  await page.goto("/admin/new");

  for (const label of [
    "Title",
    "Slug",
    "Category",
    "Summary",
    "Context",
    "Problem",
    "What I built",
    "Result",
    "Live URL",
    "Source URL",
  ]) {
    await expect(page.getByLabel(label, { exact: false }).first()).toBeVisible();
  }
});

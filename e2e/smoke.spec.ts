/**
 * Playwright smoke tests.
 *
 * These run against the production build; `playwright.config.ts` starts
 * `pnpm serve` automatically. Accessibility assertions live in
 * `e2e/a11y.spec.ts`.
 */

import { test, expect } from "@playwright/test";

test.describe("Home page @smoke", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("./");
    await expect(page).toHaveTitle(/Blueprint/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("./");
    const textbookLink = page.getByRole("link", { name: /Textbook/i }).first();
    await expect(textbookLink).toBeVisible();
  });
});

test.describe("Examples demo page @smoke", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the examples demo page
    await page.goto("docs/examples-demo");
  });

  test("loads the examples demo page", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Live Examples Demo");
  });

  test("live example figures are present", async ({ page }) => {
    const figures = page.locator("figure[data-example-id]");
    await expect(figures.first()).toBeVisible();
  });
});

test.describe("Chapter pages @smoke", () => {
  test("chapter 0 section 1 loads", async ({ page }) => {
    await page.goto("docs/00-foundations/what-is-software-engineering");
    await expect(page.locator("h1")).toContainText("What Is Software Engineering");
  });

  test("chapter 1 TypeScript section loads", async ({ page }) => {
    await page.goto("docs/01-first-sprint/typescript");
    await expect(page.locator("h1")).toContainText("TypeScript");
  });
});

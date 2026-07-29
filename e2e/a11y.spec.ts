/**
 * Automated accessibility checks.
 *
 * The suite runs axe-core against the production build on the pages that carry
 * the most custom markup: the landing page, a prose chapter section, and the
 * live-example demo (which mounts interactive playgrounds).
 *
 * Run with: `pnpm test:a11y`
 */

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const PAGES: { name: string; path: string }[] = [
  { name: "home page", path: "./" },
  { name: "chapter section", path: "docs/00-foundations/what-is-software-engineering" },
  { name: "live examples demo", path: "docs/examples-demo" },
];

test.describe("Accessibility @a11y", () => {
  for (const { name, path } of PAGES) {
    test(`${name} has no serious or critical axe violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("domcontentloaded");

      const results = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        // Third-party playground iframes are audited by their own project.
        .exclude("iframe")
        .analyze();

      const blocking = results.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      );

      expect(
        blocking,
        blocking
          .map((violation) => `${violation.id} (${violation.impact}): ${violation.help}`)
          .join("\n"),
      ).toEqual([]);
    });
  }

  test("every page exposes a main landmark and a level-one heading @a11y", async ({ page }) => {
    for (const { path } of PAGES) {
      await page.goto(path);
      await expect(page.locator("main, [role=main]").first()).toBeVisible();
      await expect(page.locator("h1").first()).toBeVisible();
    }
  });

  test("the colour mode toggle is reachable and operable from the keyboard @a11y", async ({
    page,
  }) => {
    await page.goto("./");

    const toggle = page.getByRole("button", { name: /(dark|light) mode|switch between/i }).first();
    await expect(toggle).toBeVisible();

    const before = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    await toggle.press("Enter");
    await expect
      .poll(() => page.evaluate(() => document.documentElement.getAttribute("data-theme")))
      .not.toBe(before);
  });

  test("live example figures carry accessible names @a11y", async ({ page }) => {
    await page.goto("docs/examples-demo");

    const figures = page.locator("figure[data-example-id]");
    const count = await figures.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      await expect(figures.nth(index)).toHaveAttribute("aria-label", /.+/);
    }
  });
});

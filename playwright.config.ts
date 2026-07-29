import { defineConfig, devices } from "@playwright/test";

/**
 * The site is published under a repository sub-path on GitHub Pages
 * (`/<repo>/`), and `docusaurus serve` honours that same `baseUrl`. The value
 * is derived here with the same rules as `docusaurus.config.ts` so end-to-end
 * runs hit real URLs both locally and in CI.
 */
const [githubOrg = "blueprint-edu", githubRepo = "textbook"] = (
  process.env.GITHUB_REPOSITORY ?? "blueprint-edu/textbook"
).split("/");

const isOrgPages = githubRepo.toLowerCase() === `${githubOrg.toLowerCase()}.github.io`;
const baseUrlPath = isOrgPages ? "/" : `/${githubRepo}/`;

const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}${baseUrlPath}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm serve --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});

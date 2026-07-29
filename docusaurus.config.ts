import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkLiveCode from "./plugins/remark-live-code";

/**
 * GitHub Pages configuration.
 *
 * `GITHUB_REPOSITORY` is provided automatically by GitHub Actions in the
 * `owner/repo` form. Locally it falls back to the canonical coordinates so the
 * dev server and the deployed site agree on `baseUrl`.
 */
const [githubOrg = "blueprint-edu", githubRepo = "textbook"] = (
  process.env.GITHUB_REPOSITORY ?? "blueprint-edu/textbook"
).split("/");

/** `owner.github.io` repositories are served from the domain root. */
const isOrgPages = githubRepo.toLowerCase() === `${githubOrg.toLowerCase()}.github.io`;

const repoUrl = `https://github.com/${githubOrg}/${githubRepo}`;

const config: Config = {
  title: "Blueprint: Software Engineering Textbook",
  tagline: "An interactive, practical guide to software engineering fundamentals.",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: `https://${githubOrg}.github.io`,
  baseUrl: isOrgPages ? "/" : `/${githubRepo}/`,
  trailingSlash: false,

  organizationName: githubOrg,
  projectName: githubRepo,
  deploymentBranch: "gh-pages",

  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  onDuplicateRoutes: "throw",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: `${repoUrl}/edit/main/`,
          showLastUpdateTime: false,
          breadcrumbs: true,
          remarkPlugins: [remarkLiveCode],
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          filename: "sitemap.xml",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/social-card.png",
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    navbar: {
      title: "Blueprint",
      logo: {
        alt: "Blueprint textbook logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "textbookSidebar",
          position: "left",
          label: "Textbook",
        },
        {
          to: "/docs/authoring-code-examples",
          position: "left",
          label: "Authoring Guide",
        },
        {
          href: repoUrl,
          label: "GitHub",
          position: "right",
          "aria-label": "Blueprint textbook repository on GitHub",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Textbook",
          items: [
            {
              label: "Chapter 0: Foundations",
              to: "/docs/foundations/what-is-software-engineering",
            },
            {
              label: "Chapter 1: First Sprint",
              to: "/docs/first-sprint/apply-to-the-company",
            },
            { label: "Live Examples Demo", to: "/docs/examples-demo" },
          ],
        },
        {
          title: "Guides",
          items: [
            { label: "Authoring Code Examples", to: "/docs/authoring-code-examples" },
            { label: "Contributing", to: "/docs/contributor-guide" },
            { label: "Accessibility", to: "/docs/accessibility" },
          ],
        },
        {
          title: "Repository",
          items: [
            { label: "GitHub", href: repoUrl },
            { label: "Issues", href: `${repoUrl}/issues` },
            { label: "Example Security", to: "/docs/maintainer-guide/example-security" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Blueprint Contributors. Content available under the repository license.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ["bash", "json", "diff"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

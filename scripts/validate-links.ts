#!/usr/bin/env tsx
/**
 * Link validation script.
 *
 * Validates internal links in Markdown files.
 * Note: Docusaurus also validates links at build time with onBrokenLinks: "throw".
 * This script provides pre-build validation for faster feedback.
 */

import fs from "fs";
import path from "path";

const DOCS_DIR = path.join(process.cwd(), "docs");

function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
}

function main(): void {
  if (!fs.existsSync(DOCS_DIR)) {
    console.log("No docs/ directory found — skipping link validation.");
    return;
  }

  const files = findMarkdownFiles(DOCS_DIR);
  const errors: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const relPath = path.relative(process.cwd(), file);

    // Check for obviously broken relative links (../nonexistent)
    const linkRe = /\[([^\]]*)\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;
    while ((match = linkRe.exec(content)) !== null) {
      const href = match[2];
      // Skip external links, anchors, and absolute paths
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("/") ||
        href.startsWith("mailto:")
      ) {
        continue;
      }
      // Check relative file links
      const resolved = path.resolve(path.dirname(file), href.split("#")[0]);
      if (
        !fs.existsSync(resolved) &&
        !fs.existsSync(resolved + ".md") &&
        !fs.existsSync(resolved + ".mdx")
      ) {
        errors.push(`${relPath}: Potentially broken link: "${href}"`);
      }
    }
  }

  if (errors.length > 0) {
    console.warn(`\n⚠  Link validation found ${errors.length} potential issue(s):\n`);
    for (const err of errors) {
      console.warn(`  - ${err}`);
    }
    // Warnings only — Docusaurus will throw on broken links at build time
    console.warn("\nNote: Run `pnpm build` for authoritative broken-link detection.");
  } else {
    console.log(`✅ Link validation passed (${files.length} files checked)`);
  }
}

main();

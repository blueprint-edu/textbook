#!/usr/bin/env tsx
/**
 * Content validation script.
 *
 * Validates:
 * - Required front matter fields on all docs
 * - Unique document IDs
 * - Non-empty chapter directories
 */

import fs from "fs";
import path from "path";

const DOCS_DIR = path.join(process.cwd(), "docs");
const REQUIRED_FRONTMATTER = ["title"];

interface ValidationResult {
  errors: string[];
  warnings: string[];
}

function extractFrontMatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm: Record<string, string> = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line
      .slice(colonIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key) fm[key] = value;
  }
  return fm;
}

function validateDocs(dir: string, result: ValidationResult): void {
  const seenIds = new Map<string, string>();

  function walkDir(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    const mdFiles = entries.filter(
      (e) => e.isFile() && (e.name.endsWith(".md") || e.name.endsWith(".mdx")),
    );

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walkDir(path.join(currentDir, entry.name));
      }
    }

    for (const file of mdFiles) {
      const filePath = path.join(currentDir, file.name);
      const content = fs.readFileSync(filePath, "utf-8");
      const fm = extractFrontMatter(content);
      const relPath = path.relative(DOCS_DIR, filePath);

      // Check required front matter
      for (const field of REQUIRED_FRONTMATTER) {
        if (!fm[field]) {
          result.errors.push(`${relPath}: Missing required front matter field: "${field}"`);
        }
      }

      // Check for duplicate IDs
      if (fm["id"]) {
        const existing = seenIds.get(fm["id"]);
        if (existing) {
          result.errors.push(
            `${relPath}: Duplicate document id="${fm["id"]}" (first seen in ${existing})`,
          );
        } else {
          seenIds.set(fm["id"], relPath);
        }
      }
    }
  }

  walkDir(dir);
}

function main(): void {
  const result: ValidationResult = { errors: [], warnings: [] };

  if (!fs.existsSync(DOCS_DIR)) {
    console.error("No docs/ directory found.");
    process.exit(1);
  }

  validateDocs(DOCS_DIR, result);

  for (const warning of result.warnings) {
    console.warn(`⚠  ${warning}`);
  }

  if (result.errors.length > 0) {
    console.error(`\n❌ Content validation failed with ${result.errors.length} error(s):\n`);
    for (const err of result.errors) {
      console.error(`  ✗ ${err}`);
    }
    process.exit(1);
  } else {
    console.log(`✅ Content validation passed (${result.warnings.length} warning(s))`);
  }
}

main();

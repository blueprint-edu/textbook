#!/usr/bin/env tsx
/**
 * Content validation script.
 *
 * Validates:
 * - Required front matter fields on all docs
 * - Unique document IDs
 * - Non-empty chapter directories
 * - Prose constraints in chapter content (the mechanically checkable subset of
 *   the writing rules in project_blueprint_spec.md): no em-dashes, no
 *   difficulty-minimizing words, no colon-led fragment link lists.
 */

import fs from "fs";
import path from "path";

const DOCS_DIR = path.join(process.cwd(), "docs");
const REQUIRED_FRONTMATTER = ["title"];

// Prose rules apply only to student-facing chapter directories (00-*, 01-*, ...),
// not to contributor or maintainer documentation.
const CHAPTER_DIR = /^\d{2}-/;

// Words implying a difficult concept should be trivial (spec's banned list plus
// common inflections). "just" is handled separately below: it has common benign
// senses ("not just a word"), so it warns for human review instead of failing.
const BANNED_WORDS =
  /\b(simple|simply|simplest|merely|straightforward|easy|easily|easier|easiest|obvious|obviously|trivial|trivially)\b/gi;
const WARNED_WORDS = /\b(just)\b/gi;

// Filler and marketing vocabulary that reads as machine-generated prose.
const BANNED_AI_WORDS =
  /\b(load-bearing|delve|delves|delving|delved|crucial|crucially|leverage|leverages|leveraged|leveraging|vibrant)\b/gi;
const BANNED_AI_PHRASES =
  /\b(?:it\s+is|it['’]s)\s+worth\s+noting\s+that\b|\bin\s+today['’]s\s+fast-paced\s+world\b/gi;

// A markdown list item whose body is a link followed by a colon-led fragment,
// e.g. "- [Foo](foo.md): the concept."
const COLON_LED_LINK_FRAGMENT = /^\s*[-*]\s+\[[^\]]+\]\([^)]*\):\s/;

// Both HTML-comment and MDX-comment forms are recognized; docs compiled as
// MDX must use the {/* ... */} form.
const PROSE_IGNORE_LINE = /<!--\s*prose-ignore\s*-->|\{\/\*\s*prose-ignore\s*\*\/\}/;
const PROSE_IGNORE_START = /<!--\s*prose-ignore-start\s*-->|\{\/\*\s*prose-ignore-start\s*\*\/\}/;
const PROSE_IGNORE_END = /<!--\s*prose-ignore-end\s*-->|\{\/\*\s*prose-ignore-end\s*\*\/\}/;

/**
 * Lint one chapter document's prose. Skips front matter, fenced code blocks,
 * inline code spans, and blockquotes (in-fiction company artifacts are quoted
 * blocks and exempt per the company bible). Carried-forward Tome quotes that
 * legitimately use banned patterns can be wrapped in
 * <!-- prose-ignore-start --> ... <!-- prose-ignore-end --> or preceded by
 * <!-- prose-ignore --> on the previous line.
 */
function lintProse(relPath: string, content: string, result: ValidationResult): void {
  const lines = content.split("\n");
  let inFrontMatter = false;
  let inCodeFence = false;
  let inIgnoreBlock = false;
  let ignoreNextLine = false;

  lines.forEach((rawLine, idx) => {
    const lineNo = idx + 1;

    if (lineNo === 1 && rawLine.trim() === "---") {
      inFrontMatter = true;
      return;
    }
    if (inFrontMatter) {
      if (rawLine.trim() === "---") inFrontMatter = false;
      return;
    }

    if (/^\s*(```|~~~)/.test(rawLine)) {
      inCodeFence = !inCodeFence;
      return;
    }
    if (inCodeFence) return;

    if (PROSE_IGNORE_START.test(rawLine)) {
      inIgnoreBlock = true;
      return;
    }
    if (PROSE_IGNORE_END.test(rawLine)) {
      inIgnoreBlock = false;
      return;
    }
    if (inIgnoreBlock) return;

    if (PROSE_IGNORE_LINE.test(rawLine)) {
      ignoreNextLine = true;
      return;
    }
    if (ignoreNextLine) {
      ignoreNextLine = false;
      return;
    }

    // Blockquotes are in-fiction company artifacts; exempt.
    if (/^\s*>/.test(rawLine)) return;

    // Strip inline code spans before word checks.
    const line = rawLine.replace(/`[^`]*`/g, "");

    if (line.includes("—")) {
      result.errors.push(`${relPath}:${lineNo}: Em-dash in prose`);
    }

    const bannedMatches = line.match(BANNED_WORDS);
    if (bannedMatches) {
      for (const word of bannedMatches) {
        result.errors.push(
          `${relPath}:${lineNo}: Banned word "${word}" (implies difficulty is trivial)`,
        );
      }
    }

    const warnedMatches = line.match(WARNED_WORDS);
    if (warnedMatches) {
      for (const word of warnedMatches) {
        result.warnings.push(
          `${relPath}:${lineNo}: "${word}" needs human judgment (banned when it implies a difficult concept is trivial)`,
        );
      }
    }

    const aiWordMatches = line.match(BANNED_AI_WORDS);
    if (aiWordMatches) {
      for (const word of aiWordMatches) {
        result.errors.push(`${relPath}:${lineNo}: Banned word "${word}" (filler vocabulary)`);
      }
    }

    const aiPhraseMatches = line.match(BANNED_AI_PHRASES);
    if (aiPhraseMatches) {
      for (const phrase of aiPhraseMatches) {
        result.errors.push(`${relPath}:${lineNo}: Banned phrase "${phrase}" (filler phrasing)`);
      }
    }

    if (COLON_LED_LINK_FRAGMENT.test(line)) {
      result.errors.push(
        `${relPath}:${lineNo}: Colon-led fragment after link in list item (write a complete sentence)`,
      );
    }
  });
}

interface ValidationResult {
  errors: string[];
  warnings: string[];
}

function extractFrontMatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
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

      // Prose constraints apply to chapter content only.
      const topDir = relPath.split(path.sep)[0];
      if (topDir && CHAPTER_DIR.test(topDir)) {
        lintProse(relPath, content, result);
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

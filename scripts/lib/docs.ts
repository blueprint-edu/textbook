/**
 * Shared helpers for the content-validation and example-extraction scripts.
 */

import fs from "node:fs";
import path from "node:path";

/** Walks up from `start` until the directory containing `package.json` is found. */
function findRepoRoot(start: string): string {
  let dir = start;
  for (;;) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return start;
    dir = parent;
  }
}

export const REPO_ROOT = findRepoRoot(process.cwd());
export const DOCS_DIR = path.join(REPO_ROOT, "docs");
export const STATIC_DIR = path.join(REPO_ROOT, "static");
export const GENERATED_DIR = path.join(REPO_ROOT, "generated");

export interface DocFile {
  /** Absolute path on disk. */
  absolutePath: string;
  /** Path relative to the repository root, using POSIX separators. */
  relativePath: string;
  /** Docusaurus document id, e.g. `01-first-sprint/typescript`. */
  docId: string;
  /** Raw file contents. */
  raw: string;
  /** Parsed front matter values. */
  frontMatter: Record<string, string>;
  /** Body with front matter removed. */
  body: string;
  /** Line number on which the body starts (1-based) in the original file. */
  bodyStartLine: number;
}

/** Recursively collects every Markdown/MDX file below `dir`. */
export function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listMarkdownFiles(full));
    } else if (/\.mdx?$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results.sort();
}

/**
 * Minimal YAML front matter reader.
 *
 * The textbook deliberately restricts front matter to flat `key: value` pairs,
 * so a full YAML parser would add a dependency for no benefit.
 */
export function parseFrontMatter(raw: string): {
  frontMatter: Record<string, string>;
  body: string;
  bodyStartLine: number;
} {
  if (!raw.startsWith("---")) {
    return { frontMatter: {}, body: raw, bodyStartLine: 1 };
  }
  const lines = raw.split("\n");
  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closingIndex === -1) {
    return { frontMatter: {}, body: raw, bodyStartLine: 1 };
  }

  const frontMatter: Record<string, string> = {};
  for (const line of lines.slice(1, closingIndex)) {
    const match = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    frontMatter[key] = rawValue.trim().replace(/^["'](.*)["']$/, "$1");
  }

  return {
    frontMatter,
    body: lines.slice(closingIndex + 1).join("\n"),
    bodyStartLine: closingIndex + 2,
  };
}

/** Loads every document under `docs/` with front matter already parsed. */
export function loadDocs(docsDir: string = DOCS_DIR): DocFile[] {
  return listMarkdownFiles(docsDir).map((absolutePath) => {
    const raw = fs.readFileSync(absolutePath, "utf8");
    const { frontMatter, body, bodyStartLine } = parseFrontMatter(raw);
    const relativePath = path.relative(REPO_ROOT, absolutePath).split(path.sep).join("/");
    const docId = path
      .relative(docsDir, absolutePath)
      .split(path.sep)
      .join("/")
      .replace(/\.mdx?$/, "");
    return { absolutePath, relativePath, docId, raw, frontMatter, body, bodyStartLine };
  });
}

/** Resolves the site-relative URL a document is served from. */
export function docUrl(doc: DocFile): string {
  const slug = doc.frontMatter.slug;
  if (slug) {
    return `/docs${slug.startsWith("/") ? slug : `/${slug}`}`;
  }
  return `/docs/${doc.docId}`;
}

export interface Problem {
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
}

/** Prints problems in a compact, copy-pasteable form and returns the count. */
export function reportProblems(title: string, problems: Problem[]): number {
  if (problems.length === 0) {
    console.log(`✓ ${title}: no problems found`);
    return 0;
  }
  console.error(`\n✗ ${title}: ${problems.length} problem(s) found\n`);
  for (const problem of problems) {
    const location = problem.line ? `${problem.file}:${problem.line}` : problem.file;
    console.error(`  ${location}\n    ${problem.message}`);
    if (problem.suggestion) {
      console.error(`    → ${problem.suggestion}`);
    }
  }
  console.error("");
  return problems.length;
}

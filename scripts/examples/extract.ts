#!/usr/bin/env tsx
/**
 * Example extraction script.
 *
 * Parses all Markdown files in docs/ and extracts live code examples.
 * Validates metadata, detects duplicate IDs, and writes a manifest JSON.
 *
 * Output: generated/examples/manifest.json
 */

import fs from "fs";
import path from "path";

const DOCS_DIR = path.join(process.cwd(), "docs");
const OUTPUT_DIR = path.join(process.cwd(), "generated", "examples");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");
const SUMMARY_PATH = path.join(OUTPUT_DIR, "summary.md");

const SUPPORTED_LANGUAGES = new Set(["ts", "typescript", "tsx", "jsx"]);

export interface ExampleManifestEntry {
  id: string;
  title: string;
  language: "ts" | "tsx";
  source: string;
  sourceFile: string;
  sourceLine: number;
  expectedOutcome: "pass" | "type-error" | "runtime-error";
  runMode: "auto" | "manual" | "skip";
  expectedDiagnosticCodes: number[];
  skipReason?: string;
  tests?: string;
}

function tokenizeMeta(meta: string): Map<string, string | undefined> {
  const map = new Map<string, string | undefined>();
  const re = /([A-Za-z_][\w-]*)(?:=(?:"([^"]*)"|([\w,.:-]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(meta)) !== null) {
    const [, key, quoted, unquoted] = m;
    map.set(key, quoted ?? unquoted);
  }
  return map;
}

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

export function extractExamplesFromFile(
  filePath: string,
  seenIds: Map<string, string>,
  errors: string[],
): ExampleManifestEntry[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(process.cwd(), filePath);
  const lines = content.split("\n");
  const examples: ExampleManifestEntry[] = [];

  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip outer fences (4+ backticks) used in documentation/guides
    // to show illustrative code examples
    const outerFenceMatch = line.match(/^(`{4,})/);
    if (outerFenceMatch) {
      const fenceStr = outerFenceMatch[1];
      i++; // skip opening outer fence line
      // Skip until matching closing fence
      while (i < lines.length && !lines[i].startsWith(fenceStr)) {
        i++;
      }
      i++; // consume closing outer fence
      continue;
    }

    const fenceMatch = line.match(/^```(\w+)\s+(.*)/);

    if (!fenceMatch) {
      i++;
      continue;
    }

    const lang = fenceMatch[1];
    const meta = fenceMatch[2];
    const startLine = i + 1; // 1-based

    if (!SUPPORTED_LANGUAGES.has(lang) || !meta.includes("live")) {
      // Skip to end of fence
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        i++;
      }
      i++;
      continue;
    }

    // Collect source until closing fence
    const sourceLines: string[] = [];
    i++;
    while (i < lines.length && !lines[i].startsWith("```")) {
      sourceLines.push(lines[i]);
      i++;
    }
    i++; // consume closing fence

    const source = sourceLines.join("\n");
    const tokens = tokenizeMeta(meta);

    // Validate
    const id = tokens.get("id") ?? "";
    if (!id) {
      errors.push(`${relPath}:${startLine}: Live code block missing required id= attribute`);
      continue;
    }

    if (seenIds.has(id)) {
      errors.push(
        `${relPath}:${startLine}: Duplicate live example id="${id}" (first seen in ${seenIds.get(id)})`,
      );
      continue;
    }
    seenIds.set(id, `${relPath}:${startLine}`);

    const expect = (tokens.get("expect") ?? "pass") as "pass" | "type-error" | "runtime-error";
    const run = (tokens.get("run") ?? "auto") as "auto" | "manual" | "skip";
    const skipReason = tokens.get("skipReason");
    const errorsStr = tokens.get("errors") ?? "";

    if (run === "skip" && !skipReason) {
      errors.push(`${relPath}:${startLine}: id="${id}" uses run=skip but is missing skipReason`);
      continue;
    }

    if (expect === "type-error" && !errorsStr) {
      errors.push(
        `${relPath}:${startLine}: id="${id}" expects type-error but has no errors= codes`,
      );
      continue;
    }

    const expectedDiagnosticCodes = errorsStr
      ? errorsStr
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
          .map((c) => parseInt(c, 10))
          .filter((n) => !isNaN(n))
      : [];

    const normalizedLang: "ts" | "tsx" = lang === "tsx" || lang === "jsx" ? "tsx" : "ts";

    examples.push({
      id,
      title: tokens.get("title") ?? id,
      language: normalizedLang,
      source,
      sourceFile: relPath,
      sourceLine: startLine,
      expectedOutcome: expect,
      runMode: run,
      expectedDiagnosticCodes,
      skipReason,
      tests: tokens.get("tests"),
    });
  }

  return examples;
}

function main(): void {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error("No docs/ directory found.");
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = findMarkdownFiles(DOCS_DIR);
  const seenIds = new Map<string, string>();
  const errors: string[] = [];
  const manifest: ExampleManifestEntry[] = [];

  for (const file of files) {
    const examples = extractExamplesFromFile(file, seenIds, errors);
    manifest.push(...examples);
  }

  if (errors.length > 0) {
    console.error(`\n❌ Example extraction failed with ${errors.length} error(s):\n`);
    for (const err of errors) {
      console.error(`  ✗ ${err}`);
    }
    process.exit(1);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  // Summary
  const passing = manifest.filter((e) => e.expectedOutcome === "pass").length;
  const typeErrors = manifest.filter((e) => e.expectedOutcome === "type-error").length;
  const runtimeErrors = manifest.filter((e) => e.expectedOutcome === "runtime-error").length;
  const skipped = manifest.filter((e) => e.runMode === "skip").length;

  // Markdown summary consumed by the CI job summary step.
  const summary = [
    "| Metric | Count |",
    "| ------ | ----- |",
    `| Total live examples | ${manifest.length} |`,
    `| Passing examples | ${passing} |`,
    `| Intentional type errors | ${typeErrors} |`,
    `| Intentional runtime errors | ${runtimeErrors} |`,
    `| Skipped examples | ${skipped} |`,
    "",
  ].join("\n");
  fs.writeFileSync(SUMMARY_PATH, summary);

  console.log(`✅ Extracted ${manifest.length} live examples from ${files.length} files`);
  console.log(
    `   Pass: ${passing}  Type-error: ${typeErrors}  Runtime-error: ${runtimeErrors}  Skipped: ${skipped}`,
  );
  console.log(`   Manifest: ${MANIFEST_PATH}`);
}

/**
 * Only run the CLI when this module is the entry point, so the extraction
 * helpers can be imported by tests without side effects.
 */
if (process.argv[1] !== undefined && /extract\.ts$/.test(process.argv[1])) {
  main();
}

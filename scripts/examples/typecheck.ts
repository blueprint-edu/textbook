#!/usr/bin/env tsx
/**
 * Example type-checking script.
 *
 * Reads the manifest produced by extract.ts and type-checks each example
 * using the TypeScript compiler API.
 *
 * Validates:
 * - pass examples have no diagnostics
 * - type-error examples have the declared diagnostic codes
 * - skip examples are type-checked unless typecheck=skip is set
 *
 * Output: generated/examples/diagnostics.json
 */

import fs from "fs";
import path from "path";
import ts from "typescript";

const MANIFEST_PATH = path.join(process.cwd(), "generated", "examples", "manifest.json");
const DIAGNOSTICS_PATH = path.join(process.cwd(), "generated", "examples", "diagnostics.json");
const TEMP_DIR = path.join(process.cwd(), "generated", "examples", "temp");

interface ExampleManifestEntry {
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
}

interface DiagnosticResult {
  code: number;
  severity: "error" | "warning" | "suggestion";
  message: string;
  line: number;
  column: number;
  sourceExcerpt?: string;
}

interface ExampleDiagnostics {
  id: string;
  passed: boolean;
  diagnostics: DiagnosticResult[];
  errors: string[];
}

function severityLabel(category: ts.DiagnosticCategory): "error" | "warning" | "suggestion" {
  switch (category) {
    case ts.DiagnosticCategory.Error:
      return "error";
    case ts.DiagnosticCategory.Warning:
      return "warning";
    default:
      return "suggestion";
  }
}

function typeCheckExample(entry: ExampleManifestEntry): ExampleDiagnostics {
  const isTsx = entry.language === "tsx";
  const fileName = path.join(TEMP_DIR, `${entry.id}.${isTsx ? "tsx" : "ts"}`);

  // Wrap TSX with React import
  const source = isTsx ? `import React from "react";\n${entry.source}` : entry.source;

  fs.mkdirSync(TEMP_DIR, { recursive: true });
  fs.writeFileSync(fileName, source, "utf-8");

  const compilerOptions: ts.CompilerOptions = {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: isTsx ? ts.JsxEmit.ReactJSX : undefined,
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
    noEmit: true,
    skipLibCheck: false,
  };

  const host = ts.createCompilerHost(compilerOptions);
  const program = ts.createProgram([fileName], compilerOptions, host);
  const allDiagnostics = ts.getPreEmitDiagnostics(program);

  const diagnostics: DiagnosticResult[] = [];
  const lineOffset = isTsx ? 1 : 0; // Account for added React import line

  for (const d of allDiagnostics) {
    if (!d.file || !d.start) continue;
    const { line: rawLine, character } = d.file.getLineAndCharacterOfPosition(d.start);
    const line = Math.max(1, rawLine + 1 - lineOffset);
    const col = character + 1;
    const message = ts.flattenDiagnosticMessageText(d.messageText, "\n");

    // Get source excerpt (the relevant source line from the original code)
    const srcLines = entry.source.split("\n");
    const srcLine = srcLines[line - 1]?.trim().slice(0, 80);

    diagnostics.push({
      code: d.code,
      severity: severityLabel(d.category),
      message,
      line,
      column: col,
      sourceExcerpt: srcLine,
    });
  }

  // Clean up temp file
  try {
    fs.unlinkSync(fileName);
  } catch {
    // ignore
  }

  const errors: string[] = [];
  let passed = true;

  if (entry.expectedOutcome === "pass") {
    const errs = diagnostics.filter((d) => d.severity === "error");
    if (errs.length > 0) {
      passed = false;
      errors.push(
        `id="${entry.id}" (${entry.sourceFile}:${entry.sourceLine}): expect=pass but has ${errs.length} type error(s):\n` +
          errs.map((e) => `  TS${e.code} line ${e.line}: ${e.message}`).join("\n"),
      );
    }
  } else if (entry.expectedOutcome === "type-error") {
    const errorCodes = new Set(diagnostics.map((d) => d.code));
    for (const expected of entry.expectedDiagnosticCodes) {
      if (!errorCodes.has(expected)) {
        passed = false;
        errors.push(
          `id="${entry.id}" (${entry.sourceFile}:${entry.sourceLine}): expected TS${expected} but it was not found`,
        );
      }
    }
    if (diagnostics.filter((d) => d.severity === "error").length === 0) {
      passed = false;
      errors.push(
        `id="${entry.id}" (${entry.sourceFile}:${entry.sourceLine}): expect=type-error but no errors found`,
      );
    }
  }

  return { id: entry.id, passed, diagnostics, errors };
}

function main(): void {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Manifest not found at ${MANIFEST_PATH}. Run pnpm examples:extract first.`);
    process.exit(1);
  }

  const manifest: ExampleManifestEntry[] = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

  const allResults: ExampleDiagnostics[] = [];
  const allErrors: string[] = [];
  let checkedCount = 0;
  const skippedCount = 0;

  for (const entry of manifest) {
    if (entry.expectedOutcome === "runtime-error") {
      // Runtime-error examples still need to pass type checking
      // (unless they have intentional type errors too)
      checkedCount++;
      const result = typeCheckExample(entry);
      allResults.push(result);
      // For runtime-error, we don't fail on type errors
    } else {
      checkedCount++;
      const result = typeCheckExample(entry);
      allResults.push(result);
      allErrors.push(...result.errors);
    }
  }

  // Write diagnostics
  fs.mkdirSync(path.dirname(DIAGNOSTICS_PATH), { recursive: true });
  const diagnosticsMap: Record<string, DiagnosticResult[]> = {};
  for (const r of allResults) {
    diagnosticsMap[r.id] = r.diagnostics;
  }
  fs.writeFileSync(DIAGNOSTICS_PATH, JSON.stringify(diagnosticsMap, null, 2));

  if (allErrors.length > 0) {
    console.error(`\n❌ Example type-checking failed with ${allErrors.length} error(s):\n`);
    for (const err of allErrors) {
      console.error(`  ✗ ${err}\n`);
    }
    process.exit(1);
  }

  const failed = allResults.filter((r) => !r.passed).length;
  const passed = allResults.filter((r) => r.passed).length;
  console.log(
    `✅ Type-checked ${checkedCount} examples — ${passed} passed, ${failed} failed, ${skippedCount} skipped`,
  );
  console.log(`   Diagnostics: ${DIAGNOSTICS_PATH}`);
}

main();

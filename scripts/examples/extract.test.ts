/**
 * Tests for the live-example extraction pipeline.
 *
 * These run against temporary fixture documents so they stay independent of
 * the textbook content, while still exercising the real parser used by
 * `pnpm examples:extract`.
 */

import fs from "fs";
import path from "path";
import { extractExamplesFromFile } from "./extract";

/** Fixtures live inside the repository so no writes escape the workspace. */
const FIXTURE_ROOT = path.join(process.cwd(), "generated", "test-fixtures");

function withFixture(fileName: string, contents: string, run: (filePath: string) => void): void {
  fs.mkdirSync(FIXTURE_ROOT, { recursive: true });
  const dir = fs.mkdtempSync(path.join(FIXTURE_ROOT, "extract-"));
  const filePath = path.join(dir, fileName);
  try {
    fs.writeFileSync(filePath, contents);
    run(filePath);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

describe("extractExamplesFromFile", () => {
  it("extracts a passing TypeScript example with its metadata", () => {
    const doc = [
      "---",
      "id: sample",
      "---",
      "",
      '```ts live id=sample-basic title="Basic types" expect=pass',
      'const greeting: string = "hello";',
      "console.log(greeting);",
      "```",
      "",
    ].join("\n");

    withFixture("sample.md", doc, (filePath) => {
      const errors: string[] = [];
      const examples = extractExamplesFromFile(filePath, new Map(), errors);

      expect(errors).toEqual([]);
      expect(examples).toHaveLength(1);
      expect(examples[0]).toMatchObject({
        id: "sample-basic",
        title: "Basic types",
        language: "ts",
        expectedOutcome: "pass",
        runMode: "auto",
      });
      expect(examples[0].source).toContain("const greeting");
    });
  });

  it("ignores fenced blocks that are not marked live", () => {
    const doc = ["```ts", "const x = 1;", "```", ""].join("\n");

    withFixture("plain.md", doc, (filePath) => {
      const errors: string[] = [];
      expect(extractExamplesFromFile(filePath, new Map(), errors)).toHaveLength(0);
      expect(errors).toEqual([]);
    });
  });

  it("reports an error when a live block has no id", () => {
    const doc = ["```ts live", "const x = 1;", "```", ""].join("\n");

    withFixture("missing-id.md", doc, (filePath) => {
      const errors: string[] = [];
      extractExamplesFromFile(filePath, new Map(), errors);
      expect(errors.join("\n")).toMatch(/id/i);
    });
  });

  it("reports duplicate ids across documents", () => {
    const doc = ["```ts live id=duplicate-id expect=pass", "const x = 1;", "```", ""].join("\n");
    const seen = new Map<string, string>([["duplicate-id", "docs/elsewhere.md:10"]]);

    withFixture("duplicate.md", doc, (filePath) => {
      const errors: string[] = [];
      extractExamplesFromFile(filePath, seen, errors);
      expect(errors.join("\n")).toMatch(/duplicate/i);
    });
  });

  it("records declared diagnostic codes for intentional type errors", () => {
    const doc = [
      '```ts live id=intentional-type-error title="Broken" expect=type-error errors=2322',
      'const count: number = "twenty";',
      "```",
      "",
    ].join("\n");

    withFixture("type-error.md", doc, (filePath) => {
      const errors: string[] = [];
      const examples = extractExamplesFromFile(filePath, new Map(), errors);

      expect(errors).toEqual([]);
      expect(examples[0].expectedOutcome).toBe("type-error");
      expect(examples[0].expectedDiagnosticCodes).toEqual([2322]);
    });
  });

  it("requires a skipReason when run=skip", () => {
    const doc = [
      "```ts live id=skipped-example expect=pass run=skip",
      "const x = 1;",
      "```",
      "",
    ].join("\n");

    withFixture("skip.md", doc, (filePath) => {
      const errors: string[] = [];
      extractExamplesFromFile(filePath, new Map(), errors);
      expect(errors.join("\n")).toMatch(/skipReason/i);
    });
  });
});

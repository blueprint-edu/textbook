/**
 * remark-live-code: Transforms fenced code blocks with `live` metadata
 * into LiveCodeExample MDX component calls.
 *
 * Usage in Markdown:
 *   ```ts live id=ch1-s5-basic-types title="Basic types" expect=pass
 *   const x: string = "hello";
 *   console.log(x);
 *   ```
 *
 * See docs/authoring-code-examples.md for the complete grammar.
 */

import type { Root, Code } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LiveCodeMeta {
  id: string;
  title?: string;
  expect: "pass" | "type-error" | "runtime-error";
  errorCodes: number[];
  run: "auto" | "manual" | "skip";
  skipReason?: string;
  consolePanel?: "open" | "closed";
  view?: "split" | "editor" | "result";
  height?: number;
  readonly?: boolean;
  tests?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SUPPORTED_LANGUAGES = new Set(["ts", "typescript", "tsx", "jsx"]);

const KNOWN_KEYS = new Set([
  "live",
  "id",
  "title",
  "expect",
  "errors",
  "run",
  "skipReason",
  "console",
  "view",
  "height",
  "readonly",
  "tests",
]);

// ---------------------------------------------------------------------------
// Metadata parsing
// ---------------------------------------------------------------------------

/**
 * Tokenise code-fence metadata into a key→value map.
 * Handles: bare flags, key=value, key="quoted value"
 */
export function tokenizeMeta(meta: string): Map<string, string | undefined> {
  const map = new Map<string, string | undefined>();
  // Matches: key, key=value, key="quoted value"
  const re = /([A-Za-z_][\w-]*)(?:=(?:"([^"]*)"|([\w,.:-]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(meta)) !== null) {
    const [, key, quoted, unquoted] = m;
    map.set(key, quoted ?? unquoted);
  }
  return map;
}

/**
 * Parse and validate the metadata string of a live code block.
 * Returns null if the block is not marked `live`.
 * Throws a descriptive error on invalid metadata.
 */
export function parseMeta(meta: string, filePath: string, line: number): LiveCodeMeta | null {
  const tokens = tokenizeMeta(meta);

  if (!tokens.has("live")) return null;

  const validationErrors: string[] = [];
  const result: Partial<LiveCodeMeta> = {
    expect: "pass",
    errorCodes: [],
    run: "auto",
  };

  for (const [key, value] of tokens.entries()) {
    if (key === "live") continue;

    if (!KNOWN_KEYS.has(key)) {
      validationErrors.push(
        `Unknown metadata key "${key}". Valid keys: ${[...KNOWN_KEYS].join(", ")}`,
      );
      continue;
    }

    switch (key) {
      case "id":
        result.id = value ?? "";
        break;

      case "title":
        result.title = value ?? "";
        break;

      case "expect":
        if (!["pass", "type-error", "runtime-error"].includes(value ?? "")) {
          validationErrors.push(
            `Invalid expect="${value ?? ""}". Must be: pass | type-error | runtime-error`,
          );
        } else {
          result.expect = value as LiveCodeMeta["expect"];
        }
        break;

      case "errors": {
        const codes = (value ?? "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
          .map((c) => {
            const n = parseInt(c, 10);
            if (isNaN(n)) {
              validationErrors.push(`Error code "${c}" in errors= is not a valid integer`);
              return NaN;
            }
            return n;
          })
          .filter((n) => !isNaN(n));
        result.errorCodes = codes;
        break;
      }

      case "run":
        if (!["auto", "manual", "skip"].includes(value ?? "")) {
          validationErrors.push(`Invalid run="${value ?? ""}". Must be: auto | manual | skip`);
        } else {
          result.run = value as LiveCodeMeta["run"];
        }
        break;

      case "skipReason":
        result.skipReason = value ?? "";
        break;

      case "console":
        if (!["open", "closed"].includes(value ?? "")) {
          validationErrors.push(`Invalid console="${value ?? ""}". Must be: open | closed`);
        } else {
          result.consolePanel = value as "open" | "closed";
        }
        break;

      case "view":
        if (!["split", "editor", "result"].includes(value ?? "")) {
          validationErrors.push(`Invalid view="${value ?? ""}". Must be: split | editor | result`);
        } else {
          result.view = value as "split" | "editor" | "result";
        }
        break;

      case "height": {
        const h = parseInt(value ?? "", 10);
        if (isNaN(h) || h <= 0) {
          validationErrors.push(`height must be a positive integer, got "${value ?? ""}"`);
        } else {
          result.height = h;
        }
        break;
      }

      case "readonly":
        result.readonly = true;
        break;

      case "tests":
        result.tests = value ?? "";
        break;
    }
  }

  // Cross-field validation
  if (!result.id) {
    validationErrors.push("Missing required id=<identifier>. Example: id=ch1-s5-basic-types");
  }

  if (result.run === "skip" && !result.skipReason) {
    validationErrors.push(
      `run=skip requires skipReason="...". Example: skipReason="Requires a live browser API"`,
    );
  }

  if (result.expect === "type-error" && (!result.errorCodes || result.errorCodes.length === 0)) {
    validationErrors.push(
      "expect=type-error requires errors=<comma-separated TS codes>. Example: errors=2322",
    );
  }

  if (validationErrors.length > 0) {
    const prefix = `${filePath}:${line}: Live code block validation failed:`;
    throw new Error([prefix, ...validationErrors.map((e) => `  - ${e}`)].join("\n"));
  }

  return result as LiveCodeMeta;
}

// ---------------------------------------------------------------------------
// Source escaping
// ---------------------------------------------------------------------------

/**
 * Escape source code for embedding in a JSX template literal expression.
 * @deprecated The plugin now uses JSON.stringify for reliable MDX v3 escaping.
 *             This function is kept for backward compatibility with tests.
 */
export function escapeForTemplateLiteral(src: string): string {
  return src.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

// ---------------------------------------------------------------------------
// Language normalisation
// ---------------------------------------------------------------------------

export function normaliseLanguage(lang: string): "ts" | "tsx" {
  return lang === "tsx" || lang === "jsx" ? "tsx" : "ts";
}

// ---------------------------------------------------------------------------
// ID deduplication (module-level for a single build; cleared between test runs)
// ---------------------------------------------------------------------------

/**
 * Docusaurus compiles every MDX file more than once (server bundle, client
 * bundle, dev-server rebuilds), so a naive "seen ids" set produces false
 * duplicate reports. Ownership is therefore tracked per source file: when a
 * file is re-processed it first releases the ids it previously registered.
 */
const _idOwners = new Map<string, string>();
const _fileIds = new Map<string, Set<string>>();

/** Reset the seen-ID registry. Called in tests and between build phases. */
export function resetSeenIds(): void {
  _idOwners.clear();
  _fileIds.clear();
}

/** Releases every id previously registered by `filePath`. */
function releaseFileIds(filePath: string): void {
  const owned = _fileIds.get(filePath);
  if (!owned) return;
  for (const id of owned) {
    if (_idOwners.get(id) === filePath) _idOwners.delete(id);
  }
  _fileIds.delete(filePath);
}

/** Returns the file that already owns `id`, or `undefined` when it is free. */
function claimId(id: string, filePath: string): string | undefined {
  const owner = _idOwners.get(id);
  const owned = _fileIds.get(filePath) ?? new Set<string>();
  if (owner !== undefined && (owner !== filePath || owned.has(id))) {
    return owner;
  }
  _idOwners.set(id, filePath);
  owned.add(id);
  _fileIds.set(filePath, owned);
  return undefined;
}

// ---------------------------------------------------------------------------
// MDX JSX node helpers
// ---------------------------------------------------------------------------

type MdxJsxAttribute =
  | { type: "mdxJsxAttribute"; name: string; value: string }
  | {
      type: "mdxJsxAttribute";
      name: string;
      value: {
        type: "mdxJsxAttributeValueExpression";
        value: string;
        data: { estree: object };
      };
    };

function stringAttr(name: string, value: string): MdxJsxAttribute {
  return { type: "mdxJsxAttribute", name, value };
}

/**
 * Create an expression attribute with a proper ESTree AST.
 * MDX v3 requires `data.estree` on `mdxJsxAttributeValueExpression` nodes;
 * without it the compiled JS produces an empty expression (`source: ,`).
 */
function exprAttr(name: string, expr: string): MdxJsxAttribute {
  return {
    type: "mdxJsxAttribute",
    name,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: expr,
      data: {
        estree: {
          type: "Program",
          sourceType: "module" as const,
          body: [
            {
              type: "ExpressionStatement",
              expression: parseExpressionToEstree(expr),
            },
          ],
        },
      },
    },
  };
}

/**
 * Build a minimal ESTree expression node from a JS expression string.
 * Handles the specific expression shapes the plugin produces:
 *  - JSON string literals: `"..."` → Literal
 *  - Numeric literals: `123` → Literal
 *  - Boolean literals: `true` / `false` → Literal
 *  - Array literals: `[1,2,3]` → ArrayExpression
 */
function parseExpressionToEstree(expr: string): object {
  // Boolean
  if (expr === "true") return { type: "Literal", value: true, raw: "true" };
  if (expr === "false") return { type: "Literal", value: false, raw: "false" };

  // Numeric literal
  const num = Number(expr);
  if (!isNaN(num) && expr.trim() !== "") {
    return { type: "Literal", value: num, raw: expr };
  }

  // JSON string literal produced by JSON.stringify
  if (expr.startsWith('"')) {
    try {
      const value = JSON.parse(expr) as string;
      return { type: "Literal", value, raw: expr };
    } catch {
      // fall through
    }
  }

  // Array of numbers: [2322,2339]
  if (expr.startsWith("[") && expr.endsWith("]")) {
    const inner = expr.slice(1, -1);
    const elements = inner
      ? inner.split(",").map((s) => {
          const n = Number(s.trim());
          return { type: "Literal", value: n, raw: s.trim() };
        })
      : [];
    return { type: "ArrayExpression", elements };
  }

  // Fallback: wrap in an identifier (should not normally reach here)
  return { type: "Identifier", name: "undefined" };
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

const remarkLiveCode: Plugin<[], Root> = () => {
  return (tree: Root, file) => {
    const filePath = String(file.path ?? file.history?.[0] ?? "<unknown>");
    releaseFileIds(filePath);

    visit(tree, "code", (node: Code) => {
      if (!node.meta) return;
      if (!SUPPORTED_LANGUAGES.has(node.lang ?? "")) return;

      const line = node.position?.start?.line ?? 0;

      let meta: LiveCodeMeta | null;
      try {
        meta = parseMeta(node.meta, filePath, line);
      } catch (err) {
        // Re-throw so Docusaurus surfaces it as a build error with location
        const msg = err instanceof Error ? err.message : String(err);
        file.fail(msg, node.position?.start ?? { line, column: 0 });
        return;
      }

      if (!meta) return; // Not a live block

      // Check for duplicate IDs across the whole site
      const conflictingFile = claimId(meta.id, filePath);
      if (conflictingFile !== undefined) {
        file.fail(
          `Duplicate live example id="${meta.id}" (already used in ${conflictingFile}). ` +
            `Each live code block must have a globally unique id.`,
          node.position?.start ?? { line, column: 0 },
        );
        return;
      }

      const lang = normaliseLanguage(node.lang ?? "ts");

      // Build JSX attributes
      const attrs: MdxJsxAttribute[] = [
        stringAttr("id", meta.id),
        stringAttr("language", lang),
        // JSON.stringify produces a single-line JS string literal with all
        // special characters properly escaped — safe for MDX v3 / acorn.
        exprAttr("source", JSON.stringify(node.value)),
      ];

      if (meta.title) attrs.push(stringAttr("title", meta.title));
      if (meta.expect !== "pass") attrs.push(stringAttr("expect", meta.expect));
      if (meta.errorCodes.length > 0) {
        attrs.push(exprAttr("errorCodes", `[${meta.errorCodes.join(",")}]`));
      }
      if (meta.run !== "auto") attrs.push(stringAttr("run", meta.run));
      if (meta.skipReason) attrs.push(stringAttr("skipReason", meta.skipReason));
      if (meta.consolePanel) attrs.push(stringAttr("consolePanel", meta.consolePanel));
      if (meta.view) attrs.push(stringAttr("view", meta.view));
      if (meta.height) attrs.push(exprAttr("height", String(meta.height)));
      if (meta.readonly) attrs.push(exprAttr("readonly", "true"));
      if (meta.tests) attrs.push(stringAttr("tests", meta.tests));

      // Replace the Code node with an mdxJsxFlowElement node in-place.
      // Cast via unknown because we're swapping the node type entirely.
      const replacement = node as unknown as Record<string, unknown>;
      replacement["type"] = "mdxJsxFlowElement";
      replacement["name"] = "LiveCodeExample";
      replacement["attributes"] = attrs;
      replacement["children"] = [];
      replacement["data"] = { _mdxExplicitJsx: true };
      delete replacement["lang"];
      delete replacement["meta"];
      delete replacement["value"];
    });
  };
};

export default remarkLiveCode;

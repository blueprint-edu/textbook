/**
 * LiveCodeExample component.
 *
 * Renders an interactive LiveCodes playground for textbook code examples.
 * Lazy-loaded to avoid SSR issues. Registered globally via
 * src/theme/MDXComponents.tsx so MDX files need no per-file imports.
 */

import React, { lazy, Suspense, useEffect, useState } from "react";
import styles from "./styles.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DiagnosticInfo {
  code: number;
  severity: "error" | "warning" | "suggestion";
  message: string;
  line: number;
  column: number;
  sourceExcerpt?: string;
}

export interface LiveCodeExampleProps {
  /** Globally unique identifier for this example. */
  id: string;
  /** Source language of the example. */
  language: "ts" | "tsx";
  /** Source code of the example. */
  source: string;
  /** Accessible title shown above the playground. */
  title?: string;
  /** Expected outcome from automated validation. */
  expect?: "pass" | "type-error" | "runtime-error";
  /** Expected TypeScript diagnostic codes (for expect=type-error). */
  errorCodes?: number[];
  /** Whether to execute automatically, require manual run, or skip. */
  run?: "auto" | "manual" | "skip";
  /** Required explanation when run=skip. */
  skipReason?: string;
  /** Initial console panel state. */
  consolePanel?: "open" | "closed";
  /** Layout mode for the playground. */
  view?: "split" | "editor" | "result";
  /** Height of the playground in pixels. */
  height?: number;
  /** Whether the editor is read-only. */
  readonly?: boolean;
  /** ID of an associated test block. */
  tests?: string;
  /** TypeScript diagnostics pre-computed at build time. */
  diagnostics?: DiagnosticInfo[];
}

/** Minimal prop subset we pass to the LiveCodes React component. */
interface LivecodesProps {
  appUrl?: string;
  config?: Record<string, unknown>;
  style?: React.CSSProperties;
  className?: string;
  title?: string;
}

/**
 * Pinned LiveCodes app version (see https://livecodes.io/docs/features/permanent-url).
 * v49 (current livecodes.io) has a regression: the Monaco model for TSX projects is
 * created with a .ts filename, so the editor flags every JSX element as a type error
 * ("Cannot find name 'main'", etc.). v48 names the model .tsx and checks cleanly.
 * Pinning also protects examples from future upstream breaking changes.
 */
const LIVECODES_APP_URL = "https://v48.livecodes.io";

// ---------------------------------------------------------------------------
// Lazy-loaded LiveCodes
// ---------------------------------------------------------------------------

type LivecodesModule = { default: React.ComponentType<LivecodesProps> };

// livecodes/react ships its own prop types; we cast via unknown to avoid
// duplicating its full interface while keeping the import typed.
const LivecodesReact = lazy(() =>
  import("livecodes/react").then((m) => m as unknown as LivecodesModule),
);

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DiagnosticsPanel({
  diagnostics,
  isIntentional,
}: {
  diagnostics: DiagnosticInfo[];
  isIntentional: boolean;
}) {
  if (!diagnostics || diagnostics.length === 0) return null;

  return (
    <div className={styles.diagnostics} role="region" aria-label="TypeScript diagnostics">
      {isIntentional && (
        <div className={styles.intentionalBadge} role="note">
          <span aria-hidden="true">📚</span> Intentional teaching error — these diagnostics are part
          of the lesson.
        </div>
      )}
      <ul className={styles.diagnosticsList} role="list">
        {diagnostics.map((d, i) => (
          <li
            key={i}
            className={`${styles.diagnosticItem} ${styles[`diagnosticItem__${d.severity}`]}`}
          >
            <span className={styles.diagnosticCode} aria-label={`TypeScript error TS${d.code}`}>
              TS{d.code}
            </span>
            <span className={styles.diagnosticSeverity}>
              {d.severity === "error" ? (
                <span aria-hidden="true">✖</span>
              ) : d.severity === "warning" ? (
                <span aria-hidden="true">⚠</span>
              ) : (
                <span aria-hidden="true">ℹ</span>
              )}
              <span className="sr-only">{d.severity}</span>
            </span>
            <span className={styles.diagnosticLocation}>
              Line {d.line}, Col {d.column}
            </span>
            <span className={styles.diagnosticMessage}>{d.message}</span>
            {d.sourceExcerpt && <code className={styles.diagnosticExcerpt}>{d.sourceExcerpt}</code>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkipNotice({ reason }: { reason: string }) {
  return (
    <div className={styles.skipNotice} role="note">
      <span aria-hidden="true">⏭</span> Execution skipped: {reason}
    </div>
  );
}

function RuntimeErrorBadge() {
  return (
    <div className={styles.runtimeErrorBadge} role="note">
      <span aria-hidden="true">⚡</span> Intentional runtime error — this failure is part of the
      lesson.
    </div>
  );
}

function ManualRunNotice() {
  return (
    <div className={styles.manualNotice} role="note">
      <span aria-hidden="true">▶</span> Click <strong>Run</strong> in the playground to execute this
      example.
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function LiveCodeExample({
  id,
  language,
  source,
  title,
  expect,
  errorCodes: _errorCodes,
  run = "auto",
  skipReason,
  consolePanel,
  view = "split",
  height = 320,
  readonly = false,
  diagnostics,
}: LiveCodeExampleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isIntentionalTypeError = expect === "type-error";
  const isIntentionalRuntimeError = expect === "runtime-error";
  const isManual = run === "manual";
  const isSkipped = run === "skip";

  const ariaLabel = title ? `Interactive code example: ${title}` : "Interactive code example";

  // LiveCodes playground configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playgroundConfig: Record<string, any> = {
    readonly,
    autoupdate: run === "auto",
    mode: view === "editor" ? "editor" : view === "result" ? "result" : "full",
    activeEditor: "script",
    script: {
      language: language === "tsx" ? "tsx" : "typescript",
      content: source,
    },
    tools: {
      enabled: ["console", "compiled"],
      active: consolePanel === "open" ? "console" : "console",
      status: consolePanel === "open" ? "open" : "none",
    },
    zoom: 1,
    lineNumbers: true,
    wordWrap: true,
    fontSize: 14,
  };

  // SSR fallback: render source as plain code block
  if (!mounted) {
    return (
      <figure
        className={styles.container}
        aria-label={ariaLabel}
        data-example-id={id}
        data-language={language}
        data-expect={expect ?? "pass"}
      >
        {title && <figcaption className={styles.caption}>{title}</figcaption>}
        <div className={styles.loadingFallback} aria-busy="true">
          <pre>
            <code>{source}</code>
          </pre>
          <p className="sr-only">Interactive playground loading…</p>
        </div>
      </figure>
    );
  }

  return (
    <figure
      className={[
        styles.container,
        isIntentionalTypeError ? styles.containerTypeError : "",
        isIntentionalRuntimeError ? styles.containerRuntimeError : "",
        isManual ? styles.containerManual : "",
        isSkipped ? styles.containerSkipped : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={ariaLabel}
      data-example-id={id}
      data-language={language}
      data-expect={expect ?? "pass"}
    >
      {title && <figcaption className={styles.caption}>{title}</figcaption>}

      {isIntentionalRuntimeError && <RuntimeErrorBadge />}
      {isManual && !isSkipped && <ManualRunNotice />}

      {isSkipped ? (
        <>
          <pre className={styles.staticCode}>
            <code>{source}</code>
          </pre>
          {skipReason && <SkipNotice reason={skipReason} />}
        </>
      ) : (
        <Suspense
          fallback={
            <div className={styles.loadingFallback} aria-live="polite" aria-busy="true">
              <pre>
                <code>{source}</code>
              </pre>
              <p>Loading interactive playground…</p>
            </div>
          }
        >
          <div className={styles.playground} style={{ height: `${height}px` }}>
            <LivecodesReact
              appUrl={LIVECODES_APP_URL}
              config={playgroundConfig}
              style={{ height: "100%", width: "100%", border: "none" }}
              title={ariaLabel}
            />
          </div>
        </Suspense>
      )}

      {diagnostics && diagnostics.length > 0 && (
        <DiagnosticsPanel diagnostics={diagnostics} isIntentional={isIntentionalTypeError} />
      )}
    </figure>
  );
}

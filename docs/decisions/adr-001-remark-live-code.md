---
title: "ADR 001: Remark Plugin + Global Component Registration"
sidebar_position: 1
---

**Date:** 2025-01-01  
**Status:** Accepted

## Context

Textbook authors need to embed interactive code examples in Markdown files. We evaluated several approaches:

1. **Raw MDX components in every file** — Authors import `<LiveCodeExample />` at the top of each `.mdx` file.
2. **Docusaurus custom pages** — Each example is a separate `.tsx` page.
3. **Remark plugin + global component** — A remark plugin transforms code fences; the component is registered globally.
4. **CDN-loaded script** — Examples are loaded via a `<script>` tag at runtime.

## Decision

We chose **option 3**: a local remark plugin (`plugins/remark-live-code`) that transforms marked code fences into `<LiveCodeExample />` JSX, combined with global component registration via `src/theme/MDXComponents.tsx`.

## Rationale

### Authoring ergonomics

Authors use familiar triple-backtick code fences. No per-file imports are required. The `live` flag and metadata attributes are concise and readable in Markdown source.

### Separation of concerns

The remark plugin owns parsing and validation. The `LiveCodeExample` component owns rendering. Scripts own extraction and type-checking. Each layer is independently testable.

### Docusaurus compatibility

Global component registration (swizzling `MDXComponents`) is the [officially supported Docusaurus pattern](https://docusaurus.io/docs/markdown-features/react#mdx-component-scope) for making components available in all MDX files.

### Build-time validation

Parsing at remark time means invalid metadata fails the build with a precise source location, file path, and suggested correction. This is not possible with runtime component approaches.

### No CDN dependency

LiveCodes is installed as an npm dependency. The playground loads from the local build, not from a third-party CDN. This improves reliability, privacy, and load performance.

## Consequences

- Authors must follow the documented metadata grammar.
- Live examples are only interactive client-side; a static fallback is shown during SSR.
- The remark plugin must be kept in sync with the `LiveCodeExample` prop interface.
- The `LiveCodeExample` component must be registered globally for all MDX files to use it.

## Alternatives Considered

### Raw MDX component imports

Rejected because it requires every author to add an import statement to every section file, creating friction and a maintenance burden.

### CDN-loaded LiveCodes

Rejected because it creates a runtime dependency on an external service, reducing reliability and potentially introducing privacy concerns.

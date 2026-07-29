---
title: Authoring Code Examples
sidebar_position: 1
---

This guide describes the complete grammar for live, interactive code examples in the Blueprint textbook.

## Quick Start

Create a live example by adding `live` and a unique `id` to a TypeScript or TSX code fence:

````markdown
```ts live id=ch1-s5-basic-types title="Basic types" expect=pass
const courseName: string = "Software Engineering";
console.log(courseName);
```
````

Code blocks **without** the `live` flag remain ordinary syntax-highlighted blocks and are never transformed.

## Supported Languages

| Fence language | Rendered as             | Use for                   |
| -------------- | ----------------------- | ------------------------- |
| `ts`           | TypeScript              | Non-React scripts         |
| `typescript`   | TypeScript              | Non-React scripts (alias) |
| `tsx`          | TSX + React JSX runtime | React components          |
| `jsx`          | TSX + React JSX runtime | React components (alias)  |

## Complete Metadata Grammar

```text
<language> live [key=value | key="quoted value" | bare-flag] ...
```

### Required attributes

| Attribute         | Description                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `live`            | **Required.** Marks the block as interactive. Without this, all other attributes are ignored. |
| `id=<identifier>` | **Required.** A globally unique, stable identifier. Use kebab-case: `ch1-s5-basic-types`.     |

### Optional attributes

| Attribute                                | Default  | Description                                                                                             |
| ---------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `title="<text>"`                         | —        | Accessible title shown above the playground. Recommended for every example.                             |
| `expect=pass\|type-error\|runtime-error` | `pass`   | Expected outcome for automated validation.                                                              |
| `errors=<codes>`                         | —        | **Required when `expect=type-error`.** Comma-separated TypeScript error codes, e.g. `errors=2322,2339`. |
| `run=auto\|manual\|skip`                 | `auto`   | Execution mode. `manual` shows a Run button. `skip` requires `skipReason`.                              |
| `skipReason="<text>"`                    | —        | **Required when `run=skip`.** Explains why automated execution is skipped.                              |
| `console=open\|closed`                   | `closed` | Initial state of the console panel.                                                                     |
| `view=split\|editor\|result`             | `split`  | Playground layout. `split` shows editor and result side by side.                                        |
| `height=<integer>`                       | `320`    | Height of the playground in pixels.                                                                     |
| `readonly`                               | `false`  | When present, the editor is read-only.                                                                  |
| `tests=<example-id>`                     | —        | Associate a test block with this example.                                                               |

### Validation rules

The build fails if:

- `id` is missing or duplicated.
- `expect=type-error` is used without `errors=`.
- `run=skip` is used without `skipReason`.
- An unknown key is present.
- `errors=` contains non-integer values.
- `height=` is not a positive integer.

## Example Recipes

### TypeScript with console output

````markdown
```ts live id=ch1-s5-basic-types title="Basic types" expect=pass
const courseName: string = "Software Engineering";
console.log(courseName);
```
````

### React component

````markdown
```tsx live id=ch1-s8-greeting title="A React component" expect=pass
type GreetingProps = { name: string };

function Greeting({ name }: GreetingProps) {
  return <h2>Hello, {name}!</h2>;
}

export default function App() {
  return <Greeting name="Ada" />;
}
```
````

### Intentional TypeScript error

````markdown
```ts live id=ch1-s5-type-error title="Investigating a type error" expect=type-error errors=2322
const enrollment: number = "twenty";
console.log(enrollment);
```
````

### Intentional runtime error

````markdown
```ts live id=ch1-s5-runtime-error title="Intentional failure" expect=runtime-error
throw new Error("This failure is part of the lesson");
```
````

### Manual execution

````markdown
```tsx live id=ch1-s8-manual title="Run this manually" expect=pass run=manual
export default function App() {
  return <button>Click Run to execute</button>;
}
```
````

### Skipped example

````markdown
```ts live id=browser-only title="Browser API" run=skip skipReason="Requires a browser permission prompt"
console.log(navigator.mediaDevices);
```
````

### Open console panel

````markdown
```ts live id=ch1-s5-console-demo title="Console output" expect=pass console=open
for (let i = 1; i <= 5; i++) {
  console.log(`Step ${i}`);
}
```
````

## ID Conventions

Use kebab-case IDs that include the chapter and section number:

```text
ch{chapter}-s{section}-{descriptive-slug}
```

Examples: `ch1-s5-basic-types`, `ch2-s3-onclick-handler`, `demo-runtime-error`.

IDs must be globally unique across all files. The build fails on any duplicate.

## Validation Workflow

Run these commands to validate your examples:

```bash
pnpm examples:extract   # Parse and validate all examples
pnpm examples:typecheck # Type-check with the TypeScript compiler
pnpm examples:test      # Run automated runtime tests
```

Or run all CI checks at once:

```bash
pnpm ci
```

## Architecture Decision

See `docs/decisions/adr-001-remark-live-code.md` for the rationale for this authoring model.

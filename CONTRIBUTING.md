# Contributing to Blueprint Textbook

Thank you for your interest in contributing!

## Definition of Done

A contribution is complete when:

- [ ] `pnpm format:check` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm validate:content` passes
- [ ] `pnpm examples:extract` passes
- [ ] `pnpm examples:typecheck` passes
- [ ] `pnpm test:unit` passes
- [ ] `pnpm build` succeeds

Run all checks at once: `pnpm ci`

## Quick Start

```bash
pnpm install
pnpm start       # Live development server
pnpm build       # Production build
pnpm ci          # All CI checks
```

## Adding Content

See `docs/authoring-code-examples.md` for the interactive code example authoring guide.

Follow the chapter/section naming convention:

- Directory: `docs/{chnum}-{slug}/`
- File: `{secnum}-{slug}.md`
- Document ID: kebab-case, e.g. `what-is-software-engineering`
- Example IDs: `ch{n}-s{n}-{slug}`, e.g. `ch1-s5-basic-types`

## Code Style

- Run `pnpm format` to format all files
- TypeScript strict mode is enabled throughout
- No `any` except at documented interoperability boundaries

## Pull Requests

Use the pull request template. All CI checks must pass before merge.

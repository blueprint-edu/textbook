---
title: Contributor Guide
sidebar_position: 2
---

Thank you for contributing to the Blueprint textbook! This guide describes the definition of done for textbook contributions.

## Definition of Done

A contribution is complete only when **all** of the following pass:

- [ ] `pnpm format:check` — Code and prose are formatted.
- [ ] `pnpm lint` — No linting errors.
- [ ] `pnpm typecheck` — TypeScript compiles without errors.
- [ ] `pnpm validate` — Content validation passes (front matter, IDs, etc.).
- [ ] `pnpm examples:extract` — All live examples have unique IDs and valid metadata.
- [ ] `pnpm examples:typecheck` — Every live example type-checks correctly.
- [ ] `pnpm examples:test` — Runtime tests pass (or intentional failures match their `expect` declaration).
- [ ] `pnpm test:unit` — Unit tests pass.
- [ ] `pnpm build` — The production site builds without errors.
- [ ] Accessibility is preserved (run `pnpm test:a11y` for automated checks).

## Quick Local Validation

```bash
pnpm ci
```

This runs all of the above in order.

## Content Guidelines

- Keep section introductions concise (2–4 sentences).
- Use `:::info Content forthcoming` admonitions for placeholder sections.
- Every live example must have a unique `id` following the `ch{n}-s{n}-{slug}` convention.
- Declare intentional errors precisely with `expect=type-error errors=<codes>`.
- Never fabricate citations, research findings, or statistical claims.
- Use inclusive, respectful language throughout.

## Pull Request Checklist

Before opening a PR, confirm:

1. All CI checks pass locally (`pnpm ci`).
2. Every new live example has a unique ID and correct metadata.
3. All links in new content are valid.
4. Images have alt text.
5. Heading levels are sequential (no skipping from H1 to H3).

## Reporting Issues

- **Content errors**: Use the "Content Error" issue template.
- **Technical defects**: Use the "Technical Defect" issue template.
- **Security concerns**: See `SECURITY.md`.

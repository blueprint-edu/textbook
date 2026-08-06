# Blueprint: Software Engineering Textbook

An interactive, production-ready Docusaurus 3 textbook for software engineering courses, featuring embedded LiveCodes playgrounds, TypeScript diagnostics, and automated example validation.

## Technology overview

| Technology                                    | Version | Purpose                                      |
| --------------------------------------------- | ------- | -------------------------------------------- |
| [Docusaurus 3](https://docusaurus.io/)        | 3.10.x  | Static site generator and textbook framework |
| [React](https://react.dev/)                   | 19.x    | UI library                                   |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0    | Language throughout the repository           |
| [LiveCodes](https://livecodes.io/)            | 0.109.x | Interactive browser-based code playgrounds   |
| [pnpm](https://pnpm.io/)                      | 11.x    | Package manager                              |
| [Node.js](https://nodejs.org/)                | 22 LTS  | Runtime (use the `.nvmrc`-declared version)  |
| [Jest](https://jestjs.io/)                    | 29.x    | Unit and component tests                     |
| [Playwright](https://playwright.dev/)         | latest  | End-to-end tests                             |
| [ESLint](https://eslint.org/)                 | 9.x     | Code linting                                 |
| [Prettier](https://prettier.io/)              | 3.x     | Code formatting                              |

## Requirements

- Node.js ≥ 22 LTS (check `.nvmrc`)
- pnpm ≥ 9 (`npm install -g pnpm`)

## Installation

```bash
pnpm install --frozen-lockfile
```

## Local development

```bash
# Start dev server (hot reload)
pnpm start

# Production build
pnpm build

# Serve the production build locally
pnpm serve
```

The dev server runs at `http://localhost:3000/textbook/` (or `/` when
`GITHUB_REPOSITORY` is not set — see [GitHub Pages configuration](#github-pages-configuration)).

## Validation commands

```bash
# Check code formatting
pnpm format:check

# Auto-fix formatting
pnpm format

# Lint TypeScript and JavaScript
pnpm lint:code

# Lint Markdown files
pnpm lint:markdown

# Run all linters
pnpm lint

# Type-check the whole repository
pnpm typecheck

# Validate document front matter, unique IDs, and structure
pnpm validate:content

# Validate internal and external links
pnpm validate:links

# Extract all live examples and write generated/examples/manifest.json
pnpm examples:extract

# Type-check every extracted live example
pnpm examples:typecheck

# Run unit and component tests
pnpm test:unit

# Run Playwright smoke tests (requires a running site)
pnpm test:e2e

# Run all CI checks locally (same as the workflow)
pnpm ci
```

## How to author a chapter

1. Create a directory under `docs/` following the zero-padded convention:

   ```text
   docs/10-my-chapter/
   ```

2. Add `_category_.json`:

   ```json
   {
     "label": "10. My Chapter",
     "position": 10,
     "collapsible": true,
     "collapsed": false
   }
   ```

3. Create one Markdown file per section:

   ```text
   docs/10-my-chapter/01-my-section.md
   ```

4. Add front matter to every section:

   ```yaml
   ---
   title: "10.1 My Section"
   sidebar_position: 1
   ---
   ```

5. Register the chapter in `sidebars.ts` following the existing pattern.

## How to create a live example

Add the `live` flag and a unique `id` to any fenced TypeScript code block:

````markdown
```ts live id=ch10-s1-hello title="Hello, world" expect=pass
const message: string = "Hello, world!";
console.log(message);
```
````

For React (TSX) examples:

````markdown
```tsx live id=ch10-s1-greeting title="A React greeting" expect=pass
export default function App() {
  return <h2>Hello, Blueprint!</h2>;
}
```
````

## How to mark intentional TypeScript errors

Declare the expected TypeScript error codes with `expect=type-error errors=<codes>`:

````markdown
```ts live id=ch10-s1-type-error title="Type assignment error" expect=type-error errors=2322
const score: number = "not a number";
```
````

Multiple codes are comma-separated: `errors=2322,2339`.

For inline annotations on specific lines, use `@expect-ts-error <code>`:

````markdown
```ts live id=ch10-s1-inline-error title="Missing property" expect=type-error errors=2339
const user = { name: "Ada" };
// @expect-ts-error 2339 Property does not exist
console.log(user.grade);
```
````

## How to mark intentional runtime errors

Use `expect=runtime-error`:

````markdown
```ts live id=ch10-s1-runtime-error title="An expected failure" expect=runtime-error
throw new Error("This is intentional.");
```
````

## How to skip execution responsibly

Use `run=skip` with a mandatory `skipReason`:

````markdown
```ts live id=ch10-s1-skip title="Camera access" run=skip skipReason="Requires a browser permission dialog"
navigator.mediaDevices.getUserMedia({ video: true });
```
````

Use `run=manual` when a reader should press Run themselves:

````markdown
```tsx live id=ch10-s1-manual title="Run manually" run=manual
export default function App() {
  return <button>Run me!</button>;
}
```
````

## How to run CI checks locally

```bash
pnpm ci
```

This runs formatting, linting, type-checking, content validation, example
extraction and type-checking, unit tests, and a production build — the same
steps as the GitHub Actions validate workflow.

## GitHub Pages deployment

Deployment is automatic on every push to `main`.

The site is served from the URL configured by `GITHUB_REPOSITORY`:

- **Project Pages** (`org/textbook`): `https://org.github.io/textbook/`
- **Org Pages** (`org/org.github.io`): `https://org.github.io/`

### GitHub repository settings

Before the first deployment, complete these one-time steps in
**Settings → Pages**:

1. Set **Source** to **GitHub Actions**.

That is the only manual step required. The deploy workflow handles everything
else.

## GitHub Pages configuration

The site derives its `url` and `baseUrl` automatically from the
`GITHUB_REPOSITORY` environment variable that GitHub Actions provides:

```text
GITHUB_REPOSITORY=myorg/textbook
→ url: https://myorg.github.io
→ baseUrl: /textbook/
```

For a user/org Pages site:

```text
GITHUB_REPOSITORY=myorg/myorg.github.io
→ url: https://myorg.github.io
→ baseUrl: /
```

For local development, set `GITHUB_REPOSITORY` to override the default
`blueprint-edu/textbook`:

```bash
GITHUB_REPOSITORY=myorg/myname.github.io pnpm start
```

## How to configure organization and repository names

1. Fork or clone this repository under your own GitHub account or organization.
2. The `GITHUB_REPOSITORY` secret is automatically populated by GitHub Actions.
3. For local development, you can leave the defaults or set the variable:

   ```bash
   export GITHUB_REPOSITORY=myorg/my-textbook
   pnpm start
   ```

4. Edit `docusaurus.config.ts` to change the site title, tagline, and footer
   copyright. Search for `blueprint-edu` to find all default values.

## How to resolve the known Chapter 3 numbering conflict

The problem statement assigns two sections the heading "User Research"
(3.1 and 6.2). The repository resolves this by naming them:

- `docs/03-user-research/01-user-research.md` — Chapter 3.1
- `docs/06-analysis/02-user-research-contextual-inquiry.md` — Chapter 6.2

Both have distinct `sidebar_position` values and unique filenames.

## Troubleshooting

### `pnpm install` fails with lockfile errors

```bash
pnpm install  # regenerate the lockfile
pnpm format   # re-format pnpm-lock.yaml if needed
```

### `pnpm build` reports broken links

- Check that all `to=` values in `docusaurus.config.ts` and `src/pages/index.tsx`
  use normalized paths (no numeric directory prefix, e.g. `/docs/foundations/…`
  not `/docs/00-foundations/…`).
- Run `pnpm validate:links` to get the full list.

### `pnpm examples:extract` fails on duplicate IDs

Every live example needs a globally unique `id=`. Search for the duplicate with:

```bash
grep -r 'id=YOUR-ID' docs/
```

### ESLint reports a jiti version error

The ESLint config uses `eslint.config.mjs` (JavaScript) to avoid the `jiti`
version requirement for TypeScript config files. Do not rename it to `.ts`.

### `pnpm test:unit` passes but `pnpm build` fails with `source: ,`

This indicates the remark plugin is producing `mdxJsxAttributeValueExpression`
nodes without the required `data.estree` AST. The plugin includes a
`parseExpressionToEstree` helper to handle this — ensure you have not reverted
that code.

## Security considerations

- Textbook examples execute only in the browser inside a sandboxed LiveCodes
  iframe. They cannot access the parent page's storage or cookies.
- The CI validation workflow has no deployment credentials.
- The deploy workflow uses OIDC and the minimal `pages: write` permission.
- `pull_request_target` is never used.
- See `docs/maintainer-guide/example-security.md` for the full threat model.

## Accessibility expectations

The site targets WCAG 2.2 AA. Key commitments:

- Sufficient text contrast in both light and dark modes.
- Full keyboard navigation.
- Descriptive `aria-label` on every playground iframe.
- Screen-reader announcements for example status.
- Alt text required on all images (enforced by `pnpm validate:content`).

See `docs/accessibility.md` for the complete statement.

## License

See the `LICENSE` file. **The repository owner must replace the placeholder
license with an appropriate license before publishing.** The `LICENSE` file
currently contains a placeholder.

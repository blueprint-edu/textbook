---
title: "1.7 Linting, Checking, and Validating"
sidebar_position: 7
---

**Topics:** Definition of Done, Linting, Coverage basics

## Learning Objectives

By the end of this section, you will be able to:

- Run each quality-gate command and explain what it verifies.
- Explain what "Definition of Done" means and apply the course's version.
- Create a combined `npm run check` script in package.json.

## Done Is a Definition, Not a Feeling

"It works" is the least trustworthy sentence in software. Works on whose machine? With which inputs? Formatted how? Agile teams replace the feeling with a **Definition of Done**: a written checklist that a piece of work either satisfies or does not.

The work sample's definition of done is seven commands. An epoch is complete when every one of them succeeds:

1. `npm run typecheck` reports no type errors.
2. `npm run lint` reports no errors or warnings.
3. `npm run format:check` finds every file formatted.
4. `npm run test` passes every test.
5. `npm run test:coverage` reaches full coverage of the files in scope.
6. `npm run build` produces a production bundle.
7. `npm run mutation:check` shows every reference implementation passing and every curated mutant failing.

Run each one now, on your freshly cloned repository (before you make any changes), and watch them pass. You are expected to run them individually, and to know what each one is telling you, for the whole first epoch.

## What Each Gate Catches

- **`typecheck`** runs the TypeScript compiler with this project's maximum-strictness settings and no output files. It catches type errors everywhere, including files your tests never touch.
- **`lint`** runs ESLint with type-aware rules. Linters catch legal-but-bad code: the banned `any` and friends, unused variables, missing return types, misused React hooks. Our configuration treats every warning as failing, because a tolerated warning pile grows until nobody reads it.
- **`format:check`** runs Prettier in verification mode. Everyone has opinions about how to format code, but most of the time it really doesn't matter. Nobody on a team should spend review time on indentation, so a program decides, and everyone's diffs stay clean. `npm run format` fixes everything automatically, and your editor does it on save, so this gate should rarely fail.
- **`test`** you met in the previous section.
- **`test:coverage`** runs the tests and then measures **coverage**: which lines, branches, and functions of the in-scope source files were actually executed by at least one test. The epoch's configuration lists which files are in scope, and the bar is full coverage of them. Be clear about what this means: coverage proves your tests _visited_ the code, not that they checked the right things there. A suite can execute every line and assert nothing. Full coverage is the floor, not the goal, which is exactly why the seventh gate exists.
- **`build`** produces the optimized production bundle that GitHub Pages will serve. It can fail even when everything else passes, and finding that out at deploy time is the wrong time.
- **`mutation:check`** is the interesting one, and it gets its own section in chapter 2. The short version: it runs your tests against deliberately sabotaged implementations and demands that your tests notice. It is the gate that catches the assert-nothing suite that coverage waves through. Right now it reports that nothing is active yet and passes.

## Now Write `npm run check`

Seven commands is a lot of typing, and you have now run each enough times to know what it does. Time to automate. The `scripts` section of `package.json` maps command names to what they run, and scripts can call other scripts. Open `package.json`, find `"scripts"`, and add one line:

```json
"check": "npm run typecheck && npm run lint && npm run format:check && npm run test && npm run test:coverage && npm run build && npm run mutation:check"
```

:::warning

The `package.json` file is a JSON file, and has strict rules about commas. If you add the `"check"` line at the end of the `"scripts"` section, make sure the previous line has a comma at the end. Otherwise, the file will be invalid JSON.
:::

Then run it:

```bash
npm run check
```

The `&&` operator chains commands and stops at the first failure, so `check` fails fast at the earliest broken gate instead of burying it in later output. From now on, this is the command you run before every commit you intend to push, and the definition of done collapses into one word.

Notice what you did: you found a repetitive manual process and encoded it as a program. That instinct, applied relentlessly, is a large fraction of what senior engineers actually do. But it was important to see how these things worked in isolation: Automation you understand is a tool, automation you don't is a superstition.

The `check` command is yours. The repository does not ship it, the graders run the seven gates independently.

## Continuous Integration

Your repository also ships a **continuous integration** (CI) workflow: GitHub runs the same gates on every push and every pull request, on a clean machine that has none of your local state (this is called "GitHub Actions"). The green check or red X on a pull request is the whole gate's verdict, visible to your reviewers. Chapter 7 goes deeper into the DevOps side; for now, know that red CI means not done, no exceptions.

## Coming Up

Every gate so far checks plain TypeScript. The next section adds the last ingredient of epoch 1: TSX, where your typed functions start producing things you can actually see in a browser.

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E1 (week 1)]

- **E1.10: Epoch 1 integration and release.** As the intern team, we need evidence that the first increment is releasable.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

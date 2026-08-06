---
title: "1.6 Tests"
sidebar_position: 6
---

**Topics:** Vitest, Assertions

## Learning Objectives

By the end of this section, you will be able to:

- Write a basic Vitest test with describe/it/expect.
- Use common matchers like toBe, toEqual, and toThrow.
- Explain what makes a good unit test.

## Tests Are the Spec

In much of software engineering, the tests _are_ the product spec. A paragraph of prose can be vague; a test cannot. It says: given exactly this input, the code must produce exactly this output, and a machine checks the claim thousands of times a day.

This has a practical consequence that will save you hours in this course: **if you cannot figure out why you are failing a test, read the test code.** The epoch tasks come with public tests, and every one of them is a precise, executable statement of what your function must do. Students who treat failing tests as obstacles have a bad time. Students who treat them as documentation finish early.

The work sample uses [Vitest](https://vitest.dev), a fast test runner built by the same community as Vite (a popular frontend build tool). If you have seen Jest, Vitest's API is nearly identical on purpose.

## The Anatomy of a Test

A test file imports the functions it tests, groups related tests with `describe`, states each behavior with `it`, and makes claims with `expect`. Here is a test file for the `letterGrade` function from the previous section:

```ts
import { describe, expect, it } from "vitest";
import { letterGrade } from "../src/letterGrade";

describe("letterGrade", () => {
  it("gives an A at 90 and above", () => {
    expect(letterGrade(90)).toBe("A");
    expect(letterGrade(100)).toBe("A");
  });

  it("gives a B from 80 up to but not including 90", () => {
    expect(letterGrade(80)).toBe("B");
    expect(letterGrade(89.9)).toBe("B");
  });

  it("fails everything below 70", () => {
    expect(letterGrade(69.9)).toBe("F");
    expect(letterGrade(0)).toBe("F");
  });
});
```

Read the `it` titles top to bottom and you get a specification in plain English. A useful pattern for structuring the body of longer tests is **Given/When/Then**:

- given this setup,
- when this happens,
- then expect this result.

For one-line tests like these it might feel silly, but it will make life easier when our tests grow.

Notice which inputs the tests probe: 90, 89.9, 80, 69.9, 0. Boundary values, exactly where the bugs live. A test suite that only checks 95 and 20 would pass a broken implementation that put the B cutoff at 85. Choosing inputs that can tell a correct implementation from a plausible wrong one is the core skill of testing.

## Matchers

`expect(value)` returns an object with **matchers**, methods that make a claim about the value:

- **`toBe(expected)`** checks with `===`. Use it for primitives: numbers, strings, booleans.
- **`toEqual(expected)`** checks structural equality, comparing objects and arrays field by field. `expect({ points: 3 }).toEqual({ points: 3 })` passes where `toBe` would fail, because they are different objects with the same contents. The difference between "same object" and "same contents" becomes a major theme in chapter 4.
- **`toThrow()`** checks that a function call raises an error: `expect(() => percentage(5, 0)).toThrow()`. Note the wrapper arrow function; without it, the error fires before the matcher can catch it.

There are more (`toBeNull`, `toContain`, `toBeCloseTo` for floating point, and friends), and the [Vitest documentation](https://vitest.dev/api/expect.html) lists them all. These four cover most of epoch 1.

## Running Tests

Two commands, both from the repository root:

```bash
npm run test          # run the whole suite once
npm run test:watch    # rerun affected tests every time you save
```

Watch mode is very useful: use it to keep tests running in a terminal while you implement, and every save tells you within seconds what the state of the code is. A failing test prints the expected value, the received value, and the exact line of the failing assertion. That output is not scolding you; it is handing you the bug report.

The live block below fakes the experience in the browser so you can see _basically_ what these tests are doing. It's not magic!

```ts live id=ch1-s6-assertion title="An assertion, approximately" expect=pass console=open
function formatQuestions(count: number): string {
  if (count === 1) {
    return "1 question";
  }
  return `${count} questions`;
}

function check(actual: string, expected: string): void {
  if (actual === expected) {
    console.log(`PASS: got ${actual}`);
  } else {
    console.log(`FAIL: expected ${expected}, got ${actual}`);
  }
}

check(formatQuestions(1), "1 question");
check(formatQuestions(3), "3 questions");
check(formatQuestions(0), "0 questions");
```

Break the function on purpose (make the `=== 1` check `=== 2`) and run it again. Watching a test catch a bug you planted builds exactly the right intuition for what tests are for.

## What Makes a Test Good

Four properties, in rough priority order:

- **It can fail.** A test that passes no matter what the code does is decoration. Every test should be able to name a plausible bug it would catch.
- **It tests behavior, not implementation.** Assert what the function returns, not how it got there. Tests welded to implementation details break every time you refactor, and teach you to distrust them.
- **It reads as a claim.** Title plus assertions should make sense to a teammate who has never seen the implementation.
- **It is independent.** Each test sets up what it needs and does not depend on another test running first. Test runners shuffle order, and so should your assumptions.

In epoch 1, most tests are provided to you and your job is to satisfy and read them. The epochs after that progressively hand you the test-writing job, and by epoch 3 the quality of your own tests is itself part of what gets graded.

## Coming Up

Tests are one gate on the definition of done, but only one. The next section tours the whole gate: linting, formatting, type checking, coverage, and the ritual of making all of them pass before you call anything finished.

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E1 (week 1)]

- **E1.2: formatPoints(points).** As a learner, I need point values displayed consistently.
- **E1.3: percentage(earned, possible).** As a learner, I need a normalized percentage for score reporting.
- **E1.4: isPassingScore(earned, possible, threshold).** As a learner, I need to know whether a score meets the configured threshold.
- **E1.5: scoreBand(percentage).** As a learner, I need a human-readable performance category.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

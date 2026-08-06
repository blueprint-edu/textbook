---
title: "2.6 Mutation Testing"
sidebar_position: 6
---

**Topics:** Mutation testing, Mutants, Test quality

## Learning Objectives

By the end of this section, you will be able to:

- Explain why full coverage does not guarantee good tests.
- Explain what a mutant is and what it means to kill one.
- Strengthen a test suite until it distinguishes correct code from plausibly wrong code.
- Describe how `npm run mutation:check` grades your tests.

## Coverage Lies

Section 1.7 planted a warning that comes due now: coverage proves your tests _visited_ the code, not that they checked anything while they were there. Here is a suite with 100% coverage of `letterGrade`:

```ts
it("runs letterGrade", () => {
  letterGrade(95);
  letterGrade(85);
  letterGrade(75);
  letterGrade(50);
  expect(true).toBe(true);
});
```

Every line executed, every branch taken, coverage report glowing green, and not one claim made about any result. Replace `letterGrade` with a function that returns `"F"` for everyone and this suite still passes. Coverage is a floor. The question that actually matters about a test suite is different: **if the code were wrong, would a test fail?**

That question sounds hard to check. It turns out to be checkable by brute honesty: make the code wrong, on purpose, and see.

## Mutants

A **mutant** is a copy of an implementation with one deliberate defect: a `>=` becomes `>`, a `+` becomes `-`, a condition drops a clause, a function checks the first element instead of all of them. **Mutation testing** runs your test suite against mutants and demands failure. Two terms of art:

- **A test kills a mutant** when it fails while the mutant is in place. Good; your suite can tell right from this particular wrong.
- **A mutant survives** when every test passes with the defect in place. Bad; there is a bug your suite cannot see.

Watch a mutant survive. Both implementations below face the same weak test:

```ts live id=ch2-s6-survivor title="A surviving mutant" expect=pass console=open
type LetterGrade = "A" | "B" | "C" | "F";

function letterGrade(percentage: number): LetterGrade {
  if (percentage >= 90) {
    return "A";
  }
  if (percentage >= 80) {
    return "B";
  }
  if (percentage >= 70) {
    return "C";
  }
  return "F";
}

// The mutant: one character different. An A now requires MORE than 90.
function letterGradeMutant(percentage: number): LetterGrade {
  if (percentage > 90) {
    return "A";
  }
  if (percentage >= 80) {
    return "B";
  }
  if (percentage >= 70) {
    return "C";
  }
  return "F";
}

function weakSuite(grade: (percentage: number) => LetterGrade): boolean {
  return grade(95) === "A" && grade(85) === "B" && grade(20) === "F";
}

console.log("Real implementation passes:", weakSuite(letterGrade));
console.log("Mutant passes:", weakSuite(letterGradeMutant));
```

Both print `true`. The weak suite tested 95, 85, and 20, all comfortably far from the boundaries, so a defect _at_ the boundary sails through. A student with exactly 90.0 gets a B from the mutant, and no test would have caught it.

Now kill it. Add one assertion at the boundary, `grade(90) === "A"`, to the suite in the playground and rerun. The real implementation still passes; the mutant fails. That is a kill, and the test that did it is precisely the boundary-probing test section 1.6 told you to write. Mutation testing is the enforcement arm of that advice: a suite that skips boundaries does not get politely warned, it gets caught.

## What Kills Mutants

Killing mutants is not about writing _more_ tests; the weak suite above could grow to fifty far-from-the-boundary cases and still kill nothing new. It is about tests that can tell a correct implementation from a specific plausible mistake:

- **Probe the boundaries.** Off-by-one mutants (`>=` to `>`, and friends) die only to inputs exactly at the edge.
- **One focused test per rule.** A validator enforcing seven rules needs at least seven tests, each violating exactly one rule against an otherwise-valid input. A test that violates three rules at once cannot tell you which rule is broken, and a mutant that drops one rule slips past it.
- **Assert the interesting properties.** Order preserved, input unmutated, empty case handled: each of these claims kills a family of mutants (in-place sorting, accidental mutation, missing base case) that result-only tests miss.
- **Vary the fixture.** If every test uses the same three-question quiz, a mutant that special-cases three-question quizzes survives. Deliberately awkward fixtures, like a quiz reusing an option ID across two questions, exist to catch scope bugs, and you saw in the last section how plausible those are.

## How the Course Runs It

Real mutation-testing tools, like [Stryker](https://stryker-mutator.io/), generate thousands of mutants mechanically. This course does something more curated: the instructors maintain, for each task that grades your tests, a set of hand-written mutants, each one a defect a reasonable student could actually ship. The boundary slip, the swapped `some`/`every`, the validator that only checks the first question, the trim that never happens, the uniqueness check at the wrong scope. Each mutant encodes a plausible bug, and your test suite's job is to catch it.

This is what `npm run mutation:check`, the seventh gate, has been waiting to do. Starting this epoch, it runs a **contract matrix** for E2.8:

1. **Your tests run against reference implementations,** known-correct versions of `isQuizWellFormed`. Every reference must pass. A test that fails correct code is a wrong test, and this half of the matrix catches it.
2. **Your tests run against the curated mutants.** Every mutant must be killed by at least one failing test.

Pass both halves and your suite has demonstrated something coverage never could: it accepts correct implementations and rejects plausible wrong ones. That pair of properties is called a **behavior contract**, and writing tests that hold up as one is a skill this course grades directly, here for the first time and repeatedly after this. The epoch 2 integration task also re-runs the matrix for `scoreBand` from epoch 1, now that your test-writing has caught up with it. And a word of fair warning from section 1.2: the graders hold additional hidden mutants. Write tests to kill the _category_ of defect, not the specific mutants you can see, and the hidden ones die too.

There is a deeper idea underneath, worth saying once this week and remembering all semester. Tests are code, and code can be wrong. Mutation testing is how tests get tested: not by reading them and nodding, but by checking their behavior against known-good and known-bad implementations, mechanically. When you meet "who reviews the reviewer?" problems for the rest of your career, and you will, this move (make the failure you fear, verify the alarm rings) is the standard answer.

## Your Turn

Chapter 2 ends here, which means epoch 2 begins.

Merge the `epoch-2` branch and open `curriculum/epoch-2.md`. Ten tasks, E2.1 through E2.10: six query functions you have been circling all chapter, one immutable rename, the well-formedness validator with its contract tests, the `QuestionBank` component, and the integration release. The loop ban is live, the array methods are the tool, and for the first time, your tests themselves are part of what gets graded.

Plan the sprint before you code, and log your estimates; the retrospective at the start of chapter 3 will want them.

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E2 (week 2)]

- **E2.8: isQuizWellFormed(quiz).** As an instructor, I need validation before learners can take a quiz.
- **E2.10: Epoch 2 integration and release.** As the intern team, we need a reliable functional-programming increment.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

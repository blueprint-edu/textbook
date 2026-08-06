---
title: "1.5 TypeScript"
sidebar_position: 5
---

**Topics:** Data types, Functions, Conditionals

## Learning Objectives

By the end of this section, you will be able to:

- Declare variables with explicit TypeScript type annotations.
- Write typed functions with parameters and return types.
- Use conditionals to control program flow.

## Why TypeScript

JavaScript is the language browsers run, and its whole execution model is based on the idea of, "If anything goes wrong, let's pretend that it doesn't." That is tolerable when you are putting a document on a screen. It is not tolerable when you are dealing with people's money, or health data, or grades. (Its name still has nothing to do with Java, by the way; that was marketing, cashing in on Java's popularity.)

**TypeScript** is JavaScript plus static types. The compiler checks, before anything runs, that you are using your data the way you said you would: no reading fields that do not exist, no passing a string where a number goes. When you break the rules, you get an error message at compile time instead of a wrong answer at runtime.

You may hate error messages, but you know what you hate even more? A secret bug that silently corrupts your biggest customer's data. Embrace the error message. Love the error message. This project's TypeScript configuration is set to maximum strictness, which means more error messages, which means more bugs caught while they are cheap.

You wrote TypeScript in your previous course, so this section is a refresher tuned to how we write it here.

## Types and Variables

The primitives you will touch constantly are `string`, `number`, and `boolean`. Declare variables with `const` and an explicit type annotation:

```ts live id=ch1-s5-basic-types title="Basic types" expect=pass
const quizTitle: string = "TypeScript Fundamentals";
const questionCount: number = 10;
const isPublished: boolean = false;
console.log(quizTitle, questionCount, isPublished);
```

Two house rules:

- **`const` by default.** Use `let` only when a variable genuinely needs reassignment, which is rarer than you think. A value that cannot be reassigned is a value you never have to hunt for.
- **Annotate boundaries.** Our lint rules require explicit types where code meets other code: function parameters, function return types, and exported values. Inside a function body, inference can do the work.

When the types disagree, the compiler says so. This example is deliberately wrong; read the error before you fix it:

```ts live id=ch1-s5-type-error title="Investigating a type error" expect=type-error errors=2322
const enrollment: number = "twenty";
console.log(enrollment);
```

## The Forbidden Type

TypeScript has an escape hatch called `any`, a type that turns the checker off for whatever it touches.

You will never be allowed to use it. Seriously: the linter is configured to reject `any` and every one of its accomplices (unchecked casts, `@ts-ignore`, non-null assertions), so code that uses them does not pass the definition of done, does not merge, and does not get graded kindly. `any` does not make type errors go away; it makes them wait for a user to find.

## Functions

Named functions get explicit parameter and return types. This one is a close cousin of `formatPoints`, the epoch 1 task whose acceptance criteria you saw in section 1.2 (writing the real one is your job, but it rhymes with this):

```ts live id=ch1-s5-function title="A typed function" expect=pass
function formatQuestions(count: number): string {
  if (count === 1) {
    return "1 question";
  }
  return `${count} questions`;
}

console.log(formatQuestions(1));
console.log(formatQuestions(7));
```

The return type is a promise the compiler enforces: every path out of this function produces a `string`, or the code does not compile. Our configuration also refuses functions with missing returns, so "I forgot the else branch" becomes a compile error instead of an `undefined` at runtime.

While we are here: TypeScript has two equality operators you will see, `==` (which you will never use) and `===` (which you will always use). The triple form checks value and type with no sneaky coercion. The linter, as usual, has an opinion, and it agrees with this paragraph.

## Conditionals

You know `if`, `else if`, and `else`. The shape worth practicing is a function that maps an input through ordered conditions to a result, because epoch 1 asks you to write one (`scoreBand`, which turns a percentage into a performance category). Here is the same shape wearing a different hat:

```ts live id=ch1-s5-letter-grade title="Ordered conditions" expect=pass console=open
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

console.log(letterGrade(91));
console.log(letterGrade(80));
console.log(letterGrade(20));
```

Two things in that example repay attention:

- **The union type.** `LetterGrade` is a type with exactly four allowed string values. Try returning `"A+"` from the function and watch the compiler refuse. Unions let the type system carry rules that would otherwise live in comments and hope.
- **Boundaries.** Is 80 a `"B"` or a `"C"`? The code answers precisely, and tests for functions like this always probe the edges: 90, 89.9, 80, 70, 0. Off-by-one boundary bugs are a whole genre, and you will meet their tests in section 1.6.

Predict, then run: what does `letterGrade(90)` return? Decide before you check.

## Coming Up

You can now write typed functions. The next section is about proving they work: Vitest, assertions, and the habit of treating tests as the most precise description of what your code does.

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E1 (week 1)]

- **E1.1: Define AnswerOption, Question, and Quiz.** As a developer, I need explicit domain contracts so every later function and component shares the same vocabulary.
- **E1.2: formatPoints(points).** As a learner, I need point values displayed consistently.
- **E1.3: percentage(earned, possible).** As a learner, I need a normalized percentage for score reporting.
- **E1.4: isPassingScore(earned, possible, threshold).** As a learner, I need to know whether a score meets the configured threshold.
- **E1.5: scoreBand(percentage).** As a learner, I need a human-readable performance category.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

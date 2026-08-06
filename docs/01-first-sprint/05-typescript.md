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

JavaScript is the language browsers run, and its whole execution model is based on the idea of, "If anything goes wrong, let's pretend that it doesn't." That is tolerable when you are putting a document on a screen. It is not tolerable when you are dealing with people's money, or health data, or grades.

:::tip

JavaScript's name has nothing to do with Java, by the way; that was marketing, cashing in on Java's popularity.
:::

**TypeScript** is JavaScript plus static types. The compiler checks, before anything runs, that you are using your data the way you said you would: no reading fields that do not exist, no passing a string where a number goes. When you break the rules, you get an error message at compile time instead of a wrong answer at runtime.

You may hate error messages, but you know what you hate even more? A secret bug that silently corrupts your biggest customer's data. Embrace the error message. Love the error message.

You should have written TypeScript before this course, so this section is a refresher tuned to how we write it here. If you aren't familiar with TypeScript, you should probably go read a longer introduction.

## Basic Data

Let's start with looking at the basics of types, values, variables, and operators in TypeScript.

### Logging

In TypeScript, you can use `console.log` to output values for debugging purposes. This works the same way as in JavaScript. Here is a simple example:

```ts live id=ch1-s5-logging title="Logging values" expect=pass  console=open
console.log("Hello, TypeScript!");
```

### Types and Values

Here are the basic types:

- `number`: Includes integers and decimals. Implemented as 64-bit floating point numbers.
- `boolean`: Either `true` or `false` (which are global builtin constants).
- `string`: You can use 'single quotes' or "double quotes". There are also backticks ` for multi-line strings (and a lot more).

```ts live id=ch1-s5-types title="Basic types overview" expect=pass  console=open
// Numbers
console.log(49);
console.log(300.9122);
console.log(0);

// Boolean
console.log(true);
console.log(false);

// Strings
console.log("Hello there");
console.log("Guess what?\nSpecial characters exist!");
console.log(`Backticks
allow multiple lines!`);
```

There's also several special values:

- `null`: A special value used to indicate something is "unknown".
- `undefined`: Another special value used to indicate a value is not yet set.
- `NaN`: Short for "Not a Number". Except if you typecheck it, it is counted as a number. The idea is that it is produced when you do math with numbers that is invalid. Basically, if you see it in your code, things have gone badly.

#### Operators

Numeric operations are normal, but are always using floating point math.

```ts live id=ch1-s5-operators title="Numeric operators" expect=pass  console=open
console.log("3+4 is", 3 + 4);
console.log("9/3 is", 9 / 3);
console.log("4/0 is", 4 / 0);
console.log("0/0 is", 0 / 0);
console.log("2.1*4.7 is", 2.1 * 4.7);
// Remember modulo? Clock arithematic? Remainder? Whatever you want to call it.
console.log("18 % 12 is", 18 % 12);
```

Booleans use &&, ||, and !

```ts live id=ch1-s5-boolean-operators title="Boolean operators" expect=pass  console=open
console.log("This produces false:", true && false);
console.log("This produces true:", true || false);
```

Strings use `+` and let you do indexing. Strings have a bunch of useful methods that you can call. You'll need to learn more about them organically.

#### Types and Variables

You can declare variables using three keywords: `const`, `let`, and `var`. In this course, we will primarily use `const` and `let`. If you see `var`, think of it as being like `let` and avoid it in new code.

Declare variables that do not change with `const` and an explicit type annotation:

```ts live id=ch1-s5-basic-types title="Basic types" expect=pass  console=open
const quizTitle: string = "TypeScript Fundamentals";
const questionCount: number = 10;
const isPublished: boolean = false;

console.log(quizTitle, questionCount, isPublished);
```

If a variable needs to be reassigned, use `let` with an explicit type annotation instead of `const`.

```ts live id=ch1-s5-let title="Using let for reassignment" expect=pass console=open
let currentScore: number = 0;
console.log("Original value:", currentScore);

currentScore = 10;
console.log("New value:", currentScore);
```

Two house rules:

- **`const` by default.** Use `let` only when a variable genuinely needs reassignment, which is rarer than you think. A value that cannot be reassigned is a value you never have to hunt for.
- **Annotate boundaries.** Our lint rules require explicit types where code meets other code: function parameters, function return types, and exported values. Inside a function body, inference can do the work.

The example below shows how you don't always have to provide an explicit type annotation for every variable; TypeScript can often infer the type from the assigned value. Hover over the variables to see their types; you will notice that they are actually inferred as their _literal values_ instead of the more general `string`, `number`, or `boolean` types.

```ts live id=ch1-s5-inference title="Type inference" expect=pass  console=open
const inferredString = "I am inferred as a string value";
const inferredNumber = 42;
const inferredBoolean = true;

console.log(inferredString, inferredNumber, inferredBoolean);
```

When the types disagree, the compiler says so. This example is deliberately wrong; read the error before you fix it:

```ts live id=ch1-s5-type-error title="Investigating a type error" expect=type-error errors=2322  console=open
const enrollment: number = "twenty";
console.log(enrollment);
```

If you hover over the `enrollment` variable, you will see a message like:

```text
Type 'string' is not assignable to type 'number'.(2322)
```

It is critical to actually read error messages like this and think about what they are saying.

### The Forbidden Type

TypeScript has an escape hatch called `any`, a type that turns the checker off for whatever it touches.

**YOU ARE NOT ALLOWED TO USE THE `any` TYPE IN THIS COURSE.** If we catch you doing so, we will reject your submission at best and fail you at worst, depending on how many times you try it.

Seriously: the linter is configured to reject `any` and every one of its accomplices (unchecked casts, `@ts-ignore`, non-null assertions), so code that uses them does not pass the definition of done, does not merge, and does not get graded kindly. `any` does not make type errors go away; it makes them wait for a user to find.

:::danger

Don't you dare use the `any` type in your code.
:::

### Type Unions

A type union allows a variable to hold one of several types or values. For example, a variable could be either a `string` or `number`:

```ts live id=ch1-s5-type-union title="Type union" expect=pass  console=open
let value: string | number;

value = "Hello";
console.log(value);

value = 42;
console.log(value);
```

Much more useful is a type union that covers a subset of specific values from a type. You can give special names to these subsets using type aliases. For example:

```ts live id=ch1-s5-type-alias title="Type alias with union" expect=pass  console=open
type LetterGrade = "A" | "B" | "C" | "D" | "F";

let grade: LetterGrade;
grade = "A";
console.log(grade);

grade = "F";
console.log(grade);
```

This prevents an error where someone tries to assign a value to `grade` that is not one of the allowed letter grades.

```ts live id=ch1-s5-type-alias-error title="Type alias with union error" expect=type-error errors=2322  console=open
type LetterGrade = "A" | "B" | "C" | "D" | "F";

let grade: LetterGrade;
grade = "E"; // This should produce a type error
console.log(grade);
```

### String Interpolation

A cool feature in modern JavaScript is that we can embed variables and expressions into string literals when we use backticks.

```ts live id=ch1-s5-string-interpolation title="String interpolation" expect=pass  console=open
let name: string = "Dr. Bart";
let pets: number = 6;

let message: string = `${name} has ${pets} pets. He would like ${pets + 1} pets though!`;

console.log(message);
```

## Functions

Remember the vocabulary you have seen in previous courses:

- Define: To specify what a function does
- Call: To activate a function
- Parameters: The formal names of the values passed to a function
- Arguments: The actual values passed to a function

### Function Calls

You call functions with the name of the function and parentheses. You can have any number of arguments.

```ts live id=ch1-s5-function-call title="Function call" expect=pass  console=open
// Function name is `console.log`
// 3 arguments
console.log(19, "Hello World", true);
```

### Defining Functions

There are two main ways to define functions in TypeScript: using the `function` declaration and arrow (`=>`) functions. Both are called the same way, with the name of the function, parentheses, and the arguments.

```ts live id=ch1-s5-function-declaration title="Function declaration" expect=pass  console=open
// Function declaration
function add(first: number, second: number): number {
  return first + second;
}

// Arrow Function
const subtract = (first: number, second: number): number => {
  return first - second;
};

// Both are called the exact same way:
console.log(add(1, 3));
console.log(subtract(9, 3));
```

With the lambda syntax, you actually don't even need the curly braces and `return` IF the body of the function is just a single expression:

```ts live id=ch1-s5-arrow-syntax title="Arrow function shorthand" expect=pass console=open
const subtract = (first: number, second: number): number => first - second;

// Still works the same way
console.log(subtract(9, 3));
```

### Exporting Functions

To make functions available in other files, you need to use the `export` keyword:

```ts
export const multiply = (first: number, second: number): number => {
  return first * second;
};

console.log(multiply(3, 4));
```

This won't do anything interesting here, but if were in Visual Studio Code you'd now be able to use the `multiply` function in other files. Nifty!

### Annotations

Annotations are how you tell TypeScript what type a variable, parameter, or return value should have. They are optional in many cases because TypeScript can infer types, but we are requiring them for this course to ensure clarity and consistency.

If you have a function that doesn't return anything, you should annotate it with the `void` return type. For example:

```ts live id=ch1-s5-void-function title="Void function" expect=pass  console=open
export const sayHello = (name: string): void => {
  console.log("Hello", name);
};

sayHello();

console.log(sayHello());
```

What happens when you log the result of calling a `void` function? The function MUST return a value, so it returns `undefined` by default. Depending on how you log it, it might appear as an empty string or the word `undefined`. Importantly, `console.log` is NOT the same thing as `return`.

### Function Types

Function names are just variables holding a value of type function.

FUNCTIONS ARE A TYPE OF DATA.

:::tip

No seriously, functions are just another type of data.

:::

This is often uncomfortable for people new to "functional programming", but it's one of the most powerful ideas in all of computing. Functions are a first-class type of data and can be assigned to variables. That's literally what is happening when you use arrow expressions.

However, it's not enough to say that a variable is of type "function", since you need to specify its arity, parameter types, and return type:

- **Arity**: The number of parameters a function takes.
- **Parameter types**: The types of each parameter a function accepts.
- **Return type**: The type of value a function returns.

The syntax for this looks a lot like the syntax for defining a function itself, but written as a type annotation. For example:

```ts live id=ch1-s5-function-type title="Function type" expect=pass  console=open
let myOperation: (first: number, second: number) => number;

myOperation = (first: number, second: number): number => first + second;
console.log(myOperation(2, 3));

myOperation = (first: number, second: number): number => first * second;
console.log(myOperation(2, 3));
```

Hover over the `myOperation` variable in your editor to see its type. It should show `(first: number, second: number) => number`. This may seem like a lot of gibberish the first time you see it; you need to carefully parse through each piece of the type to make sure you fully understand what you are seeing.

## Conditionals

TypeScript has a few different ways of handling conditionals, including `if` statements, the ternary operator, and logical operators.

### Equality

There are two equality operators in JavaScript. There's the double equal operator (which you will never use) and the triple equal operator (which you will always use). Along with the `!==` equal operator ("not equal equal"), you can check for equality.

```ts live id=ch1-s5-equality title="Equality operators" expect=pass  console=open
console.log(1 + 1 === 2);
console.log("Hello" + "World" === "HelloWorld");
console.log(1 + 3 !== "4");
```

Okay there is actually a case where you MIGHT choose to use the double equal operator (`==`) or the not equal operator (`!=`) , but we're gonna skip over it for now. Just assume you won't use it.

You will basically never use `==` or `!=`. You will only ever use `===` and `!==`.

### Logical Operators

You have all the classics: `<` , `>`, `<=`, and `>=`.

You have the `!` (not).

You have `&&` (and) and `||` (or).

### Truthiness

Like Python, JavaScript has Truthiness. Any value can be evaluated in a conditional context as either Truthy or Falsy. The rules are different than in Python.

You can read more here: [https://developer.mozilla.org/en-US/docs/Glossary/Truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)

### `if` Statements

The most common and straightforward approach is using `if`, `else if`, and `else` blocks.

```ts live id=ch1-s5-if-else title="If, else if, else" expect=pass  console=open
let age: number = 29;

if (age >= 21) {
  console.log("Can drink");
} else if (age >= 18) {
  console.log("Getting closer");
} else {
  console.log("Cannot drink");
}
```

:::danger

You actually won't use `if` statements as much, because there are often more concise ways to express conditional logic, such as the ternary operator or logical operators.

:::

### Ternary `? :` Operator

The ternary operator is a concise way to write simple `if-else` statements. It has the form:

```ts
condition ? expressionIfTrue : expressionIfFalse;
```

For example:

```ts live id=ch1-s5-ternary title="Ternary operator" expect=pass  console=open
let age: number = 29;
console.log(age >= 21 ? "Can drink" : "Cannot drink");
```

You can actually even nest the operator:

```ts live id=ch1-s5-nested-ternary title="Nested ternary operator" expect=pass  console=open
let age: number = 29;
console.log(age >= 21 ? (age >= 65 ? "Senior can drink" : "Can drink") : "Cannot drink");
```

## Examples

Let's run through some quick examples of these concepts in action.

### Ordered Conditions

Here is an example that maps a percentage to a letter grade.

```ts live id=ch1-s5-letter-grade title="Ordered conditions" expect=pass  console=open
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

### Question Formatting

Here's a slightly more complicated function that looks like one you will need for the first set of tasks.

```ts live id=ch1-s5-function title="A typed function" expect=pass  console=open
function formatQuestions(count: number): string {
  if (count === 1) {
    return "1 question";
  }
  return `${count} questions`;
}

console.log(formatQuestions(1));
console.log(formatQuestions(7));
```

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

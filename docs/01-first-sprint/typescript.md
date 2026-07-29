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

## Introduction

TypeScript adds a type system to JavaScript, catching errors before your code runs. In this section, you'll learn the fundamental building blocks: types, variables, functions, and conditionals.

## Code Examples

The interactive examples below demonstrate key TypeScript concepts.
Edit the code and press **Run** to see the output.

```ts live id=ch1-s5-basic-types title="Basic types" expect=pass
const courseName: string = "Software Engineering";
const studentCount: number = 30;
const isActive: boolean = true;
console.log(courseName, studentCount, isActive);
```

```ts live id=ch1-s5-function title="Typed function" expect=pass
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("Ada"));
```

```ts live id=ch1-s5-type-error title="Investigating a type error" expect=type-error errors=2322
// This assignment is intentionally wrong to demonstrate TypeScript's type checker.
const enrollment: number = "twenty";
console.log(enrollment);
```

:::info Content forthcoming

Full content for this section is under active development. Check back soon.

:::

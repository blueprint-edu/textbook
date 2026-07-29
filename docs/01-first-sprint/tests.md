---
title: "1.6 Tests"
sidebar_position: 6
---

**Topics:** Jest, Assertions

## Learning Objectives

By the end of this section, you will be able to:

- Write a basic Jest test with describe/it/expect.
- Use common Jest matchers like toBe, toEqual, and toThrow.
- Explain what makes a good unit test.

## Introduction

Testing is how we build confidence that our code works correctly. With Jest, you can write concise, readable tests that verify your functions behave as expected.

## Code Examples

```ts live id=ch1-s6-assertion title="Basic assertion" expect=pass
// Jest-style assertion (demonstration only — run in test environment)
function add(a: number, b: number): number {
  return a + b;
}

const result = add(2, 3);
console.log("2 + 3 =", result);
console.log("Test passed:", result === 5);
```

:::info Content forthcoming

Full content for this section is under active development. Check back soon.

:::

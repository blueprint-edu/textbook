---
title: "2.3 Higher-Order Functions"
sidebar_position: 3
---

**Topics:** onClick handlers, Functions as values, Testing interactivity

## Learning Objectives

By the end of this section, you will be able to:

- Pass functions as arguments to other functions.
- Use onClick and other event handlers in React.
- Test interactive components with React Testing Library.

## Introduction

Functions that accept or return other functions are called higher-order functions. They're fundamental to React event handling and to many patterns in functional programming.

## Code Examples

```ts live id=ch2-s3-hof title="Higher-order function" expect=pass
function applyTwice(f: (n: number) => number, x: number): number {
  return f(f(x));
}

const double = (n: number) => n * 2;
console.log(applyTwice(double, 3)); // 12
```

:::info Content forthcoming

Full content for this section is under active development. Check back soon.

:::

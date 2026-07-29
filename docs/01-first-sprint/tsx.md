---
title: "1.8 TSX"
sidebar_position: 8
---

**Topics:** HTML structure in TSX, CSS and styling, Testing React components

## Learning Objectives

By the end of this section, you will be able to:

- Write a React component using TSX syntax.
- Apply CSS to a React component.
- Write a basic test for a React component with React Testing Library.

## Introduction

TSX allows you to write HTML-like syntax directly in TypeScript files. Combined with React, it's the standard way to build interactive user interfaces in modern web development.

## Code Examples

```tsx live id=ch1-s8-greeting title="A React component" expect=pass
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  console.log(`Rendering greeting for ${name}`);
  return <h2>Hello, {name}!</h2>;
}

export default function App() {
  return <Greeting name="Ada" />;
}
```

:::info Content forthcoming

Full content for this section is under active development. Check back soon.

:::

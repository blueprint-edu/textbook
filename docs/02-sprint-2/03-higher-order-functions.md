---
title: "2.3 Higher-Order Functions"
sidebar_position: 3
---

**Topics:** Functions as values, onClick handlers, Testing interactivity

## Learning Objectives

By the end of this section, you will be able to:

- Store functions in variables and pass them as arguments.
- Write arrow functions with typed parameters.
- Attach an onClick handler to a button and pass handlers to components as props.
- Test a click with React Testing Library and a spy function.

## Functions Are Values

Here is the idea this whole epoch stands on: in TypeScript, a function is a value, the same way `42` and `"hello"` are values. It can be stored in a variable, passed as an argument, returned from another function, and described by a type.

```ts live id=ch2-s3-function-value title="A function in a variable" expect=pass console=open
function shout(message: string): string {
  return message.toUpperCase() + "!";
}

const announce: (message: string) => string = shout;

console.log(announce("tests are passing"));
```

Read the type annotation on `announce` carefully: `(message: string) => string` means "a function that takes a string and returns a string." That is a type like any other, and the compiler enforces it like any other; try assigning `shout` to a variable typed `(n: number) => string` and watch it refuse.

A **higher-order function** is a function that takes a function as an argument, or returns one. The name sounds ceremonial. The idea is not:

```ts live id=ch2-s3-hof title="A higher-order function" expect=pass console=open
function applyTwice(f: (n: number) => number, x: number): number {
  return f(f(x));
}

function double(n: number): number {
  return n * 2;
}

console.log(applyTwice(double, 3));
```

`applyTwice` knows _when_ to call its function and _what_ to do with the result, but it has no idea what the function does. The caller supplies the behavior. That split, one function providing the skeleton and another providing the behavior, is the pattern behind every array method in the next section and every event handler your components will ever have.

## Arrow Functions

Writing a full named function every time you need to hand behavior to something gets old fast. An **arrow function** is a compact expression form:

```ts live id=ch2-s3-arrows title="Arrow functions" expect=pass console=open
const triple = (n: number): number => n * 3;

const isLong = (word: string): boolean => word.length > 8;

console.log(triple(7));
console.log(isLong("refactoring"));
```

The single-expression body needs no braces and no `return`; the expression's value is the return value. Arrows shine exactly where higher-order functions want them, inline at the call site:

```ts live id=ch2-s3-inline-arrow title="Behavior supplied inline" expect=pass console=open
function applyTwice(f: (n: number) => number, x: number): number {
  return f(f(x));
}

console.log(applyTwice((n) => n + 10, 0));
console.log(applyTwice((n) => n * n, 3));
```

Note the parameter `n` has no annotation in those inline arrows. The compiler infers it from `applyTwice`'s signature, and the house style accepts that: inline arrows whose types are pinned down by context can lean on inference. Named, exported functions still annotate everything.

## onClick: Handing Behavior to the Browser

Now the payoff. A button does not know what clicking it should mean; you tell it by handing it a function. In TSX, that is the `onClick` prop:

```tsx live id=ch2-s3-onclick title="A button with a handler" expect=pass run=manual console=open
export default function App() {
  const handleClick = (): void => {
    console.log("Recorded at " + new Date().toLocaleTimeString());
  };

  return (
    <main>
      <button onClick={handleClick}>Record a practice event</button>
    </main>
  );
}
```

Click the button a few times with the console open. Two details deserve a close look:

- **`onClick={handleClick}`, not `onClick={handleClick()}`.** You are passing the function itself, to be called later, on click. With the parentheses you would be calling it now, once, during rendering, and passing its return value (`undefined`) as the handler. This mistake is extremely common; when a handler "fires immediately" or "does nothing," check for stray parentheses first.
- **The handler is a value crossing a boundary.** Your component hands a function to React; React hands back control when the user acts. This is the same split as `applyTwice`: one side decides when to call the function, the other decides what it does.

Components can play the same game with each other. A parent passes a function as a prop, and the child calls it when something happens inside:

```tsx live id=ch2-s3-callback-prop title="A handler as a prop" expect=pass run=manual console=open
interface SkillButtonProps {
  skill: string;
  onPick: (skill: string) => void;
}

function SkillButton({ skill, onPick }: SkillButtonProps) {
  return <button onClick={() => onPick(skill)}>{skill}</button>;
}

export default function App() {
  const report = (skill: string): void => {
    console.log("Picked: " + skill);
  };

  return (
    <main>
      <SkillButton skill="arrays" onPick={report} />
      <SkillButton skill="objects" onPick={report} />
    </main>
  );
}
```

`SkillButton` decides _when_ to call `onPick` (on click) and _with what_ (its own skill); the parent decides what picking means. The return type `void` in the prop's annotation says "called for its effect, no return value expected." This parent-supplies-the-meaning pattern is the backbone of chapter 3, where components start holding state and telling each other about changes.

One honest caveat about this week: epoch 2's component, `QuestionBank`, is deliberately _not_ interactive. It receives a selected skill as a plain prop and renders accordingly; nothing in it handles a click. That is on purpose. This epoch is about computing the right data; making the interface drive those computations is epoch 3's whole job, and it will use exactly the handler patterns you saw here.

## Testing a Click

If a component takes a handler, a test can pass one in and check that it gets called correctly. React Testing Library provides `userEvent` to simulate the user, and Vitest provides `vi.fn()`, a **spy**: a recordable fake function that remembers every call made to it.

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SkillButton } from "../src/components/SkillButton";

describe("SkillButton", () => {
  it("reports its skill when clicked", async () => {
    const onPick = vi.fn();
    render(<SkillButton skill="arrays" onPick={onPick} />);

    await userEvent.click(screen.getByRole("button", { name: "arrays" }));

    expect(onPick).toHaveBeenCalledWith("arrays");
  });
});
```

The shape to internalize: render with a spy, act like a user, assert about the calls. Note the `await`; user events are asynchronous, and forgetting the `await` produces tests that pass before the click lands. Chapter 3 turns this pattern into a daily tool; this is your first sighting, not your last.

## Coming Up

You can now hand behavior to a function. The next section is where that pays off hardest: the array methods, `map`, `filter`, `find`, and `reduce`, which run your functions over whole collections and power six of this epoch's ten tasks.

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E2 (week 2)]

- **E2.9: QuestionBank component.** As an instructor, I need to view a filtered question bank and skill summary.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

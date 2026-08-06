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

## HTML, Briefly

A web page is a tree of **HTML elements**: headings (`h1` through `h6`), paragraphs (`p`), lists (`ul`, `ol`, `li`), buttons, links, images, and dozens more. Two structural facts matter for everything you build this semester:

- **Elements nest.** A list contains list items; a `section` contains a heading and paragraphs. The browser turns the whole document into a tree (the DOM) and renders it.
- **Elements mean things.** A `button` is not a styled box; it is a control the browser makes keyboard-operable and announces to screen readers. `header`, `main`, `section`, and `article` describe a page's structure to software, not to eyes.

That second fact is called **semantic HTML**: use the element that says what the thing _is_, and reach for a meaning-free `div` only when nothing meaningful fits. The work sample's tests find elements by their meaning ("the button named Submit", "the heading"), so unsemantic markup does more than offend taste here; it fails.

Let's look at a simple example:

```tsx live id=ch1-s8-html title="Basic HTML structure" expect=pass
export default function App() {
  return (
    <main>
      <h1>Welcome to the Quiz App</h1>
      <p>This is a simple example of HTML structure in TSX.</p>
    </main>
  );
}
```

## CSS, Briefly

CSS styles the tree with rules: selectors that pick elements, and declarations that set their appearance. You will mostly select by **class** using a period in front of the **CSS selector**:

```css
.question-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
}
```

Any element with `className="question-card"` gets the border and padding. The work sample keeps its styles in a plain CSS file that the application imports, and classes are the bridge between markup and styling.

A decision we made on purpose: **this course uses no UI component kit.** No Bootstrap, no Material. Kits are fine tools you may use later, but they wrap exactly the two skills you are here to build, semantic markup and honest CSS, in a box you cannot see into. Everything you style, you style yourself. The reference designs are deliberately modest, and nobody is grading your color taste.

## TSX: Markup Inside TypeScript

TSX is TypeScript extended so that markup is an expression. A **component** is a function that returns markup, and files containing TSX use the `.tsx` extension. Here is the house style, matching how every component in the work sample is written:

```tsx live id=ch1-s8-greeting title="A component in the house style" expect=pass
interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <h2>Hello, {name}!</h2>;
}

export default function App() {
  return (
    <main>
      <Greeting name="Ada" />
      <Greeting name="Pumpkin" />
    </main>
  );
}
```

The pieces, one at a time:

- **A props interface.** `GreetingProps` declares exactly what data the component accepts, and the compiler holds every caller to it. Try passing `name={42}` and see. We'll talk more about this in a later chapter.
- **A named function** that destructures its props in the parameter list. Component names are capitalized; that is how TSX tells `<Greeting />` from `<h2>`. Again, we'll come back to this weird syntax.
- **Curly braces embed expressions.** `{name}` drops a TypeScript value into the markup. Anything that produces a value works: `{formatQuestions(3)}`, `{count + 1}`.
- **Components compose like elements.** `App` uses `Greeting` twice with different props, the same way it would use any HTML element.

## Rendering a List

In epoch 1, you will sometimes need to render arrays of data with `map`. We haven't taught you these in detail yet, but let's take a look anyway.

```tsx live id=ch1-s8-option-list title="Data to markup" expect=pass
interface AnswerOption {
  id: string;
  label: string;
}

interface OptionListProps {
  options: AnswerOption[];
}

function OptionList({ options }: OptionListProps) {
  return (
    <ul>
      {options.map((option) => (
        <li key={option.id}>{option.label}</li>
      ))}
    </ul>
  );
}

export default function App() {
  const options: AnswerOption[] = [
    { id: "a", label: "A stack" },
    { id: "b", label: "A queue" },
    { id: "c", label: "A tree" },
  ];
  return (
    <section>
      <h2>Which structure is the DOM?</h2>
      <OptionList options={options} />
    </section>
  );
}
```

Most of this probably doesn't make sense yet, but we wanted to show you what more authentic code is going to look like. You'll probably need to copy and paste this for now, and make small tweaks. Epoch 1's components render quiz questions and options exactly this way.

## Testing Components

Components are functions, so they can be tested like functions: render one, then assert about what a user would find on the page. The work sample uses [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) with Vitest:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Greeting } from "../src/components/Greeting";

describe("Greeting", () => {
  it("greets the named person with a heading", () => {
    render(<Greeting name="Ada" />);
    expect(screen.getByRole("heading", { name: "Hello, Ada!" })).toBeInTheDocument();
  });
});
```

Look at the query: `getByRole("heading", ...)`. The test finds the element the way assistive technology would, by role and accessible name, not by class name or DOM position. This is the course's standard query style, and it quietly enforces the semantic HTML rule: if your markup has no real heading, the test cannot find one. Epoch 1's public tests query your components exactly like this, and chapter 3 makes component testing a first-class topic once your components become interactive.

## Coming Up

You now have every technical ingredient of epoch 1: types, functions, tests, the quality gate, and components to render it all. The last section of this chapter covers how work actually lands: the pull request, and the humans on the other side of it.

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E1 (week 1)]

- **E1.6: QuizHeader component.** As an instructor, I need the quiz identity and summary visible.
- **E1.7: QuestionPrompt component.** As a learner, I need a clear prompt, point value, and optional skill label.
- **E1.8: OptionPreview component.** As an instructor, I need to preview an answer option and its correctness indicator.
- **E1.9: QuizOverview component and CSS.** As an instructor, I need a readable static preview of the entire quiz.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

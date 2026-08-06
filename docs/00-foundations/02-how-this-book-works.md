---
title: "0.2 How Does This Book Work?"
sidebar_position: 2
---

**Topics:** How to use this textbook, Learning with AI tools responsibly

## Learning Objectives

By the end of this section, you will be able to:

- Navigate the textbook's chapter and section structure.
- Run interactive code examples directly in the browser.
- Describe responsible and effective use of AI coding assistants.

## What This Book Teaches

This irreverent, sloppy, but interactive textbook wants to teach you how to make web applications using TypeScript and React Hooks. This version is the second edition. We updated the book with modern React idioms and stricter tooling, and added more details about Software Engineering itself: requirements, teamwork, testing culture, careers, and the lifecycle that surrounds the code.

Give the book a chance, please.

## The shape of the course

The first half of the book runs on a weekly rhythm, and each chapter is paired with one epoch of your work sample project:

| Chapter | You learn                                                           | Your epoch                                        |
| ------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| 1       | The job, the tools, TypeScript, tests, and the definition of done   | Epoch 1: domain types and pure functions          |
| 2       | Branches, higher-order functions, arrays, objects, mutation testing | Epoch 2: quiz queries and transformations         |
| 3       | User research, wireframing, components, state, testing UIs          | Epoch 3: the first interactive interface          |
| 4       | Passing and nesting state, aliases, deep copies, coverage           | Epoch 4: editing and immutable updates            |
| 5       | Deep state, usability testing, interviews, cover letters            | Epoch 5: scoring, analytics, and the review queue |

Read the chapter and do the assignments. Each chapter ends by pointing you at that week's epoch tasks, and the sections themselves list the tasks they prepare you for, so you always know why you are reading what you are reading.

Chapter 6 prepares you for the midterm interview. Chapters 7 and 8 carry you into the second half of the course, where you join a team and build a project across three sprints. Chapter 9 covers agentic engineering, the practice of working with AI systems that write code, which is best learned after you can evaluate code yourself.

## The story you are in

Starting in chapter 1, you will apply for a job at **NotEvilEduTools LLC**, the (fictional) educational technology company behind the (fictional) quiz platform **Quizzer**. Your five-week work sample is their evaluation process; if you pass, then you enter the second half of the course as an employee on one of their teams. The company is fake, but everything they asks you to build is a genuine exercise in the skills this book teaches, and the application you finish will be deployed and working.

## Interactive examples

Most concepts in this book have runnable examples. The code below is live: edit it and press the Run triangle in the top-right corner.

```ts live id=ch0-s2-try-editing title="Edit this code and run it" expect=pass console=open
const greeting: string = "Hello from chapter 0";

console.log(greeting);

console.log("Change the text above and run this again.");
```

Try to develop these two habits:

1. **Predict before you run**: decide what you expect the output to be, then check. Being wrong in a prediction is one of the fastest ways to find and fix a broken mental model.
2. **Break things on purpose**: Change a value, remove a line, misspell a name, and watch what the error message says. You are going to spend your career reading error messages.

## AI Can Prevent Learning

You have access to AI assistants that can write TypeScript faster than you can. You will eventually learn how to use them. But you should consider what your learning goals are, and whether you can achieve those goals with an assistant doing the work for you.

**We recommend disabling AI autocomplete in your IDE for the first five weeks of the course.** You will be writing code that is evaluated in a midterm interview, and you need to be able to do that work yourself. You will also be writing code that is evaluated by your peers, and you need to be able to explain your own work.

An assistant producing your solution does not build understanding in your brain. This matters in this course for a blunt structural reason: **the midterm interview is conducted on paper, in person, and you must pass it to pass the course.** If you are using an assistant to do your work sample, you will not be able to answer the questions in the interview. You will fail the course.

## Learning with AI

Used well, an assistant is a patient tutor. Some uses that genuinely help:

- Ask it to explain an error message, a concept, or a piece of code you did not write, and then check its explanation against the documentation.
- Ask it to quiz you, or to generate practice problems slightly different from the ones you have seen.
- After you have solved something yourself, ask it to review your solution and suggest improvements, then evaluate whether you agree.

## Confidently Wrong

Remember that assistants are confidently wrong, especially about fast-moving ecosystems like React. Stay vigilant.

This textbook isn't immune to being wrong either. If you find a mistake, please report it in the [`textbook` repository's issue tracker](https://github.com/blueprint-edu/textbook/issues).

## What you need

You need:

- Knowledge about Typescript (from your previous courses),
- a computer you can install software on, and
- a GitHub account.

## Coming Up Next

Chapter 1 walks through the full environment setup, and then the company would like a word with you about your application.

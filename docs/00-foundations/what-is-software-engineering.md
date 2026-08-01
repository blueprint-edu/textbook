---
title: "0.1 What Is Software Engineering?"
sidebar_position: 1
---

**Topics:** Software engineering vs. programming, What coding/programming is, The scope of a software engineer's work

## Learning Objectives

By the end of this section, you will be able to:

- Distinguish between coding, programming, and software engineering.
- Describe the activities that software engineers perform beyond writing code.
- Explain why engineering practices like testing and collaboration matter.

## What is programming?

Programming is writing instructions that a computer will execute. The instructions manipulate data: numbers, text, lists, records, and structures built out of all of those. A program takes data in, transforms it, and produces data out, whether the output is a number printed to a console or a button appearing on a screen.

People sometimes use "coding" for the narrow act of typing the instructions and "programming" for the broader activity of figuring out what instructions to write. But in practice, what matters is what both words leave out: everything that happens around the code.

## Programming versus software engineering

If programming is making the computer do something, software engineering is making software that keeps working: over time, for real users, in the hands of a team. [Titus Winters](https://abseil.io/resources/swe-book) described software engineering as "programming integrated over time" (as in, repeated over time), and that framing holds up remarkably well.

Consider the differences between a homework assignment and a real product.

- A homework program runs **once**, for you, tonight. A product runs for **years**, for people you will never meet, long after you have forgotten how it works.
- A homework program is written by **one** person who holds the whole design in their head. A product is written by a **team**, and no single person holds all of it.
- When a homework program fails, you lose **points**. When a product fails, people lose **money, health records, or (worst of all) student grades**.

None of the practices in this book exist because programming is hard in the puzzle-solving sense. They exist because time, teammates, and stakes turn correct-tonight code into wrong-next-month code, and engineers need defenses against that decay.

## What software engineers actually do

Writing new code is a surprisingly small fraction of a software engineer's week. The rest of the job looks like this:

- **Understanding the problem.** Talking to users and stakeholders, writing requirements, and negotiating what the software should do before anyone builds it.
- **Designing.** Deciding how to structure data and split up responsibilities so the system can grow without collapsing.
- **Reading code.** Engineers read far more code than they write: their teammates' code in reviews, their own code from six months ago, and library code that behaves in surprising ways.
- **Verifying.** Writing tests, running checkers, and reviewing each other's work. A professional team does not ask "does it work?" and accept a shrug; it asks for evidence.
- **Delivering and maintaining.** Building, deploying, monitoring, and then changing the software as the world changes underneath it. Most of the cost of software is paid after version one ships.

If that list sounds like it involves a lot of communication, good! Software engineering is a deeply social discipline that happens to involve a compiler.

## Why the practices matter

Throughout this book you will meet practices that can feel like bureaucracy on day one:

- version control rituals,
- linters that reject working code,
- tests you must write for functions you are sure are correct,
- agile ceremonies you must perform, and
- reviews you must wait for before merging.

Each one is a defense that came from a past failure. Every practice converts a late, expensive surprise into an early, cheap annoyance. You want to "shift errors to the left" (earlier in the timeline). A type error at compile time is an annoyance; the same mistake discovered by a customer costs money. A failing test on your laptop is an annoyance; the same defect in production costs you your weekend. Engineers accept small frictions on purpose, because they have seen the alternative.

You do not have to take this on faith. The course is arranged so that the practices pay off in front of you, on a project big enough for shortcuts to hurt. I mean, as best we could. It's impossible to make a course exactly like the real thing.

## Where this course fits

By now, you should have written code with classes, objects, and tests. This course is about the engineering around the programming, and it is organized the way working engineers organize their time.

For the first five weeks, you will be working on a quiz application called Quizzer. This won't be a real product, of course, but you should still learn a lot building it. The goal is to model what software engineers do in the real world, while also evaluating your ability to complete tasks.

After the work sample comes an interview, where we will assess what you have learned. If you pass the interview, then you will join a team and build something larger together: with sprints, standups, reviews, and retrospectives.

## Coming Up

The next section explains how the book itself works, including the interactive examples and the role of AI tools in your learning.

---
title: "1.4 Agile"
sidebar_position: 4
---

**Topics:** Sprints and sprint events, Project boards and issues

## Learning Objectives

By the end of this section, you will be able to:

- Explain the purpose of a sprint in agile development.
- Identify the key events in a sprint cycle.
- Use a project board to manage tasks as GitHub issues.

## The Problem Agile Answers

Back in the day, people used to follow a model named **waterfall** that ran in one long pass: gather all the requirements, design the whole system, build it, test it, ship it. For most software it has a fatal flaw: the plan is finished at the moment you know the least. Requirements turn out to be wrong, users want something different from what they said, and the world changes while you are building. Waterfall discovers all of this at the end, when it is most expensive.

**Agile** is a family of practices built on the opposite bet: plan a little, build a working slice, show it to people, learn, and repeat. You will be wrong either way; agile arranges to be wrong early and cheaply instead of late and expensively. The [Agile Manifesto](https://agilemanifesto.org/) is a one-page statement of the values behind this, from 2001, and it is worth the two minutes it takes to read.

Neither model is a religion (although some people treat Agile that way?). Agile done as empty ritual is common enough to have a name: [cargo-cult](https://en.wikipedia.org/wiki/Cargo_cult_programming) agile. The practices below matter because of what they let you learn, not because performing them earns points.

## Sprints and Their Events

A **sprint** is a fixed window of time, usually one to four weeks, in which the team commits to a small set of work and finishes it to a defined standard. Fixed is the important word: the deadline does not move, so scope has to be chosen honestly.

There are four events in a sprint cycle:

- **Sprint planning** starts the sprint: choose what to take on, break it into tasks, agree on what done means for each.
- **Daily standup** is a minutes-long sync: what I did, what I am doing, what is blocking me. Its purpose is surfacing blockers, not reporting to a boss.
- **Sprint review** ends the sprint by demonstrating working software to people outside the team and collecting reactions.
- **Sprint retrospective** is the team alone, asking what about our process helped, what hurt, and what we will change next sprint.

Chapter 2 covers the review, retrospective, and planning cycle in more depth, and in the second half of the course you will run all four events with a real team.

## Your Sprints

The first half of this course is five one-week sprints. Each week:

1. The chapter teaches the concepts.
2. The epoch branch delivers the tasks.
3. You work the tasks on your board, to the definition of done.
4. You open a pull request, get it reviewed, merge, and submit.

Epoch tasks live as GitHub issues on your project board, as section 1.2 described, and the epoch's final task is always an integration and release check: evidence that the increment actually ships. That is the agile bar for a sprint, and it is the bar the grader holds you to. A sprint that ends with "almost done" software did not end; it rolled its problem into the next sprint.

Working solo, you might be tempted to skip the ceremony. Keep two pieces anyway:

- **A real planning pass.** Read every task and its acceptance criteria at the start of the week and put them in order on your board. Ten minutes of planning routinely saves an evening of rework.
- **A real done standard.** Nothing moves to Done until the checks in section 1.7 pass. This is the habit the whole course is built to install.

## Coming Up

Enough process. The next section starts the technical spine of the course: TypeScript, the language everything in Quizzer is written in.

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E1 (week 1)]

- **E1.10: Epoch 1 integration and release.** As the intern team, we need evidence that the first increment is releasable.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

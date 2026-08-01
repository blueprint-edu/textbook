---
title: "1.9 Pull Request"
sidebar_position: 9
---

**Topics:** Creating pull requests, Code review, Approving and merging

## Learning Objectives

By the end of this section, you will be able to:

- Open a pull request on GitHub.
- Provide constructive code review feedback.
- Merge a pull request after approval.

## Work Does Not Land By Itself

On a professional team, nobody edits `main` directly. Work happens on a branch, and it lands through a **pull request** (PR): a proposal that says "here are my commits, here is why, please look before this merges." The PR is where continuous integration runs, where teammates review, and where the decision to merge gets made in the open.

The course runs the same way, with one rule stated plainly: **you never merge your own work without an approval.** Every epoch lands through a PR that a peer has reviewed and approved, and the record of those reviewed PRs is itself something you submit on Canvas. This is not ceremony for its own sake. Code review is the single most common quality practice in industry, and being good at it, on both sides, is a hireable skill.

## Opening a Good Pull Request

The mechanics are quick: push your branch to your fork, and GitHub offers a **Compare & pull request** button; or use the Pull requests tab and choose your branch. The repository provides a PR template so you start from a structure instead of a blank box.

What separates a good PR from a merge-shaped apology:

- **Say what and why.** State which epoch and which task IDs the PR completes, and mention anything a reviewer would otherwise have to reverse-engineer: a decision you made, a criterion you interpreted, a thing you are unsure about.
- **Arrive green.** CI runs the full definition of done on your PR. Requesting review on red CI politely asks another person to find what a machine already found.
- **Keep it reviewable.** A PR of five hundred changed lines gets worse review than two PRs of two hundred. In this course an epoch is a natural unit; on the job, you will learn to slice thinner.

Then request review from your peer group and go do something else. Waiting is part of the workflow, which is why real teams keep several tasks in flight.

## Reviewing Someone Else's Work

Reviewing is not proofreading, and it is not a dominance ritual. You are answering one question: **should this merge?** Your repository ships the checklist your peers will use (`docs/REVIEW_CHECKLIST.md`); it asks, in short: does the PR say what it completes, is CI green, does the code meet the acceptance criteria and not only the public tests, are names and types clean, do state updates avoid mutation, and do the tests read clearly.

Some practical craft for writing reviews worth receiving:

- **Be specific and anchored.** Comment on lines, not vibes. "This branch never runs when `possible` is 0" beats "logic seems off."
- **Ask before asserting.** "What happens if `options` is empty?" respects the possibility that the author thought of it. Half of good review comments are questions.
- **Say what is good.** "This test names the boundary case exactly" is information; the author now knows to keep doing it. A review is a conversation, not a verdict with line numbers.
- **Approve honestly.** Approving means "I looked, and I would put my name on merging this." An approval you did not read your way to is a small fraud on your future teammates, and in this course it will usually be caught, because reviewers are accountable for what they approved.

When you receive a review, the discipline is symmetrical: assume good faith, answer every comment, and say thank you for the catch that stung. Every engineer you admire has a thousand review comments in their past.

## Merging and Recording

Once CI is green and an approval is in:

1. **Merge the PR** on GitHub. The push to `main` triggers the Pages workflow, so your deployed site updates itself.
2. **Submit on Gradescope**, which grades the epoch against the full gate plus the hidden checks.
3. **Record the PR on Canvas**: the link to the merged, approved pull request is part of each epoch's completion.

## Your Turn

That is the whole loop: branch, work to the definition of done, PR, review, merge, submit. Chapter 1 ends here, which means epoch 1 begins.

Merge the `epoch-1` branch in your repository and open `curriculum/epoch-1.md`. It lists ten tasks, E1.1 through E1.10: the domain types, the pure functions (several of which you have been circling all chapter), the four components of the static quiz preview, and the integration release. Everything in it is something this chapter prepared you for.

Marla has already emailed to say she is "thrilled to see what you build!" Priya's advice stands: read the task document first, run the gates often, and ask questions early.

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E1 (week 1)]

- **E1.10: Epoch 1 integration and release.** As the intern team, we need evidence that the first increment is releasable.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

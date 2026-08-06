---
title: "2.1 Sprint Review"
sidebar_position: 1
---

**Topics:** Sprint review, Sprint retrospective, Sprint planning

## Learning Objectives

By the end of this section, you will be able to:

- Demonstrate completed work in a sprint review.
- Run a retrospective and identify one concrete process change.
- Plan a sprint from a backlog, with honest estimates.

## Sprint One Is Over

If the loop from chapter 1 closed, then your epoch 1 pull request is merged, your Gradescope submission is in, and your quiz preview is deployed on GitHub Pages. That was a sprint: a fixed week, a committed set of tasks, and a working increment at the end.

What separates a team that improves from a team that repeats its first week forever is what happens at the boundary between sprints. Section 1.4 named the four sprint events; this section is about the three that live at the boundary: review, retrospective, and planning. Two company emails set the frame:

> **From:** Martin Quist, Director of People Success, NotEvilEduTools LLC
> **To:** All Interns
> **Subject:** Agile at NotEvilEduTools
>
> Hi team! As you begin Sprint 2, a reminder that NotEvilEduTools is an Agile workplace. Every sprint, every team:
>
> - **Reviews** what was built (demos, not slide decks)
> - **Retrospects** on how we worked
> - **Plans** what comes next
>
> Ceremony attendance is mandatory. Remember: velocity is a measurement, not a judgment.
>
> Martin

And, shortly afterward:

> **From:** Priya Ramachandran, Engineering Lead, Quizzer
> **To:** You
> **Subject:** RE: Agile at NotEvilEduTools
>
> What Martin means: show your work, be honest about what slowed you down, and don't commit to more than you can finish.
>
> Do the retrospective even though you work alone. Especially because you work alone: nobody else is going to notice your process problems for you.
>
> Priya

## Sprint Review: Show the Software

A **sprint review** demonstrates working software to people outside the team and collects their reactions. Not screenshots, not a report, not "it's basically done": the actual software, running. The rule of the review is that only demonstrated work counts. If it cannot be shown, it is not done, and pretending otherwise steals from next sprint.

Reviews earn their time in two ways:

- **They force integration honesty.** A demo has a way of surfacing the thing that "works on my machine" but not anywhere else. Knowing a demo is coming changes how you finish work all week.
- **They collect course corrections early.** Stakeholders watching a demo say things like "wait, why does it do that?" while the feature is a week old, not a year old.

Your solo version this week is real, not simulated: your deployed GitHub Pages site is the demo, and the epoch 2 task document asks for demonstrated evidence, including showing validation failures and filtered views working. Open your deployed site after you merge and click through what you built. You are the first stakeholder to react to it.

## Sprint Retrospective: Fix the Process

The **retrospective** is the team alone, examining how the sprint went, not what it produced. The standard shape is three questions:

1. What helped us this sprint?
2. What hurt us this sprint?
3. What one thing will we change next sprint?

Two disciplines make retrospectives worth having:

- **Blameless means blameless.** Retros examine the process, not the people. "The tests caught the bug late because we wrote them last" is a retro finding. "Sam wrote bad code" is not, and a team that allows the second stops getting honest answers to the first.
- **One change, actually made.** A retro that produces seven resolutions produces zero. Pick the single change with the best effort-to-payoff ratio and make it next sprint, where the next retro can judge whether it worked.

Run one on your sprint 1, in writing, and keep it short. Did you run the gates often, or save them for a painful Friday? Did you read acceptance criteria before or after writing code? Did a task take triple your guess? Write down your one change. This is a habit interviewers genuinely ask about, and "here is a process problem I noticed in my own work and fixed" is a better story than most resumes carry.

## Sprint Planning: Commit Honestly

**Sprint planning** starts the next sprint: pull work from the prioritized backlog, break it into tasks, and commit to what the team can genuinely finish. The two failure modes are both about honesty. Overcommit, and the sprint ends with a pile of 80%-done tasks, which demo as 0%-done. Undercommit, and stakeholders learn to distrust the plan in the other direction.

Estimation is the hard part, and nobody is good at it at first. The fix is feedback: estimate every task, record the actual, and compare. Your epoch tasks carry point estimates, and the epoch 2 integration task asks you to document how accurate those estimates turned out to be for you. After five epochs of that, you will have real data about your own calibration, which is more than many working engineers can claim.

Your planning pass this week: merge the epoch 2 branch (the next section shows you how), read all ten tasks and their acceptance criteria, order them on your project board, and note which ones look big. The dependency structure matters: the query functions in E2.1 through E2.6 feed the validation in E2.8 and the component in E2.9, so sequencing them well is the difference between a smooth week and a knot.

## Coming Up

The sprint ceremonies are the rhythm; branches are the mechanics underneath them. The next section covers how Git branches actually work, how each epoch arrives as one, and what happens when two branches disagree.

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E2 (week 2)]

- **E2.10: Epoch 2 integration and release.** As the intern team, we need a reliable functional-programming increment.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

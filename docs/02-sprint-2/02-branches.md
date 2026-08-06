---
title: "2.2 Branches"
sidebar_position: 2
---

**Topics:** Git branches, Feature branches, Merging, Merge conflicts

## Learning Objectives

By the end of this section, you will be able to:

- Create and switch between Git branches.
- Merge one branch into another.
- Read a merge conflict and explain how one gets resolved.

## What a Branch Actually Is

Chapter 1 had you committing to one line of history. A **branch** is another line of history: a named pointer to a commit, and a place where new commits can pile up without touching any other branch.

The mental model that makes Git make sense: your repository is a graph of commits, each one pointing at its parent. A branch is nothing but a label stuck to one commit, and the label moves forward automatically as you commit. Creating a branch copies nothing and costs nothing; it writes a 41-byte file that says "the label `experiment` points at commit `a3f9c21`." This is why professional teams branch constantly and casually. Branches are how several lines of work proceed at once without stepping on each other, and in a solo repository they are how _your_ several lines of work do the same.

## The Branches You Already Have

Run this in your work sample repository:

```bash
git branch --all
```

You will see `main`, and you will see the five epoch branches: `epoch-1` through `epoch-5`. Each epoch branch contains everything the previous one did, plus one commit that adds the new week's material: the task document, new stubs, new public tests, updated coverage configuration. The course delivers the curriculum itself through the exact mechanism this section teaches.

When a new epoch starts, you merge its branch into your own work:

```bash
git switch main
git merge epoch-2
```

**Merging** takes the commits from one branch and combines them into another. For the epoch branches, the merge is designed to be quiet: epoch commits add new files and rarely touch anything you have edited, so Git combines the two histories without complaint, and your epoch 1 work sails through unchanged. One of the automated checks this course's curriculum is built with literally verifies that a diligent student's work survives every epoch merge. You are not expected to take that on faith; you are expected to run `npm run check` after every merge and see for yourself.

## Branching Your Own Work

Section 1.9 told you that work lands through pull requests and that nobody edits `main` directly. Branches are the other half of that workflow. The pattern, called a **feature branch**, goes:

```bash
git switch main
git switch -c e2-queries     # create a branch and switch to it
# ...work, commit, work, commit...
git push -u origin e2-queries
```

Then open the pull request from `e2-queries`, get your review, and merge on GitHub. Some habits that keep this pleasant:

- **Name branches after the work.** `e2-queries` tells your reviewer what to expect. `stuff` and `fix2` tell them nothing.
- **Branch small, merge often.** A branch that lives for three days accumulates three days of divergence from `main`. The longer two lines of history grow apart, the worse the reunion.
- **Commit before you switch.** Git will refuse to switch branches over uncommitted changes it would clobber. If you are mid-thought, commit; a rough commit on a branch that will be reviewed later is normal and fine.

The visual overview of all this is one command away, and worth running until the graph model feels natural:

```bash
git log --oneline --graph --all
```

## When Branches Disagree

Merging is quiet only while the branches changed different things. When both branches changed the same lines of the same file, Git refuses to guess and declares a **merge conflict**. A conflict is not an error. Git stops, marks the disputed region in the file, and waits for a human decision:

```text
<<<<<<< HEAD
passingPercentage: 65,
=======
passingPercentage: 70,
>>>>>>> epoch-5
```

Everything between `<<<<<<< HEAD` and `=======` is your branch's version; everything after, the incoming branch's version. Resolving means editing the file into the single version that should survive (keep yours, keep theirs, or write something combining both), deleting the marker lines, then:

```bash
git add src/fixtures/sampleQuiz.ts
git commit
```

The commit concludes the merge. VS Code renders conflicts with buttons for each choice, which is convenient, but the buttons do exactly the edit described above, and you should be able to do it by hand in any editor.

Two honesty notes, so nothing here surprises you later:

- **You will hit real conflicts in this course, on purpose.** The epoch 4 and epoch 5 merges each produce one small conflict in one fixture file, because a task will have asked you to edit a line the next epoch also edits. The task documents tell you it is coming and what the intended resolution is. It is a designed rehearsal of a thing that happens to every working engineer, in a setting where the answer is documented.
- **Resolving a conflict is a decision, not a chore.** The right resolution depends on what both changes were _for_. Read both sides before picking one; the worst merge outcomes come from clicking "Accept Current" until the markers go away.

## Coming Up

Branches deliver epoch 2's actual content, and that content is a shift in how you write code: functions that take functions. The next section introduces higher-order functions, the idea the whole epoch is built on.

---
title: "4.3 Mutable Nested Data"
sidebar_position: 3
---

**Topics:** Deep nesting, Immutability patterns, Structured cloning

## Learning Objectives

By the end of this section, you will be able to:

- Update deeply nested data structures immutably.
- Use utility functions to simplify nested updates.
- Recognize when deep nesting signals a design problem.

## Introduction

Real-world data is often deeply nested. This section covers strategies for updating nested state without mutating it, keeping React's rendering model intact.

:::info Content forthcoming

Full content for this section is under active development. Check back soon.

:::

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E4 (week 4)]

- **E4.1: Define Response and Attempt; implement createAttempt.** As a learner, I need a complete initialized attempt for a quiz.
- **E4.2: recordAnswer(attempt, questionId, optionId).** As a learner, I need to record an answer in centralized attempt state.
- **E4.3: setResponseConfidence(attempt, questionId, confidence).** As a learner, I need confidence stored with the response.
- **E4.4: toggleResponseFlag(attempt, questionId).** As a learner, I need centralized flag state.
- **E4.5: clearAnswer(attempt, questionId).** As a learner, I need to remove a selected answer.
- **E4.6: editQuestionPrompt(quiz, questionId, prompt).** As an instructor, I need to edit a prompt without changing unrelated quiz data.
- **E4.7: editOptionLabel(quiz, questionId, optionId, label).** As an instructor, I need to edit a nested option label safely.
- **E4.8: setCorrectOption(quiz, questionId, optionId).** As an instructor, I need exactly one correct option after an edit.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

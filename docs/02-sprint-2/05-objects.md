---
title: "2.5 Objects"
sidebar_position: 5
---

**Topics:** Objects, Object spread and immutability, Records, Arrays of objects, every and some

## Learning Objectives

By the end of this section, you will be able to:

- Copy an object with spread and explain why the copy matters.
- Build a Record with computed keys using reduce.
- Chain higher-order methods over arrays of objects.
- Write compound validation predicates with every and some.

## Objects Model Things

You have been using objects since chapter 1: every `Quiz`, `Question`, and `AnswerOption` is one, and an `interface` describes its shape so the compiler can hold everyone to it. One stylistic note before the new material, because students arriving from Java expect classes everywhere. This book does not use classes. Our data is plain objects described by interfaces, created with literal syntax, transformed by functions. Classes bundle data with the methods that change it, which is a fine idea in many languages and an awkward fit for React, where data needs to flow between components and change by replacement. Chapter 4 completes that argument. For now: interfaces describe, literals create, functions transform.

**Destructuring**, which you saw in component props, works on any object and keeps transformation code readable:

```ts live id=ch2-s5-destructure title="Destructuring" expect=pass console=open
interface Track {
  id: string;
  title: string;
  genre: string;
  seconds: number;
}

const track: Track = {
  id: "t1",
  title: "Compile Time",
  genre: "electronic",
  seconds: 214,
};

const { title, seconds } = track;
console.log(`${title} runs ${seconds} seconds`);
```

## Copying with Spread

Spread works on objects the way it worked on arrays: copy the fields of an existing object into a new literal. Fields written after the spread override the copied ones, which makes "a copy of this, with one change" a one-liner:

```ts live id=ch2-s5-spread title="Copy, then override" expect=pass console=open
interface Playlist {
  title: string;
  isPublic: boolean;
}

const original: Playlist = { title: "Focus Mix", isPublic: false };

const renamed: Playlist = { ...original, title: "Deep Focus Mix" };

console.log(original);
console.log(renamed);
```

Two objects now exist. `original` still says "Focus Mix"; nothing modified it. This is the entire implementation technique for E2.7 (`renameQuiz`), whose acceptance criteria state three requirements: returns a _new_ quiz, the title changes, the original remains unchanged.

Before you run this next one, predict all four answers. Write them down, then run:

```ts live id=ch2-s5-identity title="Predict, then run" expect=pass console=open
interface Playlist {
  title: string;
  isPublic: boolean;
}

const original: Playlist = { title: "Focus Mix", isPublic: false };
const copy: Playlist = { ...original };
const alias: Playlist = original;

console.log(copy === original);
console.log(alias === original);
console.log(copy.title === original.title);
console.log(alias === copy);
```

If any answer surprised you, you have met the difference between an **alias** (another name for the same object) and a **copy** (a different object with the same contents). `===` on objects compares identity, not contents, which is why section 1.6 needed `toEqual` alongside `toBe`. This distinction becomes central in chapter 4; today it needs to exist in your head.

One warning to carry forward: spread copies one level. The copy's fields hold the same _values_, and when a field's value is itself an object or array, both copies share it. That shared-structure problem, and the deep updates it complicates, opens chapter 4. Epoch 2's updates are all top-level, so spread as shown is the whole story this week.

## Records: Objects as Lookup Tables

Interfaces describe objects whose field names you know in advance. Sometimes the field names _are_ the data: counting questions per skill means one field per skill, and you cannot list skills in an interface you have not seen. The type for this is **`Record<string, number>`**: an object whose keys are strings and whose values are numbers.

Building one pairs `reduce` with **computed keys**, the bracket syntax that lets an expression name a field:

```ts live id=ch2-s5-record title="Counting by genre" expect=pass console=open
interface Track {
  id: string;
  title: string;
  genre: string;
  seconds: number;
}

const playlist: Track[] = [
  { id: "t1", title: "Compile Time", genre: "electronic", seconds: 214 },
  { id: "t2", title: "Merge Conflict Blues", genre: "blues", seconds: 187 },
  { id: "t3", title: "Refactor", genre: "electronic", seconds: 240 },
];

const countByGenre: Record<string, number> = playlist.reduce<Record<string, number>>(
  (counts, track) => ({
    ...counts,
    [track.genre]: (counts[track.genre] ?? 0) + 1,
  }),
  {},
);

console.log(countByGenre);
```

Every piece earns its place. The accumulator starts as `{}`. Each step spreads the counts so far into a new object, then sets one computed key: `[track.genre]` means "the field named by this track's genre." And `counts[track.genre] ?? 0` handles the first sighting of a genre; the `??` operator says "if the left side is `null` or `undefined`, use the right side." Under this project's strict settings, the compiler insists you handle that missing-key case, and `?? 0` is the idiomatic answer for a counter. E2.6 (`questionCountBySkill`) is this function with skills in place of genres, and it is worth three points because assembling these pieces without a template is a real skill. You have now seen the pieces.

Reading a Record back out has a companion tool: `Object.entries` turns the object into an array of `[key, value]` pairs, at which point all of yesterday's array methods apply. The `QuestionBank` component renders its skill summary exactly that way.

## Compound Predicates: every and some

The last two array methods answer yes-or-no questions about a whole array. **`every`** asks "does the predicate hold for all elements?" and **`some`** asks "for at least one?":

```ts live id=ch2-s5-every-some title="Validating a playlist" expect=pass console=open
interface Track {
  id: string;
  title: string;
  genre: string;
  seconds: number;
}

function isPlaylistReady(tracks: Track[]): boolean {
  return (
    tracks.length > 0 &&
    tracks.every((track) => track.title.trim().length > 0) &&
    tracks.every((track) => track.seconds > 0) &&
    tracks.every(
      (track, index) => tracks.findIndex((candidate) => candidate.id === track.id) === index,
    )
  );
}

const good: Track[] = [
  { id: "t1", title: "Compile Time", genre: "electronic", seconds: 214 },
  { id: "t2", title: "Merge Conflict Blues", genre: "blues", seconds: 187 },
];

const blank: Track[] = [{ id: "t1", title: "   ", genre: "electronic", seconds: 214 }];

console.log(isPlaylistReady(good));
console.log(isPlaylistReady(blank));
console.log(isPlaylistReady([]));
```

`isPlaylistReady` is a **compound predicate**: several rules joined by `&&`, each one readable on its own line. The uniqueness check is the clever one, and worth decoding: an element's `findIndex` equals its own `index` only when no earlier element shares its ID, so the `every` passes exactly when all IDs are unique. Note also `trim()` before the length check; a title of three spaces is not a title, and whitespace-only strings are a classic validation hole.

This is the exact architecture of E2.8, `isQuizWellFormed`, the five-point centerpiece of the epoch: at least one question, nonblank prompts, at least two options each, exactly one correct option, positive points, unique question IDs, and option IDs unique within each question. Each rule is one clause. "Exactly one correct option" wants a `filter`-then-count rather than a bare `some`, since `some` cannot tell one match from three. And "unique within each question" is a scope decision: the same option ID appearing in two _different_ questions is fine, so the uniqueness check runs per question, not globally. Read scopes in acceptance criteria as carefully as values; a validator that checks the right rule in the wrong scope passes most tests and fails the interesting ones.

Which raises a question: if your validator had that scope bug, would your tests catch it? The next section is about exactly that question, and the course's mechanism for asking it automatically.

## Coming Up

You now have every tool epoch 2 requires: functions as values, the array methods, immutable copies, Records, and compound predicates. The last section of the chapter introduces mutation testing, where your tests stop being graded on coverage and start being graded on whether they can catch bugs.

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E2 (week 2)]

- **E2.6: questionCountBySkill(quiz).** As an instructor, I need a typed frequency table for planning coverage.
- **E2.7: renameQuiz(quiz, title).** As an instructor, I need to rename a quiz without mutating the original object.
- **E2.8: isQuizWellFormed(quiz).** As an instructor, I need validation before learners can take a quiz.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

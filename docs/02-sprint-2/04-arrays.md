---
title: "2.4 Arrays"
sidebar_position: 4
---

**Topics:** Arrays, Higher-order array methods, map, filter, find, reduce

## Learning Objectives

By the end of this section, you will be able to:

- Transform arrays with map, filter, and reduce instead of loops.
- Use find safely, handling the undefined case.
- Build new arrays with spread instead of mutating methods.
- Choose the right array method for a given transformation.

## The Loop Ban

Time to say it plainly: starting this epoch, the linter rejects `for` loops, `while` loops, and `forEach` in your application code. Write one and the definition of done fails.

The rule has an actual argument behind it. A loop tells the reader _how_ something happens: initialize, check, mutate, repeat. It says nothing about _what_ is being computed; you have to execute the loop in your head to find out. The array methods in this section each name a specific transformation. `filter` can only ever select elements. `map` can only ever convert them. When you read the method name, you know the shape of the result before reading another character, and whole categories of loop bugs (off-by-one indices, mutated accumulators, early exits that skip cleanup) have no place to live.

Professionals write loops when loops are the right tool. You will too, after this course. The ban exists because the methods below have to become your reflex, and they never will while a `for` loop sits within reach.

Our running examples use a music playlist, a shape that should feel familiar next to the quiz:

```ts
interface Track {
  id: string;
  title: string;
  genre: string;
  seconds: number;
}
```

## map: Convert Every Element

`map` calls your function on every element and collects the results into a new array, same length, same order:

```ts live id=ch2-s4-map title="map converts elements" expect=pass console=open
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

const titles: string[] = playlist.map((track) => track.title);
const labels: string[] = playlist.map((track) => `${track.title} (${track.seconds}s)`);

console.log(titles);
console.log(labels);
```

You met `map` in section 1.8 rendering lists of elements; that was this exact method, converting data objects into markup. Notice both results are _new_ arrays. `playlist` is untouched, which is a theme this section will keep hammering.

## filter: Keep Some Elements

`filter` calls your function on every element and keeps the ones where it returns `true`. The function you pass, one that answers yes or no about a value, is called a **predicate**:

```ts live id=ch2-s4-filter title="filter selects elements" expect=pass console=open
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

const electronic: Track[] = playlist.filter((track) => track.genre === "electronic");
const shortTracks: Track[] = playlist.filter((track) => track.seconds < 200);

console.log(electronic.map((track) => track.title));
console.log(shortTracks.map((track) => track.title));
```

Filtering to a genre nobody uses returns `[]`, an empty array, not an error and not `null`. Code downstream of a `filter` should always be prepared for the empty case, and this epoch's tests check exactly that; E2.5 requires an empty result when no questions match a skill.

## find: Get One Element, Maybe

`find` returns the _first_ element where your predicate answers `true`. The interesting part is what happens when nothing matches: you get `undefined`, and TypeScript makes you deal with it.

```ts live id=ch2-s4-find title="find returns Track or undefined" expect=pass console=open
interface Track {
  id: string;
  title: string;
  genre: string;
  seconds: number;
}

const playlist: Track[] = [
  { id: "t1", title: "Compile Time", genre: "electronic", seconds: 214 },
  { id: "t2", title: "Merge Conflict Blues", genre: "blues", seconds: 187 },
];

function findTrack(tracks: Track[], id: string): Track | undefined {
  return tracks.find((track) => track.id === id);
}

const hit = findTrack(playlist, "t2");
if (hit === undefined) {
  console.log("No such track.");
} else {
  console.log(`Found: ${hit.title}`);
}

console.log(findTrack(playlist, "t9"));
```

The return type `Track | undefined` is the honest one, and this project's strict settings will not let you pretend otherwise; write `hit.title` without checking for `undefined` first and the compiler stops you. Resist the urge to "fix" a missing result by inventing a default object. A lookup that fabricates data hides bugs from every caller. E2.1 and E2.2 say this in their acceptance criteria: return the match or `undefined`, and do not fabricate.

## reduce: Boil It All Down

`map` and `filter` produce arrays. **`reduce`** produces one value of any kind, by carrying an accumulator through the elements. Your function receives the accumulator so far and the next element, and returns the new accumulator:

```ts live id=ch2-s4-reduce title="reduce accumulates one result" expect=pass console=open
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

const totalSeconds: number = playlist.reduce((total, track) => total + track.seconds, 0);

console.log(totalSeconds);
```

The `0` is the starting accumulator, and it makes the empty case work for free: reducing an empty playlist returns `0`, no special case required. E2.3 (`totalPossiblePoints`) is this pattern with points instead of seconds, and its acceptance criteria demand exactly that graceful empty behavior.

`reduce` also handles jobs that look too clever for it at first, like deduplication in first-appearance order. The accumulator does not have to be a number:

```ts live id=ch2-s4-dedupe title="reduce with an array accumulator" expect=pass console=open
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

const genres: string[] = playlist.reduce<string[]>(
  (seen, track) => (seen.includes(track.genre) ? seen : [...seen, track.genre]),
  [],
);

console.log(genres);
```

Walk it: start with `[]`, and for each track, keep the list as-is if the genre is already in it, otherwise build a new list with the genre appended. The result preserves the order genres first appeared, which sorting would destroy. E2.4 (`skillsForQuiz`) wants precisely this behavior, first-appearance order and all. The `<string[]>` after `reduce` tells the compiler what the accumulator is, which it cannot infer from `[]` alone.

## New Arrays, Not Changed Arrays

That `[...seen, track.genre]` deserves its own moment. The `...` is **spread**: it copies the elements of an existing array into a new array literal. Appending by spread builds a new array; appending by `push` mutates the one you have. This project bans `push`, `pop`, `sort`, and the other mutating methods in the modules that update state, and chapter 4 explains in gory detail why mutation and React are enemies. For now, build the reflex:

```ts live id=ch2-s4-spread title="Spread builds new arrays" expect=pass console=open
const original: string[] = ["alpha", "beta"];

const extended: string[] = [...original, "gamma"];
const reversed: string[] = [...original].reverse();

console.log(original);
console.log(extended);
console.log(reversed);
```

`original` survives both operations untouched. Even `reverse`, a mutating method, becomes safe when aimed at a fresh spread copy instead of the original. Every function you write this epoch has "does not mutate its input" in its acceptance criteria, stated or implied, and the graders check.

## Choosing the Method

A decision guide, worth internalizing until it is automatic:

- **Same number of elements, each converted?** `map`.
- **Some of the elements, unchanged?** `filter`.
- **One element, by a condition?** `find`, and handle `undefined`.
- **One combined value from all elements?** `reduce`.
- **A yes-or-no about the whole array?** `every` and `some`, coming in the next section.

Chains read top to bottom like a pipeline: `playlist.filter(isElectronic).map(toLabel)` says "the electronic tracks, as labels" almost in English. If you catch yourself reaching for `reduce` to do what a `filter` plus a `map` would say more clearly, reach again; the fanciest method is not the best one, the clearest one is.

## Coming Up

Arrays hold this epoch's data, but the elements inside them are objects: questions, options, tracks. The next section covers objects properly, including how to copy them without mutating, count with them, and validate them.

{/* epoch-tie-ins:start */}

{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}

{/* prose-ignore-start */}

:::info[This section prepares you for E2 (week 2)]

- **E2.1: findQuestion(quiz, questionId).** As a developer, I need a safe lookup for a question by ID.
- **E2.2: findOption(question, optionId).** As a developer, I need a safe nested option lookup.
- **E2.3: totalPossiblePoints(quiz).** As an instructor, I need the quiz's total possible points.
- **E2.4: skillsForQuiz(quiz).** As an instructor, I need a deduplicated list of skills represented by the quiz.
- **E2.5: questionsForSkill(quiz, skill).** As an instructor, I need to filter the bank to a selected skill.
- **E2.6: questionCountBySkill(quiz).** As an instructor, I need a typed frequency table for planning coverage.

:::

{/* prose-ignore-end */}

{/* epoch-tie-ins:end */}

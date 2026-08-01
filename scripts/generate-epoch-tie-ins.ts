#!/usr/bin/env tsx
/**
 * Epoch tie-in generator.
 *
 * Reads blueprint.yaml (the course's source of truth) and injects, into each
 * chapter section document, the list of work-sample tasks that section
 * prepares students for. The block is generated, not hand-written, so
 * textbook/epoch alignment cannot rot (IMPLEMENTATION_PLAN.md, Phase 4,
 * task 5).
 *
 * Usage:
 *   pnpm generate:tie-ins          # rewrite tie-in blocks in place
 *   pnpm generate:tie-ins --check  # fail if committed blocks differ
 *
 * The blueprint is located at ../project-blueprint/blueprint.yaml relative to
 * the textbook root, overridable with BLUEPRINT_PATH. When the blueprint is
 * absent (standalone textbook checkout), --check skips with a warning unless
 * BLUEPRINT_REQUIRED=1 (the course release pipeline sets it).
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const TEXTBOOK_ROOT = process.cwd();
const DOCS_DIR = path.join(TEXTBOOK_ROOT, "docs");
const BLUEPRINT_PATH =
  process.env["BLUEPRINT_PATH"] ??
  path.join(TEXTBOOK_ROOT, "..", "project-blueprint", "blueprint.yaml");

// MDX comment syntax: Docusaurus compiles .md docs as MDX, which rejects
// HTML comments.
const START_MARKER = "{/* epoch-tie-ins:start */}";
const END_MARKER = "{/* epoch-tie-ins:end */}";

interface BlueprintTask {
  id: string;
  deliverable: string;
  user_story: string;
}

interface BlueprintEpoch {
  id: string;
  name: string;
  week: number;
  tasks: BlueprintTask[];
}

interface BlueprintSection {
  id: string;
  slug: string;
  title: string;
  epoch_tasks: string[];
}

interface BlueprintChapter {
  id: string;
  directory: string;
  title: string;
  epoch: string | null;
  sections: BlueprintSection[];
}

interface Blueprint {
  epochs: BlueprintEpoch[];
  textbook: { chapters: BlueprintChapter[] };
}

function extractFrontMatterField(content: string, field: string): string | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    if (line.slice(0, colonIdx).trim() === field) {
      return line
        .slice(colonIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
    }
  }
  return null;
}

/** Map section number (1-based) to the doc file whose sidebar_position matches. */
function findSectionFile(chapterDir: string, sectionNumber: number): string | null {
  const dir = path.join(DOCS_DIR, chapterDir);
  if (!fs.existsSync(dir)) return null;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".md") && !name.endsWith(".mdx")) continue;
    const filePath = path.join(dir, name);
    const content = fs.readFileSync(filePath, "utf-8");
    const position = extractFrontMatterField(content, "sidebar_position");
    if (position !== null && Number(position) === sectionNumber) return filePath;
  }
  return null;
}

function renderBlock(
  section: BlueprintSection,
  epoch: BlueprintEpoch,
  tasks: BlueprintTask[],
): string {
  // Each MDX comment sits in its own paragraph (blank lines between them):
  // consecutive comment lines form one markdown paragraph, and prettier then
  // pairs the `*` of one line's `*/}` with the next line's `{/*` as emphasis
  // and rewrites the asterisks to underscores, corrupting the markers.
  const lines: string[] = [
    START_MARKER,
    "",
    "{/* Generated from blueprint.yaml by scripts/generate-epoch-tie-ins.ts. Do not edit by hand; run `pnpm generate:tie-ins`. */}",
    "",
    "{/* prose-ignore-start */}",
    "",
    `:::info[This section prepares you for ${epoch.id} (week ${epoch.week})]`,
    "",
  ];
  // MDX treats bare `<` and `{` in prose as JSX/expression openers; escape
  // them so blueprint text like `Record<QuestionId, Attempt>` renders
  // literally.
  const mdxEscape = (text: string): string => text.replace(/([<{])/g, "\\$1");
  for (const task of tasks) {
    const story = mdxEscape(task.user_story.trim().replace(/\s+/g, " "));
    lines.push(`- **${task.id}: ${mdxEscape(task.deliverable)}.** ${story}`);
  }
  lines.push("", ":::", "", "{/* prose-ignore-end */}", "", END_MARKER);
  return lines.join("\n");
}

function injectBlock(content: string, block: string): string {
  const eol = content.includes("\r\n") ? "\r\n" : "\n";
  const normalizedBlock = block.split("\n").join(eol);
  const startIdx = content.indexOf(START_MARKER);
  const endIdx = content.indexOf(END_MARKER);
  if (startIdx !== -1 && endIdx !== -1) {
    return content.slice(0, startIdx) + normalizedBlock + content.slice(endIdx + END_MARKER.length);
  }
  const trimmed = content.replace(/(\r?\n)+$/, "");
  return trimmed + eol + eol + normalizedBlock + eol;
}

function main(): void {
  const checkMode = process.argv.includes("--check");

  if (!fs.existsSync(BLUEPRINT_PATH)) {
    const message = `blueprint.yaml not found at ${BLUEPRINT_PATH} (set BLUEPRINT_PATH to override).`;
    if (checkMode && process.env["BLUEPRINT_REQUIRED"] !== "1") {
      console.warn(`⚠  ${message} Skipping tie-in check.`);
      return;
    }
    console.error(`❌ ${message}`);
    process.exit(1);
  }

  const blueprint = yaml.load(fs.readFileSync(BLUEPRINT_PATH, "utf-8")) as Blueprint;
  const tasksById = new Map<string, { task: BlueprintTask; epoch: BlueprintEpoch }>();
  for (const epoch of blueprint.epochs) {
    for (const task of epoch.tasks) {
      tasksById.set(task.id, { task, epoch });
    }
  }

  const errors: string[] = [];
  const drifted: string[] = [];
  let written = 0;

  for (const chapter of blueprint.textbook.chapters) {
    for (const section of chapter.sections) {
      if (section.epoch_tasks.length === 0) continue;

      const sectionNumber = Number(section.id.match(/S(\d+)$/)?.[1]);
      const filePath = findSectionFile(chapter.directory, sectionNumber);
      if (!filePath) {
        errors.push(
          `${section.id} (${chapter.directory}, position ${sectionNumber}): no doc file with matching sidebar_position`,
        );
        continue;
      }

      const resolved = section.epoch_tasks.map((id) => {
        const entry = tasksById.get(id);
        if (!entry) errors.push(`${section.id}: unknown task id ${id}`);
        return entry;
      });
      if (resolved.some((entry) => entry === undefined)) continue;
      const entries = resolved as { task: BlueprintTask; epoch: BlueprintEpoch }[];
      const epoch = entries[0].epoch;
      const block = renderBlock(
        section,
        epoch,
        entries.map((entry) => entry.task),
      );

      const content = fs.readFileSync(filePath, "utf-8");
      const updated = injectBlock(content, block);
      const relPath = path.relative(TEXTBOOK_ROOT, filePath);
      if (updated !== content) {
        if (checkMode) {
          drifted.push(relPath);
        } else {
          fs.writeFileSync(filePath, updated);
          written += 1;
          console.log(`✏  ${relPath}`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ Tie-in generation failed with ${errors.length} error(s):\n`);
    for (const err of errors) console.error(`  ✗ ${err}`);
    process.exit(1);
  }
  if (checkMode && drifted.length > 0) {
    console.error(`\n❌ Tie-in blocks out of date in ${drifted.length} file(s):\n`);
    for (const file of drifted) console.error(`  ✗ ${file}`);
    console.error("\nRun `pnpm generate:tie-ins` and commit the result.");
    process.exit(1);
  }
  console.log(
    checkMode
      ? "✅ Epoch tie-in blocks match blueprint.yaml"
      : `✅ Tie-ins updated (${written} file(s) changed)`,
  );
}

main();

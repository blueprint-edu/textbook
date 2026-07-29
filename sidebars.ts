import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// Note: Docusaurus strips numeric prefixes from directory names when generating
// document IDs. e.g., docs/00-foundations/ → document IDs use "foundations/".

const sidebars: SidebarsConfig = {
  textbookSidebar: [
    {
      type: "category",
      label: "Guides",
      collapsed: false,
      items: [
        "authoring-code-examples",
        "contributor-guide",
        "accessibility",
        {
          type: "category",
          label: "Maintainer Guide",
          items: ["maintainer-guide/example-security"],
        },
        {
          type: "category",
          label: "Decisions",
          items: ["decisions/adr-001-remark-live-code"],
        },
      ],
    },
    {
      type: "doc",
      id: "examples-demo",
      label: "Live Examples Demo",
    },
    {
      type: "category",
      label: "Chapter 0: Foundations",
      collapsed: false,
      items: ["foundations/what-is-software-engineering", "foundations/how-this-book-works"],
    },
    {
      type: "category",
      label: "Chapter 1: First Sprint",
      collapsed: true,
      items: [
        "first-sprint/apply-to-the-company",
        "first-sprint/work-sample-task",
        "first-sprint/dev-environment",
        "first-sprint/agile",
        "first-sprint/typescript",
        "first-sprint/tests",
        "first-sprint/linting-checking-validating",
        "first-sprint/tsx",
        "first-sprint/pull-request",
      ],
    },
    {
      type: "category",
      label: "Chapter 2: Sprint 2",
      collapsed: true,
      items: [
        "sprint-2/sprint-review",
        "sprint-2/branches",
        "sprint-2/higher-order-functions",
        "sprint-2/arrays",
        "sprint-2/objects",
        "sprint-2/mutation-testing",
      ],
    },
    {
      type: "category",
      label: "Chapter 3: User Research & Components",
      collapsed: true,
      items: [
        "user-research/user-research",
        "user-research/wireframing",
        "user-research/reactive-programs",
        "user-research/child-components",
        "user-research/testing-ui",
        "user-research/resume-v1",
      ],
    },
    {
      type: "category",
      label: "Chapter 4: State Management",
      collapsed: true,
      items: [
        "state-management/passing-state",
        "state-management/mutable-nested-usestate",
        "state-management/mutable-nested-data",
        "state-management/aliases-references",
        "state-management/code-coverage",
      ],
    },
    {
      type: "category",
      label: "Chapter 5: Deep Dive",
      collapsed: true,
      items: [
        "deep-dive/deep-state",
        "deep-dive/usability-testing",
        "deep-dive/whiteboard-interviews",
        "deep-dive/cover-letters",
      ],
    },
    {
      type: "category",
      label: "Chapter 6: Analysis",
      collapsed: true,
      items: [
        "analysis/preparing-for-exam",
        "analysis/user-research-contextual-inquiry",
        "analysis/requirements-analysis",
        "analysis/storyboarding",
      ],
    },
    {
      type: "category",
      label: "Chapter 7: Professional Practice",
      collapsed: true,
      items: [
        "professional/usability-principles",
        "professional/devops",
        "professional/networking",
        "professional/being-a-group-mate",
      ],
    },
    {
      type: "category",
      label: "Chapter 8: On the Job",
      collapsed: true,
      items: [
        "on-the-job/welcome-to-the-company",
        "on-the-job/project-setup",
        "on-the-job/sprint-planning",
        "on-the-job/daily-standup",
        "on-the-job/presenting",
        "on-the-job/sprint-reviews",
        "on-the-job/sprint-retrospectives",
      ],
    },
    {
      type: "category",
      label: "Chapter 9: Advanced Topics",
      collapsed: true,
      items: ["advanced/agentic-engineering", "advanced/red-blue-testing"],
    },
  ],
};

export default sidebars;

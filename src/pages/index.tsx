import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

function HomepageHero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className="container">
        <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.heroButtons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/foundations/what-is-software-engineering"
          >
            Start Reading →
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/examples-demo">
            See Live Examples
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: "Interactive Code Examples",
    emoji: "⚡",
    description:
      "Every code example runs live in your browser. Experiment with TypeScript and React without leaving the page.",
  },
  {
    title: "TypeScript from the Start",
    emoji: "📐",
    description:
      "Build solid foundations in typed JavaScript. See real TypeScript diagnostics with clear explanations.",
  },
  {
    title: "Project-Based Learning",
    emoji: "🏗️",
    description:
      "Learn software engineering the way professionals work: through sprints, code reviews, and iterative development.",
  },
  {
    title: "Accessible Design",
    emoji: "♿",
    description:
      "Full keyboard support, WCAG 2.2 AA compliance, light and dark modes, and screen-reader announcements.",
  },
  {
    title: "Open Source",
    emoji: "🌐",
    description:
      "Built in the open. Contribute corrections, suggest improvements, or adapt for your own course.",
  },
  {
    title: "Industry Practices",
    emoji: "🔧",
    description:
      "Git workflows, agile sprints, pull requests, linting, testing — the real tools of modern software teams.",
  },
];

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.featuresTitle}>Why Blueprint?</h2>
        <div className={styles.featuresGrid}>
          {features.map(({ title, emoji, description }) => (
            <div key={title} className={styles.featureCard}>
              <div className={styles.featureEmoji} aria-hidden="true">
                {emoji}
              </div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDescription}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TableOfContentsPreview() {
  return (
    <section className={styles.toc}>
      <div className="container">
        <h2 className={styles.tocTitle}>Course Outline</h2>
        <div className={styles.tocGrid}>
          {[
            {
              num: 0,
              title: "Foundations",
              desc: "What is software engineering? How to learn with this book.",
            },
            {
              num: 1,
              title: "First Sprint",
              desc: "TypeScript, tests, TSX, git, and your first pull request.",
            },
            {
              num: 2,
              title: "Sprint 2",
              desc: "Higher-order functions, arrays, objects, and mutation testing.",
            },
            {
              num: 3,
              title: "User Research",
              desc: "Reactive programs, components, props, and UI testing.",
            },
            {
              num: 4,
              title: "State Management",
              desc: "useState, nested state, deep copies, and code coverage.",
            },
            {
              num: 5,
              title: "Deep Dive",
              desc: "Usability testing, whiteboard interviews, and career prep.",
            },
            {
              num: 6,
              title: "Analysis",
              desc: "Contextual inquiry, requirements, and storyboarding.",
            },
            {
              num: 7,
              title: "Professional Practice",
              desc: "DevOps, networking, and team collaboration.",
            },
            {
              num: 8,
              title: "On the Job",
              desc: "Sprints, standups, presenting, and retrospectives.",
            },
            { num: 9, title: "Advanced Topics", desc: "Agentic engineering and red/blue testing." },
          ].map(({ num, title, desc }) => (
            <div key={num} className={styles.tocCard}>
              <span className={styles.tocChapterNum}>Ch. {num}</span>
              <h3 className={styles.tocChapterTitle}>{title}</h3>
              <p className={styles.tocChapterDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="Home"
      description="Blueprint: An interactive, project-based software engineering textbook using TypeScript and React."
    >
      <a href="#__docusaurus" className="skip-to-content">
        Skip to main content
      </a>
      <main id="__docusaurus">
        <HomepageHero />
        <HomepageFeatures />
        <TableOfContentsPreview />
      </main>
    </Layout>
  );
}

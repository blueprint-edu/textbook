/**
 * Email component.
 *
 * Renders an in-narrative email message with a header (From/To/Subject)
 * and a letter-style body. The body is authored as regular Markdown
 * between the opening and closing tags. Registered globally via
 * src/theme/MDXComponents.tsx so MDX files need no per-file imports.
 */

import React, { type ReactNode } from "react";
import styles from "./styles.module.css";

export interface EmailProps {
  /** Sender, e.g. "Priya Ramachandran, Engineering Lead, Quizzer". */
  from: string;
  /** Recipient. Defaults to "You". */
  to?: string;
  /** Subject line. */
  subject: string;
  /** Optional date line, shown only when provided. */
  date?: string;
  /** Email body, authored as Markdown. */
  children: ReactNode;
}

export default function Email({
  from,
  to = "You",
  subject,
  date,
  children,
}: EmailProps): React.ReactElement {
  return (
    <section className={styles.email} aria-label={`Email from ${from}. Subject: ${subject}`}>
      <dl className={styles.header}>
        <div className={styles.row}>
          <dt>From</dt>
          <dd>{from}</dd>
        </div>
        <div className={styles.row}>
          <dt>To</dt>
          <dd>{to}</dd>
        </div>
        {date && (
          <div className={styles.row}>
            <dt>Date</dt>
            <dd>{date}</dd>
          </div>
        )}
        <div className={styles.row}>
          <dt>Subject</dt>
          <dd className={styles.subject}>{subject}</dd>
        </div>
      </dl>
      <div className={styles.body}>{children}</div>
    </section>
  );
}

import Link from "next/link";

import styles from "./section-placeholder.module.css";

type SectionPlaceholderProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  actionHref?: string;
  actionLabel?: string;
}>;

export function SectionPlaceholder({
  eyebrow,
  title,
  description,
  emptyTitle,
  emptyDescription,
  actionHref,
  actionLabel,
}: SectionPlaceholderProps) {
  return (
    <section className={styles.page} aria-labelledby="page-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title} id="page-title">
          {title}
        </h1>
        <p className={styles.description}>{description}</p>
      </header>

      <div className={styles.emptyState}>
        <span className={styles.marker} aria-hidden="true" />
        <div>
          <h2>{emptyTitle}</h2>
          <p>{emptyDescription}</p>
          {actionHref && actionLabel ? (
            <Link className={styles.action} href={actionHref}>
              {actionLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

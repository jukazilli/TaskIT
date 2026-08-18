"use client";

import Link from "next/link";

import styles from "./page.module.css";

type ProjectsErrorProps = Readonly<{
  reset: () => void;
}>;

export default function ProjectsError({ reset }: ProjectsErrorProps) {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Projetos</p>
          <h1>Não foi possível carregar seus projetos.</h1>
          <p className={styles.intro}>
            Seus dados não foram alterados. Você pode tentar novamente ou voltar
            para Hoje.
          </p>
        </div>
      </header>

      <div className={styles.workspace}>
        <div className={styles.emptyState}>
          <span className={styles.emptyMark} aria-hidden="true" />
          <div>
            <h2>O contexto de projetos está indisponível.</h2>
            <p>Uma nova tentativa refaz apenas a leitura desta página.</p>
            <div className={styles.cardActions}>
              <button onClick={reset} type="button">
                Tentar novamente
              </button>
              <Link href="/app/today">Voltar para Hoje</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

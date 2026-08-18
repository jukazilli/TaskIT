import styles from "./page.module.css";

export default function ProjectsLoading() {
  return (
    <section className={styles.page} aria-busy="true" aria-live="polite">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Projetos</p>
          <h1>Organize o que tem propósito.</h1>
        </div>
      </header>

      <div className={styles.workspace}>
        <div className={styles.emptyState}>
          <span className={styles.emptyMark} aria-hidden="true" />
          <div>
            <h2>Carregando seus projetos…</h2>
            <p>Estamos preparando apenas o contexto necessário para esta visão.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

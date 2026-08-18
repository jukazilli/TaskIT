import styles from "./page.module.css";

export default function InboxLoading() {
  return (
    <section className={styles.workspace} aria-busy="true" aria-live="polite">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Inbox</p>
        <h1>Carregando sua Inbox…</h1>
        <p className={styles.description}>
          Preparando suas capturas sem interromper o restante do app.
        </p>
      </header>
    </section>
  );
}

"use client";

import { Button } from "@/components/ui/button";

import styles from "./page.module.css";

export default function InboxError({ reset }: Readonly<{ reset: () => void }>) {
  return (
    <section className={styles.workspace}>
      <div className={styles.emptyState} role="alert">
        <h1>Não foi possível abrir sua Inbox.</h1>
        <p>
          Suas tarefas continuam preservadas. Tente carregar novamente quando a
          conexão estiver disponível.
        </p>
        <div>
          <Button onClick={reset}>Tentar novamente</Button>
        </div>
      </div>
    </section>
  );
}

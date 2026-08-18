import { redirect } from "next/navigation";

import { getCurrentAuthSession } from "@/server/auth/session";
import { listInboxTasks } from "@/server/tasks/tasks";

import { QuickAdd } from "./quick-add";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?returnTo=%2Fapp%2Finbox");
  }

  const tasks = await listInboxTasks(session.subject);

  return (
    <section className={styles.workspace} aria-labelledby="inbox-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Inbox</p>
        <h1 id="inbox-title">Capture primeiro. Organize depois.</h1>
        <p className={styles.description}>
          Coloque a tarefa para fora da cabeça sem interromper seu fluxo.
          Projeto, prioridade e agenda podem ser definidos depois.
        </p>
      </header>

      <div className={styles.captureSurface}>
        <QuickAdd />
      </div>

      <section className={styles.listSection} aria-labelledby="captured-title">
        <div className={styles.listHeader}>
          <h2 id="captured-title">Capturadas</h2>
          <span
            className={styles.count}
            aria-label={`${tasks.length} tarefas na Inbox`}
          >
            {tasks.length}
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Sua Inbox está vazia.</h3>
            <p>
              Use o campo acima sempre que lembrar de algo. Você decide onde
              isso entra no plano depois.
            </p>
          </div>
        ) : (
          <ul className={styles.taskList}>
            {tasks.map((task) => (
              <li className={styles.taskItem} key={task.id}>
                <span className={styles.taskMark} aria-hidden="true" />
                <span className={styles.taskTitle}>{task.title}</span>
                <span className={styles.taskStatus}>Inbox</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui";
import { signOutAction } from "@/server/auth/actions";
import {
  AuthServiceUnavailableError,
  getCurrentAuthSession,
} from "@/server/auth/session";

import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  let session;

  try {
    session = await getCurrentAuthSession();
  } catch (error) {
    if (error instanceof AuthServiceUnavailableError) {
      return (
        <main className={styles.shell}>
          <section className={styles.notice}>
            <h1>Não foi possível confirmar sua sessão.</h1>
            <p>
              O serviço de autenticação não respondeu como esperado. Você pode
              tentar novamente sem perder nenhum dado.
            </p>
            <Link href="/app">Tentar novamente</Link>
          </section>
        </main>
      );
    }

    throw error;
  }

  if (!session) {
    redirect("/login?returnTo=%2Fapp");
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true" />
          <span>TaskIT</span>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="quiet">
            Sair
          </Button>
        </form>
      </header>

      <section className={styles.content} aria-labelledby="app-title">
        <p className={styles.eyebrow}>Sessão protegida</p>
        <h1 className={styles.title} id="app-title">
          Olá{session.name ? `, ${session.name}` : ""}.
        </h1>
        <p className={styles.copy}>
          Sua identidade foi recuperada no servidor. A partir daqui, as
          próximas capacidades do TaskIT serão sempre escopadas ao usuário
          autenticado — nunca a um identificador enviado pelo cliente.
        </p>
      </section>
    </main>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell/app-shell";
import {
  AuthServiceUnavailableError,
  getCurrentAuthSession,
} from "@/server/auth/session";
import {
  DatabaseConfigurationError,
  DatabaseUnavailableError,
} from "@/server/db/client";
import { ensureUserPreferences } from "@/server/users/preferences";

export const dynamic = "force-dynamic";

type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

function RecoveryNotice({
  title,
  copy,
}: Readonly<{
  title: string;
  copy: string;
}>) {
  return (
    <main className="bootstrap-shell">
      <section className="bootstrap-card" aria-labelledby="app-error-title">
        <span className="bootstrap-mark" aria-hidden="true" />
        <div>
          <p className="bootstrap-eyebrow">TaskIT</p>
          <h1 id="app-error-title">{title}</h1>
          <p className="bootstrap-copy">{copy}</p>
          <p className="bootstrap-copy">
            <Link href="/app">Tentar novamente</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default async function AppLayout({ children }: AppLayoutProps) {
  let session;

  try {
    session = await getCurrentAuthSession();
  } catch (error) {
    if (error instanceof AuthServiceUnavailableError) {
      return (
        <RecoveryNotice
          title="Não foi possível confirmar sua sessão."
          copy="O serviço de autenticação não respondeu como esperado. Você pode tentar novamente sem perder nenhum dado."
        />
      );
    }

    throw error;
  }

  if (!session) {
    redirect("/login?returnTo=%2Fapp%2Ftoday");
  }

  try {
    const preferences = await ensureUserPreferences(session.subject);

    if (!preferences.onboardingCompleted) {
      redirect("/onboarding");
    }
  } catch (error) {
    if (
      error instanceof DatabaseConfigurationError ||
      error instanceof DatabaseUnavailableError
    ) {
      return (
        <RecoveryNotice
          title="Não foi possível preparar seu espaço."
          copy="O TaskIT não conseguiu acessar o ambiente de dados correto. Tente novamente quando a conexão estiver disponível."
        />
      );
    }

    throw error;
  }

  return (
    <AppShell userEmail={session.email} userName={session.name}>
      {children}
    </AppShell>
  );
}

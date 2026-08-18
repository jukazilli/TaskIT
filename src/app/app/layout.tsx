import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell/app-shell";
import {
  AuthServiceUnavailableError,
  getCurrentAuthSession,
} from "@/server/auth/session";

export const dynamic = "force-dynamic";

type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function AppLayout({ children }: AppLayoutProps) {
  let session;

  try {
    session = await getCurrentAuthSession();
  } catch (error) {
    if (error instanceof AuthServiceUnavailableError) {
      return (
        <main className="bootstrap-shell">
          <section className="bootstrap-card" aria-labelledby="auth-error-title">
            <span className="bootstrap-mark" aria-hidden="true" />
            <div>
              <p className="bootstrap-eyebrow">TaskIT</p>
              <h1 id="auth-error-title">Não foi possível confirmar sua sessão.</h1>
              <p className="bootstrap-copy">
                O serviço de autenticação não respondeu como esperado. Você pode
                tentar novamente sem perder nenhum dado.
              </p>
              <p className="bootstrap-copy">
                <Link href="/app">Tentar novamente</Link>
              </p>
            </div>
          </section>
        </main>
      );
    }

    throw error;
  }

  if (!session) {
    redirect("/login?returnTo=%2Fapp%2Ftoday");
  }

  return (
    <AppShell userEmail={session.email} userName={session.name}>
      {children}
    </AppShell>
  );
}

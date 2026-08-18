import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui";
import {
  AuthServiceUnavailableError,
  getCurrentAuthSession,
} from "@/server/auth/session";
import {
  DatabaseConfigurationError,
  DatabaseUnavailableError,
} from "@/server/db/client";
import { completeOnboardingAction } from "@/server/onboarding/actions";
import { ensureUserPreferences } from "@/server/users/preferences";

import styles from "./onboarding.module.css";
import { TimezoneField } from "./timezone-field";

export const dynamic = "force-dynamic";

type OnboardingPageProps = Readonly<{
  searchParams: Promise<{
    error?: string;
  }>;
}>;

const errorMessages: Record<string, string> = {
  "invalid-preferences":
    "Revise o fuso horário e as preferências antes de continuar.",
  unavailable:
    "Não foi possível salvar suas preferências agora. Tente novamente.",
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const params = await searchParams;
  let session;

  try {
    session = await getCurrentAuthSession();
  } catch (error) {
    if (error instanceof AuthServiceUnavailableError) {
      return (
        <main className={styles.shell}>
          <section className={styles.notice}>
            <h1>Não foi possível confirmar sua sessão.</h1>
            <p>Tente novamente sem perder nenhum dado.</p>
            <Link href="/onboarding">Tentar novamente</Link>
          </section>
        </main>
      );
    }

    throw error;
  }

  if (!session) {
    redirect("/login?returnTo=%2Fonboarding");
  }

  let preferences;

  try {
    preferences = await ensureUserPreferences(session.subject);
  } catch (error) {
    if (
      error instanceof DatabaseConfigurationError ||
      error instanceof DatabaseUnavailableError
    ) {
      return (
        <main className={styles.shell}>
          <section className={styles.notice}>
            <h1>Não foi possível preparar suas preferências.</h1>
            <p>
              O TaskIT não conseguiu acessar o ambiente de dados correto. Tente
              novamente quando a conexão estiver disponível.
            </p>
            <Link href="/onboarding">Tentar novamente</Link>
          </section>
        </main>
      );
    }

    throw error;
  }

  if (preferences.onboardingCompleted) {
    redirect("/app/today");
  }

  const errorMessage = params.error ? errorMessages[params.error] : undefined;

  return (
    <main className={styles.shell}>
      <section className={styles.card} aria-labelledby="onboarding-title">
        <header className={styles.header}>
          <div className={styles.brand}>
            <span className={styles.mark} aria-hidden="true" />
            <span>TaskIT</span>
          </div>
          <p className={styles.step}>Só o essencial para começar</p>
          <h1 id="onboarding-title">Como sua semana funciona?</h1>
          <p className={styles.copy}>
            Ajuste três preferências. Você poderá mudar tudo depois em
            Configurações.
          </p>
        </header>

        {errorMessage ? (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        ) : null}

        <form action={completeOnboardingAction} className={styles.form}>
          <TimezoneField initialTimezone={preferences.timezone} />

          <label className={styles.field} htmlFor="weekStart">
            <span>Minha semana começa em</span>
            <select
              defaultValue={preferences.weekStart}
              id="weekStart"
              name="weekStart"
            >
              <option value="1">Segunda-feira</option>
              <option value="7">Domingo</option>
            </select>
            <small>Isso organiza a visão semanal; não limita seus estudos.</small>
          </label>

          <label className={styles.field} htmlFor="defaultSessionMinutes">
            <span>Duração padrão de uma sessão</span>
            <select
              defaultValue={preferences.defaultSessionMinutes}
              id="defaultSessionMinutes"
              name="defaultSessionMinutes"
            >
              <option value="25">25 minutos</option>
              <option value="40">40 minutos</option>
              <option value="50">50 minutos</option>
              <option value="60">60 minutos</option>
              <option value="90">90 minutos</option>
            </select>
            <small>É apenas um ponto de partida para o planejamento.</small>
          </label>

          <aside className={styles.calendarNote}>
            <strong>Google Calendar é opcional.</strong>
            <p>
              Você pode entrar no TaskIT agora e conectar seu calendário depois,
              quando quiser. Nenhuma permissão Google é necessária para continuar.
            </p>
          </aside>

          <Button className={styles.submit} type="submit">
            Salvar e entrar no TaskIT
          </Button>
        </form>
      </section>
    </main>
  );
}

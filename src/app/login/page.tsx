import Link from "next/link";

import { Button, TextField } from "@/components/ui";
import { signInAction, signUpAction } from "@/server/auth/actions";

import styles from "./page.module.css";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    mode?: string;
    returnTo?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  "invalid-credentials":
    "E-mail ou senha não conferem. Revise e tente novamente.",
  "invalid-signup":
    "Informe nome, e-mail e uma senha com pelo menos 8 caracteres.",
  "missing-fields": "Preencha e-mail e senha para continuar.",
  "signup-failed": "Não foi possível criar sua conta com esses dados.",
  unavailable:
    "Não foi possível acessar o serviço de autenticação. Tente novamente.",
};

function safeReturnTo(value?: string) {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return "/app";
  }

  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const isSignUp = params.mode === "signup";
  const returnTo = safeReturnTo(params.returnTo);
  const errorMessage = params.error ? errorMessages[params.error] : undefined;
  const alternateHref = isSignUp
    ? `/login?returnTo=${encodeURIComponent(returnTo)}`
    : `/login?mode=signup&returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <main className={styles.shell}>
      <section className={styles.card} aria-labelledby="auth-title">
        <div className={styles.mark} aria-hidden="true" />
        <p className={styles.eyebrow}>TaskIT</p>
        <h1 className={styles.title} id="auth-title">
          {isSignUp ? "Crie sua conta." : "Que bom ter você de volta."}
        </h1>
        <p className={styles.copy}>
          {isSignUp
            ? "Comece com o essencial. O Google Calendar continua opcional."
            : "Entre para continuar sua semana de estudos."}
        </p>

        {errorMessage ? (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        ) : null}

        <form
          action={isSignUp ? signUpAction : signInAction}
          className={styles.form}
        >
          <input name="returnTo" type="hidden" value={returnTo} />

          {isSignUp ? (
            <TextField
              autoComplete="name"
              id="name"
              label="Seu nome"
              name="name"
              required
            />
          ) : null}

          <TextField
            autoComplete="email"
            id="email"
            label="E-mail"
            name="email"
            required
            type="email"
          />
          <TextField
            autoComplete={isSignUp ? "new-password" : "current-password"}
            hint={isSignUp ? "Use pelo menos 8 caracteres." : undefined}
            id="password"
            label="Senha"
            minLength={isSignUp ? 8 : undefined}
            name="password"
            required
            type="password"
          />

          <Button className={styles.submit} type="submit">
            {isSignUp ? "Criar conta" : "Entrar"}
          </Button>
        </form>

        <p className={styles.switch}>
          {isSignUp ? "Já tem uma conta? " : "Primeira vez por aqui? "}
          <Link href={alternateHref}>
            {isSignUp ? "Entrar" : "Criar conta"}
          </Link>
        </p>
      </section>
    </main>
  );
}

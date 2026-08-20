"use client";

import { createAuthClient } from "@neondatabase/auth/next";
import { useState } from "react";

import { Button } from "@/components/ui";

import styles from "./page.module.css";

const authClient = createAuthClient();

type GoogleSignInButtonProps = {
  returnTo: string;
};

function googleErrorPath(returnTo: string) {
  const params = new URLSearchParams({
    error: "google-signin-failed",
    returnTo,
  });

  return `/login?${params.toString()}`;
}

export function GoogleSignInButton({ returnTo }: GoogleSignInButtonProps) {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function handleGoogleSignIn() {
    setPending(true);
    setError(undefined);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: returnTo,
        newUserCallbackURL: returnTo,
        errorCallbackURL: googleErrorPath(returnTo),
      });

      if (result.error) {
        setError(
          "Não foi possível iniciar o login com Google. Tente novamente.",
        );
        setPending(false);
      }
    } catch {
      setError("Não foi possível iniciar o login com Google. Tente novamente.");
      setPending(false);
    }
  }

  return (
    <div className={styles.socialAuth}>
      <Button
        aria-busy={pending}
        className={styles.googleButton}
        disabled={pending}
        onClick={handleGoogleSignIn}
        type="button"
        variant="secondary"
      >
        <svg
          aria-hidden="true"
          className={styles.googleIcon}
          viewBox="0 0 24 24"
        >
          <path
            d="M21.6 12.23c0-.71-.06-1.24-.2-1.8H12v3.27h5.52a4.7 4.7 0 0 1-2.05 3.08l-.02.11 2.98 2.31.21.02c1.94-1.79 3.06-4.43 3.06-6.99Z"
            fill="#4285F4"
          />
          <path
            d="M12 22c2.7 0 4.97-.89 6.63-2.42l-3.16-2.44c-.85.57-1.99.97-3.47.97-2.6 0-4.8-1.76-5.6-4.19l-.11.01-3.1 2.4-.04.1A10 10 0 0 0 12 22Z"
            fill="#34A853"
          />
          <path
            d="M6.4 13.92A6.1 6.1 0 0 1 6.07 12c0-.67.12-1.31.32-1.92v-.11L3.26 7.53l-.1.05A10 10 0 0 0 2 12c0 1.6.38 3.11 1.05 4.43l3.35-2.51Z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.89c1.88 0 3.14.81 3.86 1.48l2.84-2.77C16.96 2.98 14.7 2 12 2a10 10 0 0 0-8.85 5.58l3.24 2.5C7.2 7.65 9.4 5.89 12 5.89Z"
            fill="#EA4335"
          />
        </svg>
        {pending ? "Abrindo Google..." : "Continuar com Google"}
      </Button>

      {error ? (
        <p className={styles.socialError} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

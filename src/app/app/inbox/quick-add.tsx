"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { quickAddTaskAction, type QuickAddState } from "@/server/tasks/actions";

import styles from "./page.module.css";

const initialState: QuickAddState = {
  status: "idle",
  version: 0,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "Capturando…" : "Adicionar à Inbox"}
    </Button>
  );
}

export function QuickAdd() {
  const [state, formAction] = useActionState(quickAddTaskAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    formRef.current?.reset();
    const titleInput = document.getElementById("quick-add-title");

    if (titleInput instanceof HTMLInputElement) {
      titleInput.focus();
    }
  }, [state.status, state.version]);

  return (
    <form
      action={formAction}
      className={styles.quickAdd}
      noValidate
      ref={formRef}
    >
      <TextField
        autoComplete="off"
        error={state.fieldError}
        id="quick-add-title"
        label="Nova tarefa"
        maxLength={200}
        name="title"
        placeholder="Ex.: revisar capítulo 4"
      />

      <div className={styles.quickAddFooter}>
        <SubmitButton />
        <p aria-live="polite" className={styles.feedback}>
          {state.status === "success"
            ? "Adicionada à Inbox. Continue capturando se precisar."
            : (state.error ?? "Só o título é obrigatório. Organize depois.")}
        </p>
      </div>
    </form>
  );
}

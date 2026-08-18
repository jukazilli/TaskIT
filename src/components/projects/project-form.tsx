"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  projectColorOptions,
  projectIconOptions,
  projectStatusLabels,
  projectStatuses,
} from "@/features/projects/project-options";
import {
  createProjectAction,
  updateProjectAction,
  type ProjectFormState,
} from "@/server/projects/actions";
import type { Project } from "@/server/projects/projects";

import styles from "./project-form.module.css";

const initialState: ProjectFormState = {};

function SubmitButton({ editing }: Readonly<{ editing: boolean }>) {
  const { pending } = useFormStatus();

  return (
    <button className={styles.submit} disabled={pending} type="submit">
      {pending ? "Salvando…" : editing ? "Salvar alterações" : "Criar projeto"}
    </button>
  );
}

type ProjectFormProps = Readonly<{
  project?: Project;
}>;

export function ProjectForm({ project }: ProjectFormProps) {
  const editing = Boolean(project);
  const action = editing ? updateProjectAction : createProjectAction;
  const [state, formAction] = useActionState(action, initialState);
  const prefix = project?.id ?? "new-project";

  function fieldError(field: keyof NonNullable<ProjectFormState["fieldErrors"]>) {
    return state.fieldErrors?.[field];
  }

  return (
    <form action={formAction} className={styles.form}>
      {project ? <input name="projectId" type="hidden" value={project.id} /> : null}

      {state.error ? (
        <p className={styles.formError} role="alert">
          {state.error}
        </p>
      ) : null}

      <label className={styles.field} htmlFor={`${prefix}-name`}>
        <span>Nome</span>
        <input
          aria-describedby={fieldError("name") ? `${prefix}-name-error` : undefined}
          aria-invalid={fieldError("name") ? true : undefined}
          defaultValue={project?.name ?? ""}
          id={`${prefix}-name`}
          maxLength={120}
          name="name"
          placeholder="Ex.: Certificação AWS"
          required
        />
        {fieldError("name") ? (
          <small className={styles.fieldError} id={`${prefix}-name-error`}>
            {fieldError("name")}
          </small>
        ) : null}
      </label>

      <label className={styles.field} htmlFor={`${prefix}-description`}>
        <span>Descrição curta</span>
        <textarea
          aria-describedby={
            fieldError("description") ? `${prefix}-description-error` : undefined
          }
          aria-invalid={fieldError("description") ? true : undefined}
          defaultValue={project?.description ?? ""}
          id={`${prefix}-description`}
          maxLength={500}
          name="description"
          placeholder="O resultado que você quer alcançar."
          rows={3}
        />
        {fieldError("description") ? (
          <small className={styles.fieldError} id={`${prefix}-description-error`}>
            {fieldError("description")}
          </small>
        ) : (
          <small>Opcional. Mantenha apenas o contexto necessário.</small>
        )}
      </label>

      <div className={styles.twoColumns}>
        <label className={styles.field} htmlFor={`${prefix}-status`}>
          <span>Status</span>
          <select
            defaultValue={project?.status ?? "active"}
            id={`${prefix}-status`}
            name="status"
          >
            {projectStatuses.map((status) => (
              <option key={status} value={status}>
                {projectStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field} htmlFor={`${prefix}-due-date`}>
          <span>Prazo</span>
          <input
            aria-describedby={
              fieldError("dueDate") ? `${prefix}-due-date-error` : undefined
            }
            aria-invalid={fieldError("dueDate") ? true : undefined}
            defaultValue={project?.dueDate ?? ""}
            id={`${prefix}-due-date`}
            name="dueDate"
            type="date"
          />
          {fieldError("dueDate") ? (
            <small className={styles.fieldError} id={`${prefix}-due-date-error`}>
              {fieldError("dueDate")}
            </small>
          ) : null}
        </label>
      </div>

      <div className={styles.twoColumns}>
        <label className={styles.field} htmlFor={`${prefix}-color`}>
          <span>Cor</span>
          <select
            defaultValue={project?.colorKey ?? "lime"}
            id={`${prefix}-color`}
            name="colorKey"
          >
            {projectColorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field} htmlFor={`${prefix}-icon`}>
          <span>Ícone</span>
          <select
            defaultValue={project?.iconKey ?? "folder"}
            id={`${prefix}-icon`}
            name="iconKey"
          >
            {projectIconOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <SubmitButton editing={editing} />
    </form>
  );
}

import type { ComponentPropsWithoutRef } from "react";

import styles from "./text-field.module.css";

export type TextFieldProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "aria-describedby" | "aria-invalid" | "id"
> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({
  error,
  hint,
  id,
  label,
  className,
  ...props
}: TextFieldProps) {
  const message = error ?? hint;
  const messageId = message ? `${id}-message` : undefined;
  const inputClasses = [styles.input, error ? styles.invalid : undefined, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        {...props}
        aria-describedby={messageId}
        aria-invalid={error ? true : undefined}
        className={inputClasses}
        id={id}
      />
      {message ? (
        <p
          className={error ? styles.error : styles.hint}
          id={messageId}
          role={error ? "alert" : undefined}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

export type QuickAddInput = Readonly<{
  title: string;
}>;

export type QuickAddValidation =
  | Readonly<{ ok: true; value: QuickAddInput }>
  | Readonly<{ ok: false; error: string }>;

export function readQuickAddTitle(formData: FormData) {
  const value = formData.get("title");
  return typeof value === "string" ? value : "";
}

export function parseQuickAddInput(formData: FormData): QuickAddValidation {
  const title = readQuickAddTitle(formData).trim();

  if (!title) {
    return { ok: false, error: "Digite um título para capturar a tarefa." };
  }

  if (title.length > 200) {
    return { ok: false, error: "Use no máximo 200 caracteres." };
  }

  return { ok: true, value: { title } };
}

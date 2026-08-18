import {
  isProjectColorKey,
  isProjectIconKey,
  isProjectStatus,
  type ProjectColorKey,
  type ProjectIconKey,
  type ProjectStatus,
} from "@/features/projects/project-options";

export type ProjectInput = Readonly<{
  name: string;
  description: string | null;
  status: ProjectStatus;
  dueDate: string | null;
  colorKey: ProjectColorKey;
  iconKey: ProjectIconKey;
}>;

export type ProjectField =
  | "name"
  | "description"
  | "status"
  | "dueDate"
  | "colorKey"
  | "iconKey";

export type ProjectValidationResult =
  | Readonly<{ ok: true; value: ProjectInput }>
  | Readonly<{
      ok: false;
      fieldErrors: Partial<Record<ProjectField, string>>;
    }>;

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function parseProjectInput(formData: FormData): ProjectValidationResult {
  const name = readField(formData, "name");
  const descriptionValue = readField(formData, "description");
  const status = readField(formData, "status");
  const dueDateValue = readField(formData, "dueDate");
  const colorKey = readField(formData, "colorKey");
  const iconKey = readField(formData, "iconKey");

  const fieldErrors: Partial<Record<ProjectField, string>> = {};

  if (!name || name.length > 120) {
    fieldErrors.name = "Use um nome entre 1 e 120 caracteres.";
  }

  if (descriptionValue.length > 500) {
    fieldErrors.description = "A descrição deve ter no máximo 500 caracteres.";
  }

  if (!isProjectStatus(status)) {
    fieldErrors.status = "Escolha um status válido.";
  }

  if (dueDateValue && !isIsoDate(dueDateValue)) {
    fieldErrors.dueDate = "Informe uma data válida.";
  }

  if (!isProjectColorKey(colorKey)) {
    fieldErrors.colorKey = "Escolha uma cor disponível.";
  }

  if (!isProjectIconKey(iconKey)) {
    fieldErrors.iconKey = "Escolha um ícone disponível.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: {
      name,
      description: descriptionValue || null,
      status: status as ProjectStatus,
      dueDate: dueDateValue || null,
      colorKey: colorKey as ProjectColorKey,
      iconKey: iconKey as ProjectIconKey,
    },
  };
}

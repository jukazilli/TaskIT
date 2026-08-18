export const projectStatuses = ["active", "paused", "completed"] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

export const projectStatusLabels: Record<ProjectStatus, string> = {
  active: "Ativo",
  paused: "Pausado",
  completed: "Concluído",
};

export const projectColorOptions = [
  { value: "lime", label: "Lima" },
  { value: "lime-soft", label: "Lima suave" },
  { value: "neutral", label: "Neutro" },
] as const;
export type ProjectColorKey = (typeof projectColorOptions)[number]["value"];

export const projectIconOptions = [
  { value: "folder", label: "Pasta" },
  { value: "book", label: "Livro" },
  { value: "target", label: "Objetivo" },
  { value: "certificate", label: "Certificação" },
] as const;
export type ProjectIconKey = (typeof projectIconOptions)[number]["value"];

export function isProjectStatus(value: string): value is ProjectStatus {
  return projectStatuses.includes(value as ProjectStatus);
}

export function isProjectColorKey(value: string): value is ProjectColorKey {
  return projectColorOptions.some((option) => option.value === value);
}

export function isProjectIconKey(value: string): value is ProjectIconKey {
  return projectIconOptions.some((option) => option.value === value);
}

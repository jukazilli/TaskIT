"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAuthSession } from "@/server/auth/session";
import {
  DatabaseConfigurationError,
  DatabaseUnavailableError,
} from "@/server/db/client";
import {
  ProjectNotFoundError,
  ProjectUserMissingError,
  archiveProject,
  createProject,
  updateProject,
} from "@/server/projects/projects";
import {
  parseProjectInput,
  type ProjectField,
} from "@/server/projects/project-input";

export type ProjectFormState = Readonly<{
  error?: string;
  fieldErrors?: Partial<Record<ProjectField, string>>;
}>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function requireSession(returnTo: string) {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  return session;
}

function readProjectId(formData: FormData) {
  const value = formData.get("projectId");

  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    return null;
  }

  return value;
}

function projectMutationError(error: unknown): ProjectFormState | null {
  if (
    error instanceof DatabaseConfigurationError ||
    error instanceof DatabaseUnavailableError ||
    error instanceof ProjectUserMissingError
  ) {
    return { error: "Não foi possível salvar o projeto agora. Tente novamente." };
  }

  if (error instanceof ProjectNotFoundError) {
    return { error: "O projeto não está mais disponível para edição." };
  }

  return null;
}

export async function createProjectAction(
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const session = await requireSession("/app/projects?mode=create");
  const validation = parseProjectInput(formData);

  if (!validation.ok) {
    return { fieldErrors: validation.fieldErrors };
  }

  try {
    await createProject(session.subject, validation.value);
    revalidatePath("/app/projects");
  } catch (error) {
    const knownError = projectMutationError(error);

    if (knownError) {
      return knownError;
    }

    throw error;
  }

  redirect("/app/projects");
}

export async function updateProjectAction(
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const projectId = readProjectId(formData);

  if (!projectId) {
    return { error: "O projeto não pôde ser identificado." };
  }

  const session = await requireSession(`/app/projects?edit=${projectId}`);
  const validation = parseProjectInput(formData);

  if (!validation.ok) {
    return { fieldErrors: validation.fieldErrors };
  }

  try {
    await updateProject(session.subject, projectId, validation.value);
    revalidatePath("/app/projects");
  } catch (error) {
    const knownError = projectMutationError(error);

    if (knownError) {
      return knownError;
    }

    throw error;
  }

  redirect("/app/projects");
}

export async function archiveProjectAction(formData: FormData) {
  const projectId = readProjectId(formData);

  if (!projectId) {
    redirect("/app/projects?error=archive-failed");
  }

  const session = await requireSession("/app/projects");
  let failed = false;

  try {
    await archiveProject(session.subject, projectId);
    revalidatePath("/app/projects");
  } catch (error) {
    if (
      error instanceof DatabaseConfigurationError ||
      error instanceof DatabaseUnavailableError ||
      error instanceof ProjectNotFoundError
    ) {
      failed = true;
    } else {
      throw error;
    }
  }

  redirect(failed ? "/app/projects?error=archive-failed" : "/app/projects");
}

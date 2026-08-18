"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAuthSession } from "@/server/auth/session";
import {
  DatabaseConfigurationError,
  DatabaseUnavailableError,
} from "@/server/db/client";
import { TaskUserMissingError, createInboxTask } from "@/server/tasks/tasks";
import {
  parseQuickAddInput,
  readQuickAddTitle,
} from "@/server/tasks/task-input";

export type QuickAddState = Readonly<{
  status: "idle" | "error" | "success";
  version: number;
  title?: string;
  fieldError?: string;
  error?: string;
}>;

export async function quickAddTaskAction(
  previousState: QuickAddState,
  formData: FormData,
): Promise<QuickAddState> {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?returnTo=%2Fapp%2Finbox");
  }

  const title = readQuickAddTitle(formData);
  const validation = parseQuickAddInput(formData);
  const version = previousState.version + 1;

  if (!validation.ok) {
    return {
      status: "error",
      version,
      title,
      fieldError: validation.error,
    };
  }

  try {
    await createInboxTask(session.subject, validation.value);
    revalidatePath("/app/inbox");
  } catch (error) {
    if (
      error instanceof DatabaseConfigurationError ||
      error instanceof DatabaseUnavailableError ||
      error instanceof TaskUserMissingError
    ) {
      return {
        status: "error",
        version,
        title,
        error: "Não foi possível capturar a tarefa agora. Tente novamente.",
      };
    }

    throw error;
  }

  return { status: "success", version };
}

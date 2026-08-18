"use server";

import { redirect } from "next/navigation";

import {
  DatabaseConfigurationError,
  DatabaseUnavailableError,
} from "@/server/db/client";
import { getCurrentAuthSession } from "@/server/auth/session";
import { parseOnboardingPreferences } from "@/server/onboarding/preferences";
import { completeUserOnboarding } from "@/server/users/preferences";

export async function completeOnboardingAction(formData: FormData) {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?returnTo=%2Fonboarding");
  }

  const validation = parseOnboardingPreferences(formData);

  if (!validation.ok) {
    redirect("/onboarding?error=invalid-preferences");
  }

  try {
    await completeUserOnboarding(session.subject, validation.value);
  } catch (error) {
    if (
      error instanceof DatabaseConfigurationError ||
      error instanceof DatabaseUnavailableError
    ) {
      redirect("/onboarding?error=unavailable");
    }

    throw error;
  }

  redirect("/app/today");
}

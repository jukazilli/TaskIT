import type { OnboardingPreferencesInput } from "@/server/users/preferences";

export type OnboardingValidationResult =
  | Readonly<{ ok: true; value: OnboardingPreferencesInput }>
  | Readonly<{ ok: false }>;

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function isValidTimeZone(timezone: string) {
  if (!timezone || timezone.length > 100) {
    return false;
  }

  try {
    new Intl.DateTimeFormat("pt-BR", { timeZone: timezone }).format();
    return true;
  } catch {
    return false;
  }
}

export function parseOnboardingPreferences(
  formData: FormData,
): OnboardingValidationResult {
  const timezone = readField(formData, "timezone");
  const weekStart = Number(readField(formData, "weekStart"));
  const defaultSessionMinutes = Number(
    readField(formData, "defaultSessionMinutes"),
  );

  if (
    !isValidTimeZone(timezone) ||
    !Number.isInteger(weekStart) ||
    weekStart < 1 ||
    weekStart > 7 ||
    !Number.isInteger(defaultSessionMinutes) ||
    defaultSessionMinutes < 5 ||
    defaultSessionMinutes > 240
  ) {
    return { ok: false };
  }

  return {
    ok: true,
    value: {
      timezone,
      weekStart,
      defaultSessionMinutes,
    },
  };
}

import {
  DatabaseConfigurationError,
  DatabaseUnavailableError,
  getSql,
} from "@/server/db/client";

export type UserPreferences = Readonly<{
  userId: string;
  timezone: string;
  weekStart: number;
  defaultSessionMinutes: number;
  onboardingCompleted: boolean;
}>;

export type OnboardingPreferencesInput = Readonly<{
  timezone: string;
  weekStart: number;
  defaultSessionMinutes: number;
}>;

type PreferencesRow = {
  user_id: string;
  timezone: string;
  week_start: number;
  default_session_minutes: number;
  onboarding_completed_at: string | null;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function assertAuthSubject(subject: string) {
  if (!UUID_PATTERN.test(subject)) {
    throw new Error("Authenticated subject is not a valid UUID.");
  }
}

function toPreferences(row: PreferencesRow): UserPreferences {
  return {
    userId: row.user_id,
    timezone: row.timezone,
    weekStart: Number(row.week_start),
    defaultSessionMinutes: Number(row.default_session_minutes),
    onboardingCompleted: Boolean(row.onboarding_completed_at),
  };
}

function rethrowDatabaseError(error: unknown): never {
  if (error instanceof DatabaseConfigurationError) {
    throw error;
  }

  throw new DatabaseUnavailableError();
}

export async function ensureUserPreferences(
  authSubject: string,
): Promise<UserPreferences> {
  assertAuthSubject(authSubject);

  try {
    const sql = getSql();
    const rows = (await sql.query(
      `WITH resolved_user AS (
         INSERT INTO taskit.app_user (auth_subject)
         VALUES ($1::uuid)
         ON CONFLICT (auth_subject)
         DO UPDATE SET auth_subject = EXCLUDED.auth_subject
         RETURNING id
       )
       INSERT INTO taskit.user_preferences (user_id)
       SELECT id FROM resolved_user
       ON CONFLICT (user_id)
       DO UPDATE SET user_id = EXCLUDED.user_id
       RETURNING user_id, timezone, week_start, default_session_minutes,
                 onboarding_completed_at`,
      [authSubject],
    )) as unknown as PreferencesRow[];

    const row = rows[0];

    if (!row) {
      throw new DatabaseUnavailableError();
    }

    return toPreferences(row);
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      throw error;
    }

    rethrowDatabaseError(error);
  }
}

export async function completeUserOnboarding(
  authSubject: string,
  input: OnboardingPreferencesInput,
): Promise<UserPreferences> {
  assertAuthSubject(authSubject);

  try {
    await ensureUserPreferences(authSubject);

    const sql = getSql();
    const rows = (await sql.query(
      `UPDATE taskit.user_preferences AS preferences
       SET timezone = $2,
           week_start = $3,
           default_session_minutes = $4,
           onboarding_completed_at = COALESCE(onboarding_completed_at, now()),
           updated_at = now()
       FROM taskit.app_user AS app_user
       WHERE preferences.user_id = app_user.id
         AND app_user.auth_subject = $1::uuid
       RETURNING preferences.user_id,
                 preferences.timezone,
                 preferences.week_start,
                 preferences.default_session_minutes,
                 preferences.onboarding_completed_at`,
      [
        authSubject,
        input.timezone,
        input.weekStart,
        input.defaultSessionMinutes,
      ],
    )) as unknown as PreferencesRow[];

    const row = rows[0];

    if (!row) {
      throw new DatabaseUnavailableError();
    }

    return toPreferences(row);
  } catch (error) {
    if (
      error instanceof DatabaseConfigurationError ||
      error instanceof DatabaseUnavailableError
    ) {
      throw error;
    }

    rethrowDatabaseError(error);
  }
}

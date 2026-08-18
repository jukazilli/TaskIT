BEGIN;

ALTER TABLE taskit.user_preferences
  ADD COLUMN onboarding_completed_at timestamptz;

COMMIT;

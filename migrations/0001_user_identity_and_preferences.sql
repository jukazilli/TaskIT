BEGIN;

CREATE SCHEMA IF NOT EXISTS taskit;

CREATE TABLE taskit.app_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_subject uuid NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE taskit.user_preferences (
  user_id uuid PRIMARY KEY REFERENCES taskit.app_user(id) ON DELETE CASCADE,
  timezone text NOT NULL DEFAULT 'UTC',
  week_start smallint NOT NULL DEFAULT 1,
  default_session_minutes smallint NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_preferences_timezone_not_blank CHECK (
    length(btrim(timezone)) BETWEEN 1 AND 100
  ),
  CONSTRAINT user_preferences_week_start_iso CHECK (week_start BETWEEN 1 AND 7),
  CONSTRAINT user_preferences_session_duration CHECK (
    default_session_minutes BETWEEN 5 AND 240
  )
);

CREATE TABLE taskit.availability_window (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES taskit.app_user(id) ON DELETE CASCADE,
  weekday smallint NOT NULL,
  start_minute smallint NOT NULL,
  end_minute smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT availability_window_weekday_iso CHECK (weekday BETWEEN 1 AND 7),
  CONSTRAINT availability_window_start_minute CHECK (
    start_minute BETWEEN 0 AND 1439
  ),
  CONSTRAINT availability_window_end_minute CHECK (
    end_minute BETWEEN 1 AND 1440
  ),
  CONSTRAINT availability_window_order CHECK (start_minute < end_minute),
  CONSTRAINT availability_window_unique UNIQUE (
    user_id,
    weekday,
    start_minute,
    end_minute
  )
);

CREATE INDEX availability_window_user_schedule_idx
  ON taskit.availability_window (user_id, weekday, start_minute);

COMMIT;

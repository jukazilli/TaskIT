BEGIN;

CREATE TABLE taskit.project (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES taskit.app_user(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active',
  due_date date,
  color_key text NOT NULL DEFAULT 'lime',
  icon_key text NOT NULL DEFAULT 'folder',
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT project_name_length CHECK (length(btrim(name)) BETWEEN 1 AND 120),
  CONSTRAINT project_description_length CHECK (
    description IS NULL OR length(description) <= 500
  ),
  CONSTRAINT project_status_valid CHECK (
    status IN ('active', 'paused', 'completed')
  ),
  CONSTRAINT project_color_key_valid CHECK (
    color_key ~ '^[a-z0-9-]{1,32}$'
  ),
  CONSTRAINT project_icon_key_valid CHECK (
    icon_key ~ '^[a-z0-9-]{1,32}$'
  )
);

CREATE INDEX project_user_active_idx
  ON taskit.project (user_id, status, updated_at DESC)
  WHERE archived_at IS NULL;

CREATE INDEX project_user_archive_idx
  ON taskit.project (user_id, archived_at DESC)
  WHERE archived_at IS NOT NULL;

CREATE INDEX project_user_due_date_idx
  ON taskit.project (user_id, due_date)
  WHERE archived_at IS NULL AND due_date IS NOT NULL;

COMMIT;

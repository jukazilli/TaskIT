BEGIN;

ALTER TABLE taskit.project
  ADD CONSTRAINT project_id_user_unique UNIQUE (id, user_id);

CREATE TABLE taskit.task (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES taskit.app_user(id) ON DELETE CASCADE,
  project_id uuid,
  title text NOT NULL,
  notes text,
  priority text NOT NULL DEFAULT 'normal',
  due_date date,
  estimate_minutes integer,
  status text NOT NULL DEFAULT 'inbox',
  completed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT task_title_length CHECK (
    length(btrim(title)) BETWEEN 1 AND 200
  ),
  CONSTRAINT task_notes_length CHECK (
    notes IS NULL OR length(notes) <= 2000
  ),
  CONSTRAINT task_priority_valid CHECK (
    priority IN ('low', 'normal', 'high')
  ),
  CONSTRAINT task_estimate_minutes_valid CHECK (
    estimate_minutes IS NULL OR estimate_minutes BETWEEN 1 AND 10080
  ),
  CONSTRAINT task_status_valid CHECK (
    status IN ('inbox', 'planned', 'in_progress', 'completed', 'archived')
  ),
  CONSTRAINT task_project_owner_fk FOREIGN KEY (project_id, user_id)
    REFERENCES taskit.project(id, user_id)
);

CREATE INDEX task_user_status_idx
  ON taskit.task (user_id, status, updated_at DESC);

CREATE INDEX task_user_inbox_idx
  ON taskit.task (user_id, created_at DESC)
  WHERE status = 'inbox';

CREATE INDEX task_user_project_idx
  ON taskit.task (user_id, project_id, status, updated_at DESC)
  WHERE project_id IS NOT NULL;

CREATE INDEX task_user_due_date_idx
  ON taskit.task (user_id, due_date)
  WHERE status <> 'archived' AND due_date IS NOT NULL;

COMMIT;

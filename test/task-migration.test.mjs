import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = new URL(
  "../migrations/0004_task_schema.sql",
  import.meta.url,
);

test("task migration keeps projects optional and enforces same-user project ownership", async () => {
  const migration = await readFile(migrationPath, "utf8");

  assert.match(migration, /CREATE TABLE taskit\.task/);
  assert.match(migration, /project_id uuid,/);
  assert.match(
    migration,
    /FOREIGN KEY \(project_id, user_id\)[\s\S]*REFERENCES taskit\.project\(id, user_id\)/,
  );
  assert.match(
    migration,
    /ADD CONSTRAINT project_id_user_unique UNIQUE \(id, user_id\)/,
  );
});

test("task migration supports the canonical MVP task attributes", async () => {
  const migration = await readFile(migrationPath, "utf8");

  assert.match(migration, /priority IN \('low', 'normal', 'high'\)/);
  assert.match(migration, /due_date date/);
  assert.match(migration, /estimate_minutes integer/);
  assert.match(
    migration,
    /status IN \('inbox', 'planned', 'in_progress', 'completed', 'archived'\)/,
  );
  assert.match(migration, /notes text/);
});

test("task migration creates inbox, project and due-date access paths", async () => {
  const migration = await readFile(migrationPath, "utf8");

  assert.match(migration, /CREATE INDEX task_user_inbox_idx/);
  assert.match(migration, /CREATE INDEX task_user_project_idx/);
  assert.match(migration, /CREATE INDEX task_user_due_date_idx/);
});

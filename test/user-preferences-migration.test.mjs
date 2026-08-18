import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../migrations/0001_user_identity_and_preferences.sql",
  import.meta.url,
);

async function migrationSql() {
  return readFile(migrationUrl, "utf8");
}

test("user identity stays outside the provider-owned auth schema", async () => {
  const sql = await migrationSql();

  assert.match(sql, /CREATE SCHEMA IF NOT EXISTS taskit;/);
  assert.match(sql, /auth_subject uuid NOT NULL UNIQUE/);
  assert.doesNotMatch(sql, /REFERENCES\s+neon_auth\./i);
  assert.doesNotMatch(sql, /ALTER\s+(?:TABLE|SCHEMA)\s+neon_auth/i);
});

test("preferences have safe defaults and belong to an internal user", async () => {
  const sql = await migrationSql();

  assert.match(
    sql,
    /user_id uuid PRIMARY KEY REFERENCES taskit\.app_user\(id\) ON DELETE CASCADE/,
  );
  assert.match(sql, /timezone text NOT NULL DEFAULT 'UTC'/);
  assert.match(sql, /week_start smallint NOT NULL DEFAULT 1/);
  assert.match(sql, /default_session_minutes smallint NOT NULL DEFAULT 50/);
});

test("availability is modeled as owned weekly windows", async () => {
  const sql = await migrationSql();

  assert.match(
    sql,
    /user_id uuid NOT NULL REFERENCES taskit\.app_user\(id\) ON DELETE CASCADE/,
  );
  assert.match(sql, /weekday BETWEEN 1 AND 7/);
  assert.match(sql, /start_minute < end_minute/);
  assert.match(sql, /availability_window_user_schedule_idx/);
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL("../migrations/0003_project_schema.sql", import.meta.url);

async function migrationSql() {
  return readFile(migrationUrl, "utf8");
}

test("projects belong to an internal TaskIT user", async () => {
  const sql = await migrationSql();

  assert.match(
    sql,
    /user_id uuid NOT NULL REFERENCES taskit\.app_user\(id\) ON DELETE CASCADE/,
  );
  assert.doesNotMatch(sql, /REFERENCES\s+neon_auth\./i);
});

test("project fields cover the canonical product requirements", async () => {
  const sql = await migrationSql();

  assert.match(sql, /name text NOT NULL/);
  assert.match(sql, /description text/);
  assert.match(sql, /status text NOT NULL DEFAULT 'active'/);
  assert.match(sql, /due_date date/);
  assert.match(sql, /color_key text NOT NULL DEFAULT 'lime'/);
  assert.match(sql, /icon_key text NOT NULL DEFAULT 'folder'/);
});

test("archive stays queryable and independent from project status", async () => {
  const sql = await migrationSql();

  assert.match(sql, /archived_at timestamptz/);
  assert.match(sql, /status IN \('active', 'paused', 'completed'\)/);
  assert.match(sql, /WHERE archived_at IS NULL/);
  assert.match(sql, /WHERE archived_at IS NOT NULL/);
});

test("project text and visual identity remain bounded", async () => {
  const sql = await migrationSql();

  assert.match(sql, /length\(btrim\(name\)\) BETWEEN 1 AND 120/);
  assert.match(sql, /length\(description\) <= 500/);
  assert.match(sql, /color_key ~ '\^\[a-z0-9-\]\{1,32\}\$'/);
  assert.match(sql, /icon_key ~ '\^\[a-z0-9-\]\{1,32\}\$'/);
});

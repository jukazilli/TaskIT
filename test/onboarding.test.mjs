import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const urls = {
  migration: new URL(
    "../migrations/0002_onboarding_state.sql",
    import.meta.url,
  ),
  page: new URL("../src/app/onboarding/page.tsx", import.meta.url),
  action: new URL("../src/server/onboarding/actions.ts", import.meta.url),
  repository: new URL("../src/server/users/preferences.ts", import.meta.url),
  appLayout: new URL("../src/app/app/layout.tsx", import.meta.url),
  dbClient: new URL("../src/server/db/client.ts", import.meta.url),
};

async function read(key) {
  return readFile(urls[key], "utf8");
}

test("onboarding completion is stored explicitly", async () => {
  const migration = await read("migration");

  assert.match(migration, /ADD COLUMN onboarding_completed_at timestamptz/);
});

test("onboarding stays minimal and Calendar remains optional", async () => {
  const page = await read("page");

  assert.match(page, /Como sua semana funciona\?/);
  assert.match(page, /Google Calendar é opcional\./);
  assert.match(page, /Nenhuma permissão Google é necessária para\s+continuar\./);
  assert.match(page, /name="timezone"|TimezoneField/);
  assert.match(page, /name="weekStart"/);
  assert.match(page, /name="defaultSessionMinutes"/);
  assert.doesNotMatch(page, /calendar\.events|calendar\.readonly|oauth/i);
});

test("server action derives ownership from the authenticated session", async () => {
  const action = await read("action");
  const repository = await read("repository");

  assert.match(action, /getCurrentAuthSession\(\)/);
  assert.match(action, /completeUserOnboarding\(session\.subject/);
  assert.match(action, /redirect\("\/app\/today"\)/);
  assert.doesNotMatch(action, /formData\.get\(["']user/i);

  assert.match(repository, /app_user\.auth_subject = \$1::uuid/);
  assert.match(repository, /onboarding_completed_at = COALESCE/);
});

test("app shell sends incomplete profiles to onboarding", async () => {
  const layout = await read("appLayout");

  assert.match(layout, /ensureUserPreferences\(session\.subject\)/);
  assert.match(layout, /!preferences\.onboardingCompleted/);
  assert.match(layout, /redirect\("\/onboarding"\)/);
});

test("database client is configured lazily and remains server-only", async () => {
  const client = await read("dbClient");

  assert.match(client, /process\.env\.DATABASE_URL/);
  assert.match(client, /export function getSql/);
  assert.doesNotMatch(client, /NEXT_PUBLIC_DATABASE_URL/);
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const urls = {
  actions: new URL("../src/server/projects/actions.ts", import.meta.url),
  repository: new URL("../src/server/projects/projects.ts", import.meta.url),
  input: new URL("../src/server/projects/project-input.ts", import.meta.url),
  page: new URL("../src/app/app/projects/page.tsx", import.meta.url),
  loading: new URL("../src/app/app/projects/loading.tsx", import.meta.url),
  error: new URL("../src/app/app/projects/error.tsx", import.meta.url),
};

async function read(key) {
  return readFile(urls[key], "utf8");
}

test("project mutations derive ownership from the authenticated session", async () => {
  const actions = await read("actions");

  assert.match(actions, /getCurrentAuthSession\(\)/);
  assert.match(actions, /createProject\(session\.subject/);
  assert.match(actions, /updateProject\(session\.subject/);
  assert.match(actions, /archiveProject\(session\.subject/);
  assert.doesNotMatch(actions, /formData\.get\(["']user/i);
});

test("project repository scopes reads and writes through app_user auth subject", async () => {
  const repository = await read("repository");

  assert.match(repository, /app_user\.auth_subject = \$1::uuid/g);
  assert.match(repository, /project\.user_id = app_user\.id/g);
  assert.match(repository, /project\.archived_at IS NULL/);
  assert.match(repository, /project\.archived_at IS NOT NULL/);
  assert.doesNotMatch(repository, /DELETE FROM taskit\.project/i);
  assert.match(
    repository,
    /archived_at = COALESCE\(project\.archived_at, now\(\)\)/,
  );
});

test("project form validation keeps persisted options controlled", async () => {
  const input = await read("input");

  assert.match(input, /name\.length > 120/);
  assert.match(input, /descriptionValue\.length > 500/);
  assert.match(input, /isProjectStatus\(status\)/);
  assert.match(input, /isProjectColorKey\(colorKey\)/);
  assert.match(input, /isProjectIconKey\(iconKey\)/);
  assert.match(input, /isIsoDate\(dueDateValue\)/);
});

test("projects surface active, archived, loading and recovery states", async () => {
  const page = await read("page");
  const loading = await read("loading");
  const error = await read("error");

  assert.match(page, />Ativos</);
  assert.match(page, />\s*Arquivados\s*</);
  assert.match(page, /Novo projeto/);
  assert.match(page, /archiveProjectAction/);
  assert.match(page, /ProjectForm/);
  assert.match(loading, /Carregando seus projetos/);
  assert.match(error, /Tentar novamente/);
});

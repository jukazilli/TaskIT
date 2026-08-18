import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const urls = {
  action: new URL("../src/server/tasks/actions.ts", import.meta.url),
  input: new URL("../src/server/tasks/task-input.ts", import.meta.url),
  repository: new URL("../src/server/tasks/tasks.ts", import.meta.url),
  quickAdd: new URL("../src/app/app/inbox/quick-add.tsx", import.meta.url),
  page: new URL("../src/app/app/inbox/page.tsx", import.meta.url),
  loading: new URL("../src/app/app/inbox/loading.tsx", import.meta.url),
  error: new URL("../src/app/app/inbox/error.tsx", import.meta.url),
};

async function read(key) {
  return readFile(urls[key], "utf8");
}

test("quick add requires only a bounded title", async () => {
  const input = await read("input");

  assert.match(input, /formData\.get\(["']title["']\)/);
  assert.match(input, /title\.length > 200/);
  assert.doesNotMatch(input, /projectId|priority|estimate|dueDate/);
});

test("quick add derives ownership from the authenticated server session", async () => {
  const action = await read("action");
  const repository = await read("repository");

  assert.match(action, /getCurrentAuthSession\(\)/);
  assert.match(action, /createInboxTask\(session\.subject/);
  assert.doesNotMatch(action, /formData\.get\(["']user/i);
  assert.match(repository, /app_user\.auth_subject = \$1::uuid/);
  assert.match(
    repository,
    /INSERT INTO taskit\.task \(user_id, title, status\)/,
  );
  assert.match(repository, /'inbox'/);
});

test("quick add preserves failed input and restores focus after success", async () => {
  const action = await read("action");
  const quickAdd = await read("quickAdd");

  assert.match(action, /title,/);
  assert.match(quickAdd, /formRef\.current\?\.reset\(\)/);
  assert.match(quickAdd, /titleInput\.focus\(\)/);
  assert.match(quickAdd, /aria-live="polite"/);
});

test("inbox exposes empty loading and recovery states", async () => {
  const page = await read("page");
  const loading = await read("loading");
  const error = await read("error");

  assert.match(page, /Sua Inbox está vazia/);
  assert.match(page, /listInboxTasks\(session\.subject\)/);
  assert.match(loading, /Carregando sua Inbox/);
  assert.match(error, /Tentar novamente/);
});

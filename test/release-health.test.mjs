import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const healthUrl = new URL("../src/app/api/health/route.ts", import.meta.url);
const agentsUrl = new URL("../AGENTS.md", import.meta.url);
const qualityUrl = new URL("../.github/workflows/quality.yml", import.meta.url);
const packageUrl = new URL("../package.json", import.meta.url);
const nvmrcUrl = new URL("../.nvmrc", import.meta.url);

async function read(url) {
  return readFile(url, "utf8");
}

test("health exposes deployment identity without exposing secret values", async () => {
  const source = await read(healthUrl);

  assert.match(source, /VERCEL_GIT_COMMIT_SHA/);
  assert.match(source, /VERCEL_ENV/);
  assert.match(source, /databaseBranch: databaseHealth\.branchId/);
  assert.match(source, /status: ready \? "ok" : "degraded"/);
  assert.match(source, /auth: authConfigured/);
  assert.match(
    source,
    /database: databaseConfigured && databaseHealth\.reachable/,
  );
  assert.doesNotMatch(source, /NEON_AUTH_COOKIE_SECRET[,}]/);
  assert.doesNotMatch(source, /DATABASE_URL[,}]/);
});

test("health verifies the real Neon runtime instead of env presence only", async () => {
  const source = await read(healthUrl);

  assert.match(source, /getSql\(\)/);
  assert.match(source, /current_setting\('neon\.branch_id', true\)/);
  assert.match(source, /current_setting\('neon\.endpoint_id', true\)/);
  assert.match(source, /to_regclass\('taskit\.app_user'\)/);
  assert.match(source, /to_regclass\('taskit\.project'\)/);
  assert.match(source, /to_regclass\('taskit\.task'\)/);
  assert.match(source, /schema: databaseHealth\.schemaReady/);
});

test("health requires Neon Auth and database to resolve to the same endpoint", async () => {
  const source = await read(healthUrl);

  assert.match(source, /readAuthEndpointId/);
  assert.match(source, /databaseHealth\.endpointId === authEndpointId/);
  assert.match(source, /authDatabaseAligned/);
});

test("Vercel deployments fail health readiness when required runtime config is absent or unhealthy", async () => {
  const source = await read(healthUrl);

  assert.match(source, /process\.env\.VERCEL === "1"/);
  assert.match(source, /databaseHealth\.reachable/);
  assert.match(source, /databaseHealth\.schemaReady/);
  assert.match(source, /authDatabaseAligned/);
  assert.match(source, /status: ready \? 200 : 503/);
  assert.match(source, /Cache-Control/);
});

test("local CI and Vercel use the same Node major", async () => {
  const quality = await read(qualityUrl);
  const packageJson = JSON.parse(await read(packageUrl));
  const nvmrc = (await read(nvmrcUrl)).trim();

  assert.equal(packageJson.engines.node, "24.x");
  assert.equal(nvmrc, "24");
  assert.match(quality, /node-version: 24/g);
  assert.match(quality, /actions\/checkout@v6/g);
  assert.match(quality, /actions\/setup-node@v6/g);
});

test("agents must verify the exact Vercel SHA before delivery", async () => {
  const agents = await read(agentsUrl);

  assert.match(agents, /SHA exato/);
  assert.match(agents, /\/api\/health/);
  assert.match(agents, /deployment `production`/);
  assert.match(agents, /permanece \*\*não concluída\*\*/);
});

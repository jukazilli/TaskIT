import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("../src/app/page.tsx", import.meta.url);
const tsconfigUrl = new URL("../tsconfig.json", import.meta.url);

test("bootstrap keeps TaskIT identity in the root page", async () => {
  const page = await readFile(pageUrl, "utf8");

  assert.match(page, /TaskIT/);
});

test("TypeScript strict mode remains enabled", async () => {
  const tsconfig = JSON.parse(await readFile(tsconfigUrl, "utf8"));

  assert.equal(tsconfig.compilerOptions.strict, true);
  assert.equal(tsconfig.compilerOptions.noEmit, true);
});

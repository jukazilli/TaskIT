import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const tokensPath = new URL("../src/styles/tokens.css", import.meta.url);
const layoutPath = new URL("../src/app/layout.tsx", import.meta.url);
const globalsPath = new URL("../src/app/globals.css", import.meta.url);

test("TaskIT exposes the canonical brand and surface tokens", async () => {
  const tokens = await readFile(tokensPath, "utf8");

  assert.match(tokens, /--color-brand-500:\s*#b9f227/);
  assert.match(tokens, /--color-ink-950:\s*#172019/);
  assert.match(tokens, /--color-surface-0:\s*#ffffff/);
  assert.match(tokens, /--focus-ring-width:\s*2px/);
});

test("TaskIT applies Nunito directly from the root layout", async () => {
  const layout = await readFile(layoutPath, "utf8");
  const tokens = await readFile(tokensPath, "utf8");

  assert.match(layout, /Nunito/);
  assert.match(layout, /<html[^>]*className=\{nunito\.className\}/);
  assert.doesNotMatch(layout, /variable:\s*["']--font-nunito["']/);
  assert.doesNotMatch(tokens, /--font-sans/);
});

test("global styles consume tokens and respect reduced motion", async () => {
  const globals = await readFile(globalsPath, "utf8");

  assert.doesNotMatch(globals, /font-family:\s*var\(--font-sans\)/);
  assert.match(globals, /:focus-visible/);
  assert.match(globals, /prefers-reduced-motion:\s*reduce/);
});

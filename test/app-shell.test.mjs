import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const shellSourceUrl = new URL(
  "../src/components/app-shell/app-shell.tsx",
  import.meta.url,
);
const shellStylesUrl = new URL(
  "../src/components/app-shell/app-shell.module.css",
  import.meta.url,
);
const appLayoutUrl = new URL("../src/app/app/layout.tsx", import.meta.url);
const appRootUrl = new URL("../src/app/app/page.tsx", import.meta.url);

async function read(url) {
  return readFile(url, "utf8");
}

test("desktop and mobile preserve the same primary product destinations", async () => {
  const source = await read(shellSourceUrl);

  for (const destination of [
    "Hoje",
    "Semana",
    "Projetos",
    "Cronograma",
    "Inbox",
  ]) {
    assert.match(source, new RegExp(`label: \\"${destination}\\"`));
  }

  assert.match(source, /mobileNav = primaryNav\.filter/);
  assert.match(source, /item\.href !== "\/app\/timeline"/);
  assert.match(source, /href="\/app\/timeline">Cronograma/);
  assert.match(source, /href="\/app\/settings">Configurações/);
});

test("mobile shell uses touch-sized solid navigation surfaces", async () => {
  const css = await read(shellStylesUrl);

  assert.match(css, /@media \(max-width: 47\.999rem\)/);
  assert.match(css, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(css, /min-height: 3\.75rem/);
  assert.match(css, /background: var\(--color-surface\)/);
  assert.doesNotMatch(
    css,
    /backdrop-filter|color-mix|linear-gradient|radial-gradient/i,
  );
});

test("all app routes share server-side session protection", async () => {
  const layout = await read(appLayoutUrl);
  const root = await read(appRootUrl);

  assert.match(layout, /getCurrentAuthSession\(\)/);
  assert.match(layout, /redirect\("\/login\?returnTo=%2Fapp%2Ftoday"\)/);
  assert.match(layout, /<AppShell/);
  assert.match(root, /redirect\("\/app\/today"\)/);
});

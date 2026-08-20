import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const googleSignInPath = new URL(
  "../src/app/login/google-sign-in.tsx",
  import.meta.url,
);
const loginPagePath = new URL("../src/app/login/page.tsx", import.meta.url);
const authActionsPath = new URL(
  "../src/server/auth/actions.ts",
  import.meta.url,
);

test("Google identity login stays separate from Calendar consent", async () => {
  const source = await readFile(googleSignInPath, "utf8");

  assert.match(source, /provider:\s*"google"/);
  assert.doesNotMatch(source, /scope\s*:/i);
  assert.doesNotMatch(source, /calendar/i);
  assert.match(source, /callbackURL:\s*returnTo/);
});

test("login exposes Google sign-in in both auth modes", async () => {
  const source = await readFile(loginPagePath, "utf8");

  assert.match(source, /GoogleSignInButton/);
  assert.match(source, /google-signin-failed/);
  assert.match(source, /Google Calendar continua opcional/);
});

test("auth failures log structural diagnostics without credential fields", async () => {
  const source = await readFile(authActionsPath, "utf8");

  assert.match(source, /TaskIT authentication failure/);
  assert.match(source, /sign-up-email-result/);
  assert.doesNotMatch(source, /console\.error\([^\n]*(email|password|token)/i);
});

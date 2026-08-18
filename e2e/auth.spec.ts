import { expect, test } from "@playwright/test";

test("shows the TaskIT sign-in entry", async ({ page }) => {
  await page.goto("/login");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Que bom ter você de volta.",
    }),
  ).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByLabel("Senha")).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
});

test("redirects an unauthenticated user away from the private app", async ({
  page,
}) => {
  await page.goto("/app/today");

  await expect(page).toHaveURL(/\/login\?returnTo=%2Fapp%2Ftoday$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Que bom ter você de volta.",
    }),
  ).toBeVisible();
});

test("protects onboarding without requesting database access first", async ({
  page,
}) => {
  await page.goto("/onboarding");

  await expect(page).toHaveURL(/\/login\?returnTo=%2Fonboarding$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Que bom ter você de volta.",
    }),
  ).toBeVisible();
});

test("protects projects in the shared private app layout", async ({ page }) => {
  await page.goto("/app/projects");

  // The shared /app layout owns the anonymous fallback and intentionally sends
  // users to the canonical Today destination after authentication.
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fapp%2Ftoday$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Que bom ter você de volta.",
    }),
  ).toBeVisible();
});

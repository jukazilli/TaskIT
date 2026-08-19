import { expect, test } from "@playwright/test";

test("loads the TaskIT public landing responsively", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/TaskIT/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Sua semana de estudos, com clareza.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "A fundação técnica está pronta para receber o planejamento do produto.",
    ),
  ).toHaveCount(0);

  const viewportWidth = await page.evaluate(
    () => document.documentElement.clientWidth,
  );
  const contentWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );

  expect(contentWidth).toBeLessThanOrEqual(viewportWidth);
});

test("routes public landing actions to the correct authentication mode", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Entrar", exact: true }).first().click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Que bom ter você de volta.",
    }),
  ).toBeVisible();

  await page.goto("/");
  await page
    .getByRole("link", { name: "Criar conta", exact: false })
    .first()
    .click();
  await expect(page).toHaveURL(/\/login\?mode=signup/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Crie sua conta." }),
  ).toBeVisible();
});

test("applies the self-hosted Nunito family at runtime", async ({ page }) => {
  await page.goto("/");

  const typography = await page.evaluate(async () => {
    await document.fonts.ready;

    return {
      fontStatus: document.fonts.status,
      bodyFontFamily: getComputedStyle(document.body).fontFamily,
    };
  });

  expect(typography.fontStatus).toBe("loaded");
  expect(typography.bodyFontFamily.toLowerCase()).toContain("nunito");
});

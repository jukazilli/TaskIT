import { expect, test } from "@playwright/test";

test("loads the TaskIT bootstrap shell responsively", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/TaskIT/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Sua semana de estudos, com clareza.",
    }),
  ).toBeVisible();

  const viewportWidth = await page.evaluate(
    () => document.documentElement.clientWidth,
  );
  const contentWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );

  expect(contentWidth).toBeLessThanOrEqual(viewportWidth);
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

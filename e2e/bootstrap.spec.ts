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

  const typography = await page.evaluate(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const bodyStyles = getComputedStyle(document.body);

    return {
      nunitoVariable: rootStyles.getPropertyValue("--font-nunito").trim(),
      bodyFontFamily: bodyStyles.fontFamily,
    };
  });

  expect(typography.nunitoVariable).not.toBe("");
  expect(typography.bodyFontFamily).toContain(
    typography.nunitoVariable.split(",")[0].replaceAll('"', "").trim(),
  );
});

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

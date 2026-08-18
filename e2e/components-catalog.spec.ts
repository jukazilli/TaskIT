import { expect, test } from "@playwright/test";

test(
  "renders the local component catalog with common states",
  async ({ page }) => {
    await page.goto("/dev/components");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Catálogo de componentes",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Salvar plano" }),
    ).toBeVisible();
    await expect(page.getByLabel("Tarefa")).toBeVisible();
    await expect(
      page.getByText("Informe um título para continuar."),
    ).toBeVisible();
  },
);

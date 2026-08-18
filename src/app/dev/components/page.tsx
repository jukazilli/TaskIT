import { notFound } from "next/navigation";

import { Button, TextField } from "@/components/ui";

import styles from "./page.module.css";

export default function ComponentsCatalogPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className={styles.catalog}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>TaskIT / desenvolvimento</p>
        <h1>Catálogo de componentes</h1>
        <p className={styles.intro}>
          Superfície local para revisar componentes-base e seus estados sem
          depender de uma tela de produto.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="button-title">
        <div className={styles.sectionHeading}>
          <h2 id="button-title">Button</h2>
          <p>Variações essenciais para ação primária, secundária e discreta.</p>
        </div>

        <div className={styles.preview}>
          <div className={styles.row}>
            <Button>Salvar plano</Button>
            <Button variant="secondary">Cancelar</Button>
            <Button variant="quiet">Ver detalhes</Button>
            <Button disabled>Indisponível</Button>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="field-title">
        <div className={styles.sectionHeading}>
          <h2 id="field-title">TextField</h2>
          <p>Estados padrão, erro e indisponível com rótulos acessíveis.</p>
        </div>

        <div className={styles.previewGrid}>
          <TextField
            id="catalog-task"
            label="Tarefa"
            placeholder="Ex.: revisar capítulo 4"
            hint="Use um título curto e acionável."
          />
          <TextField
            id="catalog-error"
            label="Tarefa com erro"
            defaultValue=" "
            error="Informe um título para continuar."
          />
          <TextField
            id="catalog-disabled"
            label="Campo indisponível"
            defaultValue="Sincronizando calendário"
            disabled
          />
        </div>
      </section>
    </main>
  );
}

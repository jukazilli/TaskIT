import { SectionPlaceholder } from "@/components/app-shell/section-placeholder";

export default function TimelinePage() {
  return (
    <SectionPlaceholder
      eyebrow="Cronograma"
      title="Veja o trabalho no tempo."
      description="O cronograma vai mostrar projetos, marcos e tarefas em uma linha temporal simples, com foco em progresso e prazos — não em dependências gráficas excessivas."
      emptyTitle="Ainda não há itens para colocar no tempo."
      emptyDescription="Quando projetos e tarefas existirem, esta visão passa a mostrar como o trabalho se distribui ao longo das semanas."
      actionHref="/app/projects"
      actionLabel="Ver projetos"
    />
  );
}

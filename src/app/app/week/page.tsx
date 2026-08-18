import { SectionPlaceholder } from "@/components/app-shell/section-placeholder";

export default function WeekPage() {
  return (
    <SectionPlaceholder
      eyebrow="Semana"
      title="Planeje com espaço para a vida real."
      description="A visão semanal vai combinar carga de estudo, sessões e compromissos externos sem transformar o planejamento em uma planilha densa."
      emptyTitle="Nenhuma sessão foi planejada ainda."
      emptyDescription="Quando houver tarefas estimadas, você poderá distribuir o trabalho pela semana e reajustar sem perder contexto."
      actionHref="/app/projects"
      actionLabel="Ver projetos"
    />
  );
}

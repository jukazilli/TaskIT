import { SectionPlaceholder } from "@/components/app-shell/section-placeholder";

export default function ProjectsPage() {
  return (
    <SectionPlaceholder
      eyebrow="Projetos"
      title="Organize o que tem propósito."
      description="Projetos vão agrupar objetivos, marcos e tarefas sem exigir que cada captura já chegue perfeitamente organizada."
      emptyTitle="Você ainda não criou um projeto."
      emptyDescription="A criação e edição de projetos entram no próximo milestone. Por enquanto, a navegação já preserva o lugar dessa visão no produto."
    />
  );
}

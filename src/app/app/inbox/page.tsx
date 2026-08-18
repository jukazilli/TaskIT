import { SectionPlaceholder } from "@/components/app-shell/section-placeholder";

export default function InboxPage() {
  return (
    <SectionPlaceholder
      eyebrow="Inbox"
      title="Capture primeiro. Organize depois."
      description="A Inbox será a entrada rápida do TaskIT: título como único dado obrigatório, com organização contextual feita depois sem quebrar seu fluxo."
      emptyTitle="Sua Inbox está vazia."
      emptyDescription="O Quick Add entra no milestone de tarefas. A navegação já reserva este espaço como ponto de captura rápida em desktop e mobile."
    />
  );
}

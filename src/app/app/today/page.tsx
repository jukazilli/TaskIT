import { SectionPlaceholder } from "@/components/app-shell/section-placeholder";

export default function TodayPage() {
  return (
    <SectionPlaceholder
      eyebrow="Hoje"
      title="O que merece sua atenção agora?"
      description="Este espaço vai reunir sua próxima sessão, o que está previsto para hoje e somente os riscos que pedem uma decisão."
      emptyTitle="Seu dia está livre por enquanto."
      emptyDescription="Quando você capturar tarefas e planejar sessões, o próximo passo útil aparece aqui."
      actionHref="/app/inbox"
      actionLabel="Ir para a Inbox"
    />
  );
}

import { SectionPlaceholder } from "@/components/app-shell/section-placeholder";

export default function SettingsPage() {
  return (
    <SectionPlaceholder
      eyebrow="Configurações"
      title="Preferências sem distração."
      description="Aqui ficarão fuso, início da semana, duração padrão de sessão e integrações. O onboarding mínimo vai preencher o essencial antes desta tela ganhar edição completa."
      emptyTitle="As preferências já têm defaults seguros."
      emptyDescription="O schema de usuário usa UTC, segunda-feira e 50 minutos como defaults até que você personalize o seu contexto."
    />
  );
}

# TaskIT — Visão de Engenharia e Tech Lead

## 1. Objetivo técnico

Construir uma aplicação simples de operar, segura, testável e preparada para evolução por engenheiros humanos e agentes de IA.

A arquitetura deve favorecer baixo custo inicial, escalabilidade progressiva e baixo acoplamento entre domínio, infraestrutura e integrações externas.

## 2. Stack recomendada

### Aplicação

- Next.js com App Router;
- TypeScript em modo strict;
- React;
- PWA responsiva e instalável;
- design system próprio com tokens;
- validação de dados em runtime;
- testes unitários, integração e E2E conforme criticidade.

### Infraestrutura

- Vercel para deploy, preview environments e funções server-side;
- Neon Postgres como banco principal;
- integração Neon–Vercel preferencialmente Neon-managed, pois o projeto será gerenciado diretamente na conta Neon;
- branches de banco para previews quando o fluxo estiver configurado;
- GitHub como fonte de verdade de código, ADRs, backlog e documentação.

## 3. Arquitetura lógica

Camadas conceituais:

1. **Presentation** — páginas, componentes e estados de UI;
2. **Application** — casos de uso, comandos e queries;
3. **Domain** — regras de negócio puras;
4. **Infrastructure** — Postgres, Calendar, observabilidade e serviços externos.

Regra: componentes React não devem concentrar regra de domínio ou SQL.

## 4. Estrutura inicial sugerida

```text
src/
  app/
  components/
  features/
    tasks/
    projects/
    planning/
    sessions/
    calendar/
  domain/
  lib/
  server/
    db/
    integrations/
    services/
  styles/
  test/
```

A estrutura pode evoluir, mas fronteiras de domínio devem permanecer claras.

## 5. Modelo de dados conceitual

Entidades principais:

- User;
- UserPreferences;
- Project;
- Milestone;
- Task;
- StudySession;
- CalendarConnection;
- CalendarSource;
- ExternalCalendarEventLink;
- SyncCursor/SyncState;
- Activity/Audit metadata quando necessário.

### Regras essenciais

- todas as entidades do usuário devem ser isoladas por owner/user id;
- timestamps devem ser armazenados de forma inequívoca e convertidos para o fuso do usuário na borda;
- exclusões devem ser pensadas conforme necessidade de histórico e sincronização;
- IDs externos nunca substituem IDs internos;
- vínculo Calendar deve permitir idempotência e evitar duplicação.

## 6. Autenticação e autorização

Autenticação da aplicação e autorização do Google Calendar são preocupações distintas.

A solução de auth deve:

- suportar sessões seguras;
- funcionar com preview e produção;
- permitir Google como login sem automaticamente exigir acesso ao Calendar;
- manter autorização de dados no servidor;
- nunca confiar em user id enviado arbitrariamente pelo cliente.

A escolha final entre Neon Managed Better Auth e outra alternativa deve ser fechada no milestone de setup após spike técnico e validação de produção. Não acoplar domínio ao provedor.

## 7. Google Calendar

### Estratégia

- integração opcional;
- OAuth com menor privilégio;
- scopes incrementais quando uma ação precisar de permissão adicional;
- tokens armazenados somente no servidor e protegidos;
- refresh/revogação tratados explicitamente;
- sincronização idempotente;
- cursor/token de sincronização persistido;
- webhooks/push notifications podem ser adicionados após a sincronização básica estar confiável.

### Fonte de verdade

- dados TaskIT: Neon Postgres;
- evento externo criado fora do TaskIT: Google Calendar;
- sessão TaskIT espelhada no Calendar: TaskIT mantém identidade interna e vínculo com o evento externo.

Conflitos devem ser reconciliáveis, observáveis e nunca gerar duplicações silenciosas.

## 8. Postgres e acesso a dados

- migrations versionadas no repositório;
- migrations testadas em branch antes de produção;
- constraints no banco para invariantes importantes;
- índices guiados por consultas reais;
- transações para operações multi-etapa que exigem atomicidade;
- evitar N+1 e leitura excessiva no dashboard;
- pool/driver apropriado ao runtime serverless;
- dados pessoais nunca devem aparecer em logs desnecessariamente.

## 9. API e contratos

Mesmo usando Server Actions/Route Handlers, cada caso de uso deve possuir contrato claro:

- input validado;
- output previsível;
- erros de domínio tipados;
- autenticação explícita;
- autorização explícita;
- idempotência quando aplicável.

Não retornar estruturas de banco diretamente à UI como contrato público.

## 10. PWA e estratégia multi-device

MVP usa uma única aplicação responsiva.

Requisitos:

- manifesto instalável;
- ícones e metadata adequados;
- experiência touch e keyboard;
- layout adaptativo real;
- cache offline apenas onde semanticamente seguro;
- nunca prometer edição offline completa sem estratégia consistente de conflito.

Um shell nativo futuro deve reutilizar domínio/API, não duplicar backend.

## 11. Segurança

Baseline:

- segredo somente server-side;
- validação de input em todas as fronteiras;
- proteção CSRF conforme mecanismo utilizado;
- cookies seguros;
- princípio de menor privilégio;
- rate limiting em superfícies abusáveis;
- proteção contra IDOR;
- queries parametrizadas;
- política clara de retenção/revogação de tokens externos;
- dependências auditadas;
- nenhuma chave em commits.

## 12. Observabilidade

Desde o início:

- erros server-side estruturados;
- correlation/request id quando útil;
- métricas de falha de integração Calendar;
- métricas de latência das rotas críticas;
- logs sem conteúdo sensível;
- saúde de sincronização por conexão.

## 13. Performance

Metas iniciais:

- navegação percebida instantânea após primeira carga;
- dashboard sem consultas redundantes;
- calendar/timeline virtualizados quando volume justificar;
- operações otimistas somente com rollback seguro;
- bundle controlado;
- evitar bibliotecas pesadas para capacidades triviais.

## 14. Qualidade de código

Obrigatório:

- nomes orientados ao domínio;
- funções pequenas e coesas;
- evitar abstrações prematuras;
- comentários explicam porquê, não o que o código já diz;
- dead code removido;
- sem `any` não justificado;
- erros não engolidos;
- side effects isolados;
- lint, typecheck e testes no CI.

## 15. Estratégia de testes

### Unitários

Regras puras: carga, progresso, conflitos, recálculo e status.

### Integração

Banco, autenticação, casos de uso e Calendar adapters.

### E2E

Fluxos críticos:

- onboarding;
- criar projeto/tarefa;
- planejar sessão;
- reagendar;
- concluir sessão;
- conectar/desconectar Calendar;
- comportamento responsivo essencial.

## 16. Git e entrega

- `main` protegida conceitualmente como linha estável;
- branches curtas por backlog item;
- PR pequena e revisável;
- preview deploy para alterações de produto;
- migrations e código associados no mesmo ciclo;
- commits convencionais e intencionais;
- backlog item deve aparecer no PR.

## 17. Definition of Done de engenharia

Uma história não está pronta enquanto faltar qualquer item aplicável:

- critérios de aceite atendidos;
- typecheck/lint verdes;
- testes adequados verdes;
- responsividade validada;
- acessibilidade básica validada;
- migration segura quando necessária;
- tratamento de erro;
- observabilidade mínima;
- documentação/ADR atualizada se houve decisão estrutural;
- nenhum segredo ou TODO crítico deixado silenciosamente.
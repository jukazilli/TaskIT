# TaskIT — Backlog Canônico

## 1. Objetivo

Este backlog transforma a documentação fundadora do TaskIT em uma sequência executável por um engenheiro de IA.

Cada item possui identificador estável. O agente deve implementar itens em ordem de dependência, não simplesmente em ordem numérica quando houver bloqueios explícitos.

Prioridades:

- **P0** — necessário para fundação/MVP;
- **P1** — importante para experiência completa do MVP;
- **P2** — evolução posterior.

## 2. Milestones

- **M0 — Fundação e setup**
- **M1 — Identidade, dados e shell do produto**
- **M2 — Projetos, tarefas e inbox**
- **M3 — Planejamento semanal e sessões**
- **M4 — Google Calendar**
- **M5 — Dashboard e cronograma**
- **M6 — Qualidade, PWA e beta**
- **M7 — Inteligência e evolução**

## 2.1 Estado atual de execução

**Atualizado em:** 20 de agosto de 2026.

Um item só entra como concluído aqui quando os critérios de aceite relevantes foram demonstrados e a mudança correspondente está integrada ao `main`.

### Concluídos

- **M0:** TASKIT-001, TASKIT-002, TASKIT-003, TASKIT-004, TASKIT-005, TASKIT-006, TASKIT-007 e TASKIT-008;
- **M1:** TASKIT-101, TASKIT-102, TASKIT-103, TASKIT-104, TASKIT-105, TASKIT-106 e TASKIT-108;
- **M2:** TASKIT-201, TASKIT-202, TASKIT-203 e TASKIT-204;
- **M3 (fundação arquitetural):** TASKIT-300 — modelo de planejamento por capacidade canonicalizado antes da implementação de sessões/motor.

### Estado operacional

- Preview usa Neon `development` e Neon Auth de development;
- Production usa Neon `main` e Neon Auth de production;
- o release gate consulta o Neon real, valida schema e confirma alinhamento Auth/banco antes de considerar o ambiente saudável;
- TASKIT-204 está publicado em produção;
- TASKIT-108 está publicado em produção com landing pública, assets de marca, favicon e fundação de SEO validados.

### Próximos itens

1. **TASKIT-205 — Task Row + edição contextual**;
2. **TASKIT-109 — Configurar disponibilidade típica para planejamento**;
3. **TASKIT-301 — Schema de sessões de estudo**;
4. **TASKIT-302 — Motor de planejamento e capacidade**;
5. **TASKIT-305 — Criar sessões a partir da tarefa**;
6. **TASKIT-303/304 — Visão Semana desktop/mobile**;
7. **TASKIT-306 — Concluir e replanejar sessão**.

TASKIT-107 permanece **pausado e não concluído** após a tentativa com o provider gerenciado. Uma futura revisão pode adotar OAuth próprio no Google Cloud, mas essa alternativa ainda não é decisão arquitetural e não bloqueia o núcleo do produto. Login e autorização de Google Calendar continuam capacidades separadas.

Não implementar M3 com o antigo conceito de “carga” para depois refazê-lo. `docs/07-planning-capacity-model.md` e ADR 0007 são referência obrigatória para o caminho crítico de planejamento.

---

# M0 — Fundação e setup

## TASKIT-001 — Bootstrap da aplicação

**Prioridade:** P0

### Objetivo
Criar a base Next.js + TypeScript do projeto com estrutura coerente com a arquitetura documentada.

### Escopo
- App Router;
- TypeScript strict;
- estrutura inicial de pastas;
- scripts de dev/build/lint/typecheck/test;
- configuração de formatação;
- `.env.example` sem segredos;
- README atualizado com instruções locais.

### Aceite
- aplicação sobe localmente;
- build passa;
- lint e typecheck passam;
- nenhuma credencial real é versionada.

---

## TASKIT-002 — CI de qualidade no GitHub

**Prioridade:** P0
**Depende de:** TASKIT-001

### Objetivo
Impedir regressões básicas antes de merge.

### Escopo
- workflow para instalação reproduzível;
- lint;
- typecheck;
- testes;
- build.

### Aceite
- pipeline roda em pull requests;
- falha de qualquer gate obrigatório torna o check vermelho.

---

## TASKIT-003 — Criar e conectar projeto Vercel

**Prioridade:** P0
**Depende de:** TASKIT-001

### Objetivo
Conectar `jukazilli/TaskIT` à Vercel e habilitar previews.

### Aceite
- projeto Vercel existe;
- `main` publica produção;
- PRs/branches geram preview;
- variáveis são separadas por ambiente;
- nenhum segredo fica no GitHub.

---

## TASKIT-004 — Criar projeto Neon e ambientes de banco

**Prioridade:** P0

### Objetivo
Criar o projeto Neon do TaskIT e definir estratégia de branches.

### Escopo
- projeto TaskIT;
- branch principal de produção;
- estratégia dev/preview;
- conexão server-side segura;
- documentar integração escolhida Neon–Vercel.

### Aceite
- conexão validada por aplicação/server script;
- branch principal não é usada para experimentos;
- connection strings não são commitadas.

---

## TASKIT-005 — Integrar Neon e Vercel

**Prioridade:** P0
**Depende de:** TASKIT-003, TASKIT-004

### Objetivo
Garantir que deploys tenham acesso ao banco correto por ambiente.

### Aceite
- preview não usa inadvertidamente banco de produção para migrations/testes;
- produção usa credenciais próprias;
- estratégia está documentada.

---

## TASKIT-006 — Design tokens e Nunito

**Prioridade:** P0
**Depende de:** TASKIT-001

### Objetivo
Implementar fundação visual do TaskIT.

### Escopo
- Nunito;
- tokens de cor;
- spacing;
- radius;
- tipografia;
- focus ring;
- breakpoints;
- reduced motion baseline.

### Aceite
- tokens centralizados;
- contraste essencial validado;
- componentes não espalham valores arbitrários sem necessidade.

---

## TASKIT-007 — Storybook ou catálogo de componentes

**Prioridade:** P1
**Depende de:** TASKIT-006

### Objetivo
Criar superfície rápida de revisão de componentes e estados.

### Aceite
- componentes-base podem ser vistos isoladamente;
- estados comuns têm exemplos;
- não adiciona complexidade excessiva ao build.

---

## TASKIT-008 — Base de testes E2E

**Prioridade:** P0
**Depende de:** TASKIT-001

### Objetivo
Configurar Playwright e smoke test responsivo.

### Aceite
- E2E roda localmente e no CI apropriado;
- cobre ao menos carregamento do app em viewport mobile e desktop.

---

# M1 — Identidade, dados e shell

## TASKIT-101 — Spike e ADR de autenticação

**Prioridade:** P0
**Depende de:** TASKIT-004

### Objetivo
Escolher autenticação sem acoplar login à permissão do Google Calendar.

### Comparar
- Neon Managed Better Auth;
- alternativa madura compatível com Vercel/Next.js, somente se houver razão concreta.

### Aceite
- ADR com decisão, alternativas e consequências;
- suporte a sessão segura, preview e produção;
- estratégia de autorização server-side definida.

---

## TASKIT-102 — Implementar autenticação

**Prioridade:** P0
**Depende de:** TASKIT-101

### Aceite
- entrar/sair;
- rota privada protegida;
- sessão recuperada no servidor;
- usuário não consegue acessar recurso de outro usuário;
- erros de auth têm recuperação clara.

---

## TASKIT-103 — Schema inicial de usuário e preferências

**Prioridade:** P0
**Depende de:** TASKIT-004, TASKIT-101

### Campos conceituais
- identidade interna;
- timezone;
- início da semana;
- duração padrão de sessão;
- disponibilidade típica.

### Aceite
- migration versionada e testada fora de produção;
- preferências pertencem ao usuário autenticado;
- timezone tem default seguro e pode ser alterado.

---

## TASKIT-104 — App shell desktop

**Prioridade:** P0
**Depende de:** TASKIT-006, TASKIT-102

### Aceite
- navegação compacta;
- conteúdo responsivo;
- foco e teclado funcionais;
- destinos principais previstos.

---

## TASKIT-105 — App shell mobile

**Prioridade:** P0
**Depende de:** TASKIT-006, TASKIT-102

### Aceite
- navegação móvel clara;
- áreas de toque adequadas;
- não é mera redução do desktop;
- mantém mesmos destinos/estado conceitual.

---

## TASKIT-106 — Onboarding mínimo

**Prioridade:** P1
**Depende de:** TASKIT-103, TASKIT-104, TASKIT-105

### Aceite
- coleta fuso e preferências mínimas;
- Calendar pode ser pulado;
- usuário chega ao app sem tutorial longo.

---

## TASKIT-107 — Entrar com Google (identidade apenas)

**Prioridade:** P0
**Estado:** pausado; não bloqueia o caminho crítico do MVP de planejamento.
**Depende de:** TASKIT-102, TASKIT-005

### Objetivo
Adicionar Google como método conveniente de autenticação do TaskIT sem transformar o login em consentimento para Google Calendar.

### Escopo
- configurar o provider Google suportado pelo Neon Auth/Better Auth;
- adicionar ação “Continuar com Google” na entrada de autenticação;
- usar somente scopes necessários para identidade, perfil e e-mail;
- definir comportamento seguro de criação/vinculação de conta quando o e-mail já existir;
- manter a mesma sessão server-side e o mesmo modelo de ownership já usados pelo login por e-mail/senha;
- configurar redirect URIs e credenciais separadas para development/preview e production;
- manter segredos fora do repositório.

### Aceite
- usuário pode entrar/criar conta com Google;
- login com Google não solicita scopes do Google Calendar;
- login por e-mail/senha continua funcionando;
- identidade Google converge para o mesmo `app_user` do domínio, sem criar um segundo modelo de usuário;
- erros/cancelamento do OAuth têm recuperação clara;
- Preview e Production usam configurações corretas e isoladas;
- revogar futura permissão de Calendar não invalida a conta TaskIT.

### Regra arquitetural
A identidade de login e uma futura conexão Google Calendar são relações distintas. Mesmo quando a pessoa entra com Google, o acesso às agendas só pode ser concedido por um consentimento incremental e explícito do M4.

---

## TASKIT-108 — Landing pública, identidade visual e SEO

**Prioridade:** P0
**Depende de:** TASKIT-006, TASKIT-102

### Objetivo
Substituir o placeholder técnico de `/` por uma entrada pública do TaskIT que explique o produto, fortaleça a identidade da marca e direcione corretamente para autenticação.

### Escopo
- landing responsiva desktop/mobile;
- CTAs de entrar e criar conta;
- wordmark/mark vetoriais e favicon;
- metadata SEO, canonical, Open Graph e Twitter;
- robots, sitemap e manifest;
- mockups de produto leves em HTML/CSS;
- E2E da entrada pública e dos caminhos de autenticação;
- funcionalidades futuras precisam ser identificadas como futuras, sem promessas enganosas.

### Aceite
- `/` apresenta o produto e não o bootstrap técnico;
- entrar e criar conta direcionam aos modos corretos de autenticação;
- logo e favicon carregam como assets próprios;
- home possui metadata de indexação e compartilhamento;
- `/login` permanece fora do índice;
- landing não produz overflow horizontal em mobile/desktop;
- Production pública entrega a landing no SHA do release e `/api/health` permanece saudável.

---

## TASKIT-109 — Configurar disponibilidade típica para planejamento

**Prioridade:** P0
**Depende de:** TASKIT-103, TASKIT-106

### Objetivo
Permitir que o usuário mantenha as janelas recorrentes que representam quando normalmente existe tempo planejável, usando `availability_window` já existente.

### Escopo
- editar dias e intervalos normalmente disponíveis;
- respeitar timezone e semana configurados;
- permitir múltiplas janelas no mesmo dia quando necessário;
- não assumir 24 horas disponíveis;
- não introduzir automaticamente buffer, preferência de período ou regras avançadas;
- não persistir tempo livre derivado.

### Aceite
- usuário consulta e altera disponibilidade típica em mobile/desktop;
- intervalos inválidos são rejeitados;
- ownership é garantido no servidor;
- estado vazio é válido e não quebra o produto;
- TASKIT-302 consome essas janelas como capacidade potencial;
- testes cobrem ordenação, intervalos do mesmo dia e timezone.

---

# M2 — Projetos, tarefas e inbox

## TASKIT-201 — Schema de projetos

**Prioridade:** P0

### Aceite
- projeto pertence a usuário;
- nome, descrição curta, status, prazo opcional, identidade visual;
- archive preserva consulta histórica.

---

## TASKIT-202 — CRUD de projetos

**Prioridade:** P0
**Depende de:** TASKIT-201

### Aceite
- criar, editar, arquivar e listar;
- estados loading/empty/error;
- mobile e desktop.

---

## TASKIT-203 — Schema de tarefas

**Prioridade:** P0
**Depende de:** TASKIT-201

### Aceite
- tarefa pode ou não ter projeto;
- prioridade, prazo, estimativa e status são suportados;
- ownership garantido no servidor/banco.

---

## TASKIT-204 — Quick Add / Inbox

**Prioridade:** P0
**Depende de:** TASKIT-203

### Objetivo
Capturar tarefa com título como único dado obrigatório.

### Aceite
- operação rápida em desktop/mobile;
- foco retorna ao contexto;
- erro não perde texto digitado;
- item aparece na inbox.

---

## TASKIT-205 — Task Row + edição contextual

**Prioridade:** P0
**Depende de:** TASKIT-203

### Objetivo
Transformar a captura rápida em tarefas que recebem o contexto mínimo necessário para planejamento sem tirar o usuário da lista.

### Escopo
- Task Row de baixa densidade;
- edição contextual de título, projeto, prioridade, prazo, estimativa e notas;
- concluir/reabrir;
- prazo e estimativa aparecem somente quando relevantes;
- tarefa sem estimativa continua permitida;
- nenhuma regra de capacidade é recalculada na UI;
- preservar contexto/posição após editar.

### Aceite
- editar sem navegação desnecessária;
- concluir/reabrir mantém ownership e histórico aplicável;
- estimativa e prazo persistem para o futuro motor;
- erros preservam alterações quando possível;
- loading/empty/error cobertos;
- acessível por teclado;
- mobile usa interação contextual apropriada.

---

## TASKIT-206 — Busca e filtros de tarefas

**Prioridade:** P1
**Depende de:** TASKIT-205

### Aceite
- texto, projeto, status, prazo e prioridade;
- estado de filtro claro;
- remover filtro é imediato.

---

## TASKIT-207 — Marcos de projeto

**Prioridade:** P1
**Depende de:** TASKIT-201

### Aceite
- criar/editar/ordenar marcos;
- prazo opcional;
- tarefas podem ser associadas.

---

# M3 — Planejamento semanal e sessões

## TASKIT-300 — Fundação arquitetural do planejamento por capacidade

**Prioridade:** P0
**Estado:** concluído por esta canonicalização quando integrada ao `main`.

### Objetivo
Incorporar tempo como recurso finito antes de criar StudySession e o motor semanal definitivo.

### Escopo
- revisar documentação, migrations, Task, preferências/disponibilidade e fronteiras atuais;
- criar `docs/07-planning-capacity-model.md`;
- registrar ADR 0007;
- confirmar o que pode ser reutilizado sem migration;
- definir invariantes, linguagem, testes e fronteiras determinísticas;
- recanonicalizar o caminho crítico.

### Aceite
- Task permanece demanda e StudySession permanece alocação temporal;
- `estimate_minutes`, `due_date` e `availability_window` são reutilizados;
- nenhuma migration aplicada é editada;
- nenhuma coluna especulativa é criada;
- IA fica posterior ao cálculo determinístico;
- próximos itens de M3 referenciam o novo modelo.

---

## TASKIT-301 — Schema de sessões de estudo

**Prioridade:** P0
**Depende de:** TASKIT-203, TASKIT-300

### Objetivo
Persistir a alocação real de partes da demanda de uma tarefa no tempo.

### Aceite
- tarefa pode gerar zero, uma ou múltiplas sessões;
- cada sessão possui início/fim válidos e status suficiente para planejamento/conclusão/cancelamento;
- ownership é garantido;
- timezone é tratado nas bordas sem horário ambíguo;
- histórico necessário não é perdido ao reagendar;
- schema não duplica duração/capacidade derivável sem necessidade;
- migration nova preserva 0001–0004 e é validada em development antes de produção.

---

## TASKIT-302 — Motor de planejamento e capacidade

**Prioridade:** P0
**Depende de:** TASKIT-109, TASKIT-301, TASKIT-300

### Objetivo
Calcular de forma determinística se a demanda conhecida cabe na capacidade disponível no dia, semana e antes do prazo.

### Escopo
- disponibilidade potencial por intervalos recorrentes;
- união de intervalos ocupados;
- esforço estimado, concluído, futuro planejado e ainda sem horário;
- minutos disponíveis, planejados, necessários, livres e em déficit;
- conflito temporal e conflito de capacidade;
- viabilidade até prazo;
- resultado explicável.

### Aceite
- regras em domínio puro, sem SQL/React/LLM;
- cálculo funciona para dia, semana e intervalo até prazo;
- tempo posterior ao prazo não resolve demanda anterior;
- tarefa sem estimativa não quebra o sistema;
- intervalos sobrepostos são normalizados;
- testes abrangem timezone, DST quando aplicável, ausência de disponibilidade, múltiplas sessões, sobrecarga e prazos;
- valores derivados não viram fonte de verdade persistida sem necessidade;
- cálculo é reproduzível e explicável.

---

## TASKIT-303 — Visão Semana desktop

**Prioridade:** P0
**Depende de:** TASKIT-301, TASKIT-302, TASKIT-305

### Aceite
- segunda-domingo conforme preferência;
- sessões distribuídas no tempo;
- criar e mover sessões;
- distinguir disponibilidade potencial, ocupações e espaço livre sem heatmap excessivo;
- indicar dias apertados/sobrecarregados com linguagem humana e não somente cor;
- mostrar esforço ainda sem horário quando relevante;
- informação externa terá slot visual preparado;
- navegação por semana.

---

## TASKIT-304 — Visão Semana mobile

**Prioridade:** P0
**Depende de:** TASKIT-301, TASKIT-302, TASKIT-305

### Aceite
- experiência de toque adequada;
- trocar dias/semana com poucos passos;
- reagendamento sem exigir drag preciso;
- comunicar espaço livre, sobrecarga e esforço sem horário sem painel analítico;
- ações de resolver semana ficam próximas ao contexto;
- mantém clareza de capacidade com baixa densidade.

---

## TASKIT-305 — Criar sessões a partir de tarefa

**Prioridade:** P0
**Depende de:** TASKIT-301, TASKIT-302

### Aceite
- usar estimativa como auxílio, não obrigação;
- mostrar esforço concluído/planejado e ainda sem horário quando conhecido;
- permitir dividir em várias sessões;
- impedir intervalos inválidos;
- avaliar a janela proposta contra capacidade e prazo sem retirar controle do usuário;
- atualizar diagnóstico imediatamente;
- não reorganizar silenciosamente compromissos existentes.

---

## TASKIT-306 — Concluir e replanejar sessão

**Prioridade:** P0
**Depende de:** TASKIT-303, TASKIT-304, TASKIT-305

### Aceite
- concluir não força conclusão da tarefa;
- sessão perdida pode ser movida/dividida/removida da semana;
- histórico necessário é preservado;
- capacidade, esforço restante e risco são recalculados;
- quando não couber, oferecer alternativas determinísticas simples antes de IA;
- mudanças relevantes continuam sob controle do usuário;
- linguagem sem julgamento.

---

## TASKIT-307 — Undo para operações de planejamento

**Prioridade:** P1
**Depende de:** TASKIT-303, TASKIT-304

### Aceite
- mover/remover de baixo risco pode ser desfeito;
- feedback curto e não intrusivo.

---

# M4 — Google Calendar

## TASKIT-401 — Criar projeto OAuth/Calendar no Google Cloud

**Prioridade:** P0

### Objetivo
Configurar consentimento e credenciais de production/development necessários à integração com Google Calendar sem reutilizar silenciosamente o consentimento de login.

### Aceite
- app de consentimento identificado como TaskIT;
- Google Calendar API habilitada;
- redirect URIs corretas por ambiente;
- configuração distingue autenticação de identidade e autorização de Calendar;
- segredos fora do repositório;
- documentação do setup reproduzível.

---

## TASKIT-402 — ADR de estratégia Google Calendar

**Prioridade:** P0
**Depende de:** TASKIT-401

### Definir
- scopes mínimos;
- autorização incremental;
- leitura vs escrita;
- armazenamento/rotação de tokens;
- estratégia de sync;
- fonte de verdade e conflito;
- desconexão/revogação.

### Aceite
- decisão documentada antes da implementação completa;
- login Google e autorização Calendar permanecem fluxos independentes.

---

## TASKIT-403 — Conectar/desconectar Google Calendar

**Prioridade:** P0
**Depende de:** TASKIT-402

### Aceite
- conexão opcional;
- consentimento separado de login, inclusive para quem entrou no TaskIT usando Google;
- conexão Calendar é persistida como autorização própria, não inferida da identidade de login;
- status claro;
- revogação/desconexão remove acesso local apropriado sem encerrar a conta TaskIT;
- tokens nunca chegam ao client desnecessariamente.

---

## TASKIT-404 — Seleção de calendários relevantes

**Prioridade:** P0
**Depende de:** TASKIT-403

### Aceite
- listar calendários acessíveis pela conexão autorizada;
- usuário escolhe uma ou mais agendas relevantes;
- cada agenda selecionada define se bloqueia disponibilidade ou é apenas informativa;
- escolha persistida por calendário, sem assumir apenas a agenda principal;
- seleção pode ser alterada sem refazer o login do TaskIT.

---

## TASKIT-405 — Sincronização incremental de eventos externos

**Prioridade:** P0
**Depende de:** TASKIT-404

### Aceite
- sincronização idempotente;
- cursor/token persistido;
- eventos alterados/removidos são reconciliados;
- nenhum duplicado após múltiplas execuções;
- falhas recuperáveis são observáveis.

---

## TASKIT-406 — Mostrar eventos Google na Semana

**Prioridade:** P0
**Depende de:** TASKIT-405, TASKIT-303, TASKIT-304

### Aceite
- eventos externos distinguíveis, porém discretos;
- somente fontes bloqueadoras reduzem capacidade;
- eventos sobrepostos não descontam disponibilidade duas vezes;
- afetam cálculo de conflito/capacidade conforme configuração;
- TaskIT não oferece edição indevida de evento externo.

---

## TASKIT-407 — Espelhar sessão TaskIT no Google Calendar

**Prioridade:** P1
**Depende de:** TASKIT-403, TASKIT-301

### Aceite
- opt-in explícito;
- create/update/delete idempotentes para eventos pertencentes ao TaskIT;
- vínculo interno/externo persistido;
- retry não duplica evento.

---

## TASKIT-408 — Reconciliação e saúde da integração

**Prioridade:** P1
**Depende de:** TASKIT-405

### Aceite
- detectar token revogado/expirado;
- indicar reconexão sem bloquear produto;
- registrar último sync e falha útil;
- ação manual de sincronizar novamente quando apropriado.

---

# M5 — Dashboard e cronograma

## TASKIT-501 — Dashboard Hoje/Próximo

**Prioridade:** P0
**Depende de:** M3

### Aceite
- próxima sessão em destaque;
- agenda de hoje;
- ação imediata evidente;
- ausência de mosaico excessivo de métricas.

---

## TASKIT-502 — Resumo semanal

**Prioridade:** P0
**Depende de:** TASKIT-302

### Aceite
- planejado vs concluído;
- disponível, planejado, ainda sem horário e déficit quando existir;
- poucos riscos acionáveis;
- linguagem simples, sem percentuais opacos;
- cálculo proveniente do motor determinístico e explicável.

---

## TASKIT-503 — Identificação de itens em risco

**Prioridade:** P1
**Depende de:** TASKIT-302, TASKIT-203

### Aceite
- risco baseado em regra objetiva documentada;
- considera esforço restante, prazo e capacidade disponível anterior ao prazo;
- distingue falta de horário de sobreposição direta;
- não usa linguagem de culpa;
- usuário consegue agir a partir do aviso.

---

## TASKIT-504 — Timeline/Gantt leve de projetos

**Prioridade:** P1
**Depende de:** TASKIT-202, TASKIT-205, TASKIT-207

### Aceite
- eixo temporal;
- projeto/marco/tarefa;
- zoom semana/mês;
- hoje claramente indicado;
- progresso legível;
- hierarquia recolhível;
- desempenho aceitável com volume de referência.

---

## TASKIT-505 — Cronograma mobile simplificado

**Prioridade:** P1
**Depende de:** TASKIT-504

### Aceite
- não replica Gantt desktop de forma ilegível;
- permite compreender sequência, prazo e progresso por projeto.

---

# M6 — Qualidade, PWA e beta

## TASKIT-601 — Manifesto PWA e instalação

**Prioridade:** P0

### Aceite
- app instalável em navegadores compatíveis;
- nome, ícones e metadata corretos;
- comportamento standalone validado.

---

## TASKIT-602 — Estratégia segura de cache/offline

**Prioridade:** P1
**Depende de:** TASKIT-601

### Aceite
- somente dados/rotas semanticamente seguros são cacheados;
- UI não finge persistência de mutação offline sem suporte;
- fallback de conectividade é claro.

---

## TASKIT-603 — Auditoria de acessibilidade

**Prioridade:** P0

### Aceite
- navegação por teclado;
- foco visível;
- labels acessíveis;
- contraste;
- áreas de toque;
- reduced motion;
- correções P0/P1 concluídas.

---

## TASKIT-604 — Performance budget

**Prioridade:** P1

### Aceite
- baseline de bundle e Web Vitals registrado;
- regressões relevantes detectáveis;
- dashboard/semana não fazem consultas redundantes óbvias.

---

## TASKIT-605 — Observabilidade e error reporting

**Prioridade:** P0

### Aceite
- erros server-side rastreáveis;
- Calendar sync possui métricas/logs úteis;
- dados sensíveis não são enviados indiscriminadamente;
- ambiente distinguível.

---

## TASKIT-606 — Suite E2E crítica

**Prioridade:** P0
**Depende de:** funcionalidades MVP

### Fluxos
- login/onboarding;
- projeto;
- quick add;
- planejar sessão;
- reagendar/concluir;
- Calendar connect/sync com ambiente de teste apropriado;
- smoke mobile/desktop.

---

## TASKIT-607 — Checklist de produção

**Prioridade:** P0

### Aceite
- env vars revisadas;
- migrations aplicáveis e reversibilidade considerada;
- auth production-ready;
- OAuth/Calendar production-ready;
- domínio e redirects corretos;
- observabilidade ativa;
- backup/restore Neon entendido;
- política de privacidade e termos tratados antes de público externo quando aplicável.

---

# M7 — Inteligência e evolução

## TASKIT-701 — Instrumentação de métricas de produto

**Prioridade:** P1

### Eventos mínimos
- onboarding concluído;
- projeto criado;
- tarefa capturada;
- sessão planejada;
- sessão concluída;
- sessão replanejada;
- Calendar conectado;
- semana revisitada.

### Regra
Não capturar conteúdo textual de estudos por padrão em analytics.

---

## TASKIT-702 — Spike de planejamento assistido por IA

**Prioridade:** P2
**Depende de:** TASKIT-302, dados de uso e regras estáveis

### Objetivo
Avaliar IA como assistente de planejamento, nunca como requisito para o core funcionar.

### Aceite
- proposta mede benefício real;
- IA recebe diagnóstico produzido pelo motor determinístico e não recalcula capacidade como fonte da verdade;
- usuário confirma mudanças relevantes;
- IA recebe apenas contexto necessário;
- ações são explicáveis e reversíveis.

---

## TASKIT-703 — Sugestão inteligente de replanejamento

**Prioridade:** P2
**Depende de:** TASKIT-302, TASKIT-306, TASKIT-702

### Aceite
- parte de alternativas e diagnósticos determinísticos de disponibilidade, prazo, esforço e Calendar;
- pode ordenar ou explicar opções, mas não inventar capacidade;
- não executa mudança silenciosa;
- mostra proposta simples ao usuário.

---

## TASKIT-704 — Shell nativo: avaliação

**Prioridade:** P2

### Objetivo
Decidir se dados de uso justificam app empacotado nativo além da PWA.

### Aceite
- ADR baseada em gaps reais: notificações, widgets, background sync, store distribution ou integrações de SO;
- evitar duplicação de domínio/backend.

---

# 3. Sequência recomendada para o engenheiro de IA

Primeira trilha de execução:

`001 → 002/006/008 → 003/004 → 005 → 101 → 102/103 → 104/105/106 → 108 → 201/203 → 202/204 → 300 → 205 → 109 → 301 → 302 → 305 → 303/304 → 306 → 401/402 → 403/404/405 → 406 → 501/502/503 → 601/603/605/606/607`

No estado atual, TASKIT-204 e TASKIT-108 estão concluídos, TASKIT-300 é concluído por esta canonicalização e TASKIT-107 permanece pausado. O caminho crítico imediato passa a ser:

`205 → 109 → 301 → 302 → 305 → 303/304 → 306`

TASKIT-206/207 são P1 e não devem atrasar a chegada ao planejamento semanal. TASKIT-109 pode ser desenvolvido em paralelo técnico com TASKIT-301, mas precisa estar pronto antes de TASKIT-302.

Depois do núcleo de M3, seguir para Calendar como fonte de ocupações, Dashboard/risco e somente depois inteligência assistida. Itens P1 podem entrar quando suas dependências estiverem maduras sem bloquear o caminho crítico.

# 4. Regra para consumo por agente

Para cada item, o engenheiro de IA deve:

1. citar o ID do backlog no início do trabalho;
2. ler documentos canônicos aplicáveis;
3. verificar dependências no código real;
4. implementar somente a fatia descrita;
5. executar verificações;
6. revisar o diff;
7. criar commit com o ID ou intenção claramente rastreável;
8. atualizar este backlog se requisito/decisão aprovada mudar;
9. atualizar `2.1 Estado atual de execução` quando um item atingir todos os critérios de conclusão.

O agente não pode marcar um item como concluído apenas porque “o código foi escrito”; os critérios de aceite precisam ser demonstravelmente atendidos.
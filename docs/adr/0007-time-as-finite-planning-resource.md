# ADR 0007 — Tempo como recurso finito no domínio de planejamento

- **Status:** aceito
- **Data:** 2026-08-20
- **Backlog relacionado:** TASKIT-109, TASKIT-205, TASKIT-301–306
- **Documento canônico:** `docs/07-planning-capacity-model.md`

## Contexto

Gerenciadores de tarefas permitem acumular atividades sem provar que existe tempo suficiente para executá-las.

O TaskIT já possui os fundamentos para ir além desse modelo:

- tarefas podem ter estimativa de esforço e prazo;
- usuários possuem timezone e disponibilidade recorrente modelada;
- o produto prevê sessões de estudo como alocação temporal da tarefa;
- a visão semanal é definida como núcleo da experiência;
- Google Calendar futuramente fornece ocupações reais do tempo.

Antes de implementar definitivamente StudySession e o motor semanal, é necessário definir como essas fontes se relacionam. Fazer M3 com um modelo que apenas soma tarefas ou sessões e depois introduzir capacidade exigiria retrabalho estrutural.

## Decisão

TaskIT tratará o tempo disponível do usuário como recurso finito no domínio de planejamento.

O domínio comparará demanda conhecida de esforço com capacidade disponível, respeitando intervalos ocupados e prazos aplicáveis.

A primeira implementação será determinística e testável. IA não será usada para decidir matematicamente se uma tarefa, dia ou semana cabe.

### Semântica central

- `Task` representa demanda de trabalho;
- `estimate_minutes`, quando informado, representa esforço total conhecido;
- `StudySession` representa alocação de uma parte da demanda no tempo;
- disponibilidade recorrente representa capacidade potencial;
- eventos externos bloqueadores e sessões planejadas consomem intervalos;
- tempo livre é derivado;
- prazo restringe quais intervalos podem satisfazer uma tarefa;
- prioridade não é sinônimo de prazo;
- uma tarefa sem estimativa continua válida.

### Conflitos

O domínio distinguirá:

1. conflito temporal — intervalos incompatíveis se sobrepõem;
2. conflito de capacidade — não existe tempo total suficiente no período relevante, mesmo sem sobreposição direta.

### Calendar

Calendar é uma fonte de ocupação quando o usuário configurar um calendário como bloqueador. Calendários informativos não reduzem capacidade.

Autenticação Google e autorização Google Calendar continuam separadas.

### Persistência

Valores derivados como capacidade livre da semana, percentual de utilização ou déficit atual não serão persistidos como fonte de verdade sem justificativa concreta de performance, histórico ou analytics.

Migrations já aplicadas não serão editadas. Esta ADR, isoladamente, não exige nova migration.

## Alternativas consideradas

### A. Continuar com planejamento baseado apenas em tarefas/sessões

Rejeitada porque permite construir uma semana visualmente organizada, porém matematicamente impossível antes dos prazos.

### B. Usar IA para sugerir diretamente se a semana está cheia

Rejeitada para o core. O diagnóstico precisa ser determinístico, explicável e reproduzível. IA pode atuar depois do cálculo para ordenar ou explicar alternativas.

### C. Persistir agregados de capacidade por dia/semana desde o início

Rejeitada no MVP. Os horizontes iniciais são pequenos e podem ser calculados sob demanda; persistência derivada introduziria risco de inconsistência prematura.

### D. Criar agora modelo genérico de pessoas/recursos/equipes

Rejeitada. O MVP é individual. A analogia com resource planning não justifica arquitetura de equipes antecipada.

## Consequências positivas

- planejamento mais realista;
- detecção antecipada de sobrecarga;
- distinção clara entre tarefa e alocação temporal;
- integração Calendar ganha função concreta no domínio;
- base explicável para replanejamento;
- diferenciação de produto;
- IA futura passa a trabalhar sobre diagnóstico confiável, não sobre inferência vaga.

## Custos e riscos

- timezone torna-se crítico para cálculos;
- intervalos sobrepostos precisam ser normalizados corretamente;
- o motor exige cobertura unitária extensa;
- disponibilidade precisa ser efetivamente configurável pelo usuário;
- estimativas opcionais significam que alguns diagnósticos terão informação incompleta;
- StudySession precisa preservar histórico suficiente para conclusão e reagendamento;
- Calendar precisa distinguir fontes bloqueadoras de fontes informativas.

## Impacto nas decisões existentes

Esta ADR complementa, sem invalidar:

- ADR 0004 — identidade interna, preferências e disponibilidade típica;
- ADR 0006 — modelo inicial de tarefas e estimativa opcional.

TASKIT-203 permanece válido. Não é necessário reabrir ou alterar a migration de tarefas para adotar esta decisão.

## Regra de implementação

Antes de qualquer UI analítica de capacidade, implementar as regras puras no domínio e seus testes.

A ordem arquitetural é:

```text
fontes de dados
→ normalização de intervalos
→ cálculo determinístico
→ diagnóstico explicável
→ UI
→ sugestões/replanejamento
→ IA opcional futura
```

## Linguagem para o usuário

Não expor jargão de capacidade industrial.

Preferir frases como:

- “Sua quinta-feira está cheia demais.”
- “Faltam cerca de 2 horas para fazer tudo que você planejou.”
- “Ainda existem atividades que precisam de espaço na semana.”
- “Quer ajuda para reorganizar sua semana?”

O sistema deve reduzir ansiedade, não criar uma nova métrica de cobrança.
# TaskIT — Modelo de Planejamento por Capacidade

## 1. Status e propósito

Este documento é canônico para o domínio de planejamento do TaskIT.

A decisão é estrutural: TaskIT deve ajudar o usuário não apenas a organizar tarefas, mas a construir um plano possível dentro do tempo que realmente possui.

North Star conceitual:

> **Fazer caber.**

Na linguagem do produto:

> **O TaskIT ajuda você a entender o que realmente cabe no seu tempo.**

Termos industriais como MRP, CRP, utilização de recurso ou capacidade produtiva não pertencem à interface do usuário. Eles podem inspirar o raciocínio interno, mas a linguagem final deve permanecer humana, simples e não punitiva.

## 2. Princípio central

Tempo é um recurso finito.

O planejamento combina:

- demanda: tarefas e compromissos que exigem tempo;
- esforço: quanto tempo uma atividade precisa;
- capacidade: quanto tempo está potencialmente disponível;
- alocação: quando partes do esforço são reservadas;
- restrições: prazos, ocupações e timezone;
- validação: se a demanda cabe na capacidade antes dos respectivos prazos.

Uma lista de tarefas não é, por si só, um plano possível.

TaskIT deve distinguir claramente:

- **o que precisa ser feito**;
- **quando é possível fazer**.

## 3. Modelo mental do domínio

### Task

`Task` representa demanda de trabalho.

Uma tarefa pode existir sem horário e sem estimativa. Quando possui `estimate_minutes`, essa estimativa representa a demanda total conhecida para fins de planejamento.

Campos atuais relevantes:

- `estimate_minutes`;
- `due_date`;
- `priority`;
- `status`;
- `project_id`.

Prioridade e prazo são dimensões diferentes. Prazo limita a janela de execução; prioridade expressa importância relativa.

### StudySession

`StudySession` representa alocação real de parte da demanda no tempo.

Uma tarefa pode possuir zero, uma ou várias sessões.

Conceitualmente, uma sessão precisa representar pelo menos:

- usuário;
- tarefa de origem;
- início;
- fim;
- status;
- conclusão quando aplicável;
- timestamps necessários para histórico.

O schema definitivo é responsabilidade de TASKIT-301. Não duplicar dados que podem ser derivados com segurança.

### Disponibilidade típica

`availability_window` representa intervalos recorrentes nos quais o usuário normalmente pode planejar atividades.

Disponibilidade típica não é tempo livre final. Ela é uma das entradas do cálculo.

### Ocupações

Ocupações reduzem a capacidade potencial. Exemplos:

- eventos externos selecionados do Google Calendar;
- sessões TaskIT já planejadas;
- períodos explicitamente indisponíveis quando essa capacidade existir.

### Tempo livre

Tempo livre é derivado da disponibilidade menos a união dos intervalos ocupados aplicáveis.

Não persistir `free_minutes`, `remaining_capacity` ou percentuais semanais como fonte de verdade sem necessidade comprovada.

## 4. Estado atual do projeto

A revisão do `main` em 20 de agosto de 2026 encontrou:

- `taskit.task` já possui `estimate_minutes` e `due_date`;
- `taskit.availability_window` já existe para disponibilidade recorrente;
- `taskit.user_preferences` já possui timezone, início da semana e duração padrão de sessão;
- o onboarding atual coleta timezone, início da semana e duração padrão, mas ainda não oferece edição de disponibilidade típica;
- ainda não existe schema de `StudySession`;
- `src/domain` ainda não possui o motor de planejamento/capacidade;
- migrations aplicadas existentes são 0001–0004.

Consequência: esta decisão não exige migration imediata apenas para ser adotada. Migrations já aplicadas não devem ser editadas. A próxima migration de domínio será criada somente quando um backlog item aprovado realmente exigir mudança de schema.

## 5. Esforço estimado, planejado e restante

Para uma tarefa estimada, o domínio deve conseguir separar pelo menos:

- esforço estimado;
- esforço concluído;
- esforço futuro já planejado;
- esforço ainda não planejado.

Conceitualmente:

```text
remainingUnscheduled = max(
  estimated - completed - futureScheduled,
  0
)
```

A fórmula definitiva deve considerar a semântica de sessões canceladas/reagendadas definida em TASKIT-301/306.

Tarefa sem estimativa continua válida e não pode quebrar o sistema. Ela apenas reduz a capacidade do motor de afirmar matematicamente que todo o esforço conhecido cabe.

## 6. Capacidade disponível

TaskIT nunca deve assumir 24 horas disponíveis por dia.

A capacidade potencial começa nas janelas configuradas pelo usuário e pode ser reduzida por ocupações reais.

Exemplo conceitual:

```text
Disponibilidade típica: 18:00–22:00
Evento bloqueador:       19:00–20:30

Capacidade restante:
18:00–19:00
20:30–22:00
```

Buffers, deslocamentos automáticos, preferências de período e limites sofisticados não entram automaticamente no MVP. Só devem ser introduzidos quando houver regra aprovada e necessidade demonstrada.

## 7. Horizontes de cálculo

O motor P0 precisa responder pelo menos em:

- dia;
- semana;
- intervalo até o prazo de uma tarefa.

Horizontes maiores, como mês ou múltiplas semanas, podem ser adicionados depois sem mudar os fundamentos.

## 8. Pergunta fundamental: “cabe?”

A pergunta central é:

> **Essa demanda cabe na capacidade disponível antes do prazo?**

Ela se aplica em três níveis iniciais.

### Tarefa

Comparar esforço restante conhecido com capacidade livre antes do prazo.

### Dia

Comparar sessões/ocupações com disponibilidade real daquele dia e detectar sobrecarga.

### Semana

Comparar capacidade planejável, tempo já ocupado, esforço conhecido necessário e esforço ainda sem horário.

O resultado deve ser explicável em minutos/intervalos, não apenas um score opaco.

## 9. Dois tipos de conflito

### Conflito temporal

Dois intervalos incompatíveis ocupam o mesmo horário.

### Conflito de capacidade

Não há necessariamente sobreposição, mas a quantidade total de tempo disponível antes de um prazo ou dentro de um período é insuficiente.

Esse segundo tipo é parte central da proposta do TaskIT.

## 10. Intervalos e sobreposição

O motor deve trabalhar sobre intervalos reais.

Antes de descontar ocupações da capacidade, intervalos sobrepostos precisam ser unidos para que minutos não sejam descontados duas vezes.

Invariantes mínimas:

- `start < end`;
- duração nunca negativa;
- intervalos livres derivados nunca possuem duração negativa;
- sobreposições formam uma união de intervalos;
- tempo posterior a um prazo não resolve demanda anterior ao prazo;
- timezone define corretamente a fronteira local de dia/semana;
- histórico concluído não desaparece por causa de reagendamento futuro.

## 11. Resultado explicável

Um contrato conceitual adequado é:

```text
PlanningCapacityResult {
  availableMinutes
  scheduledMinutes
  requiredMinutes
  unscheduledMinutes
  freeMinutes
  deficitMinutes
  status
  conflicts
}
```

Os nomes finais podem mudar na implementação, mas a UI precisa receber dados suficientes para explicar por que um plano está viável, apertado ou impossível com as informações conhecidas.

Evitar contratos que exponham apenas algo como `capacity: 0.83`.

## 12. Estados internos e linguagem de produto

Estados internos podem existir para classificação determinística, mas não devem vazar como jargão.

Exemplos de tradução:

- viável → “Seu plano cabe bem na semana.”;
- apertado → “Sua semana está quase cheia.”;
- déficit → “Faltam cerca de 2 horas para fazer tudo que você planejou.”;
- sobrecarga diária → “Sua quarta-feira está cheia demais.”;
- esforço sem horário → “Ainda existem atividades que precisam de espaço no seu planejamento.”

Evitar linguagem de culpa ou produtividade moralizante.

## 13. Google Calendar

Google Calendar é uma fonte externa de ocupações, não apenas uma camada visual.

Quando implementado:

- cada calendário selecionado deve poder ser bloqueador ou apenas informativo;
- apenas eventos de calendários bloqueadores reduzem capacidade;
- eventos externos permanecem propriedade do Google Calendar;
- eventos sobrepostos não podem reduzir capacidade duas vezes;
- desconectar Calendar remove a fonte externa sem invalidar a conta TaskIT;
- Calendar não altera prioridade de tarefas.

A integração de identidade Google continua separada da autorização de Calendar.

## 14. Motor determinístico

A primeira versão do planejamento por capacidade não depende de IA.

Regras como as seguintes pertencem ao domínio puro e testável:

- calcular minutos potencialmente disponíveis;
- unir intervalos ocupados;
- calcular minutos efetivamente livres;
- calcular esforço planejado/concluído/restante;
- detectar sobreposição temporal;
- calcular déficit de capacidade;
- avaliar viabilidade de uma tarefa até o prazo;
- avaliar viabilidade diária/semanal.

A camada de apresentação não recalcula essas regras por conta própria.

## 15. IA e sugestões futuras

A ordem arquitetural é:

```text
Dados
→ motor determinístico
→ diagnóstico objetivo
→ alternativas determinísticas
→ IA opcional para ordenar/explicar opções
```

Nunca usar LLM como fonte da verdade para afirmar que uma semana “parece cheia”.

IA não pode substituir cálculo de minutos, prazo, disponibilidade ou conflitos.

## 16. Replanejamento

Quando o plano não couber, o sistema deve preservar o controle do usuário.

Alternativas P0/P1 podem incluir:

- usar outra janela disponível;
- mover sessão;
- dividir sessão;
- deixar parte da tarefa sem horário e mostrar o risco;
- ajustar manualmente estimativa ou prazo quando isso fizer sentido.

TaskIT não deve reorganizar silenciosamente eventos externos ou compromissos importantes.

## 17. Impacto no onboarding e preferências

O MVP precisa de disponibilidade suficiente para que o motor tenha uma capacidade real de entrada.

A experiência deve continuar curta. O primeiro corte deve priorizar:

- dias normalmente disponíveis;
- intervalo inicial/final por dia;
- timezone existente;
- duração padrão de sessão existente.

Buffers automáticos, preferências de manhã/tarde/noite e duração mínima/máxima por tarefa ficam fora até necessidade aprovada.

## 18. Impacto no banco

### O que já pode ser reutilizado

- `taskit.task.estimate_minutes`;
- `taskit.task.due_date`;
- `taskit.availability_window`;
- `taskit.user_preferences.timezone`;
- ownership já implementado.

### O que não deve ser criado agora

Não adicionar automaticamente:

- `earliest_start`;
- `planning_policy`;
- `splittable`;
- `minimum_session_minutes`;
- `maximum_session_minutes`;
- percentuais ou agregados semanais persistidos;
- arquitetura de equipes/recursos.

### Próxima evolução natural

TASKIT-301 definirá `StudySession` e decidirá a migration seguinte a 0004. A implementação deve revisar development e production antes de promover qualquer schema novo.

## 19. Fronteiras arquiteturais

- **Presentation:** renderiza estados humanos e coleta escolhas;
- **Application:** orquestra casos de uso e autorização;
- **Domain:** contém matemática de intervalos, esforço, capacidade, conflitos e viabilidade;
- **Infrastructure:** fornece disponibilidade persistida, sessões, Calendar e banco.

O motor de capacidade deve ser independente de React, SQL, Neon, Google Calendar e LLM.

## 20. Testes obrigatórios do motor

Cobertura mínima:

- capacidade simples;
- sobrecarga;
- prazo;
- intervalos sobrepostos;
- múltiplas sessões;
- tarefa sem estimativa;
- usuário sem disponibilidade;
- timezone e fronteiras de dia/semana;
- DST quando aplicável;
- evento Calendar bloqueador;
- calendário/evento informativo que não reduz capacidade;
- esforço concluído versus planejado versus ainda sem horário.

## 21. Observabilidade e privacidade

Eventos técnicos úteis podem registrar classes de falha como:

- falha de cálculo;
- intervalo inválido;
- conflito detectado;
- sync Calendar desatualizado;
- falha de resolução de timezone.

Não registrar títulos completos, notas pessoais ou conteúdo acadêmico sem necessidade.

## 22. Performance

Calcular sob demanda para horizontes pequenos no MVP.

Não introduzir cache, snapshots, materialized views ou processamento assíncrono até haver necessidade medida.

O domínio deve permanecer independente dessas otimizações.

## 23. Relação com backlog

Este documento é referência obrigatória para os itens:

- TASKIT-109;
- TASKIT-205;
- TASKIT-301–306;
- TASKIT-404–406;
- TASKIT-502–503;
- TASKIT-702–703.

A sequência canônica está em `docs/06-backlog.md`.

## 24. Critério de maturidade

O modelo estará suficientemente implementado quando o domínio conseguir responder de forma determinística e testável:

- existe tempo suficiente para esta tarefa antes do prazo?;
- o que foi planejado cabe neste dia?;
- o esforço conhecido cabe nesta semana?;
- quanto tempo está faltando?;
- quais intervalos ainda estão disponíveis?;
- qual parte do esforço continua sem planejamento?;
- quais mudanças simples podem tornar o plano possível?

Até lá, o TaskIT não deve apresentar o diagnóstico de capacidade como se fosse uma verdade completa.
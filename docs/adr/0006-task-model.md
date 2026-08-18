# ADR 0006 — Modelo inicial de tarefas

- **Status:** aceito para M2
- **Backlog:** TASKIT-203
- **Data:** 2026-08-18

## Contexto

Tarefas são a unidade de trabalho que liga captura rápida, projetos e sessões de estudo. O modelo inicial precisa suportar o MVP sem antecipar subtarefas, dependências complexas ou recorrência.

## Decisão

Cada tarefa pertence diretamente a um usuário. A associação a projeto é opcional, permitindo inbox e tarefas independentes.

Quando `project_id` existe, ownership é garantido também no banco por uma chave estrangeira composta `(project_id, user_id)` apontando para `(project.id, project.user_id)`. Assim, uma tarefa não pode ser ligada ao projeto de outro usuário mesmo se a camada de aplicação tiver um bug.

### Campos funcionais do primeiro corte

- título obrigatório;
- projeto opcional;
- notas curtas opcionais;
- prioridade `low`, `normal` ou `high`;
- prazo opcional como data local;
- estimativa opcional em minutos;
- status `inbox`, `planned`, `in_progress`, `completed` ou `archived`;
- timestamps de conclusão/arquivo disponíveis para preservar contexto histórico.

### Arquivamento e exclusão

`archived` é um estado da tarefa. O fluxo normal não faz hard delete.

Projetos também usam arquivamento como fluxo normal. A relação tarefa→projeto não possui cascade de exclusão: uma remoção física acidental de projeto com tarefas associadas deve ser bloqueada pelo banco. A exclusão do usuário continua removendo seus dados pelo cascade já existente na raiz de ownership.

### Estimativa

A estimativa é auxílio de planejamento, não obrigação. O banco aceita apenas valores positivos dentro de um limite defensivo amplo; o produto poderá refinar a UX sem alterar a unidade persistida.

## Fora deste ADR

- subtarefas;
- recorrência;
- dependências entre tarefas;
- sessões de estudo;
- ordenação manual avançada;
- histórico de transições de status.

Esses comportamentos entram somente quando seus backlog items forem executados.

## Validação em Neon development

A migration foi aplicada no branch `development` e validada com sujeitos sintéticos:

- tarefa sem projeto foi aceita;
- tarefa vinculada ao projeto do mesmo usuário foi aceita;
- tentativa de vínculo com projeto de outro usuário foi rejeitada pela constraint do banco;
- cleanup dos sujeitos sintéticos removeu os registros por cascade.

Nenhuma alteração foi aplicada ao branch Neon `main` neste item.

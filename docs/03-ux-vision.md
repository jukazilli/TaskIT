# TaskIT — Visão de UX

## 1. Objetivo de experiência

TaskIT deve reduzir o esforço mental necessário para transformar intenção em ação. O usuário não deve gastar energia administrando o sistema; deve gastar energia estudando.

A experiência ideal transmite três sensações: **sei o que fazer**, **sei quando fazer** e **consigo ajustar quando a realidade mudar**.

## 2. Princípios de UX

### 2.1 Menos decisões por etapa

Cada fluxo deve pedir apenas as informações necessárias naquele momento. Campos opcionais ficam disponíveis por revelação progressiva.

### 2.2 Planejamento realista

O sistema deve considerar disponibilidade real, eventos externos, duração estimada e carga acumulada antes de sugerir que algo “cabe” na semana.

### 2.3 Replanejamento é comportamento normal

Uma sessão perdida não deve gerar linguagem punitiva. O produto deve facilitar mover, dividir ou adiar o trabalho.

### 2.4 Captura rápida, organização posterior

Criar uma tarefa não pode exigir projeto, prazo, prioridade e duração de uma vez. O usuário deve conseguir capturar primeiro e organizar depois.

### 2.5 Contexto preservado

Abrir detalhes, editar ou concluir não deve fazer o usuário perder sua posição na semana, cronograma ou projeto.

### 2.6 Previsibilidade

A mesma ação deve produzir o mesmo tipo de resultado em todo o produto. Evitar controles que mudam de significado por tela.

## 3. Jornadas principais

### 3.1 Primeira semana

1. usuário entra;
2. define fuso e preferências mínimas;
3. conecta Google Calendar ou pula;
4. cria primeiro projeto;
5. captura tarefas;
6. define estimativas quando necessário;
7. aloca sessões na semana;
8. visualiza conflitos e carga;
9. inicia execução.

Meta: chegar à primeira semana planejada sem tutorial longo.

### 3.2 Capturar algo rapidamente

1. aciona Quick Add;
2. digita título;
3. salva;
4. retorna imediatamente ao contexto anterior.

Campos adicionais podem ser preenchidos sem interromper a captura.

### 3.3 Planejar uma tarefa

1. seleciona tarefa;
2. escolhe duração ou usa estimativa existente;
3. vê janelas possíveis;
4. cria uma ou mais sessões;
5. sistema atualiza carga e conflitos.

### 3.4 Replanejar sessão perdida

1. sessão fica pendente;
2. TaskIT oferece opções simples: hoje, outro dia, dividir, remover da semana;
3. usuário escolhe;
4. calendário e progresso são atualizados.

### 3.5 Revisar progresso

1. abre semana ou projeto;
2. vê progresso agregado e itens em risco;
3. entra somente nos detalhes necessários;
4. ajusta próximos passos.

## 4. Dashboard como superfície de decisão

O dashboard não é uma tela de relatório. Deve ajudar o usuário a decidir o próximo movimento.

Prioridade:

1. próxima sessão;
2. tarefas/sessões de hoje;
3. carga da semana;
4. poucos riscos relevantes.

O sistema deve evitar mensagens genéricas como “Você tem 17 tarefas”. Preferir contexto acionável, por exemplo “2h30 planejadas hoje; 1h ainda sem horário”.

## 5. Agenda e Google Calendar

Eventos externos devem ser visualmente distinguíveis de sessões TaskIT sem criar ruído.

Regras:

- conexão é opcional;
- usuário escolhe calendários relevantes;
- eventos externos são somente leitura por padrão;
- sessões TaskIT podem ser espelhadas no Google Calendar mediante opção explícita;
- conflitos são alertas, não bloqueios absolutos;
- alterações externas devem ser reconciliadas sem duplicação.

## 6. Prevenção de sobrecarga

- usar padrões inteligentes em vez de perguntar tudo;
- limitar alertas simultâneos;
- esconder métricas sem função decisória;
- evitar onboarding em carrossel longo;
- preferir aprender fazendo;
- não usar badges vermelhos permanentes para tarefas atrasadas;
- agrupar itens por intenção, não somente por atributo técnico.

## 7. Mensagens e microcopy

Tom:

- curto;
- calmo;
- claro;
- sem julgamento;
- sem infantilização;
- orientado à ação.

Exemplos de linguagem:

- “Mover para amanhã” em vez de “Você falhou em concluir”.
- “3 sessões ainda sem horário” em vez de “Planejamento incompleto”.
- “Conflito com outro compromisso” em vez de “Erro de agenda”.

## 8. Erros

Uma mensagem de erro deve, sempre que possível:

1. dizer o que não aconteceu;
2. preservar o trabalho do usuário;
3. oferecer uma ação de recuperação.

Erros técnicos brutos nunca devem ser apresentados como interface final.

## 9. Empty states

Estados vazios devem responder “o que faço agora?” com uma ação clara e mínima.

Exemplo: projeto sem tarefas deve oferecer adicionar tarefa, não explicar em três parágrafos o conceito de tarefa.

## 10. Desktop e mobile

A experiência deve preservar o mesmo modelo mental, mas não exigir paridade pixel a pixel.

Desktop privilegia:

- drag and drop;
- visão ampla;
- atalhos de teclado;
- edição em painéis contextuais.

Mobile privilegia:

- toque;
- navegação curta;
- sheets;
- replanejamento por ações diretas;
- visualizações focadas por dia/semana.

## 11. Heurísticas de qualidade

Antes de considerar um fluxo pronto, responder:

- o usuário entende onde está?
- existe uma ação principal evidente?
- há informação que pode ser removida?
- uma pessoa consegue completar a tarefa sem documentação?
- o sistema preserva contexto após agir?
- existe uma saída clara de erro?
- mobile exige mais passos do que o necessário?
- linguagem ou cor geram culpa desnecessária?

## 12. Métricas de UX

- tempo até primeira semana planejada;
- tempo médio para capturar tarefa;
- tempo médio para reagendar sessão;
- abandono no onboarding;
- número de interações para planejar tarefa;
- frequência de undo/replanejamento;
- erros de sincronização percebidos pelo usuário;
- retorno semanal.
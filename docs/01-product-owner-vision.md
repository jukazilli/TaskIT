# TaskIT — Visão de Product Owner e Funcionalidades

## 1. Visão do produto

TaskIT deve ser o sistema pessoal de execução de estudos do usuário. A experiência começa no objetivo de médio/longo prazo, desce para projetos e tarefas e termina em blocos concretos de tempo na semana.

O produto não deve premiar planejamento excessivo. Deve privilegiar clareza, execução e replanejamento simples.

## 2. Modelo mental do produto

Hierarquia principal:

**Objetivo/Projeto → Marco → Tarefa → Sessão de estudo → Registro de conclusão**

Elementos complementares:

- calendário externo;
- prioridade;
- estimativa de esforço;
- prazo;
- progresso;
- notas curtas;
- recorrência;
- disponibilidade semanal.

## 3. Módulos funcionais

### 3.1 Onboarding

Objetivo: ativar o usuário em poucos minutos.

Fluxo esperado:

1. entrar/criar conta;
2. definir fuso horário;
3. opcionalmente conectar Google Calendar;
4. criar primeiro objetivo/projeto;
5. adicionar tarefas iniciais;
6. montar a primeira semana.

A conexão com Google Calendar não deve bloquear o uso do produto.

### 3.2 Dashboard

O dashboard deve ser produtivo e informativo, mas de baixa densidade.

Deve priorizar:

- foco de hoje;
- próxima sessão;
- progresso da semana;
- carga planejada versus disponível;
- tarefas ou sessões em risco;
- atalho para planejar/replanejar.

Não deve virar um painel de dezenas de métricas.

### 3.3 Planejamento semanal

É o núcleo do produto.

Capacidades:

- visualizar segunda a domingo;
- enxergar compromissos do Google Calendar junto às sessões TaskIT;
- arrastar sessões entre dias/horários no desktop;
- replanejar de forma equivalente no mobile;
- identificar conflitos;
- mostrar capacidade diária/semanal;
- criar sessões a partir de tarefas;
- dividir uma tarefa em várias sessões;
- mover itens não concluídos sem punição visual.

### 3.4 Projetos e objetivos

Cada projeto deve representar um resultado relevante, por exemplo “Certificação AWS”, “Cálculo II” ou “Inglês B2”.

Capacidades:

- nome, descrição curta e cor/ícone;
- prazo opcional;
- status;
- progresso calculado;
- marcos;
- tarefas vinculadas;
- visão cronológica.

### 3.5 Tarefas

Capacidades:

- título;
- projeto;
- prioridade;
- prazo opcional;
- estimativa de esforço;
- status;
- notas curtas;
- recorrência opcional;
- subtarefas apenas se comprovadamente necessárias após MVP.

Estados iniciais sugeridos:

- inbox;
- planejada;
- em andamento;
- concluída;
- arquivada.

### 3.6 Sessões de estudo

Uma sessão é a manifestação temporal de uma tarefa.

Capacidades:

- tarefa de origem;
- início e fim;
- duração;
- status planejada/em andamento/concluída/cancelada;
- anotação pós-sessão opcional;
- conclusão parcial;
- replanejamento.

Uma tarefa pode gerar múltiplas sessões.

### 3.7 Cronograma estilo gestão de projetos

O usuário deve conseguir enxergar projetos no tempo, não apenas listas.

Visão proposta:

- eixo horizontal temporal;
- projetos/marcos/tarefas em linhas;
- dependências apenas se realmente úteis;
- zoom por semana/mês;
- progresso e atraso visualmente legíveis;
- filtros por projeto e status.

Para o MVP, priorizar um timeline/Gantt leve; dependências complexas ficam fora do primeiro corte.

### 3.8 Google Calendar

Integração inicial:

- conexão opcional;
- escolha de calendários a considerar;
- leitura de eventos para disponibilidade e conflitos;
- criação/atualização opcional de sessões TaskIT no Calendar;
- vínculo persistente entre sessão e evento externo;
- tratamento de eventos alterados fora do TaskIT;
- reconexão em caso de token expirado/revogado.

Regra: eventos externos continuam pertencendo ao Google Calendar; TaskIT não deve alterar eventos que não criou sem ação explícita do usuário.

### 3.9 Inbox

Captura rápida para pensamentos e tarefas ainda não planejadas.

Características:

- entrada extremamente rápida;
- título como único campo obrigatório;
- processamento posterior para projeto, prioridade, esforço e agenda.

### 3.10 Busca e filtros

MVP:

- busca por texto;
- filtros por projeto, status, prazo e prioridade;
- filtros persistentes somente quando fizer sentido para a tela.

### 3.11 Preferências

- fuso horário;
- início da semana;
- horas típicas disponíveis por dia;
- duração padrão de sessão;
- calendários conectados;
- notificações;
- tema futuro, sem priorizar no MVP.

## 4. Funcionalidades pós-MVP candidatas

- planejamento assistido por IA;
- sugestão automática de replanejamento;
- estimativa adaptativa baseada em histórico;
- análise de consistência por projeto;
- Pomodoro/focus mode;
- templates de rotinas;
- widgets de sistema;
- notificações inteligentes;
- app nativo via shell;
- importação de syllabus/plano de curso;
- captura por linguagem natural.

## 5. Regras de produto

- concluir uma sessão não precisa concluir a tarefa;
- atrasos devem gerar sugestão de replanejamento, não culpa;
- qualquer cálculo de progresso precisa ser explicável;
- calendário externo pode bloquear tempo, mas não altera prioridade da tarefa;
- tarefas sem projeto são permitidas;
- projetos arquivados permanecem consultáveis;
- exclusões destrutivas devem oferecer confirmação ou desfazer.

## 6. Critérios globais de aceite

Uma funcionalidade só está pronta quando:

- funciona em mobile e desktop nos breakpoints suportados;
- possui loading, vazio, sucesso e erro;
- é acessível por teclado quando aplicável;
- não depende exclusivamente de cor;
- possui testes compatíveis com seu risco;
- possui telemetria de erro adequada;
- não expõe segredos ou tokens ao cliente;
- documentação e backlog refletem decisões alteradas.
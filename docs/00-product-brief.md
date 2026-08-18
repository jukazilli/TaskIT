# TaskIT — Briefing do Produto

## 1. Contexto

TaskIT é um aplicativo pessoal de planejamento de estudos para pessoas que precisam organizar o que estudar, quando estudar e como distribuir esforço ao longo da semana sem transformar a ferramenta em mais uma fonte de ansiedade.

O produto deve funcionar bem em telas móveis e desktop, permitir visão semanal e visão de cronograma semelhante à gestão de projetos e integrar-se ao Google Calendar para considerar compromissos reais do usuário.

## 2. Problema

Planejadores tradicionais costumam falhar em pelo menos um destes pontos:

- registram tarefas, mas não ajudam a transformar tarefas em tempo de execução;
- exibem informação demais simultaneamente;
- tratam calendário, prioridades e projetos como universos separados;
- exigem manutenção excessiva do próprio sistema;
- fazem o usuário planejar de forma otimista sem considerar disponibilidade real.

TaskIT resolve isso criando um plano semanal visual, executável e ajustável.

## 3. Público inicial

Pessoas que estudam de forma recorrente — faculdade, concursos, certificações, idiomas, cursos ou aprendizagem profissional — e precisam conciliar estudo com trabalho, compromissos pessoais e diferentes objetivos paralelos.

## 4. Proposta de valor

> Transformar objetivos de estudo em uma semana clara, realista e executável.

TaskIT deve responder rapidamente a quatro perguntas:

1. O que preciso fazer?
2. O que importa mais agora?
3. Quando vou fazer?
4. Estou avançando no ritmo esperado?

## 5. Personalidade da marca

A marca deve comunicar **energia, calma, serenidade e foco**.

Não deve parecer infantil, clínica, corporativa ou excessivamente gamer. A energia vem do verde-lima e do progresso; a calma vem do espaço, da baixa densidade e da previsibilidade da interface.

## 6. Direção visual

- cor de assinatura: verde-lima claro;
- cores sempre sólidas, evitando gradientes como linguagem principal;
- base neutra clara, com contraste confortável;
- tipografia: Nunito;
- bordas e superfícies simples;
- sombra apenas quando necessária para hierarquia;
- ícones consistentes e familiares;
- animação discreta e funcional.

### Paleta inicial de referência

Os valores abaixo são tokens de partida, sujeitos a validação de contraste:

- `lime-500`: `#B9F227` — ações de destaque e progresso;
- `lime-100`: `#EEFACB` — superfícies de apoio;
- `ink-950`: `#172019` — texto principal;
- `ink-600`: `#667067` — texto secundário;
- `surface`: `#FAFCF8` — fundo principal;
- `surface-strong`: `#FFFFFF` — cartões;
- `border`: `#E4E9E1` — divisores;
- estados de erro, alerta e sucesso devem ter tokens próprios e não depender apenas de cor.

## 7. Princípios obrigatórios

### Produto
- planejamento deve gerar execução;
- semana é a unidade principal de operação;
- projeto/objetivo oferece contexto de longo prazo;
- sessão de estudo é a unidade de tempo executável;
- tarefas podem existir sem data, mas o produto deve incentivar alocação realista.

### Interface
- baixa densidade por padrão;
- cada tela deve possuir uma ação primária evidente;
- não explicar botões que deveriam ser intuitivos;
- preferir botões iconográficos para ações recorrentes e universais;
- usar texto quando a iconografia isolada gerar ambiguidade, especialmente em ações destrutivas ou raras;
- não esconder informação essencial atrás de gestos invisíveis;
- estados vazios devem orientar sem criar tutoriais longos.

### Experiência
- reduzir escolhas simultâneas;
- preservar contexto entre telas;
- permitir desfazer ações de baixo risco;
- evitar modais em cascata;
- edição rápida deve acontecer no contexto sempre que possível;
- planejamento nunca deve punir o usuário por não cumprir o plano.

## 8. Métrica norteadora

**Semanas executáveis:** percentual de semanas em que o usuário planejou ao menos uma sessão e concluiu parte do plano.

Métricas de apoio:

- taxa de ativação: cria primeiro projeto + primeira tarefa + primeira sessão;
- sessões planejadas por semana;
- sessões concluídas;
- taxa de replanejamento em vez de abandono;
- tempo até registrar ou reagendar uma tarefa;
- usuários com Google Calendar conectado;
- retenção semanal.

## 9. Não objetivos iniciais

O MVP não deve tentar ser:

- uma plataforma escolar ou LMS;
- rede social;
- ferramenta para equipes;
- editor de documentos completo;
- gerenciador financeiro;
- sistema complexo de gamificação;
- substituto integral do Google Calendar.

## 10. Definição de sucesso do MVP

O MVP é bem-sucedido quando um usuário consegue conectar ou ignorar o Google Calendar, criar seus objetivos, organizar tarefas, montar a semana, enxergar conflitos, acompanhar progresso e replanejar rapidamente em celular ou desktop sem precisar aprender um sistema complexo.
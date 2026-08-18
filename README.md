# TaskIT

TaskIT é um planejador pessoal de estudos para web, desktop e mobile, desenhado para reduzir carga cognitiva e transformar intenção de estudo em uma semana executável.

O produto combina planejamento semanal, tarefas, sessões de estudo, cronograma visual por projeto e integração com Google Calendar em uma interface calma, clara e de baixa densidade.

## Princípios do produto

- **Clareza antes de quantidade:** mostrar apenas o que ajuda a decidir ou agir agora.
- **Planejamento executável:** todo plano deve terminar em blocos concretos de estudo.
- **Baixa carga cognitiva:** menos texto, menos decisões simultâneas, hierarquia visual forte.
- **Iconografia antes de rótulos redundantes:** ações recorrentes devem ser reconhecíveis sem explicações.
- **Calma com energia:** verde-lima claro como energia controlada, superfícies sólidas e tipografia Nunito.
- **Calendar-aware:** o planejamento respeita compromissos reais do usuário.
- **IA-first engineering:** backlog, contratos e testes devem permitir desenvolvimento confiável por agentes de IA.

## Arquitetura-alvo

- **Aplicação:** Next.js + TypeScript, responsiva e instalável como PWA.
- **Hospedagem e compute:** Vercel.
- **Banco de dados:** Neon Postgres.
- **Integração externa principal:** Google Calendar API.
- **Distribuição inicial:** browser + instalação PWA em desktop e mobile.
- **Evolução nativa:** possível posteriormente através de shell nativo, sem duplicar domínio e backend.

## Documentação

1. [Briefing do produto](docs/00-product-brief.md)
2. [Visão de Product Owner e funcionalidades](docs/01-product-owner-vision.md)
3. [Visão de UI](docs/02-ui-vision.md)
4. [Visão de UX](docs/03-ux-vision.md)
5. [Visão de Engenharia e Tech Lead](docs/04-engineering-tech-lead.md)
6. [Desenvolvimento AI-first](docs/05-ai-first-development.md)
7. [Backlog canônico](docs/06-backlog.md)

## Regra de precedência

O backlog é executável, mas não substitui a intenção do produto. Em caso de conflito, a ordem de precedência é:

1. visão de produto e UX;
2. decisões de engenharia e segurança;
3. critérios de aceite do backlog;
4. detalhes de implementação.

Qualquer mudança estrutural deve atualizar a documentação correspondente no mesmo pull request.
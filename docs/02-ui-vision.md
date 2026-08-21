# TaskIT — Visão de UI

## 1. Objetivo visual

A interface do TaskIT deve parecer leve antes mesmo de ser usada. O usuário precisa sentir que consegue compreender a tela em poucos segundos, identificar onde está, o que é importante e qual é a próxima ação possível.

A estética deve combinar energia controlada, serenidade e foco.

## 2. Princípios de UI

### 2.1 Baixa densidade

- limitar informação simultânea;
- usar agrupamento e revelação progressiva;
- evitar tabelas densas como padrão;
- evitar barras de ferramentas extensas;
- evitar múltiplos cartões competindo pela atenção;
- usar espaço em branco como elemento funcional.

### 2.2 Hierarquia forte

Em cada tela deve ser reconhecível:

1. contexto atual;
2. informação principal;
3. próxima ação;
4. informação secundária.

### 2.3 Iconografia funcional

Priorizar ícones para ações universais e recorrentes, como:

- adicionar;
- editar;
- concluir;
- pesquisar;
- filtrar;
- navegar;
- mover/reordenar;
- abrir calendário.

Ícones devem possuir nome acessível para leitores de tela e tooltip em desktop quando útil.

Não usar ícone isolado quando sua interpretação não for suficientemente previsível.

## 3. Tipografia

Família principal: **Nunito**.

Estratégia:

- poucos tamanhos;
- poucos pesos;
- títulos claros, não gigantes;
- corpo confortável;
- números e duração com boa legibilidade;
- evitar excesso de caixa alta.

Escala inicial sugerida:

- Display: 32/40, 700;
- H1: 26/34, 700;
- H2: 20/28, 700;
- H3: 17/24, 700;
- Body: 15/22, 400/600;
- Small: 13/18, 400/600;
- Micro: 11/16, 600.

## 4. Cores

### 4.1 Assinatura

Verde-lima claro será a cor de marca, usada de forma intencional — não como preenchimento dominante de todas as telas.

Tokens iniciais:

- `brand-500 #B9F227`
- `brand-300 #D5F879`
- `brand-100 #EEFACB`
- `ink-950 #172019`
- `ink-700 #3E493F`
- `ink-600 #667067`
- `surface-0 #FFFFFF`
- `surface-1 #FAFCF8`
- `surface-2 #F2F5EF`
- `border #E4E9E1`

A paleta final precisa passar por teste WCAG; verde-lima não deve ser usado como texto claro sobre fundo branco nem como único sinal de estado.

### 4.2 Sem gradientes como linguagem visual

Superfícies e controles devem utilizar cores sólidas. Gradientes não fazem parte da identidade principal do produto.

## 5. Forma e superfícies

- cantos moderadamente arredondados;
- cartões somente quando agrupamento realmente ajudar;
- divisores sutis;
- sombras discretas e raras;
- evitar glassmorphism;
- evitar excesso de bordas;
- selecionar pelo contraste de superfície, não por decoração.

## 6. Layout desktop

Estrutura preferencial:

- navegação lateral compacta;
- área de conteúdo central ampla;
- painel contextual opcional à direita quando necessário;
- cabeçalho local da página, não um mega-header global;
- cronograma e calendário podem ocupar quase toda a largura útil.

Navegação primária candidata:

- Hoje;
- Semana;
- Projetos;
- Cronograma;
- Inbox.

Busca e configurações ficam em regiões secundárias.

## 7. Layout mobile

Princípios:

- uma coluna;
- foco em uma decisão por vez;
- bottom navigation limitada aos destinos mais frequentes;
- ações primárias próximas ao polegar;
- sheets para edição contextual;
- evitar replicar literalmente o desktop em miniatura.

Destinos iniciais candidatos:

- Hoje;
- Semana;
- Projetos;
- Inbox.

Cronograma pode ser acessado pelo projeto ou por menu secundário se não couber na navegação principal.

## 8. Componentes centrais

### 8.1 Task Row

Mostra apenas:

- estado;
- título;
- projeto por sinal visual discreto;
- prazo/estimativa se relevante no contexto.

Detalhes extras surgem sob demanda.

### 8.2 Study Session Block

Em calendário:

- título curto;
- projeto;
- duração implícita pela geometria;
- status com sinal não dependente apenas de cor.

### 8.3 Progress Ring/Bar

Usado com parcimônia. Deve mostrar progresso útil, nunca decoração vazia.

### 8.4 Quick Add

Entrada rápida, foco imediato no título, teclado-first no desktop e thumb-first no mobile.

### 8.5 Resumo de capacidade

Quando a interface precisar comunicar viabilidade do plano, usar poucos números acionáveis: tempo disponível, tempo planejado, esforço ainda sem horário e déficit somente quando existir.

Não criar gauges industriais, percentuais opacos ou heatmaps complexos como padrão. Estados como semana apertada ou dia sobrecarregado combinam texto, hierarquia e sinal visual que não depende apenas de cor.

### 8.6 Command Palette

Candidata pós-MVP ou final de MVP para usuários desktop avançados. Não pode ser necessária para operações básicas.

## 9. Dashboard

O dashboard deve ser composto por poucas zonas:

- **Agora / Próximo** — próxima sessão e ação imediata;
- **Hoje** — sessões e compromissos relevantes;
- **Semana** — progresso e capacidade resumida, mostrando apenas o necessário para decidir se ainda existe espaço ou esforço sem horário;
- **Atenção** — no máximo alguns itens com risco real.

Não usar um mosaico de KPIs.

## 10. Cronograma

Visual semelhante à gestão de projetos, porém simplificado:

- linha por projeto/marco/tarefa;
- barra temporal sólida;
- progresso dentro da barra;
- marcador de hoje;
- zoom de semana/mês;
- rolagem horizontal controlada;
- hierarquia recolhível;
- sem excesso de dependências gráficas no MVP.

## 11. Motion

Animação deve informar mudança de estado:

- reorganização;
- conclusão;
- abertura contextual;
- transição entre estados.

Duração curta, sem efeitos elásticos ou celebratórios repetitivos.

## 12. Acessibilidade visual

- contraste compatível com WCAG AA para conteúdo essencial;
- foco visível;
- área de toque adequada;
- estados não dependem só de cor;
- zoom de texto não quebra ações principais;
- suporte a reduced motion;
- ícones interativos têm rótulo acessível.

## 13. O que evitar

- interfaces com dezenas de chips;
- cinco ou mais cores competindo;
- gradientes chamativos;
- cards dentro de cards;
- tooltips usados para explicar fluxos ruins;
- textos longos para ensinar controles básicos;
- dashboards corporativos;
- gamificação visual infantil;
- menus escondendo operações essenciais.
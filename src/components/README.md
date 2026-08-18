# Components

Componentes visuais reutilizáveis e independentes de regras de domínio. Componentes específicos de uma capacidade pertencem preferencialmente ao respectivo módulo em `src/features`.

## Base UI

Primitivos compartilhados vivem em `src/components/ui`. Eles devem:

- consumir os tokens canônicos em `src/styles/tokens.css`;
- manter estados de foco, disabled e erro acessíveis;
- evitar regra de domínio;
- expor uma API pequena orientada à intenção de uso.

## Catálogo local

Durante desenvolvimento, `/dev/components` apresenta os componentes-base isoladamente e com estados comuns. A rota retorna 404 em builds de produção e não é uma superfície de produto.

Ao adicionar ou alterar um primitivo compartilhado, atualize o catálogo e a cobertura aplicável no mesmo item de backlog.

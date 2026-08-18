# TaskIT — Instruções para agentes de engenharia

Antes de alterar código, leia nesta ordem:

1. `README.md`;
2. `docs/00-product-brief.md`;
3. documentação funcional relevante;
4. `docs/02-ui-vision.md` e `docs/03-ux-vision.md` quando houver UI;
5. `docs/04-engineering-tech-lead.md`;
6. `docs/05-ai-first-development.md`;
7. item correspondente em `docs/06-backlog.md`;
8. ADRs e código relacionado.

## Regras operacionais

- Trabalhe em um backlog item ou pequena fatia coerente por vez.
- Não altere arquitetura silenciosamente; registre ADR quando aplicável.
- Não coloque regra de domínio em componentes React.
- Não acesse banco diretamente de componentes de apresentação.
- Nunca versione segredos ou tokens.
- Não use `any` ou casts amplos para contornar problemas de tipagem.
- Não desabilite lint ou testes para obter um pipeline verde.
- Toda entrada externa é não confiável e deve ser validada na fronteira apropriada.
- Integrações externas devem ficar atrás de adapters explícitos.
- Revise responsividade e acessibilidade quando houver UI.

## Antes de entregar

Execute, conforme aplicável:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Registre no PR o backlog item, testes executados, decisões, limitações e configurações necessárias.

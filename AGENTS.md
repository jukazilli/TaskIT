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
- Local, GitHub Actions e Vercel devem usar a mesma major de Node.js definida em `.nvmrc`/`package.json`.

## Antes de entregar

Execute, conforme aplicável:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Um pipeline local/GitHub verde não é suficiente para declarar uma alteração entregue quando ela afeta a aplicação publicada.

Para cada PR que gera deployment Vercel:

1. confirme que o status `Vercel` está verde para o **SHA exato** do head do PR;
2. confirme que o deployment metadata `githubCommitSha` é o mesmo SHA;
3. consulte `/api/health` no deployment e confirme `status = ok` e `release` igual ao SHA esperado;
4. não use um deployment `READY` de outro commit como evidência do commit atual.

Após merge em `main`:

1. confirme que o deployment `production` foi criado para o SHA exato de `main`;
2. confirme `/api/health` no domínio de produção;
3. se GitHub CI estiver verde mas Vercel/build/runtime falhar, a entrega permanece **não concluída** até a causa ser corrigida.

Registre no PR o backlog item, testes executados, SHA verificado na Vercel, decisões, limitações e configurações necessárias.

# ADR 0001 — Neon environments and Vercel integration

## Status

Accepted for M0. Application-level connection validation remains coupled to TASKIT-003/TASKIT-005 because Vercel project linking and environment injection must be completed before the app is allowed to consume database credentials.

## Context

TaskIT uses Neon Postgres as its source of truth and Vercel as its application platform. The project must support AI-assisted development without allowing experiments, migrations or preview deploys to operate against production data by default.

The Neon project has been provisioned under the TaskIT name. A primary `main` branch exists and a child `development` branch was created for non-production work.

No connection string, password or database credential is stored in this repository.

## Decision

### Environment model

- Neon `main` is the production database branch.
- Neon `development` is the shared non-production branch for local development and integration work that does not warrant an isolated preview branch.
- Pull requests that require database changes should receive an isolated branch derived from the appropriate parent once TASKIT-005 configures preview branching.
- Schema experiments and migration validation must not run directly on Neon `main`.
- Promotion to production must happen through versioned migrations and the engineering workflow documented in `docs/04-engineering-tech-lead.md`.

### Connection model

- Database access is server-side only.
- `DATABASE_URL` is the pooled connection used by serverless application workloads unless a later driver decision requires otherwise.
- `DATABASE_URL_UNPOOLED` is reserved for operations that explicitly require a direct connection, such as selected migration/admin workflows.
- Secrets live in environment management, never in Git, client bundles, logs or documentation.
- The application must fail clearly when required server-side database configuration is absent; it must never fall back silently to another environment.

### Vercel integration

Use the **Neon-managed Vercel integration** because TaskIT already owns and manages its Neon project directly. This preserves Neon as the database control plane while allowing Vercel previews to receive environment-specific database configuration and, when enabled in TASKIT-005, isolated preview branches.

A manual environment-variable-only connection is not the default because it would forgo the managed preview-branch lifecycle. A Vercel-managed Neon project is not chosen because the database already exists in the user's Neon account and should remain managed there.

### Preview lifecycle

After TASKIT-005:

1. production deployments map to Neon `main`;
2. normal local/shared development maps to Neon `development`;
3. database-affecting pull requests use isolated preview branches when available;
4. preview branches are disposable and must not become the source of truth;
5. cleanup follows the Git/preview lifecycle configured by the managed integration.

## Validation performed

Connectivity was verified through Neon's authenticated server-side management channel against the `development` branch and `neondb` database. The database responded successfully using the owner role. No schema mutation was performed and production was not queried for experimental validation.

Application-level connectivity is intentionally deferred until Vercel is linked and environment keys can be injected without exposing secret values. This preserves the bootstrap rule that the application must not run database operations against an unverified environment.

## Alternatives considered

### Use Neon `main` for development

Rejected because mistakes, migrations and AI-generated experiments could affect the production source of truth.

### Maintain a permanently separate Neon project for development

Not selected for the initial product because Neon branching provides lower operational overhead while preserving isolation. This can be revisited if organizational, compliance or load requirements justify physically separate projects.

### Manual Neon–Vercel connection

Useful when custom CI/CD owns database branch creation, but unnecessary for the initial TaskIT workflow and easier to misconfigure across preview environments.

## Consequences

- production has a clearly identified database branch;
- development work has a safe default branch;
- preview isolation can be added without redesigning the data architecture;
- application DB validation cannot be marked complete until TASKIT-003 and TASKIT-005 inject the correct secret environment;
- engineers and agents must treat database branch selection as part of deployment safety, not as an implementation detail.

## Operational invariants

- never commit a Neon connection string;
- never expose database credentials through `NEXT_PUBLIC_*` variables;
- never run exploratory DDL on `main`;
- migrations must be versioned and tested outside production first;
- a preview must never silently reuse production credentials for migrations or destructive tests;
- logs must not contain credentials or sensitive query payloads.

# Database migrations

TaskIT keeps application-owned Postgres migrations versioned in this directory.

## Rules

- Migrations are immutable after they have been promoted to production.
- Every migration is tested outside production first.
- Experimental DDL never runs on the Neon `main` branch.
- Provider-owned schemas such as `neon_auth` are not modified by TaskIT migrations.
- Application tables live under the `taskit` schema.
- Provider identities are stored as external subjects; application tables do not foreign-key into provider-owned auth schemas.
- Production promotion is deliberate and follows the environment strategy in `docs/adr/0001-neon-environments.md`.

## Current state

`0001_user_identity_and_preferences.sql` introduces the TaskIT-owned internal user identity, user preferences, and weekly availability windows. It is designed to be applied first to the Neon `development` branch and promoted only after the Vercel/Neon production integration is complete and reviewed.

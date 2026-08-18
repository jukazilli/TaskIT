# ADR 0002 — Authentication architecture

## Status

Accepted for M1.

## Decision

TaskIT will use **Neon Auth (Managed Better Auth)** as the application authentication service.

Authentication for the TaskIT account is intentionally separate from authorization to access Google Calendar. A user may use TaskIT without granting Calendar access, and Calendar consent must be requested later through its own explicit OAuth flow and scopes.

## Context

The original engineering foundation deliberately deferred the authentication provider decision because Neon Managed Better Auth was not yet mature enough to adopt without a spike.

That constraint has changed. Neon Auth is now based on Better Auth, stores authentication state in the project's Postgres database, branches authentication data together with Neon database branches, provides a unified server-side SDK for Next.js, and supports Neon/Vercel preview workflows.

Those properties match TaskIT's existing architecture unusually well:

- Neon is already the source of truth;
- preview isolation is a core environment invariant;
- the product is Next.js on Vercel;
- authorization must be recoverable on the server;
- AI-assisted development must not make preview auth depend on production auth state;
- Google Calendar permission must remain optional and explicit.

## Why Neon Auth

### Branch-compatible identity

Users, sessions and auth configuration live with Neon and can branch with the database. This lets authentication behavior be validated on isolated branches instead of forcing previews to reuse production identity infrastructure.

### Next.js server integration

The current Neon Auth SDK exposes one server configuration that can provide request handlers, middleware and server-side session recovery. TaskIT can therefore make authorization decisions before application services and repositories are invoked.

### Vercel preview alignment

Neon's managed integration supports provisioning auth endpoints for preview branches when Neon Auth is enabled and preview branching is active. This complements ADR 0001's environment strategy instead of creating a second, unrelated preview lifecycle.

### Lower operational surface

TaskIT does not need to self-host Better Auth or operate another identity database/service at the initial stage. Authentication data remains close to the existing database control plane while the app still consumes authentication through explicit application boundaries.

## Alternatives considered

### Auth.js / NextAuth

A mature and valid option, but it would require TaskIT to own more of the adapter/session persistence and preview-data lifecycle that Neon Auth now provides natively. There is no current product requirement that justifies that additional operational surface.

### Self-managed Better Auth

Provides maximum control and portability, but would make TaskIT responsible for schema lifecycle, deployment and auth operations that Neon currently manages. This remains a possible future exit path because Neon Auth is built on Better Auth concepts, but it is unnecessary complexity for the MVP.

### Separate hosted identity provider

Providers such as Clerk/Auth0 remain viable if future enterprise, federation or compliance requirements exceed Neon Auth's capabilities. Introducing one now would split identity from the branchable database workflow without a concrete requirement.

## Session model

- session recovery happens server-side for protected application paths;
- client state may reflect session status but is never the authority for access control;
- server actions, route handlers and application services derive the authenticated subject from the verified server session;
- authentication cookies are secure and HTTP-only according to the managed SDK flow;
- absence or invalidity of a session produces an explicit unauthenticated result rather than a fallback identity;
- logout invalidates the application session and returns the user to a recoverable signed-out state.

## Authorization model

Authentication proves identity; TaskIT's domain/application layer still owns authorization.

For user-owned resources:

1. recover the authenticated subject on the server;
2. resolve the internal TaskIT user identity associated with that subject;
3. scope repository operations to that user identity;
4. never accept a client-supplied `user_id` as authorization proof;
5. reject cross-user access even when a resource identifier is otherwise valid.

Database RLS may be added as defense in depth where it improves safety, but server-side ownership checks remain part of the application contract.

## Internal user identity

TaskIT will keep an application-owned user/profile record outside the provider-managed `neon_auth` schema. The provider subject is the authentication identity; the TaskIT user record owns product-specific preferences and domain relationships.

This preserves a clean boundary between:

- provider-managed users/sessions/credentials;
- TaskIT-managed timezone, week start, study defaults and future domain data.

TASKIT-103 will define the application user/preferences schema and the mapping to the authenticated subject.

## Google Calendar separation

Google Calendar authorization is **not** part of app authentication.

- signing into TaskIT does not grant Calendar permissions;
- onboarding must allow Calendar to be skipped;
- if Google is later offered as an identity sign-in method, identity scopes remain limited to authentication needs;
- Calendar OAuth uses a separate explicit consent step with least-privilege Calendar scopes;
- revoking Calendar access must not invalidate the TaskIT account/session;
- logging out of TaskIT does not imply destructive Calendar token revocation unless the user explicitly disconnects the integration.

This separation prevents a convenience login choice from silently becoming consent to read or write a user's calendar.

## Environment strategy

### Development

Neon Auth will first be provisioned and integrated on the Neon `development` branch. Implementation work and auth migrations must not experiment against Neon `main`.

### Preview

Once TASKIT-003/TASKIT-005 complete the Git and Neon-managed Vercel integration, database-affecting previews should receive isolated Neon branches and corresponding auth endpoints.

### Production

Neon Auth on the production branch is enabled only after the application integration has been validated outside production. Production credentials/endpoints live in environment management, never in Git.

## Application boundary

Provider-specific calls belong in infrastructure/server adapters. Domain code must not import Neon Auth SDK types.

Recommended boundary:

- `src/server/auth` — provider adapter and server session recovery;
- application-facing `AuthSession` / authenticated-subject contract — provider-neutral type;
- presentation routes/components consume application/session helpers, not raw provider APIs throughout the tree.

This keeps a future auth provider migration possible without rewriting domain logic.

## Failure and recovery behavior

- unauthenticated protected navigation redirects to the login entry point with a safe return destination;
- expired/invalid sessions are treated as signed out, not as generic 500 errors;
- provider/network failures have a user-visible retry path;
- authorization failures do not leak whether another user's resource exists;
- secrets, tokens and raw session material must not be logged.

## Consequences

### Positive

- auth and database previews share the same branching model;
- less infrastructure to operate for the MVP;
- server-side authorization remains straightforward;
- Calendar consent stays optional and understandable;
- TaskIT keeps its domain model independent from the auth provider.

### Tradeoffs

- TaskIT depends on Neon for both database and managed authentication availability;
- advanced enterprise identity requirements may later require another provider or custom Better Auth configuration;
- auth schema internals under `neon_auth` are provider-owned and must not become TaskIT domain tables.

## Implementation sequence

TASKIT-102 should:

1. provision Neon Auth on the non-production Neon branch;
2. add the current Neon Auth Next.js SDK through the normal dependency/lockfile workflow;
3. create a single server auth adapter;
4. add auth route handlers and protected-route behavior;
5. implement login/logout and server-side session recovery;
6. add tests that prove an unauthenticated user cannot reach protected content;
7. keep Calendar permissions entirely out of the auth implementation.

TASKIT-103 then adds the TaskIT-owned user/preferences schema and ownership mapping.

## Revisit triggers

Re-evaluate this ADR if:

- required identity federation is unsupported;
- enterprise/compliance requirements demand a different identity control plane;
- Neon Auth availability or pricing materially changes the product constraints;
- provider portability becomes more important than branch-native auth operations.

## References

Decision validated against Neon product documentation and changelog available in August 2026, including branchable Neon Auth based on Better Auth, the unified Next.js server SDK, and automatic Neon Auth support for Vercel preview branches through managed integration.

# ADR 0003 — Neon Auth SDK beta risk acceptance

## Status

Accepted for the TASKIT-102 implementation. Revisit before enabling production authentication.

## Context

ADR 0002 selected Neon Auth because branchable identity and the managed Neon/Vercel preview lifecycle fit TaskIT's environment model better than introducing a separate identity control plane.

During TASKIT-102 implementation, the current package release was verified again. As of August 2026, the official `@neondatabase/auth` package is still published on a beta version line (`0.4.2-beta`). Better Auth itself has a stable 1.6.x line, while Auth.js/NextAuth v5 is also still beta.

The SDK maturity is therefore an explicit risk and must not be hidden by the architectural benefits of the managed service.

## Decision

TaskIT will continue with Neon Auth for the non-production implementation, with the following constraints:

- pin `@neondatabase/auth` to the exact validated version instead of a range;
- do not add the optional `@neondatabase/auth-ui` beta package;
- confine provider-specific imports to the server authentication adapter;
- expose only a provider-neutral `AuthSession` contract to the rest of the application;
- validate login, logout, protected navigation and session recovery outside production;
- do not provision/enable production Neon Auth until TASKIT-003/TASKIT-005 complete the Vercel Git and Neon-managed integration and the implementation passes its gates;
- treat SDK upgrades as reviewed changes with CI/E2E validation, not routine floating dependency updates.

## Why not switch immediately to Better Auth

Better Auth is the stable upstream foundation and remains the preferred fallback if the Neon wrapper becomes unreliable. However, self-managing it now would make TaskIT own more authentication deployment/configuration while giving up the managed preview endpoint lifecycle that Neon already provides for branchable auth.

For the MVP, the adapter boundary limits the cost of this beta dependency while preserving the operational advantage that motivated ADR 0002.

## Why not Auth.js v5

Auth.js v5 is also on a beta release channel as of this decision, so moving to it would not remove the pre-release dependency concern. The stable Auth.js v4 line is mature, but adopting it would introduce a different session/adapter lifecycle without solving a current TaskIT requirement better than the selected approach.

## Exit path

If Neon Auth produces blocking regressions, unacceptable availability, incompatible breaking changes or remains pre-release when production authentication is ready, TaskIT should evaluate replacing the provider adapter with stable Better Auth directly against the environment-specific Neon database.

The domain and application layers must not depend on Neon Auth types or provider schema details so this replacement remains bounded.

## Production gate

Before production authentication is enabled, re-verify:

1. current Neon Auth service/package release status;
2. known security advisories for Neon Auth and Better Auth;
3. session-cookie behavior on Vercel production;
4. production/preview Neon branch mapping;
5. rollback path if an SDK upgrade fails.

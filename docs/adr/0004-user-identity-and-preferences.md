# ADR 0004 — Internal user identity and preferences

## Status

Accepted for TASKIT-103.

## Decision

TaskIT owns an internal user identity under the `taskit` database schema. The authentication provider subject is stored as a unique external identifier (`auth_subject`) rather than used as the primary key of product data.

TaskIT migrations do not foreign-key into the provider-owned `neon_auth` schema.

## Why

The authenticated subject currently originates from Neon Auth and is represented by a UUID. Treating that provider value as an external subject instead of a product primary key preserves the boundary defined by ADR 0002/0003: authentication can change without rewriting every product relationship.

All product resources reference the TaskIT-owned internal user id.

## Initial model

### Internal user

`taskit.app_user` maps one authenticated subject to one TaskIT-owned user id.

### Preferences

`taskit.user_preferences` is one-to-one with the internal user and initially stores:

- timezone;
- ISO week start (1 = Monday through 7 = Sunday);
- default study-session duration in minutes.

The database default timezone is `UTC`, which is safe when a user-specific timezone has not yet been collected. Onboarding may immediately replace it with the user's actual IANA timezone.

The initial default study-session duration is 50 minutes. This is an operational product default, not a constraint from the original brief, and may be changed by the user.

### Typical availability

`taskit.availability_window` models recurring weekly windows as relational rows owned by the internal user. Weekdays use ISO numbering and times are stored as minutes after local midnight. A later planning service interprets those local wall-clock windows in the user's configured timezone.

This avoids embedding query-critical scheduling data in opaque JSON while remaining simple for the initial product.

## Authorization invariant

Application queries for user-owned data must begin with the authenticated server-side subject, resolve the TaskIT internal user, and scope reads/writes through that internal id.

A client-provided internal user id or auth subject is never authorization proof.

The development migration was validated with two synthetic subjects. A query scoped to subject A returned only A's preferences/availability; the timezone default was verified and changed successfully. Test rows were removed after validation.

## Provider boundary

- `neon_auth` remains provider-owned;
- TaskIT does not alter provider tables;
- no application FK points into `neon_auth`;
- provider-specific identity remains confined to the authentication adapter and the `auth_subject` mapping;
- future provider migration changes the mapping/adapter rather than product foreign keys.

## Production promotion

Migration `0001_user_identity_and_preferences.sql` has been applied and tested only on Neon `development` during TASKIT-103. It must not be promoted to Neon `main` until the production Vercel/Neon environment integration is complete and the migration is deliberately reviewed for production.

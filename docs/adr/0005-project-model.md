# ADR 0005 — Initial project model

## Status

Accepted for M2.

## Context

TaskIT treats a project as a meaningful study outcome such as a certification, course or skill objective. Projects organize future milestones and tasks and must remain understandable in list, weekly and timeline views without becoming a heavyweight project-management object.

The product requirements for the initial project model are:

- every project belongs to one TaskIT user;
- name and short description;
- operational status;
- optional deadline;
- lightweight visual identity through color and icon;
- archive without losing historical access.

## Decision

### Ownership

`taskit.project.user_id` references the application-owned `taskit.app_user` identity. Provider subjects and client-supplied user identifiers are not stored as ownership proof on project rows.

All application queries must still derive the current TaskIT user from the authenticated server session and scope project reads/writes by `user_id`.

### Status

The initial operational statuses are:

- `active` — currently relevant work;
- `paused` — intentionally not being worked now;
- `completed` — outcome reached.

Status is stored as text with a database check constraint rather than a Postgres enum. This keeps future status evolution migration-friendly while preventing arbitrary values.

### Archive is separate from status

Archiving is represented by nullable `archived_at`, not by another operational status.

This distinction lets a completed or paused project be archived without destroying its historical meaning. Normal project lists can filter `archived_at IS NULL`; archive/history views can query rows where it is set.

The initial model intentionally does not define hard-delete behavior for normal product use. TASKIT-202 will expose archive as the standard removal action.

### Optional deadline

`due_date` is a calendar date rather than a timestamp. Project deadlines are day-level product commitments; exact study time belongs to tasks/sessions. A project without a deadline stores `NULL`.

### Visual identity

Projects store `color_key` and `icon_key`, not arbitrary CSS/hex values.

These keys are application semantic identifiers. The UI maps them to a controlled TaskIT palette/icon catalog. This prevents design tokens from leaking into persisted domain data and lets visual treatment change without rewriting project records.

The initial safe defaults are:

- `color_key = 'lime'`;
- `icon_key = 'folder'`.

Both keys are constrained to short lowercase slug-like values, while the exact allowed catalog remains an application concern so it can evolve without a schema migration for every new icon.

### Text limits

- name: trimmed logical length 1–120 characters;
- short description: optional, at most 500 characters.

These are domain/database safeguards. UI may choose shorter guidance for readability.

## Index strategy

The initial indexes serve the dominant expected queries:

- active/non-archived projects for a user, grouped/sorted by status and recent updates;
- archived projects for a user by archive time;
- non-archived projects with deadlines for a user by due date.

No global project index is needed because every product query is user-scoped.

## Consequences

### Positive

- ownership is explicit and application-owned;
- archive preserves history rather than mutating/deleting it;
- project status and archive semantics remain independent;
- visual identity is portable across design-system changes;
- optional deadlines fit timeline planning without pretending projects have exact time slots;
- indexes match user-scoped product access.

### Tradeoffs

- the application must map `color_key`/`icon_key` to a controlled catalog;
- status expansion requires a migration to update the check constraint;
- hard deletion, if ever introduced, requires a separate explicit product decision.

## Validation

TASKIT-201 applies and validates migration `0003_project_schema.sql` on the Neon `development` branch only before merge. Production remains unchanged until the deployment/database environment integration is complete.

## Next step

TASKIT-202 implements user-scoped project create, edit, archive and list flows using this model. TASKIT-207 may later attach milestones without changing the project ownership contract.

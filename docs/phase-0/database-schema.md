# Mithila Milan — Initial Database Schema

**Status:** Conceptual Phase 0 design; validate with cultural experts and counsel before migrations.

## Principles

- PostgreSQL relational core; UUID/ULID public identifiers, separate internal IDs where useful.
- Every user-entered cultural value stores `value_state` (`known`, `unknown`, `not_applicable`, `undisclosed`, `pending_review`), source, locale, and provenance.
- Taxonomy is versioned and never hard-deleted; aliases support transliteration and spelling variation.
- Private profile data is separated logically from public search projections.
- All sensitive reads/writes are authorization-checked and audit logged.

## Core entities

- `users`: credentials/account state, locale, timezone, created/disabled timestamps.
- `sessions`, `verification_tokens`, `consents`: auth/session and versioned legal/owner consent records.
- `profiles`: one adult owner profile; publication, moderation, visibility, and completion state.
- `profile_delegates`: owner-to-family-manager relationship, granular permissions, invitation/expiry/revocation.
- `profile_personal`, `profile_locations`, `profile_education`, `profile_employment`, `profile_family`, `profile_lifestyle`: scoped profile facets.
- `profile_cultural`: community, sub-community, Gotra, Mool, Kul, Pravara references plus state/source fields.
- `profile_horoscope`: optional private astrology data and visibility.
- `profile_preferences`: owner preferences; each criterion has `strictness` (`strict` or `flexible`).
- `profile_photos`, `media_assets`: private object metadata, visibility, moderation status, signed access policy.
- `communities`, `community_rules`, `gotra_terms`, `mool_terms`, `kul_terms`, `pravara_terms`, `locations`: curated master data, aliases, locale, source, reviewer, version, effective dates.
- `interests`: sender, recipient, status, message, timestamps, idempotency key.
- `shortlists`, `profile_views`, `searches`: discovery activity with privacy/retention controls.
- `conversations`, `conversation_members`, `messages`: permissioned internal communication; redact/retain according to policy.
- `notifications`, `notification_preferences`: in-app/email/SMS delivery state.
- `verification_cases`, `verification_evidence`, `review_decisions`: identity/profile/cultural review; reviewer scopes and outcomes.
- `reports`, `blocks`, `moderation_cases`, `moderation_actions`, `appeals`: safety workflows and evidence references.
- `subscriptions`, `plans`, `entitlements`, `payments`, `refunds`: monetization introduced after legal/payment approval.
- `content_articles`, `content_revisions`, `success_stories`: reviewed public content with attribution and consent.
- `grievances`, `data_subject_requests`: privacy and platform grievance workflows.
- `audit_events`: append-only actor/action/resource/result metadata with redacted context.
- `analytics_events`: pseudonymous/aggregated events; never raw private cultural or contact data.

## Key relationships

`users 1—1 profiles`; `profiles 1—N profile_delegates`; `profiles 1—1` per facet table; `profiles N—1 communities`; cultural terms belong to a community scope but may be shared through explicit mapping; `profiles N—N` preferences/locations/taxonomy through join tables; `profiles 1—N interests` as sender or recipient; mutual match is derived from accepted reciprocal interests; `conversations N—N profiles`; `profiles 1—N reports/blocks/verifications`; `moderation_cases` aggregate reports and actions; `audit_events` reference any actor/resource without cascading deletion.

## Important constraints and indexes

- Enforce adult eligibility at server/database boundary; never accept a minor profile.
- Unique normalized email/phone; unique active profile per owner unless a documented household model is later approved.
- Unique `(profile_id, delegate_user_id)` and expiration checks.
- Interest state machine prevents duplicate active requests and invalid transitions.
- Index published profiles by status, community, coarse location, age band, and verification state. Keep sensitive exact fields out of public indexes.
- Full-text/trigram indexes for approved names, district, and alias terms; do not make private genealogy broadly searchable.
- Unique taxonomy alias per locale/normalized spelling within scope.
- Audit and consent records are append-only; deletion jobs anonymize subject references where legally required.
- Message/report rate limits enforced outside and inside the service boundary where feasible.

## Cultural rule storage

Do not encode lineage rules as hard-coded conditionals. Store reviewed `community_rules` with: rule type, input terms, scope, explanation, confidence, source citation, reviewer, effective date, and `requires_human_review`. MVP recommendations may use user preferences only. Later cultural review may evaluate a rule and return `compatible`, `incompatible`, or `uncertain`, with explanation and provenance; it must not be presented as legal or religious authority.

## Data lifecycle

Draft profiles are private. Unpublished drafts can be deleted by the owner. Published profiles are hidden immediately on deactivation. Media, documents, messages, reports, and audit events each receive documented retention periods approved by counsel. Backups have a separate expiry process. Export uses a reviewable archive that excludes secrets, internal risk scores, and third-party private data.

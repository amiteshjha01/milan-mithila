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

## Expanded cultural data model

Cultural data is not a single column on `profiles`. It is a set of claims, each with its own applicability, visibility, provenance, and review state.

### Claim model

Use a generic `cultural_claims` table with:

- `id`, `profile_id`, `concept_type` (`gotra`, `mool`, `kul`, `pravara`, `kul_deity`, `panji_reference`), and optional `term_id`.
- `free_text_value` only when no approved term exists; never silently convert free text into a canonical term.
- `value_state` (`known`, `unknown`, `not_applicable`, `undisclosed`, `pending_review`, `disputed`).
- `claim_scope` referencing one or more `community_scopes`; applicability is explicit, not inferred from surname, caste, district, or religion.
- `claim_role` (`self_reported`, `family_reported`, `documented`, `reviewer_assessed`) and `verification_status` (`unverified`, `evidence_received`, `under_review`, `verified`, `rejected`, `expired`).
- `source_type`, `source_reference`, `source_attribution`, `entered_by`, `claimed_at`, `reviewed_at`, `reviewer_id`, `review_decision_id`, and `valid_from`/`valid_to`.
- `visibility_scope` (`private`, `delegates`, `matched_only`, `searchable_coarse`, `public_label`) and `searchable` boolean, default false.

A profile may hold multiple non-identical claims for the same concept. Conflicting claims remain visible to authorized reviewers as a conflict set; the system must not overwrite one claim with another. `cultural_claim_aliases` maps alternate spellings/transliterations to a canonical term only when a curator has approved the mapping, preserving the original input and locale.

### Taxonomy and provenance

`cultural_terms` stores canonical terms, aliases, script/transliteration variants, locale, community scope, source citation, source excerpt or page reference, curator, review status, effective dates, and supersession links. `cultural_term_scope` maps a term to applicable communities without implying that the term is universal. `cultural_provenance` stores immutable source snapshots or references and the provenance chain for imports. No public search index may expose private claim text or evidence.

`panji_claims` is a restricted subtype for a user-provided Panji reference: record identifier (encrypted/tokenized where feasible), record-holder or Panjikar organization, user authorization, evidence pointer, review outcome, expiry/re-review date, and display consent. Store no full genealogical book or family graph in MVP. Cultural reviewers see only assigned claims and minimum evidence; they cannot browse profiles or contact details.

### Secure storage and search

Store claim values and evidence in separate encrypted/private tables or object prefixes. Public profile projections contain only approved labels and coarse applicability. Search uses tenant- and role-scoped projections with keyed/opaque IDs and no exact lineage evidence. Sensitive filters require an explicit product policy and authorization check; private claims are never used for autocomplete, analytics, ranking, or URL parameters. Search logs are minimized and retained only for the approved period. Every claim read, export, review, merge, and visibility change emits an audit event.

### Compatibility rule boundary

`community_rules` must reference claim types, scopes, versioned inputs, confidence, source citation, reviewer, explanation, and `requires_human_review`. Rules produce `compatible`, `incompatible`, or `uncertain` only within a named community scope and never write a permanent rejection. MVP matching does not execute these rules; it uses explicit user preferences and displays “not evaluated” where cultural review is unavailable.

## Verification architecture

Use one `verification_cases` parent with a separate case type and evidence policy for each badge. Badges are independent and must never imply that other attributes were checked.

| Badge | Evidence | Workflow | MVP display |
|---|---|---|---|
| Mobile | OTP to claimed number; provider delivery result | rate limit → OTP verify → record timestamp/provider | `Mobile verified` |
| Email | signed time-limited link or OTP | confirm address → record timestamp | `Email verified` |
| Age eligibility | date of birth plus adult attestation; identity check only where counsel/provider approves | server-side age gate → if needed scoped identity review → do not publish DOB | `Adult profile` or no badge |
| Photo | user consent and media scan; optional liveness only if separately approved | upload → malware/content/duplicate checks → human escalation | `Photo reviewed` (not identity) |
| Identity | approved provider evidence, minimum attributes, deletion schedule | provider review → pass/fail/manual review → evidence token retained, raw document deleted per policy | `Identity verified` |
| Family | owner invite and acceptance; delegated relationship attestation | invite → owner authenticates → permissions → expiry/revocation | `Family access authorized` is private, not a public trust badge |
| Panji | user authorization plus scoped evidence and qualified reviewer decision | assign reviewer → conflict check → decision with source/provenance → user chooses display | `Panji review: pending/verified/uncertain` |

Evidence is encrypted, access-controlled, time-limited, and never downloadable by default. Each badge records issuer, evidence class, decision, timestamp, expiry, appeal path, and what it does not verify. Manual operators must use reason codes and all access is audited. A missing badge is not a negative finding.

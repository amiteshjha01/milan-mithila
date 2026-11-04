# Mithila Milan — Phase Roadmap

## Phase 0 — Research and PRD (current)

Deliver research, personas, journeys, sitemap, prioritisation, conceptual schema, architecture, security/legal register, and validation agenda. Gate: product owner, cultural reviewers, and counsel review open questions.

## Phase 1 — Brand, UX, and UI design

Create reviewed brand direction, bilingual/content strategy, accessible design tokens, onboarding, discovery, profile, family access, safety, and admin flows. Prototype mobile and desktop. Test with self-managed seekers, family managers, and accessibility users. No lineage rule is finalized by visual design alone.

## Phase 2 — Foundation and authentication

Set up Next.js modular monolith, PostgreSQL/Drizzle migrations, auth/session security, email/mobile verification, consent records, RBAC, audit primitives, object storage, rate limiting, error monitoring, and CI checks.

## Phase 3 — Profiles and onboarding

Build owner/delegate onboarding, draft/publish lifecycle, profile facets, configurable cultural taxonomy, privacy controls, photo upload, content moderation, and profile completion. Add authorization and integration tests for every field scope.

## Phase 4 — Discovery and matching

Implement normalized search, basic filters, culturally relevant filter presentation, strict/flexible preferences, saved searches, explainable recommendations, and privacy-safe indexes. Measure latency and liquidity by cohort before adding a dedicated search engine.

## Phase 5 — Interests, messaging, and family features

Add shortlist, interest state machine, mutual matches, permissioned messaging, notifications, block/report, family delegation, owner controls, and abuse handling. Test race conditions and unauthorized access.

## Phase 6 — Trust, safety, and cultural review

Add identity/profile verification, moderation queues, reports, fraud signals, appeals, grievance management, and a limited cultural-review workflow only after an authentic partner process is documented.

## Phase 7 — Membership and monetization

Finalize pricing and legal review; implement plans, entitlements, payment webhooks, invoices, refunds, cancellation, and subscription support. Never charge for a cultural truth or imply paid verification is authoritative.

## Phase 8 — Cultural ecosystem

Explore reviewed cultural education, community events, Panjikar partnerships, assisted services, and a carefully scoped digital Saurath Sabha concept. Validate each concept before building.

## Phase 9 — Launch readiness

Run functional, authorization, security, privacy, accessibility, performance, mobile, SEO, backup/restore, content, and incident-response tests. Complete counsel review, operational runbooks, support training, and staged rollout.

## Delivery gates

- Every phase ends with a working demo, tests, known-risk register, and reviewer sign-off.
- No feature is “complete” without frontend behavior, backend authorization, persistence, relevant tests, empty/error/loading states, and documentation.
- The next phase begins only after explicit approval of the current phase.

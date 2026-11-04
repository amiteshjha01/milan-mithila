# Mithila Milan — Phase 0 Product Discovery & PRD

**Status:** Review required before Phase 1
**Date:** 5 November 2026
**Scope:** Research, product requirements, MVP architecture, implementation plan. No application code is included in this phase.

## 1. Executive summary

Mithila Milan is a serious matrimonial platform for Maithil individuals and families across Mithila, India, Nepal, and the diaspora. Its differentiator is not simply a regional brand or a list of cultural filters: it is a consent-first, privacy-preserving product that makes culturally relevant information understandable and configurable without pretending to replace families, qualified Panjikars, or community judgment.

The product should begin as a focused trust-and-discovery service: verified adults create or authorize profiles, define strict versus flexible preferences, discover compatible candidates, exchange controlled interests, and communicate internally. Gotra, Mool, Kul, Pravara, and Panji-related information must be modeled as community-dependent, visibility-controlled data with provenance and uncertainty states. No lineage rule should become an automated universal rejection rule before expert validation.

**Positioning:** Tradition meets togetherness, with transparent trust and modern privacy.

## 2. Research basis and confidence

This document combines the supplied project brief, desk research, and product/engineering analysis. Desk research indicates that Mithila spans north Bihar and adjoining southeastern Nepal and that Maithili is an Indo-Aryan language and a scheduled language of India. Panji-Prabandh is described in historical and scholarly accounts as a genealogical record tradition used especially among Maithil Brahmin communities, with hereditary or designated Panjikars and marriage-lineage review. Saurath Sabha is commonly described as a traditional matrimonial assembly in Madhubani district.

These are directional findings, not a license to universalize one community's practice. Public sources differ on dates, terminology, the groups covered, and the authority of particular records. Confidence is therefore:

- **High:** privacy, consent, moderation, adult-only eligibility, secure messaging, and configurable taxonomy are product requirements.
- **Medium:** Panji and Saurath Sabha are important cultural concepts, but operational details require interviews and source review.
- **Low until validated:** exact Gotra/Mool/Pravara incompatibility rules, the meaning and use of Kul across sub-communities, certificate names, and whether a field should be searchable.

### Research sources to verify with counsel and cultural reviewers

1. Encyclopaedia/academic treatments of Maithili and Mithila geography and language.
2. Scholarly work on Maithil Brahmin social organization and Panji genealogy, including U. Jha's work referenced in public scholarship.
3. Government of India, MeitY: Digital Personal Data Protection Act, 2023 and current rules/notifications.
4. MeitY: Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, as amended.
5. Official investor and product material from Matrimony.com/BharatMatrimony, Shaadi.com, and Jeevansathi.
6. Primary interviews with Maithil scholars, Panjikars, families, prospective users, women’s safety advocates, and legal counsel.

URLs and source notes are maintained in `docs/phase-0/research-notes.md`.

## 3. Problem statement

Existing large matrimonial platforms offer scale, community segmentation, and assisted services, but they do not provide a focused, well-explained Maithil lineage model. Users and families may also face opaque recommendations, unwanted contact, fake profiles, pressure to disclose sensitive data, and ambiguous verification badges. Traditional processes provide cultural context but can be geographically limited, hard to access, and difficult for diaspora families to navigate.

Mithila Milan should solve:

1. **Trust:** “Who is this person and what has actually been verified?”
2. **Cultural fit:** “Which lineage information is relevant for this family and community?”
3. **Consent:** “Who controls a profile when a parent or relative helps?”
4. **Discovery:** “Can we search without exposing sensitive genealogy broadly?”
5. **Distance:** “Can families and individuals coordinate across cities and countries?”

## 4. Goals, non-goals, and success measures

### Goals

- Build a trusted adult-only matrimonial directory and interaction workflow.
- Support self-managed and family-assisted profiles with owner consent.
- Represent cultural data without inventing records or enforcing unvalidated rules.
- Explain why recommendations appear; never claim “100% compatible.”
- Make privacy, reporting, blocking, and grievance handling first-class flows.
- Establish an architecture that can later support Panjikar-assisted review and mobile clients.

### Non-goals for MVP

- A dating/social feed, anonymous chat, or casual matching.
- Official genealogy certification or digital replacement for Panjikars.
- Automated horoscope or lineage verdicts.
- A public directory of Gotra, Mool, or family relationships.
- Public display of phone numbers, email addresses, identity documents, or exact addresses.
- Nationwide claims of representing every Maithil community.

### Initial success measures

- Profile completion and consent completion rate.
- Percentage of active profiles with mobile/email verification.
- Search-to-profile-view and profile-view-to-interest conversion.
- Mutual-interest rate and conversation-start rate.
- Median report response time and false-positive moderation rate.
- Block/report rate, suspicious-payment reports, and repeat-abuse rate.
- User-reported trust and cultural relevance, segmented by role and geography.
- Voluntarily confirmed meaningful connections; never infer marriage from inactivity.

## 5. Users and personas

1. **Self-managed seeker:** adult Maithil professional in an Indian city or diaspora location; wants control, privacy, and efficient search.
2. **Family-assisted seeker:** adult profile owner who wants parents/relatives to help while retaining final control over acceptance, messaging, and contact sharing.
3. **Parent/guardian manager:** helps discover and shortlist; has delegated permissions, not ownership of the adult’s consent.
4. **Cultural reviewer/Panjikar partner:** reviews only assigned lineage submissions under a formal partnership and least-privilege access.
5. **Moderator/trust operator:** handles reports, profile review, fraud signals, and appeals.
6. **Administrator:** manages policy, roles, taxonomy, plans, content, and audit access.
7. **Cultural content reader:** public visitor learning about Mithila and the service before registration.

## 6. Cultural domain model

### Gotra
Model as a structured, versioned reference term plus the user's source and disclosure state. Support “unknown,” “not applicable,” and “prefer not to disclose.” Preserve transliterations and aliases. Do not infer a universal conflict rule from the value alone.

### Mool
Treat Mool as distinct from current city, native district, and ancestral village. The product must allow multiple source claims, alternate spellings, uncertainty, and community applicability. Search visibility must be independently controlled.

### Kul and Kuldevi/Kuldevta
Model as optional, community-scoped data. Avoid assuming that “Kul” has one stable meaning or that a deity field is required. Do not use religious fields to rank human worth or exclude users.

### Pravara
Model as optional lineage metadata, potentially multi-valued, with community applicability and source notes. Any compatibility logic requires expert sign-off.

### Panji-Prabandh
Treat Panji as an external cultural/genealogical record system, not a platform-owned database. Store only the minimum user-submitted claim, consent, review status, reviewer identity, source reference, and decision note. A “Panji reviewed” badge may appear only after an authentic authorized process exists. Until then, use “user provided” or “review pending.” Never imply historical certification.

### Saurath Sabha and family practice
Describe as cultural context in reviewed editorial content. Do not turn a traditional gathering into a universal digital workflow without research. Support family-assisted discovery, but preserve the adult profile owner's agency.

## 7. Community-specific product rules

- Community/sub-community determines which questions are relevant; it does not determine a person's worth.
- Every cultural field supports unknown, not applicable, and undisclosed states.
- Strict preferences are explicit exclusion criteria; flexible preferences affect ranking only.
- In uncertain lineage situations, show “requires family or qualified reviewer discussion,” not rejection.
- Taxonomy records require provenance, reviewer, effective date, aliases, and change history.
- Cultural advisors cannot see private documents or direct contact details by default.
- Content labels contested or variable traditions and names the reviewing source.
- Hindi, Maithili, English, and transliteration support should be planned, but translations require native-language review.

## 8. Functional requirements

### Account and onboarding
- Email and mobile sign-up; adult age gate; consent and terms capture.
- Select self or family-managed profile; invite actual owner to confirm.
- Multi-step profile completion with save/resume, validation, and review-before-publish.
- OTP/email verification, password recovery, session/device management.

### Profile
- Personal, location, education, work, family, lifestyle, languages, cultural, optional horoscope, and partner preferences.
- Separate public, matched-only, family-shared, and private fields.
- Multiple photos, restricted/blurred photos, explicit publishing consent.
- Profile completion and verification status with precise labels.

### Discovery
- Basic and advanced search, multi-select filters, native district/ancestral origin, saved searches, recently viewed, pagination/infinite loading.
- Cultural filters appear only when relevant and permitted.
- Recommendations show the contributing preferences and uncertainty.
- No sensitive genealogy in public indexing; use scoped search and privacy-preserving indexes.

### Interactions
- Shortlist, send/accept/decline interest, mutual match, internal messaging after permission, notifications, block, report, mute, and safety education.
- Contact exchange is a deliberate mutual action, never an automatic side effect.

### Family access
- Owner invites a delegate; granular read/shortlist/interest-coordination permissions; expiry and revocation.
- Owner approval required for publish, acceptance, messaging, and contact sharing.

### Trust and operations
- Mobile/email verification; optional identity verification through a compliant provider; profile review; report queues; duplicate/fraud signals; appeals; audit log; grievance workflow.
- Cultural review is a separate workflow from identity verification.

### Membership
- Free profile, limited discovery, interests, shortlist.
- Premium search/discovery and communication entitlements only after pricing, consumer-law, refund, and payment review.
- Subscription history, invoices, cancellation, refund, entitlement checks, and payment webhooks.

### Content and admin
- Reviewed cultural articles, FAQs, safety center, success stories with consent.
- Role-based admin: moderation, taxonomy, content, subscriptions, cultural review, grievance, analytics, audit.

## 9. Core user journeys

### Journey A — self-managed profile
`Landing → explain trust/culture → sign up → age/consent → verify contact → create profile → cultural applicability → privacy controls → preview → explicit publish → moderation/verification → discover → shortlist/interest → mutual permission → message`

### Journey B — family-assisted profile
`Family member starts → identifies adult owner → owner receives invitation → owner verifies awareness/consent → delegate permissions selected → family discovers/shortlists → owner approves interest/message/contact actions → revoke access anytime`

### Journey C — cultural review
`User requests review → explains scope and data use → minimum documents/source supplied securely → assigned reviewer sees scoped case → reviewer records outcome and evidence → user accepts/rejects display → badge/status and expiry shown → full audit trail`

### Journey D — safety incident
`User reports/block → content/account hidden from reporter → triage severity → evidence preserved with restricted access → action/appeal → grievance response → audit and safety analytics`

### Journey E — deletion
`User requests deletion → explain consequences and legal retention → re-authenticate → deactivate immediately → suppress discovery → delete/anonymize by retention schedule → confirm completion or retained categories`

## 10. Information architecture / sitemap

### Public
`/` Home
`/about` About
`/how-it-works` How it works
`/culture` Mithila culture hub
`/culture/gotra-mool` Gotra and Mool introduction
`/culture/panji-prabandh` Panji-Prabandh
`/culture/saurath-sabha` Saurath Sabha
`/safety` Safety and trust center
`/stories` Consent-based success stories
`/plans` Membership
`/faq` FAQs
`/contact` Contact and grievance entry
`/privacy` Privacy policy
`/terms` Terms

### Auth
`/signup`, `/login`, `/verify`, `/forgot-password`, `/recover`

### Member
`/app`, `/app/profile`, `/app/profile/edit`, `/app/discover`, `/app/search`, `/app/recommendations`, `/app/profile/[id]`, `/app/shortlist`, `/app/interests/sent`, `/app/interests/received`, `/app/matches`, `/app/messages`, `/app/notifications`, `/app/family-access`, `/app/subscription`, `/app/privacy`, `/app/settings`

### Operations
`/admin`, `/admin/users`, `/admin/moderation`, `/admin/reports`, `/admin/verification`, `/admin/cultural-data`, `/admin/cultural-review`, `/admin/content`, `/admin/subscriptions`, `/admin/grievances`, `/admin/analytics`, `/admin/audit`, `/admin/roles`

## 11. Prioritisation

### MVP — must have
- Secure adult account creation, contact verification, consent, recovery.
- Self and consented family-assisted onboarding.
- Profile CRUD with privacy scopes and photo upload.
- Configurable community/cultural fields with unknown/undisclosed states.
- Basic and relevant advanced search; transparent recommendations v1.
- Shortlist, interest, mutual match, internal messaging, block/report.
- Moderation queue, admin RBAC, audit log, safety center, grievance intake.
- Data export/deletion request handling, privacy/terms, accessibility baseline.
- Analytics limited to aggregated operational events.

### Should follow MVP
- Identity verification, assisted profile creation, saved searches, multilingual UI, premium plans, payment integration, richer fraud signals, cultural reviewer portal.

### Later
- Panjikar-partner workflow, reviewed lineage evidence, diaspora events, digital Saurath Sabha experiments, recommendation learning, mobile apps, verified service marketplace.

### Explicitly deferred
- Automated lineage rejection, public genealogy graph, scraped profiles, unverified cultural badges, open-ended AI advice, public contact exchange.

## 12. MVP architecture and implementation plan

Recommended build: Next.js App Router + TypeScript for web and server routes/actions, PostgreSQL with Drizzle ORM for relational data, Better Auth for email/password sessions, an SMS/email provider for verification, private object storage for media, Redis-compatible rate limiting/queues only when needed, and PostgreSQL full-text search initially. Add Meilisearch/OpenSearch only after measured search requirements. Use a payment provider only after commercial approval.

The MVP should be a modular monolith: one deployable web application, one relational database, private object storage, and background jobs. This keeps cultural rules, authorization, audit, and transactional interactions close together while preserving seams for future services. Use Zod schemas at request boundaries, server-only data access, per-user authorization checks, signed short-lived upload URLs, image malware/content checks, encryption at rest/in transit, structured audit events, and observability with redacted payloads.

Implementation order:

1. Foundation: environments, migrations, auth, session security, RBAC, audit primitives, error handling.
2. Onboarding: owner/delegate consent, profile drafts, cultural applicability, privacy scopes, media upload.
3. Discovery: normalized taxonomy, search indexes, strict/flexible preferences, recommendations explanation.
4. Interactions: interests, mutual match, messaging, notifications, block/report.
5. Operations: moderation, verification states, grievances, cultural taxonomy management, retention jobs.
6. Hardening: accessibility, abuse tests, threat model, backups/restore, load/performance tests, legal review.

## 13. Non-functional requirements

- WCAG 2.2 AA target; keyboard navigation, focus management, labels, errors, contrast, reduced motion, screen-reader semantics.
- Mobile-first and usable on low bandwidth; server-render public content; optimize image sizes.
- 99.9% target availability after launch; RPO/RTO defined before production.
- Search p95 target under 500 ms at MVP scale; messaging actions idempotent.
- No secrets in client bundles or logs; dependency and vulnerability scanning.
- All privileged actions auditable; admin access least privilege and MFA-ready.
- Test unit, integration, authorization, abuse, accessibility, and critical browser flows.

## 14. Security, privacy, and legal requirements

Treat the service as a data fiduciary/controller handling identity, relationship, location, family, cultural, religious, financial, and potentially biometric/identity-verification data. Obtain qualified Indian counsel before launch to confirm DPDP Act 2023 commencement/rules, IT Rules applicability, intermediary obligations, consumer protection, electronic contracting, payment rules, cross-border transfers, child-safety requirements, accessibility, and Nepal/diaspora obligations.

Required controls:

- Purpose limitation, data minimisation, consent records, notice in understandable language, withdrawal, access/correction, export, deletion, and grievance flows.
- Adult-only safeguards; never match minors; handle date-of-birth carefully.
- Private-by-default phone/email, horoscope, documents, exact address, and lineage evidence.
- Separate identity verification from cultural review; do not expose documents to cultural advisors by default.
- RBAC/ABAC, MFA for staff, short sessions, secure cookies, CSRF protection where applicable, rate limits, bot/OTP abuse controls.
- Encryption in transit and at rest, key rotation, private buckets, signed URLs, retention/deletion jobs, backups tested.
- Reports, blocks, impersonation/fraud handling, evidence preservation, appeals, and a published grievance contact.
- Vendor DPAs, breach response, incident notification procedures, payment-webhook signature validation, and audit retention.

## 15. Risks and mitigations

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| Universalizing one lineage rule | Cultural harm, false rejection | Expert council, configurable rules, uncertainty state | Product + cultural advisors |
| False Panji/verification claim | Trust/legal risk | Partner contracts, scoped statuses, provenance, no badge without evidence | Trust lead |
| Family coercion or impersonation | Safety/consent harm | Owner confirmation, granular delegation, owner veto and revocation | Safety lead |
| Fake profiles/scams | Financial and emotional harm | verification, reports, rate limits, moderation, scam education | Trust ops |
| Sensitive data leak | Severe privacy harm | minimization, private storage, ABAC, audit, redaction, deletion | Engineering/security |
| Low liquidity by region | Poor matches | launch cohort strategy, assisted onboarding, diaspora targeting | Growth |
| Language/translation errors | Exclusion or offense | native review, locale QA, plain-language copy | Content |
| Paid verification perception | Misleading commodification | never sell cultural truth; charge only for service effort, if lawful | Product/legal |

## 16. Cultural validation agenda

Before implementing lineage logic or publishing cultural claims, interview at least: two knowledgeable Panjikars or genealogy scholars from distinct traditions; four adults seeking matches; four parents/guardians; two women’s safety advocates; one Maithili-language editor; and one legal/privacy advisor. Validate definitions, community scope, alternate spellings, disclosure expectations, acceptable reviewer access, certificate terminology, family consent norms, gender/safety concerns, and whether users want discovery filters or private compatibility notes.

## 17. Phase 0 completion checklist

- [x] Executive product overview and problem framing
- [x] Maithil domain research with confidence limits
- [x] Gotra, Mool, Kul, Pravara, Panji-Prabandh analysis
- [x] Community-specific product rules
- [x] Personas, requirements, journeys, sitemap, roles
- [x] MVP/future prioritisation
- [x] Initial architecture and implementation order
- [x] Initial data model in `database-schema.md`
- [x] Security/legal register in `security.md`
- [x] Roadmap in `phases.md`
- [ ] Expert interviews and native-language review
- [ ] Counsel confirms current Indian/Nepal legal obligations
- [ ] Product owner approves MVP scope

**Phase 1 gate:** begin brand/UI work only after review of this document and explicit approval of the unresolved cultural and legal assumptions.

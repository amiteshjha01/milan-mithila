# Mithila Milan — Security, Privacy & Legal Plan

## Security baseline

- Use Better Auth or an equivalent audited session system; password hashing is delegated to the auth library. Never store plaintext passwords.
- Secure, HttpOnly, SameSite cookies; rotate sessions on sensitive changes; revoke sessions on account recovery.
- MFA for staff and privileged operators; least-privilege RBAC plus resource/field-level authorization.
- Zod (or equivalent) validation on every boundary; parameterized queries; output encoding; CSRF and origin checks for state-changing requests.
- OTP throttling, bot detection, login throttling, idempotency keys, and abuse monitoring.
- Private object storage, short-lived signed URLs, virus/content scanning, EXIF stripping, size/type limits, and no public identity-document URLs.
- Encrypt in transit and at rest; manage secrets in deployment configuration; never log tokens, phone/email, documents, or raw cultural evidence.
- Append-only audit events for admin access, exports, consent, moderation, verification, and data changes.
- Dependency scanning, secure headers, backups, restore drills, incident response, and vendor access reviews.

## Privacy requirements

The platform should be designed for DPDP Act 2023 obligations and current rules/notifications, but Indian counsel must confirm the applicable regime and commencement dates at launch. Treat the service as a data fiduciary/controller. Provide clear notice, purpose limitation, data minimisation, consent/withdrawal, correction, access/export, deletion, grievance redressal, retention, and breach response processes.

High-sensitivity categories include identity evidence, phone/email, exact birth data, horoscope, family details, religion-related fields, lineage claims, private messages, location, income, and delegate relationships. Default these to private or matched-only. Explain every use of cultural data. Do not use lineage or religion to create hidden desirability scores.

## IT/intermediary and consumer considerations

Counsel should confirm whether and how intermediary IT Rules obligations apply, including published grievance contact, complaint intake/acknowledgement, content handling, records, and lawful requests. Terms must clearly state that the service facilitates introductions and does not guarantee identity, compatibility, marriage, genealogy, or safety. Premium plans need transparent price, renewal, cancellation, refund, invoice, and consumer support terms.

## Threat model

| Threat | Control |
|---|---|
| Account takeover | Secure auth, recovery, rate limits, session/device revocation, alerts |
| Romance/payment scam | education, reporting, anomaly signals, moderation, payment-request warnings |
| Family impersonation/coercion | owner confirmation, delegate scope, owner veto, revocation, activity log |
| Doxxing/contact scraping | private-by-default fields, scoped access, throttling, watermarking where appropriate |
| Fake verification | status names tied to evidence and expiry; no manual badge shortcut |
| Insider/admin abuse | least privilege, MFA, reason codes, audit review, separated duties |
| Media/document leak | private buckets, signed URLs, scanning, retention/deletion |
| Cultural misinformation | expert review, source/uncertainty labels, taxonomy change log |
| Search inference | coarse indexes, no sensitive filters for unauthorized roles, query abuse detection |
| Payment/webhook abuse | signature validation, idempotency, server-side entitlements, reconciliation |

## Legal review questions

1. Which DPDP notices, consent language, child safeguards, Data Protection Officer obligations, and cross-border/vendor requirements apply at launch?
2. Does the service qualify for any IT Rules intermediary obligations and which grievance timelines/processes apply?
3. What verification provider, KYC, biometric, and document-retention practices are lawful and proportionate?
4. Which Indian and Nepal laws apply to diaspora users and data transfers?
5. What terms are needed for family-managed adult profiles and delegated consent?
6. What claims, disclaimers, refunds, subscription renewals, and payment taxes are required?
7. What copyright/licensing/attribution permissions are required for Madhubani/Kohbar artwork and cultural articles?

## Current legal source register and commencement tracker

- Digital Personal Data Protection Act, 2023, official text: https://www.meity.gov.in/data-protection-framework
- Digital Personal Data Protection Rules, 2025, Gazette publication: https://egazette.nic.in/ — published 13 November 2025; verify the Gazette instrument and amendments at each release.
- DPDP commencement tracker: Rules 1, 2, and 17–21 commenced on publication; Rule 4 is scheduled 12 months after publication; Rules 3, 5–16, 22, and 23 are scheduled 18 months after publication. The Board of Data Protection was notified on publication. Counsel must confirm whether any later notification changes these dates before launch.
- IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and amendments: https://www.meity.gov.in/it-rules-2021
- Consumer Protection Act, 2019 and E-Commerce Rules, 2020: https://consumeraffairs.nic.in/
- Information Technology Act, 2000 and official rules: https://www.meity.gov.in/
- CERT-In Directions and incident reporting guidance: https://www.cert-in.org.in/
- RBI payment and recurring transaction guidance, if subscriptions are offered: https://www.rbi.org.in/
- Nepal Privacy Act 2018 and Electronic Transactions Act, plus each diaspora country’s privacy/consumer rules: counsel to select and maintain the applicable register.

### Launch-specific legal work

Before any public cohort: classify data and roles under the current DPDP regime; approve notice/consent and child safeguards; appoint required grievance/DPO functions; document processor/vendor contracts and cross-border transfers; approve identity-provider and deletion contracts; review family delegation language; approve terms, refunds, renewals, paid claims, content licences, and accessibility; test data-subject requests; and rehearse breach, lawful-request, complaint, and appeal workflows. Record counsel name, opinion date, open issues, and expiry/review date in the release gate.

## Retention, consent, delegation, and deletion

- **Retention:** publish a schedule by category. Suggested starting policy for counsel review: unpublished drafts until deletion or 12 months inactivity; verification evidence only for the provider/counsel-approved period; active profiles until deactivation; messages for a short safety-support period; reports and moderation evidence for legal/safety limitation periods; billing records for tax/consumer-law periods; audit events for the approved security/compliance period; backups on a documented rolling expiry. Never retain raw identity documents or Panji evidence indefinitely by default.
- **Consent:** version every notice and purpose, capture timestamp, actor, language, channel, delegated scope, and withdrawal state. Separate consent for public profile, matched-only discovery, photos, identity review, cultural/Panji review, family delegation, marketing, and success stories. Withdrawal stops the relevant optional processing; it does not silently revoke legally required retention.
- **Delegated family access:** the adult profile owner is the data principal and final decision-maker. Delegates authenticate their own account, receive explicit read/shortlist/coordinate permissions, cannot change consent, publish, message, exchange contact details, or delete without owner approval, and have an expiry/revocation record. Owner activity notices and an emergency “revoke all delegates” action are mandatory.
- **Deletion:** accept authenticated requests through the member area and grievance channel; immediately hide/deactivate discovery; revoke sessions and delegates; delete or anonymize profile/media/optional data according to the schedule; preserve only narrowly justified records (for example a fraud investigation, financial record, or legal hold); remove from search indexes and caches; expire backups; provide a completion report listing categories retained and the reason. Deletion must not erase another person’s private messages or evidence needed for an active safety case without a documented legal review.

This is product planning, not legal advice. No public launch should occur before counsel signs off.

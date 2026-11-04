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

This is product planning, not legal advice. No public launch should occur before counsel signs off.

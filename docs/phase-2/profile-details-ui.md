# Individual matrimonial profile details UI

## Route

- `/profiles/[profileId]` — dynamic frontend-only profile detail route.
- Valid fictional IDs include `MM-240184`, `MM-240176`, `MM-240211`, and `MM-240198`.
- Invalid IDs render a graceful profile-unavailable state.

## Mock data

- `lib/mock-profile-details.ts` extends the existing Discover records with birth date, languages, gallery visibility, career details, family details, lineage copy, and stated partner expectations.
- Cultural values remain self-reported. Unknown, undisclosed, and not-applicable values render gracefully. No compatibility or marriage eligibility logic is implemented.

## Interactions

- Discover card links and quick-view modal link to the dynamic profile route.
- Gallery thumbnails, restricted-photo states, fullscreen viewer, and previous/next controls.
- Express Interest modal, frontend-only confirmation, shortlist toggle, share/copy-link fallback, report modal, block confirmation, and toast feedback.
- Expand/collapse sections for personal information, career, family, cultural information, and partner expectations.
- Related-profile navigation back into dynamic detail routes.

## Scope

No API, database, authentication, contact information, persistent interest/report/block state, or official Panji verification is used.

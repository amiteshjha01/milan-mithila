# Profile management UI

## Route

- `/profile` — frontend-only matrimonial profile management experience.

## Frontend architecture

- `components/profile/profile-app.tsx` owns the controlled form, section navigation, progress calculation, local photo preview, save/discard states, and public profile preview.
- `lib/mock-profile.ts` contains all profile types, fictional values, completion items, and gallery seed data.
- `public/images/mitali-profile.png` is a generated fictional portrait used by the mock profile.
- `styles/profile.css` contains the profile-management visual system and responsive form layout.

## Scope boundaries

This screen does not connect to APIs, databases, authentication, uploads, compatibility logic, cultural master data, or official Panji verification. Save confirmation explicitly states that changes are only retained for the current frontend session.

Cultural fields accept user-entered values and visibly support Available, Not known, Not applicable, and Prefer not to disclose states. Verification status is presented separately from self-reported cultural information.

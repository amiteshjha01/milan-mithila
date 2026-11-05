# Phase 2 frontend dashboard

## Route

- `/dashboard` — frontend-only application shell and user dashboard.

## Architecture

- `components/dashboard/dashboard-app.tsx` contains the interactive client shell, sidebar, top bar, welcome panel, recommendation cards, activity panels, and responsive mobile navigation.
- `lib/mock-dashboard.ts` centralizes fictional dashboard data and navigation definitions so the UI can later consume MongoDB-backed responses without changing the visual components.
- Public pages remain unchanged.

## Mock data replacement points

- `dashboardUser` → authenticated session/profile response.
- `recommendedProfiles` → curated match/search response.
- `recentProfiles` → recently viewed profiles response.
- `receivedInterests` → interests inbox response.
- `dashboardStats` → aggregate activity response.

The current dashboard intentionally contains no database reads, API calls, authentication, compatibility logic, or cultural eligibility rules. Gotra/Mool-related logic is reserved for a later product decision and is not present in this frontend-only task.

## Interaction states included

- Responsive sidebar open/close behavior.
- Active navigation state and notification indicator.
- Functional navigation links for planned screens.
- Shortlist/accept controls presented as frontend actions.
- Responsive recommendation, recent-profile, interests, and activity layouts.

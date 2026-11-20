# Frontend Audit — Mithila Milan

**Audit Date:** 2026-11-18  
**Scope:** `app/**`, `components/**`, `styles/**`, `lib/auth-context.tsx`, `lib/mock-*`

---

## 1. Route Inventory & Duplicate Routes

All 7 `/dashboard/*` sub-routes are thin re-exports of top-level routes and render the exact same components:

| Top-Level Route | Duplicate Route | Rendered Component | Notes |
|---|---|---|---|
| `app/discover/page.tsx` | `app/dashboard/discover/page.tsx` | `<Suspense><DiscoverApp /></Suspense>` | Exact re-export |
| `app/interests/page.tsx` | `app/dashboard/interests/page.tsx` | `<InterestsApp />` | Exact re-export |
| `app/messages/page.tsx` | `app/dashboard/messages/page.tsx` | `<Suspense><MessagesApp /></Suspense>` | Exact re-export |
| `app/profile/page.tsx` | `app/dashboard/profile/page.tsx` | `<ProfileApp />` | Exact re-export |
| `app/profiles/[profileId]/page.tsx` | `app/dashboard/profile/[profileId]/page.tsx` | `<ProfileDetailApp />` | Exact re-export (note singular `profile` vs plural `profiles`) |
| `app/settings/page.tsx` | `app/dashboard/settings/page.tsx` | `<SettingsApp />` | Exact re-export |
| `app/shortlist/page.tsx` | `app/dashboard/shortlist/page.tsx` | `redirect('/discover?tab=shortlisted')` | Exact re-export |

Additionally, `app/signup/page.tsx` re-renders `<LoginPage />` (`app/login/page.tsx`), which always initializes `mode` to `'login'` rather than `'signup'`.

---

## 2. Shell, Navigation & Component Reuse

- **Public Shell (`components/site-shell.tsx`):** `SiteHeader`, `SiteFooter`, `MobileBottomNav`, `PublicShell`, `PageIntro`, `SectionTitle`, `EditorialNote` are reused consistently across `/about`, `/how-it-works`, `/safety`, `/membership`, `/contact`, `/privacy`, `/terms`, `/culture`, `/kundali-matching`, `/milan-select`, and `/`.
- **Authenticated Shell (`components/layout/authenticated-shell.tsx`):** Provides sidebar navigation, topbar with live `Cmd+K` profile search (`/api/profiles?q=...`), notifications popover, auth-gate redirect to `/login`, and `MobileBottomNav`. Used by `/dashboard`, `/profile`, `/interests`, `/messages`, and `/settings`.
- **Layout Inconsistencies:**
  - `DiscoverApp` (`components/discover/discover-app.tsx`) and `ProfileDetailApp` (`components/profiles/profile-detail-app.tsx`) bypass `AuthenticatedShell` and render standalone headers/footers.
  - `MessagesApp` (`components/messages/messages-app.tsx:1585`) renders `<MobileBottomNav />` inside `<AuthenticatedShell>`, causing a duplicate mobile bottom nav.
  - `BiodataGeneratorApp` (`components/biodata/biodata-generator.tsx`) uses a custom toolbar instead of `SiteHeader` or `AuthenticatedShell`.
  - `AdminPage` (`app/admin/page.tsx`) uses a standalone admin layout.
- **Unused / Dead Frontend Files:** `components/culture/culture-art.tsx`, `components/ui/button.tsx`, `lib/mock-dashboard.ts`, and `CulturePage` in `components/public-pages.tsx` have no active consumers.

---

## 3. Responsiveness

Media queries are present across all stylesheets (`app/globals.css`, `app/public-pages.css`, `styles/dashboard.css`, `styles/profile.css`, `app/discover/discover.css`, `app/profiles/profile-details.css`, and inline `<style jsx global>` in `components/messages/messages-app.tsx`). Key breakpoints (`1120px`, `900px`, `768px`, `640px`) collapse multi-column grids, convert sidebars/filters into mobile drawers or bottom sheets, and toggle `.mobile-bottom-nav`.

---

## 4. Page & Feature Audit with Classifications

| Feature | Classification | Key Findings |
|---|---|---|
| **Static Public Pages** (`/about`, `/how-it-works`, `/safety`, `/privacy`, `/terms`) | **Implemented but not fully tested** | Clean editorial layouts; static content only. |
| **Cultural Heritage** (`/culture`) | **Implemented but not fully tested** | Interactive Gotra/Mool/Ritual tabs; links to `/discover?q=...` (which doesn't match Gotra/Mool client-side). |
| **Kundali & Panji Siddhanta** (`/kundali-matching`) | **Implemented but not fully tested** | Client-side 36-Guna math + `POST /api/panji/siddhanta`; Muhurat shortlist state is local-only. |
| **Milan Select Concierge** (`/milan-select`) | **Implemented but not fully tested** | Calls `POST /api/consultation`; `finally` block sets `formSubmitted = true` even if the request fails. |
| **Profile Management** (`/profile`) | **Implemented but not fully tested** | Full `GET`/`POST /api/profile/me` sync & live preview; photo `PrivacyControl` `onChange` and `MoreHorizontal` button are no-ops; uploads store base64 Data URLs in DB. |
| **Admin UI** (`/admin`) | **Implemented but not fully tested** | Wired to `/api/admin/*`; `loadData()` runs before admin login; hardcoded cluster host/DB name in JSX; prefilled/printed demo admin credentials. |
| **Homepage** (`/`) | **Partially implemented** | Fetches spotlight profiles from `/api/profiles`, but Quick Match drops `ageRange`, and `DiscoverApp` ignores `gotra`, `location`, and `nativeDistrict` URL params. Hardcoded `"92% Match"` and member counts. |
| **Login / Signup / Auth Modal** (`/login`, `/signup`) | **Partially implemented** | `localStorage`-only session (`lib/auth-context.tsx`), simulated `GoogleAuthModal`, silent demo-session fallback on API errors, and `/signup` defaults to login tab. |
| **Dashboard** (`/dashboard`) | **Partially implemented** | `handleShortlist` sends `targetProfileId` instead of `profileId` (fails `400` against `/api/shortlist`); `handleAcceptInterest` is local-only; `CompletionCard` hardcodes `85%`. |
| **Discover Matches** (`/discover`) | **Partially implemented** | Live `/api/profiles` fetch, but shortlist/interest calls omit `userId`/`senderId` (falling back to `DEMO_CURRENT_USER`), client search ignores Gotra/Mool, and pagination/save-search/voice-note are non-functional. |
| **Profile Details** (`/profiles/[profileId]`) | **Partially implemented** | Loads profile from `/api/profiles/[profileId]`, but Express Interest, Shortlist, Report, Block, and Recommend are **UI-only**; `gunaMilan` (`31/36`) and `familyCompanion` are hardcoded; `VoicePromptPlayer` has no audio. |
| **Interests** (`/interests`) | **Partially implemented** | Real `GET`/`POST /api/interests`, but disconnected from Discover (`DEMO_CURRENT_USER`) and Profile Details (UI-only). |
| **Messaging** (`/messages`) | **Partially implemented** | Real `GET`/`POST /api/messages` for active thread, but **never fetches conversation list** on mount; Chai video room is UI-only; attachments use ephemeral `blob:` URLs; report button is toast-only. |
| **Settings** (`/settings`) | **Partially implemented** | Uses `useState` instead of `useEffect` (initial fetch misses post-hydration `user`); `emailNotifs`/`familyAssistance` not persisted; Profile Purge is UI-only. |
| **Biodata Maker** (`/biodata`) | **Partially implemented** | Auto-fills from `/api/profile/me` and prints/shares, but edits are not saved to DB. |
| **Shortlist** (`/shortlist`) | **Partially implemented** | Redirects to `/discover?tab=shortlisted` (broken by `DEMO_CURRENT_USER` mismatch). |
| **Contact Form** (`/contact`) | **UI-only** | Local React state only; no API call. |
| **Membership** (`/membership`) | **UI-only / Not implemented** | Placeholder pricing cards; payment processing explicitly not connected. |

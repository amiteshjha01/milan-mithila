# Mithila Milan — Project Overview & Status Audit

**Audit Date:** 2026-11-18  
**Workspace:** `d:\mithila-milan\Mithila-Milan-8k`  
**Audit Mode:** Read-only architecture, implementation, security, cultural, and build audit (no code or database changes made).

---

## 1. Git & Repository Status

- **Current Branch:** `main` (tracking `origin/main` at `06eeda0`)
- **Recent Commit History (14 commits):**
  - `06eeda0` — `Merge pull request #1 from amiteshjha01/v0/discover-matches-search`
  - `9032b1d` — `Build individual profile details UI`
  - `b256a2f` — `Fix discover stylesheet resolution`
  - `77a6240` — `Build discover matches search UI`
  - `e918b7a` — `Build matrimonial profile management UI`
  - `d7753af` — `Build premium user dashboard frontend`
  - `4b840d3` — `Add MongoDB migration draft`
  - `ebd7839` — `Document database architecture decision`
  - `022c889` — `Add Prisma database foundation`
  - `6922925` — `Build public Mithila Milan website pages`
  - `03f6ccf` — `Complete Mithila Milan homepage`
  - `764632b` — `Create preliminary Milan visual concept`
  - `6cffc5e` — `Expand Phase 0 research and requirements`
  - `e305f65` — `Initial commit from v0`

- **Uncommitted Working Tree State:**
  - **24 modified tracked files** (`10,364 insertions(+)`, `361 deletions(-)`): includes `app/api/health/db/route.ts`, `app/api/profiles/route.ts`, `app/culture/page.tsx`, `app/discover/*`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/profiles/profile-details.css`, `app/public-pages.css`, `components/dashboard/dashboard-app.tsx`, `components/discover/discover-app.tsx`, `components/homepage.tsx`, `components/profile/profile-app.tsx`, `components/profiles/profile-detail-app.tsx`, `components/public-pages.tsx`, `components/site-shell.tsx`, `lib/mock-*`, `lib/mongodb-models.ts`, `lib/mongodb.ts`, `styles/dashboard.css`.
  - **Untracked files & directories:**
    - App routes: `app/admin/`, `app/biodata/`, `app/dashboard/{discover,interests,messages,profile,settings,shortlist}/`, `app/interests/`, `app/kundali-matching/`, `app/login/`, `app/messages/`, `app/milan-select/`, `app/privacy/`, `app/settings/`, `app/shortlist/`, `app/signup/`, `app/terms/`
    - API routes: `app/api/{admin,auth,consultation,interests,messages,panji,profile,profiles/[profileId],settings,shortlist}/`
    - Components & libs: `components/{auth,biodata,concierge,culture,interests,kundali,layout,messages,settings}/`, `lib/auth-context.tsx`
    - Assets, scripts, lockfile: `public/images/mithila-{aripan,kohbar,vivah}.{jpg,png}`, `scripts/seed-mongodb.ts`, `package-lock.json`

---

## 2. Tech Stack & Conflicting Implementations

- **Framework:** Next.js `16.4.3` (App Router, Turbopack), React `19`, TypeScript `5.7.3`, Tailwind CSS `4.3.3`, Zod `4.6.7`, Lucide React `1.16.0`.
- **Package Manager Conflict:** `package.json` declares `packageManager: "pnpm@12.3.4"` with `pnpm-lock.yaml`, while an untracked `package-lock.json` (npm) is also present.
- **Database Split-Brain (Prisma/PostgreSQL vs. Mongoose/MongoDB):**
  - `docs/phase-2/database-architecture-decision.md` explicitly decided to **keep Neon PostgreSQL with Prisma** and **not** migrate to MongoDB.
  - Despite that decision, 16 of 17 API routes and `.env.local` (`MONGODB_URI`, `MONGODB_DB`) now use **Mongoose `9.11.4`** (`lib/mongodb.ts`, `lib/mongodb-models.ts`).
  - Meanwhile, `app/api/seed/route.ts` and `package.json` (`prisma:generate`, `db:push`, `db:seed` -> `scripts/seed-demo.ts`) still target **Prisma / PostgreSQL**, and `scripts/seed-mongodb.ts` has no npm script.
- **Duplicate Routes:** All 7 `/dashboard/*` sub-routes (`discover`, `interests`, `messages`, `profile`, `profile/[profileId]`, `settings`, `shortlist`) are thin re-exports of top-level routes (`/discover`, `/interests`, `/messages`, `/profile`, `/profiles/[profileId]`, `/settings`, `/shortlist`). `/signup` renders `<LoginPage />` defaulting to the login tab.

---

## 3. Build, TypeScript & Runtime Verification Results

| Check | Command | Result | Notes |
|---|---|---|---|
| **TypeScript Check** | `npx tsc --noEmit` | **Passed** (exit `0`) | Note: `next.config.mjs` sets `typescript: { ignoreBuildErrors: true }`, so `next build` skips type validation. |
| **Production Build (1st run)** | `npx next build` | **Failed** (exit `1`) | Blocked by Next.js `SecurityFatalError` advisory for `next@16.4.3`. |
| **Production Build (retry)** | `npx next build` | **Passed** (exit `0`) | Compiled in 3.2s; generated 31 static (`○`) + 16 dynamic (`ƒ`) = 47 routes. Emitted security advisory warning for `next@16.4.3`. |
| **MongoDB Connectivity** | `GET /api/health/db` (on `next start -p 3099`) | **Passed** (`200`) | Returned `{"ok":true,"status":"connected","database":"mongodb","readyState":1}`. |
| **Public & API Smoke Test** | `Invoke-WebRequest` on `/`, `/discover`, `/dashboard`, `/admin`, `/kundali-matching`, `/api/profiles` | **Passed** (`200`) | All tested routes returned HTTP `200`; `/api/profiles` returned live MongoDB profile data (770,198 bytes). |

---

## 4. Master Feature Classification Summary

| Feature Area | Classification | Summary |
|---|---|---|
| Static Public Pages (`/about`, `/how-it-works`, `/safety`, `/privacy`, `/terms`) | **Implemented but not fully tested** | Complete editorial pages and responsive CSS. |
| Cultural Heritage Directory (`/culture`) | **Implemented but not fully tested** | Interactive Gotra/Mool/Ritual tabs with static cultural data. |
| Kundali & Panji Siddhanta (`/kundali-matching`, `/api/panji/siddhanta`) | **Implemented but not fully tested** | Client-side 36-Guna calculator + stateless Panji string-check API; astrological/Panji rules are unvalidated/simplified. |
| Milan Select VIP Concierge (`/milan-select`, `/api/consultation`) | **Implemented but not fully tested** | Persists leads to MongoDB `vip_consultations`; form sets submitted state in `finally` even on error. |
| Profile Management (`/profile`, `/api/profile/me`) | **Implemented but not fully tested** | Loads/saves profile to MongoDB; lacks auth check and drops non-schema fields (`maternalLineage`, `familyVillage`). |
| Admin Console (`/admin`, `/api/admin/*`) | **Implemented but not fully tested** | Functional CRUD/stats against MongoDB, but **unauthenticated** on `/api/admin/stats` & `/api/admin/users` and uses hardcoded credentials. |
| Homepage (`/`) | **Partially implemented** | Live spotlight fetch works, but Quick Match params (`ageRange`, `gotra`, `location`) are dropped/ignored by Discover; hardcoded `"92% Match"` & stats. |
| Authentication & Google Sign-In (`/login`, `/signup`, `/api/auth/*`) | **Partially implemented** | Plaintext passwords, credentials login skips password check, mock Google OAuth, `localStorage`-only session, reset token leaked in JSON. |
| Member Dashboard (`/dashboard`) | **Partially implemented** | Shortlist payload mismatch (`targetProfileId` vs `profileId`), local-only interest accept, hardcoded `85%` completion. |
| Discover Matches (`/discover`) | **Partially implemented** | Live `/api/profiles` search, but shortlist/interest calls omit `userId` (defaulting to `DEMO_CURRENT_USER`), ignores URL cultural/location params, bypasses `AuthenticatedShell`. |
| Individual Profile Details (`/profiles/[profileId]`) | **Partially implemented** | Loads profile from DB, but Express Interest, Shortlist, Report, Block, and Recommend are UI-only; Guna Milan (`31/36`) & Family Companion are hardcoded. |
| Interests (`/interests`, `/api/interests`) | **Partially implemented** | API works for send/accept/decline, but `WITHDRAW` is unimplemented in `POST`, and Discover/Detail views are disconnected. |
| Messaging & Meet Over Chai (`/messages`, `/api/messages`) | **Partially implemented** | Thread send/read works, but conversation list is never fetched on mount, Chai video room is UI-only, and attachment/Chai fields are stripped by Mongoose schema. |
| Settings & Privacy (`/settings`, `/api/settings`) | **Partially implemented** | Uses `useState` instead of `useEffect` for initial fetch; `emailNotifs`/`familyAssistance` not persisted; Profile Purge is UI-only; privacy flags unenforced by `/api/profiles`. |
| Biodata Maker (`/biodata`) | **Partially implemented** | Pre-fills from `/api/profile/me` and prints/shares, but edits are not persisted. |
| Shortlist (`/shortlist`) | **Partially implemented** | Redirects to `/discover?tab=shortlisted` (suffers from `DEMO_CURRENT_USER` mismatch). |
| Contact Form (`/contact`) | **UI-only** | Local React state submission only; no backend endpoint. |
| Membership & Billing (`/membership`) | **UI-only / Not implemented** | Placeholder pricing cards; payment gateway not connected. |
| Automated Test Suite & Rate Limiting | **Not implemented** | Zero unit/integration/E2E tests, no `middleware.ts`, no rate limiting. |

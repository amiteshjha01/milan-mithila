# Technical Debt Register — Mithila Milan

**Audit Date:** 2026-11-18

---

## 1. Architecture & Infrastructure Debt

1. **Prisma / PostgreSQL vs. Mongoose / MongoDB Split-Brain:**
   - `docs/phase-2/database-architecture-decision.md` mandates PostgreSQL + Prisma, while 16/17 API routes use Mongoose/MongoDB, `app/api/seed/route.ts` and `pnpm db:seed` still use Prisma, and `scripts/migrate-postgres-to-mongodb.ts` is broken against current Mongoose schemas.
2. **Dual Lockfiles (`pnpm-lock.yaml` + `package-lock.json`):**
   - `package.json` specifies `pnpm@12.3.4`, but an untracked `package-lock.json` exists in the root.
3. **Permissive Next.js Build Config (`next.config.mjs`):**
   - `typescript: { ignoreBuildErrors: true }` causes `next build` to skip type checking; `images: { unoptimized: true }` disables Next.js image optimization.
4. **Outdated / Vulnerable Next.js Version (`next@16.4.3`):**
   - `npx next build` triggered `SecurityFatalError` due to a known security vulnerability advisory.
5. **Large Uncommitted Working Tree:**
   - 24 modified files (+10,364 / -361 lines) and 45+ untracked files/directories are uncommitted on `main`, increasing risk of merge conflicts or accidental loss.

---

## 2. Routing, Component & Schema Debt

1. **Duplicate `/dashboard/*` Routes:**
   - 7 routes under `app/dashboard/*` duplicate top-level routes (`/discover`, `/interests`, `/messages`, `/profile`, `/profiles/[profileId]`, `/settings`, `/shortlist`), with inconsistent naming (`profiles/[profileId]` vs `dashboard/profile/[profileId]`).
2. **Shell & Navigation Fragmentation:**
   - `DiscoverApp` and `ProfileDetailApp` use custom headers/footers instead of `AuthenticatedShell`; `MessagesApp` renders a duplicate `<MobileBottomNav />` inside `AuthenticatedShell`.
3. **Mongoose Schema Mismatches & Inline Models:**
   - `MongoMatch` shares `interestSchema` on the `interests` collection.
   - `MongoGrievance` is defined in `lib/mongodb-models.ts` but unused.
   - `VipConsultation` is defined inline in `app/api/consultation/route.ts` instead of `lib/mongodb-models.ts`, causing `mongoose.models.VipConsultation` to be `undefined` in admin routes depending on cold-start order.
   - `/api/messages` writes `attachment`, `isChaiInvite`, `chaiDetails` that are stripped by `conversationSchema`.
   - `/api/profile/me` writes `maternalLineage`, `familyVillage`, `employmentPreference`, `familyPreference` that are stripped by `profileSchema`.
4. **Dead / Unused Code:**
   - `components/culture/culture-art.tsx`, `components/ui/button.tsx`, `lib/mock-dashboard.ts`, and `CulturePage` in `components/public-pages.tsx` are unused.
5. **Silent `DEMO_CURRENT_USER` & Mock Fallbacks:**
   - Hardcoded `'DEMO_CURRENT_USER'` in `/api/profiles`, `/api/profiles/[profileId]`, `/api/interests`, `/api/shortlist`, and `scripts/seed-mongodb.ts`, plus `200 OK` demo fallbacks when MongoDB is disconnected, mask real bugs and cause cross-page state mismatches.
6. **Base64 Photo Storage in MongoDB:**
   - `ProfileApp` and `BiodataGeneratorApp` store uploaded photos as base64 Data URLs, risking MongoDB 16MB BSON document limits and slow `/api/profiles` payloads (currently 770 KB for the seed set).
7. **Zero Automated Tests:**
   - No unit, integration, or E2E test suite exists in the repository.

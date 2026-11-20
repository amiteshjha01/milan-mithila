# Prioritized Next Steps & Recommendations — Mithila Milan

**Audit Date:** 2026-11-18

---

## Priority 0 (P0) — Critical Security & Auth Blockers (Do Before Any Public/Staging Deployment)

1. **Implement Real Server-Side Authentication & Sessions:**
   - Hash passwords using `argon2` or `bcrypt` (or Node `crypto.scrypt`); verify passwords on every `CREDENTIALS` login (`app/api/auth/login/route.ts`).
   - Replace `localStorage`-only auth (`lib/auth-context.tsx`) with signed `HttpOnly; Secure; SameSite=Lax` session cookies (e.g., Auth.js or `jose` JWTs) and enforce route protection in `middleware.ts`.
   - Remove unverified `GoogleAuthModal` account-picker bypass (use real Google OAuth/OIDC) and remove all fail-open demo login fallbacks.
2. **Lock Down Admin & User-Owned APIs:**
   - Require a verified `ADMIN` session in `/api/admin/stats` and `/api/admin/users`; remove hardcoded fallback credentials and auto-escalation from `admin/auth`, `auth/login`, and `app/admin/page.tsx`.
   - Derive `userId` exclusively from the verified server session in `/api/profile/me`, `/api/settings`, `/api/interests`, `/api/messages`, and `/api/shortlist` (eliminating all IDORs).
3. **Fix Password Reset & Privacy Enforcement:**
   - Never return `resetPasswordToken` in `/api/auth/forgot-password`; store a cryptographic hash (`crypto.randomBytes(32)` + SHA-256), send via email, and implement `/api/auth/reset-password`.
   - Enforce `visibility` (`PAUSED`, `CONNECTIONS_ONLY`), `accountStatus` (`BLOCKED`), `culturalVisibility`, and `photoVisibility` server-side in `/api/profiles` and `/api/profiles/[profileId]`.
4. **Upgrade Next.js & Add Security Controls:**
   - Upgrade `next` from `16.4.3` to a patched release to resolve the security advisory.
   - Add rate limiting on auth/consultation/messaging endpoints, escape `$regex` inputs in `/api/profiles`, validate `attachment.url` schemes, and configure security headers in `next.config.mjs`.

---

## Priority 1 (P1) — Core Functionality & Data Integrity Fixes

5. **Resolve Database Architecture & Commit Hygiene:**
   - Formally reconcile `docs/phase-2/database-architecture-decision.md` with the MongoDB implementation: remove unused Prisma/PostgreSQL code (`prisma/`, `lib/prisma.ts`, `app/api/seed/route.ts`) or update scripts so `package.json` (`db:seed`) points to `scripts/seed-mongodb.ts`.
   - Remove duplicate `package-lock.json` and commit the current feature set cleanly on a feature branch.
6. **Fix Broken Frontend-to-Backend Wiring:**
   - **Dashboard (`dashboard-app.tsx`):** Change `targetProfileId` to `profileId` in shortlist calls; wire `handleAcceptInterest` to `POST /api/interests`.
   - **Discover (`discover-app.tsx`):** Pass authenticated `userId` on shortlist/interest mutations; wire `gotra`, `location`, `nativeDistrict` URL params and include `gotra`/`mool`/`community` in client search.
   - **Profile Details (`profile-detail-app.tsx`):** Wire Express Interest, Shortlist, Report (`MongoGrievance`), and Block to real APIs instead of local React state.
   - **Messages (`messages-app.tsx`):** Fetch the user's conversation list on mount (`GET /api/messages?userId=...`); add `attachment`, `isChaiInvite`, `chaiDetails` to `conversationSchema` in `lib/mongodb-models.ts`; remove duplicate `<MobileBottomNav />`.
   - **Settings (`settings-app.tsx`):** Replace `useState` initial fetch with `useEffect`; persist `emailNotifs` and `familyAssistance` in `MongoUser`/`MongoProfile`; implement real profile pause/deletion API.
   - **Interests (`interests-app.tsx` & `/api/interests`):** Implement `WITHDRAW` action in `POST /api/interests`.
7. **Consolidate Models & Remove Silent Fallbacks:**
   - Move `VipConsultation` into `lib/mongodb-models.ts`; remove duplicate `MongoMatch` model on `interests`.
   - Remove `200 OK` demo fallbacks when `connectMongo()` returns `null` (return `503` instead) and fix `CastError` in `/api/profiles`.

---

## Priority 2 (P2) — Cultural Accuracy, UX & Maintainability

8. **Align Cultural Claims with Reality (or Implement Real Verification):**
   - Remove misleading claims (`"100% Verified"`, `"Digital Siddhanta Clearance"`, `"Mithila Panchang Certified"`, `"Interactive 7-Generation Sapinda Checker"`, and hardcoded `31/36` / `32/36` Guna scores on profile cards) until backed by real OTP/ID verification, Maithil Panjikar/scholar-reviewed rules, and real ephemeris-based Jyotish calculations.
   - Add missing Mithila communities (e.g., Karn Kayastha) and align `culturalVisibility` enum values between `ProfileApp` and `MongoProfile`.
9. **Deduplicate Routes & Shells:**
   - Decide on either top-level routes (`/discover`, `/messages`, etc.) or `/dashboard/*` and redirect the other set; wrap `DiscoverApp` and `ProfileDetailApp` in `AuthenticatedShell` (or a unified app shell).
   - Remove dead files (`culture-art.tsx`, `ui/button.tsx`, `mock-dashboard.ts`).
10. **Media Storage, Type Safety & Testing:**
    - Move photo/attachment uploads from base64 Data URLs and `blob:` URLs to object storage (e.g., S3/Cloudinary/R2) with size/MIME validation and EXIF stripping.
    - Remove `typescript: { ignoreBuildErrors: true }` from `next.config.mjs`.
    - Add automated API integration tests (Vitest/Playwright) covering auth, privacy, interests, messaging, and build verification.

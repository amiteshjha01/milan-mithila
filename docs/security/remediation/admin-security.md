# Phase 2 — Admin Security Remediation

**Date:** 2026-11-18  
**Branch:** `security-remediation`  
**Scope:** Removal of hardcoded/fallback admin credentials, secret hygiene in Git history and configuration, server-side admin authentication, and role-based access control (RBAC) across all admin APIs.

---

## Finding ADMIN-01 — Hardcoded Admin Credentials, Auto-Provisioning & Frontend Exposure

- **Original Vulnerability:**
  - `app/api/admin/auth/route.ts` and `app/api/auth/login/route.ts` accepted hardcoded fallback passwords and multiple hardcoded admin email aliases, and automatically created or promoted matching accounts to `role: 'ADMIN'` with a plaintext password.
  - `app/admin/page.tsx` prefilled the admin email and password in React state, rendered a 1-click "Auto-Fill Admin Credentials" button displaying the plaintext credentials in JSX, and hardcoded the MongoDB Atlas cluster hostname and database name in the client bundle.
- **Root Cause:** Demo convenience credentials and auto-seeding logic were embedded directly in API route handlers and client components.
- **Files Modified:**
  - [app/api/admin/auth/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/admin/auth/route.ts)
  - [app/api/auth/login/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/auth/login/route.ts)
  - [app/admin/page.tsx](file:///d:/mithila-milan/Mithila-Milan-8k/app/admin/page.tsx)
  - [scripts/provision-admin.ts](file:///d:/mithila-milan/Mithila-Milan-8k/scripts/provision-admin.ts)
  - [.env.example](file:///d:/mithila-milan/Mithila-Milan-8k/.env.example)
  - [.gitignore](file:///d:/mithila-milan/Mithila-Milan-8k/.gitignore)
- **Implemented Fix:**
  1. Removed all hardcoded admin emails, fallback passwords, environment-variable password comparisons, and `ensureAdminUser()` auto-provisioning from `app/api/admin/auth/route.ts` and `app/api/auth/login/route.ts`.
  2. Required administrator accounts to exist in `MongoUser` with `role` in `['ADMIN', 'MODERATOR']` and a valid Argon2id `passwordHash`.
  3. Created `scripts/provision-admin.ts` for out-of-band CLI provisioning and credential rotation: it requires a minimum 14-character password, explicitly blocks previously exposed credentials, stores only an Argon2id hash, and revokes all existing sessions for the admin account.
  4. Removed prefilled credentials, the "Auto-Fill Admin Credentials" button, credential display, and MongoDB cluster/database identifiers from `app/admin/page.tsx`.
  5. Inspected Git commit history (`git log --all`): verified `.env.local` is ignored by `.gitignore` and was never committed to Git history, and verified the untracked `app/admin` and `app/api/admin` files had never been committed prior to remediation.
- **Test Performed:**
  - `tests/admin.test.ts` → `rejects all previously hardcoded fallback admin credentials and auto-provisioning`
  - `tests/admin.test.ts` → `rejects regular member accounts attempting to log in via /api/admin/auth`
  - `tests/admin.test.ts` → `authenticates a provisioned ADMIN account with Argon2id hash and issues an ADMIN session`
- **Test Result:** **PASS** (3/3 tests passing).
- **Remaining Risk:** If any admin account was previously provisioned in the live MongoDB Atlas cluster using the old default password, operators must run `scripts/migrate-auth-security.ts --apply` followed by `scripts/provision-admin.ts` with a fresh secret.

---

## Finding ADMIN-02 — Unauthenticated Admin APIs & Missing Role-Based Access Control

- **Original Vulnerability:**
  - `GET /api/admin/stats` and `POST /api/admin/users` performed zero authentication or authorization checks.
  - Any unauthenticated caller could dump all registered users, emails, roles, and VIP consultation leads (`GET /api/admin/stats`) or verify, block, or permanently delete any member (`POST /api/admin/users`).
- **Root Cause:** Authorization was enforced only by a client-side `user?.role === 'ADMIN'` check in `app/admin/page.tsx`, leaving the underlying Next.js API routes completely open.
- **Files Modified:**
  - [app/api/admin/stats/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/admin/stats/route.ts)
  - [app/api/admin/users/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/admin/users/route.ts)
  - [lib/security/guard.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/guard.ts)
  - [lib/security/session.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/session.ts)
- **Implemented Fix:**
  1. Protected both `GET /api/admin/stats` and `POST /api/admin/users` independently on the server via `authenticate(request, { roles: ['ADMIN', 'MODERATOR'], adminSession: true })`.
  2. Required an `ADMIN`-kind session (issued only by `POST /api/admin/auth` with a 4-hour absolute / 30-minute idle timeout) in addition to live database role verification (`ADMIN` or `MODERATOR`).
  3. Enforced granular RBAC inside `POST /api/admin/users`:
     - `TOGGLE_VERIFY`, `UPDATE_VIP_STATUS`, and `CHANGE_STATUS`: allowed for `ADMIN` and `MODERATOR`.
     - `DELETE_MEMBER`: restricted exclusively to `ADMIN` (`MODERATOR` receives `403`).
     - Self-protection & peer-privilege protection: neither `ADMIN` nor `MODERATOR` can block or delete their own account or another `ADMIN`/`MODERATOR` account via the API.
  4. Added cascading cleanup on `DELETE_MEMBER` (interests, shortlists, conversations, profile, sessions, user) and automatic session revocation when `CHANGE_STATUS` sets an account to `BLOCKED` or `PENDING_REVIEW`.
- **Test Performed:**
  - `tests/admin.test.ts` → `rejects unauthenticated requests to /api/admin/stats and /api/admin/users (401)`
  - `tests/admin.test.ts` → `rejects non-admin (SEEKER / PARENT / GUARDIAN) sessions on all admin APIs (403)`
  - `tests/admin.test.ts` → `rejects a USER-kind session even if the user role was somehow mutated in DB without /api/admin/auth`
  - `tests/admin.test.ts` → `enforces RBAC between MODERATOR and ADMIN on /api/admin/users`
  - `tests/admin.test.ts` → `prevents admins from deleting or blocking themselves or other privileged accounts`
- **Test Result:** **PASS** (5/5 tests passing).
- **Remaining Risk:** None identified.

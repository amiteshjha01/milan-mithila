# Phase 1 — Authentication Security Remediation

**Date:** 2026-11-18  
**Branch:** `security-remediation`  
**Scope:** Password hashing, credential verification, authentication bypass prevention, Google OAuth ID token validation, server-side session management (`HttpOnly` cookies, expiration, revocation), CSRF protection, and account recovery.

---

## Finding AUTH-01 — Plaintext Password Storage

- **Original Vulnerability:** User and administrator passwords were stored in plaintext inside the `passwordHash` field in MongoDB (`app/api/auth/signup/route.ts`, `app/api/admin/auth/route.ts`).
- **Root Cause:** Signup and admin provisioning assigned raw request passwords directly to `passwordHash` without invoking a cryptographic password hashing algorithm (`Argon2id`, `bcrypt`, or `scrypt`), and `passwordHash` was returned in default Mongoose projections.
- **Files Modified:**
  - [lib/security/password.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/password.ts)
  - [lib/mongodb-models.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/mongodb-models.ts)
  - [app/api/auth/signup/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/auth/signup/route.ts)
  - [app/api/auth/reset-password/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/auth/reset-password/route.ts)
  - [scripts/provision-admin.ts](file:///d:/mithila-milan/Mithila-Milan-8k/scripts/provision-admin.ts)
  - [scripts/migrate-auth-security.ts](file:///d:/mithila-milan/Mithila-Milan-8k/scripts/migrate-auth-security.ts)
- **Implemented Fix:**
  1. Implemented Argon2id hashing (`@node-rs/argon2`) in `lib/security/password.ts` with OWASP-compliant parameters (`memoryCost: 19456` KiB, `timeCost: 2`, `parallelism: 1`).
  2. Added password policy enforcement (`10–128` characters, denylist of common passwords, email local-part check, repetition check).
  3. Marked `passwordHash` as `select: false` in `userSchema` and filtered user payloads exclusively through `publicUser()` in `lib/accounts.ts`.
  4. Created `scripts/migrate-auth-security.ts` to back up existing records (with credentials redacted), unset any non-Argon2id `passwordHash` values, set `mustResetPassword: true`, and revoke active sessions so legacy plaintext accounts must complete a secure password reset.
- **Test Performed:**
  - `tests/auth.test.ts` → `stores the password only as an Argon2id hash and never returns or leaks it`
  - `tests/auth.test.ts` → `rejects weak/short passwords and privileged role self-assignment`
  - `tests/auth.test.ts` → `verifies hashes with the argon2 library (unit)`
  - `tests/auth.test.ts` → `legacy plaintext accounts are forced through reset and can recover`
- **Test Result:** **PASS** (4/4 tests passing). Raw MongoDB document inspection confirms `$argon2id$v=19$m=19456,t=2,p=1$...` format and zero plaintext exposure.
- **Remaining Risk:** Existing database accounts created prior to remediation must have `scripts/migrate-auth-security.ts --apply` executed during deployment maintenance so any historical plaintext values are purged from MongoDB Atlas.

---

## Finding AUTH-02 — Missing Password Verification & Authentication Bypass on Login

- **Original Vulnerability:** `POST /api/auth/login` declared `password` as optional in `loginSchema` and never compared `password` against `user.passwordHash` for non-admin accounts. Supplying only an email address logged the caller into any member account. Additionally, when MongoDB was unreachable or a network error occurred, both the API and client UI (`app/login/page.tsx`, `components/auth/auth-modal.tsx`) fell open into a logged-in demo user session.
- **Root Cause:** Incomplete prototype authentication logic combined with fail-open demo fallbacks in API routes and client catch blocks.
- **Files Modified:**
  - [app/api/auth/login/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/auth/login/route.ts)
  - [lib/security/password.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/password.ts)
  - [app/login/page.tsx](file:///d:/mithila-milan/Mithila-Milan-8k/app/login/page.tsx)
  - [components/auth/auth-modal.tsx](file:///d:/mithila-milan/Mithila-Milan-8k/components/auth/auth-modal.tsx)
- **Implemented Fix:**
  1. Enforced a strict discriminated union schema in `POST /api/auth/login`: `CREDENTIALS` logins require a non-empty `email` and `password`.
  2. Verified passwords exclusively via `verifyPassword(user.passwordHash, d.password)`, which rejects any stored value that is not a valid `$argon2id$` hash.
  3. Added timing-equalization (`burnPasswordCheck`) when an email does not exist or belongs to an admin/moderator account, returning an identical `401 Invalid email or password.` response.
  4. Added per-IP and per-account rate limiting plus durable database account lockout (`failedLoginCount >= 5` locks for 15 minutes).
  5. Removed all fail-open demo fallbacks from `/api/auth/login`, `/api/auth/signup`, `app/login/page.tsx`, and `components/auth/auth-modal.tsx`. Database outages now return `503 Service temporarily unavailable`.
- **Test Performed:**
  - `tests/auth.test.ts` → `accepts the correct password`
  - `tests/auth.test.ts` → `rejects an incorrect password`
  - `tests/auth.test.ts` → `rejects email-only login (the old authentication bypass)`
  - `tests/auth.test.ts` → `does not reveal whether the email exists`
  - `tests/auth.test.ts` → `rejects a legacy plaintext "passwordHash" (never compares plaintext)`
  - `tests/auth.test.ts` → `locks the account after repeated failures and rate-limits brute force`
- **Test Result:** **PASS** (6/6 tests passing).
- **Remaining Risk:** Per-IP rate limiting is in-memory per process; multi-instance deployments should back `lib/security/rate-limit.ts` with Redis while retaining the MongoDB-backed per-account lockout.

---

## Finding AUTH-03 — Unverified Google OAuth Login

- **Original Vulnerability:** Sending `{ provider: 'GOOGLE', email: '<any-email>' }` to `POST /api/auth/login` logged the caller in as that user without verifying any Google ID token or OAuth code. `GoogleAuthModal` provided preset accounts and a free-form email input.
- **Root Cause:** Mock client-side account picker trusted client-supplied `email` and `googleName` fields on the server.
- **Files Modified:**
  - [lib/security/google.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/google.ts)
  - [app/api/auth/login/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/auth/login/route.ts)
  - [components/auth/google-auth-modal.tsx](file:///d:/mithila-milan/Mithila-Milan-8k/components/auth/google-auth-modal.tsx)
  - [app/login/page.tsx](file:///d:/mithila-milan/Mithila-Milan-8k/app/login/page.tsx)
  - [components/auth/auth-modal.tsx](file:///d:/mithila-milan/Mithila-Milan-8k/components/auth/auth-modal.tsx)
- **Implemented Fix:**
  1. Created `verifyGoogleIdToken(idToken)` in `lib/security/google.ts` using `google-auth-library` (`OAuth2Client.verifySignedJwtWithCertsAsync`) to verify RS256 signatures against Google's federated sign-on certificates, validate `aud === process.env.GOOGLE_CLIENT_ID`, validate `iss` (`accounts.google.com` or `https://accounts.google.com`), check token expiration (`exp`), and require `email_verified === true`.
  2. Updated `POST /api/auth/login` so `provider: 'GOOGLE'` requires `idToken` and ignores any client-supplied `email` or `name`.
  3. Blocked `ADMIN` and `MODERATOR` accounts from authenticating via Google OAuth.
  4. Added pre-hijacking protection: if an unverified password account exists for the Google-verified email, linking Google clears the unverified `passwordHash` and revokes prior sessions.
  5. Replaced the mock email picker in `components/auth/google-auth-modal.tsx` with the official Google Identity Services (`accounts.google.com/gsi/client`) credential button.
- **Test Performed:**
  - `tests/auth.test.ts` → `rejects client-supplied Google identity without a token`
  - `tests/auth.test.ts` → `rejects garbage and malformed tokens`
  - `tests/auth.test.ts` → `rejects wrong audience, wrong issuer, expired, unverified email and forged signature`
  - `tests/auth.test.ts` → `accepts a valid token, and takes identity only from the token`
  - `tests/auth.test.ts` → `cannot be used to take over an admin account`
  - `tests/auth.test.ts` → `drops an unverified password account when its email is claimed through Google (pre-hijack defence)`
- **Test Result:** **PASS** (6/6 tests passing).
- **Remaining Risk:** `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` must be provisioned in the deployment environment for Google sign-in to be active; when unset, the server fails closed (`503`).

---

## Finding AUTH-04 — Insecure Client-Side Session Storage & Missing Revocation/CSRF

- **Original Vulnerability:** Sessions were stored as unsigned JSON in `localStorage` (`mithila_milan_auth_user`). No `HttpOnly` cookies, server-side session store, expiration, revocation, or CSRF checks existed.
- **Root Cause:** Client-only state in `lib/auth-context.tsx` was treated as authentication state without server-side session tokens.
- **Files Modified:**
  - [lib/security/session.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/session.ts)
  - [lib/security/guard.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/guard.ts)
  - [lib/mongodb-models.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/mongodb-models.ts)
  - [lib/auth-context.tsx](file:///d:/mithila-milan/Mithila-Milan-8k/lib/auth-context.tsx)
  - [app/api/auth/me/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/auth/me/route.ts)
  - [app/api/auth/logout/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/auth/logout/route.ts)
- **Implemented Fix:**
  1. Added `MongoSession` collection (`lib/mongodb-models.ts`) storing only the SHA-256 hash (`tokenHash`) of a 256-bit cryptographically random opaque session token (`crypto.randomBytes(32).toString('base64url')`), with a MongoDB TTL index on `expiresAt`.
  2. Enforced both absolute and sliding idle timeouts in `lib/security/session.ts`:
     - `USER` sessions: 14-day absolute lifetime, 48-hour idle timeout.
     - `ADMIN` sessions: 4-hour absolute lifetime, 30-minute idle timeout.
  3. Issued sessions exclusively via `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` (in production, with `__Host-mm_session` prefix) cookies in `lib/security/guard.ts`.
  4. Implemented single-session revocation (`POST /api/auth/logout`) and bulk user session revocation (`revokeAllUserSessions`) on password reset, account block, or member deletion.
  5. Enforced strict `Origin` / `Sec-Fetch-Site` CSRF validation (`isSameOriginRequest`) on all state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`).
  6. Rewrote `lib/auth-context.tsx` to purge any legacy `mithila_milan_auth_user` key from `localStorage` and fetch identity exclusively from `GET /api/auth/me`.
- **Test Performed:**
  - `tests/auth.test.ts` → `requires a session for /api/auth/me`
  - `tests/auth.test.ts` → `does not trust localStorage-style identity: an unsigned cookie with a user id is rejected`
  - `tests/auth.test.ts` → `stores only a hash of the session token`
  - `tests/auth.test.ts` → `expires sessions after the absolute lifetime`
  - `tests/auth.test.ts` → `expires sessions after the idle timeout`
  - `tests/auth.test.ts` → `revokes the server-side session on logout (a captured cookie stops working)`
  - `tests/auth.test.ts` → `revokes sessions when an admin blocks the account`
  - `tests/auth.test.ts` → `blocks cross-site state-changing requests (CSRF)`
- **Test Result:** **PASS** (8/8 tests passing).
- **Remaining Risk:** None for same-site/browser flows. If cross-origin API consumers are ever introduced in the future, explicit `APP_ORIGINS` allowlisting must be configured.

---

## Finding AUTH-05 — Insecure Password Reset & Token Leak in API Response

- **Original Vulnerability:** `POST /api/auth/forgot-password` generated predictable tokens (`Date.now()` + `Math.random()`), stored them in plaintext, leaked the raw reset token directly in the HTTP JSON response, varied response messages based on email existence, and had no `/api/auth/reset-password` consumption endpoint.
- **Root Cause:** Demo reset implementation returned the token directly to the caller instead of dispatching via an out-of-band mailer and hashing at rest.
- **Files Modified:**
  - [app/api/auth/forgot-password/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/auth/forgot-password/route.ts)
  - [app/api/auth/reset-password/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/auth/reset-password/route.ts)
  - [app/reset-password/page.tsx](file:///d:/mithila-milan/Mithila-Milan-8k/app/reset-password/page.tsx)
  - [lib/mailer.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/mailer.ts)
- **Implemented Fix:**
  1. Generated 256-bit CSPRNG tokens (`crypto.randomBytes(32).toString('base64url')`), stored only their SHA-256 hash (`resetPasswordToken`) with a 30-minute expiry (`resetPasswordExpires`), and never included the token in HTTP responses.
  2. Standardized `POST /api/auth/forgot-password` to return an identical response whether or not the email exists, eliminating account enumeration.
  3. Built `POST /api/auth/reset-password` to atomically consume the hashed token (`findOneAndUpdate`), enforce password strength, hash the new password with Argon2id, clear `mustResetPassword`, and revoke all existing sessions for that user.
- **Test Performed:**
  - `tests/auth.test.ts` → `never returns the reset token and answers identically for unknown emails`
  - `tests/auth.test.ts` → `resets with a single-use token, revokes old sessions and stores a hashed token`
  - `tests/auth.test.ts` → `rejects expired reset tokens`
- **Test Result:** **PASS** (3/3 tests passing).
- **Remaining Risk:** `lib/mailer.ts` is an out-of-band transactional email boundary; a production SMTP/SES/Resend provider must be wired into `sendPasswordResetEmail()` before production launch.

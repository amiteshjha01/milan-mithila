# Authentication & Security Audit — Mithila Milan

**Audit Date:** 2026-11-18  
**Scope:** Auth flows, session management, authorization, admin access control, privacy, rate limiting, and API/build security.

---

## Executive Summary

**Authentication, session management, and authorization are currently non-functional as security boundaries.** The application relies on unsigned `localStorage` JSON for client sessions, stores plaintext passwords, skips password verification on regular user login, accepts unverified mock Google logins, and exposes unauthenticated admin and user-data APIs.

---

## 1. Critical Vulnerabilities

1. **Credentials Login Skips Password Verification (`app/api/auth/login/route.ts`):**
   - `loginSchema` marks `password` as `optional()`. For non-admin `CREDENTIALS` logins, the handler never compares `password` against `user.passwordHash`. Any user account can be accessed with only an email address.
2. **Unverified Mock Google OAuth (`app/api/auth/login/route.ts`, `components/auth/google-auth-modal.tsx`):**
   - When `provider: 'GOOGLE'` is sent, the server trusts the client-supplied `email` without verifying any Google ID token or OAuth code. Entering an existing user's (or admin's) email in `GoogleAuthModal` returns that account's full session object.
3. **Client-Side Only Session Management (`lib/auth-context.tsx`):**
   - Sessions are stored as raw JSON in `localStorage` (`mithila_milan_auth_user`) with no `HttpOnly` cookies, JWTs, signatures, or expiration. Modifying `localStorage` (`role: 'ADMIN'` or another `id`) bypasses all frontend gates. No `middleware.ts` exists.
4. **Unauthenticated Admin APIs (`app/api/admin/stats/route.ts`, `app/api/admin/users/route.ts`):**
   - Neither endpoint verifies caller authentication or `ADMIN` role. Any unauthenticated caller can dump all user emails, roles, and VIP consultation leads (`GET /api/admin/stats`) or verify, block, or permanently delete any user/profile (`POST /api/admin/users`).
5. **Widespread IDOR Across User-Owned Endpoints:**
   - `GET/POST /api/profile/me`, `GET/POST /api/settings`, `GET/POST /api/messages`, `GET/POST /api/interests`, and `GET/POST /api/shortlist` all trust client-supplied `userId`, `senderId`, or `email` without verifying caller identity.
6. **Plaintext Password Storage (`app/api/auth/signup/route.ts`, `login/route.ts`, `admin/auth/route.ts`):**
   - `passwordHash` stores raw plaintext passwords (`d.password`). No hashing library (`bcrypt`, `argon2`, or `crypto.scrypt`) is used.
7. **Hardcoded Admin Credentials & Auto-Escalation (`app/api/admin/auth/route.ts`, `app/api/auth/login/route.ts`, `app/admin/page.tsx`):**
   - Hardcoded fallback passwords (`MithilaAdmin@2026`, `Admin1234`) and emails (`admin@mithilamilan.com`, `admin@mithila.com`, `admin`) are accepted on the server, auto-promote matching users to `'ADMIN'`, and are prefilled/displayed in plaintext in `app/admin/page.tsx`.

---

## 2. High-Severity Findings

1. **Password Reset Token Leaked in API Response & Email Enumeration (`app/api/auth/forgot-password/route.ts`):**
   - Returns the generated `token` directly in the HTTP JSON response and varies response shape/message depending on whether the email exists. No reset-consumption endpoint exists.
2. **Profile Privacy & Visibility Controls Bypassed (`app/api/profiles/route.ts`, `app/api/profiles/[profileId]/route.ts`):**
   - `GET /api/profiles/[profileId]` does not exclude `PAUSED`, `CONNECTIONS_ONLY`, `BLOCKED`, or `MM-ADMIN-01` profiles. Both routes ignore `culturalVisibility` (`PRIVATE`/`CONNECTIONS`), `photoVisibility`, and `photos[].visibility`, returning sensitive lineage and photo URLs unauthenticated.
3. **ReDoS & Regex Injection (`app/api/profiles/route.ts`):**
   - User-supplied `city`, `profession`, `nativeDistrict`, `gotra`, and `q` are passed unescaped into MongoDB `$regex` queries.
4. **Fail-Open Auth on DB Outage (`app/api/auth/login/route.ts`, `signup/route.ts`, `app/login/page.tsx`, `components/auth/auth-modal.tsx`):**
   - Both API routes and UI forms fall back to returning/setting logged-in demo user sessions when MongoDB is unavailable or requests fail.
5. **Zero Rate Limiting / Brute-Force Protection:**
   - No rate limiting, account lockout, or bot protection on login, admin auth, signup, password reset, consultation, or messaging endpoints.

---

## 3. Medium & Low-Severity Findings

- **Next.js Security Advisory (`next@16.4.3`):** `npx next build` flagged a known security vulnerability (`SecurityFatalError` on first run) and recommended upgrading Next.js.
- **Missing Security Headers & Build Type Safety (`next.config.mjs`):** No CSP, HSTS, `X-Frame-Options`, or `X-Content-Type-Options` headers; `typescript.ignoreBuildErrors: true` is enabled.
- **Weak Reset Token (`app/api/auth/forgot-password/route.ts`):** Uses `Date.now()` + `Math.random()` instead of `crypto.randomBytes(32)`.
- **Unvalidated Attachment URLs (`app/api/messages/route.ts`, `components/messages/messages-app.tsx`):** `attachment` uses `z.any()` and is opened via `window.open(msg.attachment.url, '_blank')` without protocol validation (`javascript:` risk) or `noopener,noreferrer`.
- **Verbose Internal Error Messages:** 15 API routes return raw `error.message` strings in `500`/`503` responses.
- **Auto-Verification & Base64 Photos:** `signup` and `login` force `isVerified: true` without OTP/email verification; `ProfileApp` stores raw base64 image Data URLs in MongoDB without EXIF stripping or size/type validation.
- **Hardcoded Infrastructure Strings (`app/admin/page.tsx`):** Exposes MongoDB cluster host (`cluster0.u2aluwf.mongodb.net`) and DB name in client JSX.
- **Environment Hygiene:** `.gitignore` ignores `.env*`; `.env.local` contains `MONGODB_URI`, `MONGODB_DB`, `NODE_ENV` (no `SEED_SECRET` or session/signing secrets configured).

---

## 4. Security Feature Classification

| Control / Feature | Classification | Notes |
|---|---|---|
| Signup / Login / Password Reset | **Partially implemented** | Routes exist, but no password hashing, no password check on login, no reset endpoint, token leaked in JSON. |
| Session Management & Middleware | **Not implemented** | `localStorage` only; no `HttpOnly` cookies, JWT/session store, or `middleware.ts`. |
| Role-Based & Admin Access Control | **Not implemented** | Admin APIs are unauthenticated; client gate only. |
| Profile Privacy & Visibility Enforcement | **Not implemented** | Privacy fields exist in schema/UI, but `/api/profiles` and `/api/profiles/[profileId]` ignore them. |
| Rate Limiting & Security Headers | **Not implemented** | Absent across all routes and `next.config.mjs`. |

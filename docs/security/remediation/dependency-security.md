# Phase 5 — Dependency & Build Security Remediation

**Date:** 2026-11-18  
**Branches / Worktrees:**
- Main remediation workspace: `d:\mithila-milan\Mithila-Milan-8k` (branch `security-remediation`)
- Dedicated Next.js upgrade worktree: `d:\mithila-milan\Mithila-Milan-8k-nextjs-security` (branch `security/nextjs-upgrade`)

---

## Finding DEP-01 — Next.js Security Advisories (`next@16.4.3` → `next@16.4.6`)

- **Original Vulnerability:** The repository depended on `next@16.4.3`, which triggered a Next.js security advisory warning during build and was affected by two published GitHub Security Advisories:
  1. `GHSA-mfr8-8qww-v76h` (Moderate, `CWE-362`, affected range `>=16.3.0 <=16.4.4`): *Next.js: Information disclosure across root params when a `'use cache'` function is called through `unstable_cache()`*.
  2. `GHSA-vc7v-qv4w-wrv8` (Moderate, `CWE-362`, affected range `>=16.2.0 <=16.4.4`): *Next.js: Cache leak across root param values in nested `'use cache'` functions via delayed inner stream metadata*.
- **Root Cause:** `package.json` pinned `"next": "16.4.3"` prior to the `16.4.6` patch release.
- **Files Modified:**
  - [package.json](file:///d:/mithila-milan/Mithila-Milan-8k/package.json)
  - [package-lock.json](file:///d:/mithila-milan/Mithila-Milan-8k/package-lock.json)
- **Implemented Fix:**
  1. Created a dedicated Git worktree at `d:\mithila-milan\Mithila-Milan-8k-nextjs-security` on branch `security/nextjs-upgrade` while preserving all uncommitted work in the main workspace and in `d:\mithila-milan\backup-pre-security-20261118`.
  2. Upgraded `next` to the exact patched version `16.4.6` (`@next/env@16.4.6`, `@next/swc-win32-x64-msvc@16.4.6`), the latest patch release in the `16.4.x` line, without introducing unnecessary major dependency upgrades.
  3. Verified `npm audit` no longer reports any advisory against `next`.
  4. Added Direct Runtime Security Dependencies required for Phase 1:
     - `@node-rs/argon2` (`^2.0.2`) — native Rust Argon2id password hashing.
     - `google-auth-library` (`^10.6.2`) — cryptographic verification of Google OAuth ID tokens.
- **Test Performed:**
  - Verified installed version `(Get-Content node_modules/next/package.json | ConvertFrom-Json).version` equals `16.4.6`.
  - Verified `npm audit --json` shows `0` vulnerabilities in `next`.
  - Verified TypeScript check (`tsc --noEmit`), full Vitest suite (47/47 tests), and production build (`next build`).
- **Test Result:** **PASS**.
- **Remaining Risk:**
  - `npm audit` reports transitive advisories in CLI/development tooling (`shadcn` CLI pulling in `@dotenvx/dotenvx`, `fast-glob`, `picomatch`, `ts-morph`, `minimatch`; `prisma` CLI pulling in `@prisma/config` / `deepmerge-ts`; `vitest` pulling in `vite` / `tinyglobby` / `picomatch`). None of these packages are imported by any runtime application page or API route, and remediating them in `npm audit` would require SemVer-major downgrades/upgrades (`shadcn@2.10.0`, `prisma@7.10.1`, `vitest@3.1.4`), which were intentionally avoided per the Phase 5 rule *"Do not introduce unnecessary dependency upgrades"*. As a post-freeze housekeeping item, `shadcn` can be moved to `devDependencies` or invoked via `npx` rather than kept in `dependencies`.

---

## Finding DEP-02 — Build Type Safety Bypass (`typescript.ignoreBuildErrors: true`) & Missing HTTP Security Headers

- **Original Vulnerability:** `next.config.mjs` set `typescript: { ignoreBuildErrors: true }`, allowing TypeScript errors to be silently ignored during `next build`, and configured no HTTP security headers (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, or API `Cache-Control`).
- **Root Cause:** Permissive starter configuration in `next.config.mjs`.
- **Files Modified:**
  - [next.config.mjs](file:///d:/mithila-milan/Mithila-Milan-8k/next.config.mjs)
- **Implemented Fix:**
  1. Removed `typescript: { ignoreBuildErrors: true }` from `next.config.mjs` so any TypeScript type error fails the production build.
  2. Configured global HTTP security headers in `next.config.mjs`:
     - `Content-Security-Policy` restricting `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`, and allowlisting `https://accounts.google.com` for Google Identity Services.
     - `X-Frame-Options: DENY`
     - `X-Content-Type-Options: nosniff`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
     - `Strict-Transport-Security: max-age=63072000; includeSubDomains`
     - `Cache-Control: no-store` on `/api/(.*)`
- **Test Performed:**
  - Executed `tsc --noEmit` and `next build` with `ignoreBuildErrors` removed.
- **Test Result:** **PASS** (zero TypeScript errors; production build succeeds with strict type checking enabled).
- **Remaining Risk:** Next.js App Router requires `'unsafe-inline'` in `script-src` and `style-src` unless per-request CSP nonces are wired via dynamic rendering middleware; migrating to nonce-based CSP is documented as a future hardening enhancement.

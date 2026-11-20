# Phase 4 — Profile Privacy Remediation

**Date:** 2026-11-18  
**Branch:** `security-remediation`  
**Scope:** Server-side enforcement of profile visibility (`COMMUNITY`, `CONNECTIONS_ONLY`, `PAUSED`), cultural/Gotra/Mool visibility, family background visibility, photograph visibility, contact information protection, and regex-injection/ReDoS protection.

---

## Finding PRIV-01 — Profile Visibility Bypassed (`PAUSED`, `CONNECTIONS_ONLY`, Blocked & System Profiles)

- **Original Vulnerability:** `GET /api/profiles/[profileId]` returned full profile details for `PAUSED` profiles, `CONNECTIONS_ONLY` profiles (to unconnected viewers), blocked/paused accounts, and the system admin profile (`MM-ADMIN-01`). Furthermore, `POST /api/profile/me` previously overwrote `profile.visibility` with the family-section label (`'Members only'`), corrupting profile-level visibility.
- **Root Cause:** `GET /api/profiles/[profileId]` performed a direct `MithilaProfile.findOne` without checking `visibility`, owner `accountStatus`, or mutual connection status (`MongoInterest` with `status: 'ACCEPTED'`).
- **Files Modified:**
  - [lib/security/privacy.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/privacy.ts)
  - [lib/mongodb-models.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/mongodb-models.ts)
  - [app/api/profiles/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/profiles/route.ts)
  - [app/api/profiles/[profileId]/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/profiles/%5BprofileId%5D/route.ts)
  - [app/api/profile/me/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/profile/me/route.ts)
- **Implemented Fix:**
  1. Added a dedicated `familyVisibility` field (`MEMBERS`, `CONNECTIONS`, `PRIVATE`) to `profileSchema` in `lib/mongodb-models.ts` and decoupled it from profile-level `visibility` (`COMMUNITY`, `CONNECTIONS_ONLY`, `PAUSED`) in `app/api/profile/me/route.ts`.
  2. Implemented `canViewProfile(profile, relation, ownerActive)` in `lib/security/privacy.ts`:
     - Rejects system/admin profiles (`MM-ADMIN*`, `Platform Administrator`) for non-self viewers.
     - Rejects profiles whose owner `accountStatus` is not `ACTIVE` (`BLOCKED`, `PENDING_REVIEW`, `PAUSED`).
     - Rejects `PAUSED` profiles for all viewers except `SELF` and `ADMIN`.
     - Rejects `CONNECTIONS_ONLY` profiles unless `relation` is `SELF`, `ADMIN`, or `CONNECTION` (an `ACCEPTED` mutual interest exists between viewer and profile owner).
     - Fails closed (`PAUSED`) on any unrecognized visibility value.
  3. Enforced `canViewProfile()` in `/api/profiles`, `/api/profiles/[profileId]`, `/api/interests`, and `/api/shortlist`.
- **Test Performed:**
  - `tests/privacy.test.ts` → `enforces PAUSED and CONNECTIONS_ONLY profile visibility in list and detail APIs`
- **Test Result:** **PASS** (1/1 test passing).
- **Remaining Risk:** None identified.

---

## Finding PRIV-02 — Cultural/Lineage (`gotra`, `mool`, `kul`, `pravara`, `ancestralVillage`) & Family Information Exposed Regardless of Privacy Settings

- **Original Vulnerability:** Both `/api/profiles` and `/api/profiles/[profileId]` unconditionally returned `gotra`, `mool`, `ancestralVillage`, `kul`, `pravara`, `subCommunity`, `familyType`, `familyValues`, `familyLocation`, and `familySummary` even when `culturalVisibility` or `familyVisibility` was set to `CONNECTIONS` or `PRIVATE`. In addition, `/api/profiles?gotra=...` and `/api/profiles?q=...` matched against restricted `gotra` fields, acting as a search oracle.
- **Root Cause:** API serializers mapped raw Mongoose document properties directly into the JSON response without checking the viewer's relationship to the profile owner.
- **Files Modified:**
  - [lib/security/privacy.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/privacy.ts)
  - [app/api/profiles/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/profiles/route.ts)
  - [app/api/profiles/[profileId]/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/profiles/%5BprofileId%5D/route.ts)
- **Implemented Fix:**
  1. Built whitelist serializers `serializeProfileCard()` and `serializeProfileDetail()` in `lib/security/privacy.ts` driven by `fieldAccess(profile, relation)`.
  2. When `access.cultural` is `false` (e.g., `culturalVisibility` is `PRIVATE`, or `CONNECTIONS` for a non-connected member):
     - Redacts `gotra`, `mool`, `ancestralVillage`, `kul`, and `pravara` to `'Hidden by member'` (`HIDDEN_TEXT`).
     - Omits `subCommunity`, `panjiAvailability`, `gotraPreference`, and `moolPreference` from the response JSON entirely.
  3. When `access.family` is `false` (`familyVisibility` is `PRIVATE`, or `CONNECTIONS` for a non-connected member):
     - Redacts `familyType`, `familyValues`, `familyLocation`, `familyBackground`, and `familySummary` to `'Hidden by member'`.
     - Omits `fatherOccupation`, `motherOccupation`, and `siblings` from the response JSON entirely.
  4. Prevented search-oracle leakage in `GET /api/profiles`: `gotra` filters and `q` text searches on `gotra` only match profiles where `culturalVisibility` is `MEMBERS`.
  5. Contact fields (`email`, `phone`) and private documents are excluded by the whitelist serializer and are never present in `/api/profiles` or `/api/profiles/[profileId]` responses.
- **Test Performed:**
  - `tests/privacy.test.ts` → `redacts Gotra, Mool, cultural details, and family details when restricted, and blocks search-oracle leaks`
  - `tests/privacy.test.ts` → `never exposes contact info (email/phone) on profile endpoints and escapes regex metacharacters`
- **Test Result:** **PASS** (2/2 tests passing).
- **Remaining Risk:** None identified.

---

## Finding PRIV-03 — Private Photographs Exposed in API Responses

- **Original Vulnerability:** `GET /api/profiles` and `GET /api/profiles/[profileId]` returned raw `photos[].url` values regardless of profile-level `photoVisibility` (`CONNECTIONS`) or per-photo `photos[].visibility` (`MUTUAL_CONSENT`).
- **Root Cause:** Photo URLs were mapped directly (`p.photos.map(ph => ph.url)`) without checking photo visibility settings.
- **Files Modified:**
  - [lib/security/privacy.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/privacy.ts)
- **Implemented Fix:**
  1. Implemented `visiblePhotos(profile, relation)` and `photoUrlsFor(profile, relation)` in `lib/security/privacy.ts`.
  2. If `profile.photoVisibility === 'CONNECTIONS'` and the viewer is not `SELF`, `ADMIN`, or a mutual `CONNECTION`, all member photo URLs are withheld and replaced with `['/images/placeholder-user.jpg']`.
  3. For per-photo visibility, any photo marked `MUTUAL_CONSENT` (or an unknown visibility enum) is stripped from the response unless `relation` is `SELF`, `ADMIN`, or `CONNECTION`.
- **Test Performed:**
  - `tests/privacy.test.ts` → `prevents unauthorized users from accessing private/connection-only photographs`
- **Test Result:** **PASS** (1/1 test passing).
- **Remaining Risk:** Base64 data URLs or external CDN URLs returned to authorized connections are visible to those connected members by design; when S3/CloudFront object storage is introduced in a future phase, signed short-lived URLs can be layered on top of `photoUrlsFor()`.

---

## Finding PRIV-04 — Unescaped Regular Expression Injection / ReDoS in `/api/profiles`

- **Original Vulnerability:** `GET /api/profiles` passed user-supplied `city`, `profession`, `nativeDistrict`, `gotra`, and `q` directly into MongoDB `$regex` operators without escaping regex metacharacters or bounding input length.
- **Root Cause:** Raw query strings were interpolated into `{ $regex: query.q, $options: 'i' }`.
- **Files Modified:**
  - [lib/security/guard.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/guard.ts)
  - [app/api/profiles/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/profiles/route.ts)
- **Implemented Fix:**
  1. Bounded all search query parameters with Zod (`max(60)` / `max(80)`).
  2. Escaped all user input with `escapeRegex()` (`input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) before constructing `$regex` queries.
- **Test Performed:**
  - `tests/privacy.test.ts` → `never exposes contact info (email/phone) on profile endpoints and escapes regex metacharacters`
- **Test Result:** **PASS** (1/1 test passing).
- **Remaining Risk:** None identified.

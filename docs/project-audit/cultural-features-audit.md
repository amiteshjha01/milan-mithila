# Cultural Features Audit — Mithila Milan

**Audit Date:** 2026-11-18  
**Scope:** Gotra & Mool handling, Panji Siddhanta API, Kundali Matching, Muhurat Calendar, community coverage, and cultural verification claims.

> **Important Note:** This audit evaluates implementation accuracy and claim-vs-reality alignment. Unvalidated cultural, genealogical, or astrological rules in the codebase must **not** be treated as authoritative.

---

## 1. Gotra & Mool Handling

- **Database Models (`lib/mongodb-models.ts`):**
  - `MongoProfile` includes `community`, `subCommunity`, `gotra`, `mool`, `ancestralVillage`, `kul`, `pravara`, `kuldevi`, `panjiAvailability`, `lineageNotes`, `culturalVisibility`, and `partnerPreferences` (`gotraPreference`, `moolPreference`), with a compound `{ gotra: 1, mool: 1 }` index.
  - `prisma/schema.prisma` only has `gotra`, `mool`, `familyOrigin`.
- **Silent Defaults & Schema Mismatches:**
  - `app/api/signup/route.ts` and `app/api/profile/me/route.ts` (`GET`) silently default missing profiles to `gotra: 'Kashyapa'` and `mool: 'Sakri'`.
  - `app/api/profiles/route.ts` and `[profileId]/route.ts` hardcode `kul: 'Kashyap Kul'` and `pravara: 'Traya Pravara'` when absent.
  - `app/api/profile/me` (`POST`) sends `maternalLineage` and `familyVillage`, which do not exist on `profileSchema` and are dropped by Mongoose; `ProfileApp` writes `'Members only'`/`'Only me'` to `culturalVisibility` while the schema enum expects `'MEMBERS' | 'CONNECTIONS' | 'PRIVATE'`.
- **Broken Discovery Filtering:**
  - `components/discover/discover-app.tsx` ignores `gotra`, `location`, and `nativeDistrict` URL query params passed from `Homepage`, and its client-side `matchesQuery` excludes `gotra`, `mool`, and `community` (breaking `/discover?q=Kashyapa` links from `/culture`).

---

## 2. Panji Siddhanta API & Checker

- **Backend (`app/api/panji/siddhanta/route.ts`):**
  - Stateless `POST` endpoint performing **only 3 case-insensitive exact string comparisons**:
    1. `brideGotra === groomGotra` -> `INELIGIBLE_SAGOTRA`
    2. `brideMool === groomMool` -> `REQUIRES_PANJIKAR_REVIEW`
    3. `brideMaternalMool === groomMaternalMool` -> `REQUIRES_PANJIKAR_REVIEW`
    4. Otherwise -> `APPROVED`
  - **Gaps:** No Panji scroll database, no 7-paternal / 5-maternal Sapinda traversal, no cross-checking paternal vs. maternal Mool, no Gotra–Mool consistency validation, and no transliteration normalization (`'Kashyapa'` vs `'Kashyapa (कश्यप)'` fails to match). Generates an ephemeral `MM-SIDDHANTA-*` certificate number without DB persistence.
- **UI (`components/kundali/panji-siddhanta-checker.tsx`):**
  - Renders an *"Interactive 7-Generation Sapinda Threshold Checker"* consisting of 7 **hardcoded static cards** that always display `'Clear ✓'` regardless of input or API response.
  - Verdict heading bug: treats `INELIGIBLE_SAGOTRA` under the same `else` branch as `REQUIRES_PANJIKAR_REVIEW`.

---

## 3. Kundali Matching & Muhurat Calendar

- **Ashtakoot Engine (`components/kundali/kundali-matching-app.tsx`):**
  - Purely client-side (no backend API).
  - `deriveAstroFromDob` uses a **toy linear modulo formula** on `dayOfYear` and `hourFraction` to derive Nakshatra, Rashi, Charan, and Manglik status—completely ignoring **birth year**, **place of birth**, **ayanamsha**, and **planetary ephemeris**.
  - Ashtakoot scoring omits standard Vashya 5×5 matrix rules, some Yoni unfriendly pairs, and Rakshasa-bride/Deva-groom Gana handling.
- **Hardcoded Profile Guna Scores:**
  - `lib/mock-profile-details.ts` and `components/profiles/profile-detail-app.tsx` display hardcoded `31/36` Guna Milan data on every MongoDB profile (including an impossible `Nadi: 4/8` in `sampleGunaData`, since Nadi is strictly `0` or `8`), alongside hardcoded `"Sagotra Avoidance: Verified Non-Sagotra"`.
  - `components/dashboard/dashboard-app.tsx` displays `{profile.gunaMilan?.score || 32}/36 Gunas` without comparing against the logged-in user.
- **Muhurat Calendar (`components/kundali/mithila-muhurat-calendar.tsx`):**
  - Displays 8 hardcoded dates (Nov 2026–Apr 2027) labeled `"Mithila Vishwavidyalaya Panchang 2026–2027"` / `"Mithila Panchang Certified"`; shortlisting is local React state only.

---

## 4. Community-Specific Coverage

- **Supported Options:** `Maithil Brahmin`, `Maithil Kayastha`, `Maithil community`, `Prefer to self-describe`, `Prefer not to disclose`.
- **Gaps:** **Karn / Karna Kayastha** and other Mithila communities (e.g., Bhumihar, Rajput, Yadav) are absent from community dropdowns. `profile-detail-app.tsx` hardcodes fallback `subCommunity: 'Shrotriya / Bika'`.
- **Biodata Mool List (`components/biodata/biodata-generator.tsx`):** Mixes Mools with modern cities (`Darbhanga`, `Madhubani`).

---

## 5. Cultural Verification Claims vs. Reality

| Claim in UI / Marketing | Actual Implementation | Classification |
|---|---|---|
| *"पंजी सिद्धान्त पत्र (Digital Siddhanta Clearance)"* / *"Saurath Desk Protocol"* / *"Both branches clear Sapinda thresholds"* | 3 exact string comparisons (`gotra`, `mool`, `maternalMool`); 7-generation Sapinda cards are hardcoded `'Clear ✓'`. Contradicts `/culture` disclaimer that the platform does not issue Panji certificates. | **Partially implemented** (unvalidated rules) |
| *"100% Verified Maithil Seekers"*, *"Gotra & Mool verified"*, *"Identity & Lineage Verified"*, *"Scan to Verify Profile"* QR | `signup` and `login` auto-set `verified: true` with zero OTP, ID, or Panji verification; admin toggle is a manual boolean; Biodata QR is a static decorative SVG. | **Not implemented** (misleading claim) |
| *"Accurate 36-point Guna compatibility rooted in traditional Maithil Jyotish"* & *"Mithila Panchang Certified"* | Toy DOB-modulo math ignoring birth year/ephemeris; profile cards show hardcoded `31/36` / `32/36`; Muhurat list is 8 static objects. | **Partially implemented** (unvalidated rules) |
| *"Cultural fields never used for automated cold rejection"* & granular cultural privacy | `/api/profiles` and `[profileId]` ignore `culturalVisibility` and expose `gotra`/`mool`/`ancestralVillage` publicly. | **Not implemented** |

# Phase 3 — IDOR Vulnerability Remediation

**Date:** 2026-11-18  
**Branch:** `security-remediation`  
**Scope:** Elimination of Insecure Direct Object References (IDOR) across `/api/profile/me`, `/api/settings`, `/api/interests`, `/api/messages`, `/api/shortlist`, `/api/profiles`, and `/api/profiles/[profileId]`.

---

## Finding IDOR-01 — `/api/profile/me` Trusts Client-Supplied `userId` and `email`

- **Original Vulnerability:** `GET /api/profile/me` accepted `?userId=` and `?email=` query parameters and returned that user's full profile and account metadata without authentication. `POST /api/profile/me` accepted `userId` in the JSON body and overwrote the target user's display name and profile document.
- **Root Cause:** No server-side session lookup; caller identity was read directly from URL query parameters and request body fields.
- **Files Modified:**
  - [app/api/profile/me/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/profile/me/route.ts)
  - [lib/security/guard.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/guard.ts)
  - [lib/security/images.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/images.ts)
- **Implemented Fix:**
  1. Both `GET` and `POST /api/profile/me` now call `authenticate(request)` and derive the user ID exclusively from `result.auth.user.id`.
  2. Any `userId` or `email` supplied in the query string or JSON body is ignored and stripped by a strict Zod schema (`bodySchema`).
  3. Protected fields (`role`, `verified`, `verificationLabel`, `profileCode`, `userId`, `visibility`) cannot be mass-assigned through the profile form.
  4. Added strict image validation (`isSafeImageUrl`) for uploaded photographs (only `/images/...`, `https://...`, or base64 Data URLs with verified PNG/JPEG/WebP magic bytes up to 2 MB).
- **Test Performed:**
  - `tests/idor.test.ts` → `rejects unauthenticated access to every user-owned endpoint with 401`
  - `tests/idor.test.ts` → `/api/profile/me: User A cannot read or modify User B profile by supplying userId or email`
- **Test Result:** **PASS** (2/2 tests passing).
- **Remaining Risk:** None identified.

---

## Finding IDOR-02 — `/api/settings` Allows Reading and Modifying Any User's Privacy Settings

- **Original Vulnerability:** `GET /api/settings?userId=<victim>` returned any user's privacy settings, and `POST /api/settings` with `{ userId: "<victim>", visibility: "COMMUNITY", culturalVisibility: "MEMBERS" }` allowed an attacker to downgrade another member's profile and lineage privacy settings.
- **Root Cause:** Endpoint trusted client-supplied `userId` (ObjectId or email) with no authentication check.
- **Files Modified:**
  - [app/api/settings/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/settings/route.ts)
- **Implemented Fix:**
  1. Required `authenticate(request)` on both `GET` and `POST /api/settings`.
  2. Removed `userId` from `settingsSchema` and queried/updated `MongoProfile` exclusively by `{ userId: result.auth.user.id }`.
  3. Validated `visibility` (`COMMUNITY`, `CONNECTIONS_ONLY`, `PAUSED`), `culturalVisibility` (`MEMBERS`, `CONNECTIONS`, `PRIVATE`), and `photoVisibility` (`MEMBERS`, `CONNECTIONS`) against strict enum maps.
- **Test Performed:**
  - `tests/idor.test.ts` → `/api/settings: User A cannot read or update User B privacy settings`
- **Test Result:** **PASS** (1/1 test passing).
- **Remaining Risk:** None identified.

---

## Finding IDOR-03 — `/api/interests` Allows Spoofing `senderId` and Accepting/Declining Others' Interests

- **Original Vulnerability:**
  - `GET /api/interests?userId=<victim>` returned all sent and received interests for `<victim>`.
  - `POST /api/interests` with `action: 'TOGGLE'` trusted client-supplied `senderId`, allowing an attacker to send or withdraw interests on behalf of another member.
  - `POST /api/interests` with `action: 'ACCEPT'` or `'DECLINE'` accepted any `interestId` without checking whether the caller was the `receiverId`, allowing the sender (or a third party) to force-accept an interest and unlock a conversation.
- **Root Cause:** Missing session authentication and missing participant role checks (`senderId` vs `receiverId`) on state transitions.
- **Files Modified:**
  - [app/api/interests/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/interests/route.ts)
- **Implemented Fix:**
  1. Required `authenticate(request)` on `GET` and `POST /api/interests`.
  2. Resolved the caller's own profile code via `getViewer(result.auth)` and ignored any client-supplied `userId` or `senderId`.
  3. Enforced strict state-transition ownership:
     - `ACCEPT` and `DECLINE`: allowed **only** when the authenticated viewer is the `receiverId` and `interest.status === 'PENDING'`; otherwise returns `403` (or `409`).
     - `WITHDRAW`: allowed **only** when the authenticated viewer is the `senderId` and `interest.status === 'PENDING'`.
     - `TOGGLE`: always uses `viewer.profileCode` as `senderId`, blocks self-interest (`400`), and verifies the target profile is visible to the viewer (`404` if paused/blocked/unconnected `CONNECTIONS_ONLY`).
- **Test Performed:**
  - `tests/idor.test.ts` → `/api/interests: User C cannot accept/decline User B received interest or withdraw User A sent interest`
- **Test Result:** **PASS** (1/1 test passing).
- **Remaining Risk:** None identified.

---

## Finding IDOR-04 — `/api/messages` Allows Reading Any Conversation and Spoofing `senderId`

- **Original Vulnerability:**
  - `GET /api/messages?userId=<A>&targetUserId=<B>` returned the full private message history between `A` and `B` to any unauthenticated caller.
  - `POST /api/messages` trusted `senderId` in the JSON body, allowed messaging any member without an accepted mutual interest, and stored unvalidated `attachment.url` values (enabling `javascript:` XSS when opened via `window.open`).
- **Root Cause:** No session authentication, no conversation-participant check, no mutual-interest gate, and `z.any()` schema for attachments.
- **Files Modified:**
  - [app/api/messages/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/messages/route.ts)
  - [lib/security/images.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/images.ts)
  - [components/messages/messages-app.tsx](file:///d:/mithila-milan/Mithila-Milan-8k/components/messages/messages-app.tsx)
- **Implemented Fix:**
  1. Required `authenticate(request)` on `GET` and `POST /api/messages`.
  2. Scoped `GET /api/messages` queries with `{ $and: [{ participants: { $in: viewer.keys } }, ...] }` so a user can never query a conversation they are not a participant in.
  3. Derived the message sender exclusively from `viewer.profileCode` (ignoring any client-supplied `senderId`).
  4. Verified an `ACCEPTED` `MongoInterest` exists between the sender and `recipientId` before allowing any message to be sent (`403` otherwise) and blocked sending to `BLOCKED` conversations.
  5. Replaced `z.any()` on `attachment` with a strict schema and validated `attachment.url` via `isSafeLinkUrl()` (only `https:` or safe root-relative paths), plus hardened `window.open` in `components/messages/messages-app.tsx` with protocol validation and `'noopener,noreferrer'`.
- **Test Performed:**
  - `tests/idor.test.ts` → `/api/messages: enforces mutual-interest requirement and blocks third-party access or sender spoofing`
- **Test Result:** **PASS** (1/1 test passing).
- **Remaining Risk:** None identified.

---

## Finding IDOR-05 — `/api/shortlist` Allows Reading and Modifying Any User's Shortlist

- **Original Vulnerability:** `GET /api/shortlist?userId=<victim>` and `POST /api/shortlist` (`{ userId: "<victim>", profileId: "..." }`) trusted the client-supplied `userId` (defaulting to `'DEMO_CURRENT_USER'`).
- **Root Cause:** No session authentication; `userId` was read from query/body parameters.
- **Files Modified:**
  - [app/api/shortlist/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/shortlist/route.ts)
- **Implemented Fix:**
  1. Required `authenticate(request)` on `GET` and `POST /api/shortlist`.
  2. Removed `userId` from the request schema and bound all reads, inserts, and deletes to `viewer.keys` / `viewer.userId`.
  3. Verified that a shortlisted target profile exists and is visible to the viewer before adding.
- **Test Performed:**
  - `tests/idor.test.ts` → `/api/shortlist: User A cannot read or mutate User B shortlist`
- **Test Result:** **PASS** (1/1 test passing).
- **Remaining Risk:** None identified.

---

## Finding IDOR-06 — `/api/profiles` and `/api/profiles/[profileId]` Unauthenticated Access & Identity Spoofing

- **Original Vulnerability:** Both `/api/profiles` and `/api/profiles/[profileId]` were publicly accessible without authentication, trusted `currentUserId` / `currentUserGender` query parameters, and allowed raw MongoDB `_id` enumeration on `/api/profiles/[profileId]`.
- **Root Cause:** Missing session authentication and reliance on client-supplied viewer parameters.
- **Files Modified:**
  - [app/api/profiles/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/profiles/route.ts)
  - [app/api/profiles/[profileId]/route.ts](file:///d:/mithila-milan/Mithila-Milan-8k/app/api/profiles/%5BprofileId%5D/route.ts)
  - [lib/security/privacy.ts](file:///d:/mithila-milan/Mithila-Milan-8k/lib/security/privacy.ts)
- **Implemented Fix:**
  1. Required `authenticate(request)` on both `GET /api/profiles` and `GET /api/profiles/[profileId]`.
  2. Derived viewer identity, gender, shortlist flags, and connection status exclusively from the server-side session (`getViewer(result.auth)`).
  3. Restricted `/api/profiles/[profileId]` to public `MM-...` profile codes and returned `404` whenever `canViewProfile()` denies access.
- **Test Performed:**
  - `tests/idor.test.ts` → `rejects unauthenticated access to every user-owned endpoint with 401`
  - `tests/privacy.test.ts` → `enforces PAUSED and CONNECTIONS_ONLY profile visibility in list and detail APIs`
- **Test Result:** **PASS** (2/2 tests passing).
- **Remaining Risk:** None identified.

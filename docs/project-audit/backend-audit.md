# Backend & MongoDB Audit — Mithila Milan

**Audit Date:** 2026-11-18  
**Scope:** `lib/mongodb.ts`, `lib/mongodb-models.ts`, `lib/prisma.ts`, `prisma/**`, `scripts/**`, `app/api/**`

---

## 1. Database Connection & Architecture Split-Brain

- **MongoDB Connection (`lib/mongodb.ts`):**
  - Uses Mongoose (`maxPoolSize: 10`, `bufferCommands: false`) with global connection caching (`global.mongooseCache`) and database name `process.env.MONGODB_DB || 'mithila_milan'`.
  - **Live Check:** `GET /api/health/db` returned `200 {"ok":true,"status":"connected","database":"mongodb","readyState":1}`.
  - **Silent Null Fallback:** `connectMongo()` catches connection errors and returns `null`, which causes `/api/auth/login`, `/api/auth/signup`, `/api/auth/forgot-password`, `/api/shortlist`, and `/api/consultation` to return `200 OK` demo fallbacks instead of failing closed.
- **Prisma vs. Mongoose Conflict:**
  - `prisma/schema.prisma` defines 4 PostgreSQL models (`User`, `Profile`, `Interest`, `Match`), and `package.json` scripts (`prisma:generate`, `db:push`, `db:seed` -> `scripts/seed-demo.ts`) still target PostgreSQL.
  - `app/api/seed/route.ts` still imports `@/lib/prisma` (PostgreSQL), whereas the other 16 API routes use Mongoose (`lib/mongodb-models.ts`).
  - `scripts/seed-mongodb.ts` exists for MongoDB but has no `package.json` script, and seeds users without `passwordHash`.
  - `scripts/migrate-postgres-to-mongodb.ts` writes Prisma fields (`legacyId`, `photoUrl`, `label`, `category`) that are stripped by Mongoose `strict: true` and omits required `MongoProfile` fields.

---

## 2. Mongoose Models & Indexes (`lib/mongodb-models.ts`)

| Model | Collection | Key Indexes | Findings / Bugs |
|---|---|---|---|
| `MongoUser` (`MithilaUser`) | `users` | `email` (unique), `phone` (sparse), `role`, `isVerified` | Stores `passwordHash` in plaintext from signup/admin routes. |
| `MongoProfile` (`MithilaProfile`) | `profiles` | `userId` (unique), `profileCode` (unique), `displayName`, `age`, `currentCity`, `nativeDistrict`, `profession`, `community`, `gotra`, `mool`, `verified`, `visibility`, compound `{ visibility, age, nativeDistrict }`, `{ currentCity, profession }`, `{ gotra, mool }` | `app/api/profile/me` writes non-schema fields (`maternalLineage`, `familyVillage`, `employmentPreference`, `familyPreference`) which Mongoose strips. |
| `MongoInterest` (`MithilaInterest`) | `interests` | `senderId`, `receiverId`, `status`, unique `{ senderId, receiverId }`, `{ receiverId, status }` | — |
| `MongoMatch` (`MithilaMatch`) | `interests` | Same as `MongoInterest` | **Bug:** Bound to `interestSchema` on the `interests` collection (duplicate model). |
| `MongoConversation` (`MithilaConversation`) | `conversations` | `participants`, `lastMessageAt` | **Schema Mismatch:** `/api/messages` pushes `attachment`, `isChaiInvite`, `chaiDetails` onto `messages`, which are stripped by Mongoose strict mode. |
| `MongoShortlist` (`MithilaShortlist`) | `shortlists` | `userId`, `profileId`, unique `{ userId, profileId }` | — |
| `MongoGrievance` (`MithilaGrievance`) | `grievances` | `reportedProfileId` | **Unused:** No API route imports or writes to `MongoGrievance`. |
| `VipConsultation` (inline in `app/api/consultation/route.ts`) | `vip_consultations` | None | **Bug:** Defined inline outside `lib/mongodb-models.ts`; `admin/stats` and `admin/users` read `mongoose.models.VipConsultation`, which is `undefined` until `/api/consultation` is loaded in that process. |

---

## 3. API Route Audit (`app/api/**`)

| Route | Methods | Validation | Classification | Concrete Findings |
|---|---|---|---|---|
| `/api/health/db` | `GET` | None | **Completed and verified** | Returns `200` connected (`readyState: 1`) in live test; returns `200 pending_configuration` if `MONGODB_URI` is unset. |
| `/api/profiles` | `GET` | Zod (`querySchema`) | **Implemented but not fully tested** | Tested `200` live. Bugs: `filter.userId = { $ne: currentUserId }` throws `CastError` on non-ObjectId strings (silently returning `200 []`); shortlists/interests hardcoded to `'DEMO_CURRENT_USER'`; unescaped `$regex`; inconsistent response shape (no `ok: true`). |
| `/api/profiles/[profileId]` | `GET` | ObjectId regex | **Implemented but not fully tested** | Hardcodes `'DEMO_CURRENT_USER'` for shortlist/interest flags; does not enforce `PAUSED` or `CONNECTIONS_ONLY` visibility. |
| `/api/profile/me` | `GET`, `POST` | Manual (no Zod) | **Implemented but not fully tested** | `GET` mutates DB by auto-creating missing profiles with hardcoded defaults (`age: 27`, `gotra: 'Kashyapa'`, `mool: 'Sakri'`); `POST` writes non-schema fields and hardcodes `profileCompletion: 90`. |
| `/api/interests` | `GET`, `POST` | `POST`: Zod; `GET`: None | **Partially implemented** | `WITHDRAW` is in Zod enum but not handled in `POST` (returns `400`); `GET` swallows errors into `200 []`. |
| `/api/messages` | `GET`, `POST` | `POST`: Zod (`z.any()` for `attachment`/`chaiDetails`) | **Partially implemented** | `attachment`, `isChaiInvite`, and `chaiDetails` are stripped by `conversationSchema`; unused imports (`MongoProfile`, `MongoUser`). |
| `/api/shortlist` | `GET`, `POST` | `POST`: Zod | **Partially implemented** | Defaults `userId` to `'DEMO_CURRENT_USER'`; `POST` returns `200 toggled_demo` if DB offline. |
| `/api/settings` | `GET`, `POST` | `POST`: Zod; `GET`: Manual | **Partially implemented** | `emailNotifs` and `familyAssistance` are accepted in `POST` but never saved (`GET` returns hardcoded `true, true`). |
| `/api/consultation` | `POST` | Zod | **Implemented but not fully tested** | Writes to `VipConsultation`, but defines model inline and falls back to `200` demo ID if DB offline. |
| `/api/panji/siddhanta` | `POST` | Zod | **Implemented but not fully tested** | Stateless in-memory string comparison; no DB reads/writes. |
| `/api/auth/login` | `POST` | Zod | **Partially implemented** | Skips password check for non-admin `CREDENTIALS`; trusts unverified `GOOGLE` emails; fails open if DB offline. |
| `/api/auth/signup` | `POST` | Zod | **Partially implemented** | Stores plaintext password; returns `200` instead of `201`; hardcodes `age: 27`, `mool: 'Sakri'`, `isVerified: true`. |
| `/api/auth/forgot-password` | `POST` | Zod | **Partially implemented** | Leaks `token` in JSON response; no email dispatch; no `/api/auth/reset-password` endpoint exists. |
| `/api/admin/auth` | `POST` | Zod | **Partially implemented** | Hardcoded fallback admin credentials; issues no session cookie/token. |
| `/api/admin/stats` | `GET` | None | **Implemented but not fully tested** | Unauthenticated; hardcodes `database.dbName: 'milan_mithila'` (mismatch with `'mithila_milan'`); `VipConsultation` may be `undefined`. |
| `/api/admin/users` | `POST` | Manual (no Zod) | **Implemented but not fully tested** | Unauthenticated; no status enum validation; missing `404` when target user/profile not found. |
| `/api/seed` | `POST` | Zod (`secret`) | **Partially implemented** | Targets **Prisma/PostgreSQL** instead of MongoDB; no `try/catch` around DB calls. |

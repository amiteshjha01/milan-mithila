# Phase 2.1 database setup

- Database: Neon PostgreSQL via the connected Neon integration.
- ORM: Prisma 6.19.x.
- Schema: `prisma/schema.prisma`.
- Runtime client: `lib/prisma.ts`.
- Health check: `GET /api/health/db`.
- Public profile query: `GET /api/profiles?city=...&profession=...&q=...`.
- Development seed route: `POST /api/seed` with `{ "secret": "$SEED_SECRET" }`.
- Local seed script: `pnpm db:seed`.

The schema deliberately keeps Gotra, Mool, family origin, and cultural fields nullable and informational. They are not used for compatibility decisions. The public profile endpoint excludes these fields from its response until cultural validation and privacy policy review are complete.

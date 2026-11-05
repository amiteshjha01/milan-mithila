# MongoDB Atlas migration draft

## Status

The MongoDB Atlas integration is connected in v0, but the available integration environment inventory currently exposes no MongoDB connection variable and the Atlas MCP project lookup returned `404 Not Found: No group with ID 6aec2fda4e6d15d792edb7db exists.` Because of that, this migration was prepared but not executed or verified against Atlas.

No MongoDB cluster was created, upgraded, or moved to a paid tier. The migration is designed for an M0/free cluster once the integration provides a working connection string.

## Chosen approach

- Driver/model layer: Mongoose 9.
- Source of truth during migration: existing Neon PostgreSQL + Prisma schema.
- Destination collections: `users`, `profiles`, `interests`, `matches`.
- Idempotency: every migrated document stores its original PostgreSQL ID in `legacyId`; rerunning uses `updateOne(..., { upsert: true })`.
- Relations: retained as string IDs for portability and explicit joins in application code.
- Cultural fields: preserved as nullable informational profile fields; no compatibility logic is added.
- Data access: no production route was switched to MongoDB. PostgreSQL remains the application source of truth until parity checks and an explicit cutover decision.

## Run when Atlas credentials are available

Set the integration-provided `MONGODB_URI` and optionally `MONGODB_DB`, then run:

```bash
pnpm tsx scripts/migrate-postgres-to-mongodb.ts
```

The script reads all current Prisma users with related profiles, interests, and matches and upserts them into MongoDB. It does not delete PostgreSQL data and does not modify the live application read path.

## Validation required before cutover

1. Compare row/document counts per collection.
2. Compare a deterministic sample of users, profiles, interests, and matches by `legacyId`.
3. Confirm all unique and query indexes are present.
4. Run profile filters against both data stores and compare results.
5. Verify duplicate migration runs are no-ops.
6. Test backup/restore on the M0 cluster.
7. Review privacy, retention, and cultural-field handling with the product owner and Maithil experts.
8. Decide whether MongoDB remains a shadow store, becomes the read store, or is rejected in favor of Neon PostgreSQL.

## Recommendation

Keep PostgreSQL as the system of record until these checks pass. Since MongoDB is not currently reachable from the connected workspace, do not claim that a production migration or Atlas validation has occurred.

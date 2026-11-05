# Mithila Milan database architecture decision

**Status:** Decision for Phase 2.2 planning
**Scope:** MongoDB Atlas versus PostgreSQL for the MVP and near-term product
**Decision:** Keep Neon PostgreSQL with Prisma. Do not migrate to MongoDB for the current product stage.

## Executive summary

Mithila Milan has flexible profile content, but its hardest problems are relational: profile discovery across multiple filters, user-to-user interests and mutual matches, family-assisted access, verification records, moderation, privacy boundaries, and reporting. Those workflows benefit from transactions, unique constraints, joins, referential integrity, and SQL analytics more than they benefit from storing each profile as an unconstrained document.

MongoDB would make irregular profile metadata and evolving cultural fields feel easy initially. However, a MongoDB design would still need explicit references, unique indexes, transaction boundaries, and application-level consistency for matches, family permissions, and verification. That would move important correctness rules out of the database while adding a migration cost to an already-connected Neon + Prisma foundation.

The recommendation is therefore:

1. Keep PostgreSQL as the system of record.
2. Continue using Prisma for the application data layer.
3. Use normalized relational tables for identity, profiles, interests, relationships, permissions, verification, and moderation.
4. Use PostgreSQL JSONB only for bounded, versioned, non-critical flexible metadata—not for searchable core fields or compatibility rules.
5. Keep cultural fields nullable and informational until Maithil experts approve their semantics and use.

This is not a claim that PostgreSQL is universally better. MongoDB is a credible choice for a document-first product with highly variable records and low cross-record consistency requirements. Mithila Milan's MVP does not fit that shape closely enough to justify migration.

## Product-specific requirements

The database must support:

- A profile with personal, professional, family, language, location, values, and cultural context.
- Optional and evolving cultural attributes such as Gotra, Mool, Kul, and Pravara without implying that the product has authority to determine compatibility.
- Search by age range, location, profession, education, languages, values, visibility, verification state, and profile completeness.
- One-way interests, mutual matches, duplicate prevention, status changes, and audit history.
- Conversations with participants, message ordering, read state, reporting, blocking, and retention controls.
- Family-assisted access with explicit roles and revocable permissions.
- Verification cases and documents with restricted access, status transitions, reviewer attribution, and audit events.
- Admin reporting for acquisition, profile completion, moderation, verification throughput, matches, and safety events.
- Strong privacy boundaries and recoverable backups.

## Comparison table

| Criterion | MongoDB Atlas with Mongoose or Prisma | PostgreSQL with Prisma and JSONB | Decision for Mithila Milan |
|---|---|---|---|
| Profile shape | Excellent for nested, irregular documents and arrays. | Strong with relational columns plus JSONB for bounded extension data. | PostgreSQL is sufficient; core profile fields are known enough to model relationally. |
| Cultural fields | Easy to add arbitrary fields, but semantics and validation can drift between documents. | Nullable columns plus a versioned JSONB extension can evolve without making cultural data authoritative. | PostgreSQL gives better governance while preserving flexibility. |
| Search and filtering | Good for indexed scalar fields; multi-condition joins and cross-collection filters become aggregation pipelines. | Mature predicates, joins, full-text options, partial indexes, and composable query plans. | PostgreSQL. |
| Interests and mutual matches | Possible, but references, uniqueness, and consistency are application-managed or transaction-based. | Natural join table with composite uniqueness and transactional state changes. | PostgreSQL. |
| Messaging | Good for append-heavy message documents and embedded conversation summaries. | Strong for participants, permissions, moderation, read state, and transactional writes; messages can be partitioned later. | PostgreSQL for MVP; optimize/partition only when volume proves necessary. |
| Family-assisted profiles | Possible with embedded access arrays, but concurrent permission changes are harder to audit safely. | Explicit membership/permission tables with unique constraints and audit rows. | PostgreSQL. |
| Verification | Document storage is convenient for variable evidence, but access control and reviewer relations still need structure. | Strong case, reviewer, status, event, and restricted artifact relations. Store files outside either database. | PostgreSQL. |
| Transactions | Multi-document transactions exist but add operational cost and should not be the default modeling strategy. | Mature ACID transactions and constraints are the default. | PostgreSQL. |
| Analytics | Aggregation pipelines are capable, but reporting across relationships can become complex. | SQL, views, window functions, and standard BI connectivity are a better fit. | PostgreSQL. |
| Scalability | Strong horizontal scale and flexible document distribution. | Strong vertical scale, read replicas, partitioning, pooling, and mature managed Postgres options. | PostgreSQL is appropriate for MVP and early growth; revisit at measured scale. |
| Developer productivity | Fast initial modeling; schema discipline shifts into code and tests. | Existing Prisma foundation, typed schema, migrations, and relational constraints reduce rework. | PostgreSQL. |
| Cost | Atlas operational tiers and backups are reasonable, but cost depends on cluster size, storage, and transfer. | Existing Neon integration avoids a second platform; scale-to-zero/serverless options suit early traffic. | PostgreSQL has lower migration and infrastructure overhead now. |
| Migration cost today | Requires a new provider, new schema/client strategy, data export/import, rewrites, and operational cutover. | No migration; extend the existing applied schema. | PostgreSQL by a wide margin. |

## Evaluation by product domain

### 1. Matrimonial profiles and flexible nested structures

The current profile has a stable core: display name, age, location, profession, education, family summary, about text, visibility, verification state, languages, and values. These are suitable relational fields because they are searched, sorted, validated, and reported on.

MongoDB's advantage is that a profile can contain nested objects such as:

```json
{
  "identity": { "displayName": "Aarav N.", "age": 29 },
  "location": { "city": "Bengaluru", "state": "Karnataka" },
  "family": { "origin": "Darbhanga", "summary": "..." },
  "preferences": { "languages": ["Maithili", "English"] }
}
```

PostgreSQL can represent the stable fields as columns and preserve bounded optional sections in JSONB:

```ts
model Profile {
  id              String @id @default(uuid()) @db.Uuid
  userId          String @unique @db.Uuid
  displayName     String
  age             Int
  city            String
  state           String
  profession      String
  education       String
  familySummary   String
  about           String
  languages      String[]
  values         String[]
  culturalContext Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

The important distinction is governance: JSONB should hold versioned optional metadata, not silently become an unvalidated replacement for the schema. Profile fields that affect search, privacy, verification, or reporting should remain typed columns or explicit relations.

### 2. Gotra, Mool, Kul, Pravara, and community-specific data

MongoDB is attractive for cultural data because different families may provide different attributes. That flexibility is real, but it does not solve the harder questions:

- What does each field mean in this product?
- Which sources are accepted?
- Is the value self-declared, family-provided, or verified?
- Can the value be shown to another member?
- How are spelling, language, transliteration, and aliases handled?
- Is the field informational or used in a compatibility rule?

Those questions require provenance, visibility, and auditability regardless of database. PostgreSQL makes it easier to separate a profile's informational fields from future verification records and from any later, separately approved rule system.

Recommendation:

- Keep `gotra`, `mool`, and `familyOrigin` nullable on the profile for the current seed model.
- Add future `culturalAttributes` rows or versioned JSONB only after expert review.
- Store source, confidence, visibility, and review status separately from the value.
- Do not calculate compatibility from these fields in Phase 2.1 or Phase 2.2.

### 3. Advanced matrimonial search and filtering

Expected MVP query patterns include:

```sql
SELECT p.id, p."displayName", p.age, p.city, p.profession
FROM "Profile" p
WHERE p.visibility = 'COMMUNITY'
  AND p.age BETWEEN 25 AND 34
  AND p.city = 'Bengaluru'
  AND 'Maithili' = ANY(p.languages)
ORDER BY p."updatedAt" DESC
LIMIT 50;
```

PostgreSQL supports this naturally with:

- B-tree indexes for visibility, age, city, and updated time.
- GIN indexes for `languages` and `values` arrays when array containment is used.
- Partial indexes for visible profiles.
- Full-text search or trigram search later for names, professions, and about text.
- SQL joins for interests, exclusions, blocks, family permissions, and verification status.

MongoDB would use a compound index and an aggregation or find query. It performs well when filters stay within one document, but search involving block lists, interests, family access, and verification collections becomes more pipeline-heavy. Atlas Search can improve text search, but it introduces another search configuration and index lifecycle to maintain.

For the MVP, PostgreSQL's query planner and relational composition are the lower-risk choice.

### 4. Interests and mutual matches

A relational model prevents duplicate interests and makes state transitions explicit:

```prisma
model Match {
  id         String   @id @default(uuid()) @db.Uuid
  senderId   String   @db.Uuid
  receiverId String   @db.Uuid
  status     String   @default("PENDING")
  note       String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  sender     User     @relation("sentMatches", fields: [senderId], references: [id])
  receiver   User     @relation("receivedMatches", fields: [receiverId], references: [id])
  @@unique([senderId, receiverId])
}
```

A mutual match can be created in one transaction that locks or checks both directed interests and creates the relationship only once. MongoDB can model the same data as an `interests` array inside a user document or as a separate collection, but both approaches still need unique indexes and transaction logic for concurrent reciprocal requests. The relational model expresses the invariant more directly.

### 5. Messaging and conversation management

A practical PostgreSQL MVP model is:

```prisma
model Conversation {
  id        String   @id @default(uuid()) @db.Uuid
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  members   ConversationMember[]
  messages  Message[]
}

model Message {
  id             String   @id @default(uuid()) @db.Uuid
  conversationId String   @db.Uuid
  senderId       String   @db.Uuid
  body           String
  createdAt      DateTime @default(now())
  deletedAt      DateTime?
}
```

MongoDB's document model is useful for chat histories when a conversation is small and bounded, but embedding messages in one document creates document growth and hot-document concerns. A message collection is more typical at scale, which reduces much of MongoDB's initial modeling advantage. PostgreSQL also makes it straightforward to join participant permissions, blocks, reports, retention policies, and moderation events.

If messaging becomes the dominant workload, PostgreSQL can add a dedicated message table, time-based partitioning, read replicas, or a specialized event/queue service later without moving the core identity and relationship data.

### 6. Family-assisted profile management

Family assistance is a many-to-many permission problem, not simply nested profile data:

```prisma
model ProfileDelegate {
  profileId  String
  userId     String
  role       String
  canEdit    Boolean  @default(false)
  canMessage Boolean  @default(false)
  createdAt  DateTime @default(now())
  revokedAt  DateTime?
  @@id([profileId, userId])
}
```

PostgreSQL's composite uniqueness and transactional revocation are valuable here. MongoDB can store an array of delegates on the profile, but concurrent edits, revocation history, and reporting are more difficult to make reliable without a separate collection and explicit audit records.

### 7. Identity and Panji verification records

Verification should be modeled as a restricted workflow, separate from the public profile:

```prisma
model VerificationCase {
  id          String   @id @default(uuid()) @db.Uuid
  profileId   String   @db.Uuid
  type        String
  status      String   @default("PENDING")
  reviewerId  String?  @db.Uuid
  notes       String?
  createdAt   DateTime @default(now())
  reviewedAt  DateTime?
}

model VerificationEvent {
  id        String   @id @default(uuid()) @db.Uuid
  caseId    String   @db.Uuid
  actorId   String?  @db.Uuid
  action    String
  metadata  Json?
  createdAt DateTime @default(now())
}
```

Neither database should store uploaded identity documents directly in ordinary profile documents. Use private object storage, encrypt where appropriate, store only object keys and metadata, and enforce least-privilege access. PostgreSQL is preferable for the case state machine, reviewer relationships, audit trail, and reporting. Panji-related data must remain explicitly unapproved until cultural experts define the process and authority model.

### 8. Transactions and data consistency

PostgreSQL provides the strongest default for the core invariants:

- Email uniqueness.
- One profile per user.
- No duplicate directed interest.
- Atomic mutual-match transitions.
- Atomic family permission changes and audit events.
- Verification status and reviewer updates.
- Soft deletion and privacy state transitions.

MongoDB supports multi-document transactions, but teams usually get the best MongoDB performance and simplicity by designing around single-document atomicity. Mithila Milan's important invariants cross users and collections, so that trade-off is unfavorable.

### 9. Admin analytics and reporting

Expected reports include profile completion by week, active profiles by city, interests sent/accepted, match conversion, message activity, verification queue age, and reports by category. PostgreSQL supports these with SQL aggregates, views, window functions, and BI tools.

MongoDB aggregation pipelines can produce the same reports, but cross-collection pipelines are generally harder to review, tune, and expose to analysts. If event analytics later outgrows the transactional database, emit privacy-conscious events to an analytics system rather than migrating the primary store solely for reporting.

## Query patterns and indexes

### PostgreSQL / Prisma

Expected indexes:

```sql
CREATE INDEX profile_visible_age_city_idx
  ON "Profile" (visibility, age, city);

CREATE INDEX profile_updated_idx
  ON "Profile" ("updatedAt" DESC);

CREATE INDEX profile_languages_gin_idx
  ON "Profile" USING GIN (languages);

CREATE INDEX profile_values_gin_idx
  ON "Profile" USING GIN (values);

CREATE INDEX match_receiver_status_idx
  ON "Match" ("receiverId", status);
```

Add indexes only after observing query plans. Avoid indexing every optional cultural field before the product knows which fields are actually searched. Use partial indexes for public/community-visible profiles if the dataset becomes large.

### MongoDB / Mongoose or Prisma MongoDB connector

Equivalent indexes might be:

```js
profileSchema.index({ visibility: 1, age: 1, city: 1 })
profileSchema.index({ languages: 1 })
profileSchema.index({ values: 1 })
profileSchema.index({ updatedAt: -1 })
matchSchema.index({ senderId: 1, receiverId: 1 }, { unique: true })
matchSchema.index({ receiverId: 1, status: 1 })
```

MongoDB indexes are effective when query predicates align with document fields. A future Atlas Search index may help natural-language profile search, but it is a separate operational surface and should not be introduced before search requirements are measured.

## MongoDB Atlas with Mongoose or Prisma

### Advantages

- Natural document representation for variable profile sections.
- Easy to add optional fields while iterating on an early profile form.
- Good fit for document-contained read models.
- Horizontal scaling and sharding are mature options.
- Atlas provides managed backups, monitoring, and search capabilities.

### Disadvantages

- Cross-user relationship data still needs references or separate collections.
- Application code carries more responsibility for uniqueness and consistency.
- Aggregation pipelines become harder to maintain as search, permissions, moderation, and reporting expand.
- MongoDB Prisma support is not a drop-in switch: provider, schema types, migrations, query behavior, and transaction assumptions differ.
- Introducing Atlas adds a second provider and operational surface when Neon is already connected.
- A flexible document can make cultural data drift silently across profiles unless validation and versioning are implemented carefully.

## PostgreSQL with Prisma and JSONB

### Advantages

- Already provisioned and connected through Neon.
- Existing Prisma schema, generated client, seed data, and health endpoint can be extended.
- Transactions and constraints match the relationship-heavy domain.
- JSONB provides bounded flexibility for non-core profile extensions.
- SQL is well suited to search, moderation, analytics, and admin reporting.
- Neon supports a cost-conscious early-stage deployment model with managed backups and operational tooling.

### Disadvantages

- Schema changes need more discipline than adding arbitrary document properties.
- Deeply irregular nested data is less ergonomic than a document model.
- JSONB can become an untyped dumping ground if its scope is not governed.
- High-volume messaging may eventually require partitioning, read replicas, or a specialized service.
- Prisma queries can become verbose for complex reporting unless views or SQL reports are introduced intentionally.

## Scalability, performance, and cost

For the MVP, the likely bottlenecks are not raw database throughput. They are incomplete profiles, moderation workflows, search quality, and safe messaging. Neon PostgreSQL can support this stage with a pooled connection, sensible indexes, and bounded result sets.

PostgreSQL scale plan:

1. Start with pooled connections and the existing Neon integration.
2. Add indexes from real query plans, not guesses.
3. Paginate all profile and message lists.
4. Cache only safe, non-sensitive public aggregates.
5. Add read replicas or partition messages when measurements justify them.
6. Move analytics events to a separate system if reporting workloads compete with user traffic.

MongoDB scale plan would similarly require indexes, pagination, connection management, and monitoring. Its horizontal scaling advantage is real, but it is not a free replacement for correct relationship modeling. Atlas cost would also be additive during a migration because Neon would need to remain available during validation and cutover.

## Backup and recovery requirements

### PostgreSQL / Neon

- Use Neon point-in-time recovery and managed backups according to the selected retention tier.
- Keep schema/migration files in Git.
- Test a restore into a non-production branch or isolated database before launch.
- Document recovery point objective and recovery time objective.
- Never include production dumps, passwords, identity documents, or message bodies in Git or chat artifacts.
- Encrypt private verification artifacts in object storage and keep database rows limited to metadata and access-controlled object keys.
- Run a periodic restore drill that verifies users, profiles, match states, family permissions, and audit events.

### MongoDB Atlas

- Enable continuous cloud backups or scheduled snapshots with a defined retention window.
- Test point-in-time restore and document export recovery.
- Preserve index definitions and validator rules as code.
- Verify that restored clusters retain encryption, network controls, and least-privilege access.
- Plan for collection-level and cross-collection consistency during restore validation.

The operational requirements are comparable. PostgreSQL has the lower incremental burden because Neon is already the selected and connected platform.

## Migration implications

### If we stay with PostgreSQL

- Keep the current Prisma models and extend them with explicit tables for permissions, verification, conversations, messages, blocks, and moderation events.
- Keep cultural fields nullable and separate from matching logic.
- Add JSONB only for versioned, non-critical extensions.
- Add indexes as search requirements stabilize.
- Preserve the current seeded data and API contracts.
- No provider migration, export/import, dual-write period, or cutover is required.

### If we migrate to MongoDB now

A realistic migration would include:

1. Select Atlas region, tier, network policy, backups, and access model.
2. Choose Mongoose or Prisma MongoDB. The current Prisma PostgreSQL schema cannot simply change `provider = "mongodb"` without substantial model changes.
3. Redesign UUID/object ID handling, relations, compound uniqueness, and transaction code.
4. Map relational profiles, users, interests, and matches into documents or collections.
5. Rebuild API queries and filters around MongoDB query semantics.
6. Recreate health checks, seed scripts, indexes, and backup runbooks.
7. Run a data validation comparison against Neon.
8. Operate dual-write or freeze writes for a cutover window.
9. Update environment variables and deployment configuration.
10. Keep Neon available for rollback until the new system is proven.

That migration is not justified by the current product requirements. It would delay authentication and member workflows while adding little user-visible value.

## Final recommendation

Use **Neon PostgreSQL with Prisma** as the primary database for Mithila Milan.

This recommendation is based on the product's specific risk profile: the MVP is relationship-heavy, privacy-sensitive, and likely to require auditable state transitions and cross-entity reporting. PostgreSQL gives the team a stronger correctness baseline for interests, matches, family permissions, verification cases, and moderation while still supporting flexible profile evolution through nullable fields and carefully governed JSONB.

Do not begin Phase 2.2 authentication until this decision is accepted. When authentication starts, use the existing Prisma/Neon foundation rather than adding MongoDB, a second database, or a hybrid persistence layer.

**Decision boundary:** Reconsider MongoDB only if measured requirements show that profile data is predominantly document-shaped, cross-entity transactions are minimal, and the product needs Atlas-specific capabilities that PostgreSQL cannot provide economically. That is not the current MVP shape.

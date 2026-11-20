/**
 * Security migration for pre-remediation data.  DRY-RUN by default.
 *
 *   pnpm tsx scripts/migrate-auth-security.ts            # report only, writes nothing except the backup
 *   pnpm tsx scripts/migrate-auth-security.ts --apply    # perform the migration
 *
 * What it does
 *  1. Writes a JSON backup of users/profiles/interests/shortlists/conversations to
 *     ../mithila-milan-db-backups/<timestamp>/ (outside the repository). Legacy password values are
 *     REDACTED in the backup because they are plaintext credentials; they are not needed for rollback.
 *  2. Users whose `passwordHash` is not an Argon2id hash (all legacy plaintext values) get the value
 *     REMOVED and `mustResetPassword=true`. They can only get back in through "Forgot password".
 *     Admin/Moderator accounts are included: re-provision them with scripts/provision-admin.ts.
 *  3. Normalises legacy garbage written into profile privacy enums by the old profile form
 *     (e.g. visibility="Members only") and moves it to the correct field.
 *  4. Prints COUNTS only: no e-mail addresses, hashes or passwords are printed.
 */
import fs from 'node:fs'
import path from 'node:path'
import { connectMongo } from '../lib/mongodb'
import { MongoUser, MongoProfile, MongoInterest, MongoShortlist, MongoConversation, MongoSession } from '../lib/mongodb-models'
import { isArgon2idHash } from '../lib/security/password'
import { normalizeLevel } from '../lib/security/privacy'

try {
  process.loadEnvFile('.env.local')
} catch {}

const apply = process.argv.includes('--apply')

async function main() {
  const mongo = await connectMongo()
  if (!mongo) throw new Error('MongoDB is not reachable')

  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const dir = path.resolve(process.cwd(), '..', 'mithila-milan-db-backups', stamp)
  fs.mkdirSync(dir, { recursive: true })
  const users: any[] = await MongoUser.find().select('+passwordHash +resetPasswordToken').lean()
  const dump = async (name: string, rows: any[]) => fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(rows))
  await dump('users', users.map((u) => ({ ...u, passwordHash: u.passwordHash ? '[REDACTED]' : undefined, resetPasswordToken: u.resetPasswordToken ? '[REDACTED]' : undefined })))
  await dump('profiles', await MongoProfile.find().lean())
  await dump('interests', await MongoInterest.find().lean())
  await dump('shortlists', await MongoShortlist.find().lean())
  await dump('conversations', await MongoConversation.find().lean())
  console.log(`Backup written: ${users.length} users (credentials redacted) -> ${dir}`)

  const legacy = users.filter((u) => u.authProvider !== 'GOOGLE' && !isArgon2idHash(u.passwordHash))
  const legacyWithValue = legacy.filter((u) => Boolean(u.passwordHash))
  const privileged = legacy.filter((u) => u.role === 'ADMIN' || u.role === 'MODERATOR')
  console.log(`Users needing mandatory reset: ${legacy.length} (plaintext values to remove: ${legacyWithValue.length}, privileged: ${privileged.length})`)

  const profiles: any[] = await MongoProfile.find().lean()
  const badProfiles = profiles.filter(
    (p) => !['COMMUNITY', 'CONNECTIONS_ONLY', 'PAUSED'].includes(p.visibility) || (p.culturalVisibility && !['MEMBERS', 'CONNECTIONS', 'PRIVATE'].includes(p.culturalVisibility))
  )
  console.log(`Profiles with legacy/invalid privacy values: ${badProfiles.length}`)

  if (!apply) {
    console.log('DRY RUN: nothing modified. Re-run with --apply to migrate.')
    await mongo.disconnect()
    return
  }

  for (const u of legacy) {
    await MongoUser.updateOne({ _id: u._id }, { $set: { mustResetPassword: true }, $unset: { passwordHash: 1, resetPasswordToken: 1, resetPasswordExpires: 1 } })
  }
  await MongoSession.updateMany({ revokedAt: { $exists: false } }, { $set: { revokedAt: new Date(), revokedReason: 'security_migration' } })

  for (const p of badProfiles) {
    const set: Record<string, string> = {}
    if (!['COMMUNITY', 'CONNECTIONS_ONLY', 'PAUSED'].includes(p.visibility)) {
      // the old form wrote the family-visibility label into `visibility`
      set.familyVisibility = normalizeLevel(p.visibility)
      set.visibility = 'COMMUNITY'
    }
    if (p.culturalVisibility && !['MEMBERS', 'CONNECTIONS', 'PRIVATE'].includes(p.culturalVisibility)) set.culturalVisibility = normalizeLevel(p.culturalVisibility)
    await MongoProfile.collection.updateOne({ _id: p._id }, { $set: set })
  }
  console.log('Migration applied.')
  await mongo.disconnect()
}

main().catch((e) => {
  console.error(`migration failed: ${e instanceof Error ? e.message : 'unknown error'}`)
  process.exit(1)
})

/**
 * One-off provisioning / rotation of an administrator account.
 *
 *   ADMIN_EMAIL=ops@example.org ADMIN_PASSWORD='<new strong secret>' pnpm tsx scripts/provision-admin.ts
 *
 * - The password is read from the environment of THIS process only, hashed with Argon2id,
 *   and never printed or written anywhere else. Unset it afterwards.
 * - Refuses the credentials that were previously exposed in source code.
 * - Revokes every existing session of the account (rotation).
 */
import { MongoUser, MongoSession } from '../lib/mongodb-models'
import { connectMongo } from '../lib/mongodb'
import { hashPassword } from '../lib/security/password'

try {
  process.loadEnvFile('.env.local')
} catch {}

const LEAKED = new Set(['mithilaadmin@2026', 'admin1234'])

async function main() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD || ''
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('ADMIN_EMAIL must be a real email address')
  if (password.length < 14) throw new Error('ADMIN_PASSWORD must be at least 14 characters')
  if (LEAKED.has(password.toLowerCase())) throw new Error('ADMIN_PASSWORD is a previously exposed credential')

  const mongo = await connectMongo()
  if (!mongo) throw new Error('MongoDB is not reachable')

  const passwordHash = await hashPassword(password)
  const existing: any = await MongoUser.findOne({ email })
  let userId: string
  if (existing) {
    await MongoUser.updateOne(
      { _id: existing._id },
      {
        $set: { passwordHash, role: 'ADMIN', accountStatus: 'ACTIVE', isVerified: true, mustResetPassword: false, passwordChangedAt: new Date(), failedLoginCount: 0 },
        $unset: { lockedUntil: 1, resetPasswordToken: 1, resetPasswordExpires: 1 },
      }
    )
    userId = String(existing._id)
  } else {
    const created: any = await MongoUser.create({
      email, name: 'Platform Administrator', passwordHash, authProvider: 'CREDENTIALS', role: 'ADMIN', isVerified: true,
      consentLogs: [{ consentType: 'ADMIN_PROVISIONED', grantedAt: new Date(), version: '2026.1' }],
    })
    userId = String(created._id)
  }
  const revoked = await MongoSession.updateMany({ userId, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date(), revokedReason: 'admin_rotation' } })
  console.log(`Admin account ${existing ? 'rotated' : 'created'}; sessions revoked: ${revoked.modifiedCount}`)
  await mongo.disconnect()
}

main().catch((e) => {
  console.error(`provision-admin failed: ${e instanceof Error ? e.message : 'unknown error'}`)
  process.exit(1)
})

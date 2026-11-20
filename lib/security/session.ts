import { createHash, randomBytes } from 'node:crypto'
import { Types } from 'mongoose'
import { MongoSession, MongoUser } from '@/lib/mongodb-models'

/**
 * Server-side session management.
 * - The cookie holds a 256-bit random opaque token; the DB stores only its SHA-256 hash,
 *   so a database leak does not yield usable session tokens.
 * - Sessions have an absolute expiry, an idle timeout, and can be revoked individually
 *   (logout) or in bulk (password change/reset, account block, admin delete).
 */
export const SESSION_COOKIE_NAME = process.env.NODE_ENV === 'production' ? '__Host-mm_session' : 'mm_session'

export const SESSION_POLICY = {
  USER: { absoluteMs: 14 * 24 * 3600_000, idleMs: 2 * 24 * 3600_000 },
  ADMIN: { absoluteMs: 4 * 3600_000, idleMs: 30 * 60_000 },
} as const

export type SessionKind = keyof typeof SESSION_POLICY

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function generateToken(): string {
  return randomBytes(32).toString('base64url')
}

export async function createSession(
  userId: string,
  kind: SessionKind,
  meta: { ip?: string; userAgent?: string } = {}
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_POLICY[kind].absoluteMs)
  await MongoSession.create({
    tokenHash: hashToken(token),
    userId: new Types.ObjectId(userId),
    kind,
    expiresAt,
    ip: meta.ip?.slice(0, 64),
    userAgent: meta.userAgent?.slice(0, 200),
  })
  return { token, expiresAt }
}

export interface ValidSession {
  sessionId: string
  kind: SessionKind
  user: {
    id: string
    email: string
    name: string
    role: string
    accountStatus: string
    isVerified: boolean
    mustResetPassword: boolean
  }
}

/** Returns the validated session or null. Never throws for a bad token. */
export async function validateSessionToken(token: string | undefined | null): Promise<ValidSession | null> {
  if (!token || token.length < 20 || token.length > 200) return null
  const now = Date.now()
  const session: any = await MongoSession.findOne({ tokenHash: hashToken(token) }).lean()
  if (!session || session.revokedAt) return null
  const policy = SESSION_POLICY[(session.kind as SessionKind) || 'USER']
  if (new Date(session.expiresAt).getTime() <= now) return null
  if (new Date(session.lastSeenAt).getTime() + policy.idleMs <= now) return null

  const user: any = await MongoUser.findById(session.userId).lean()
  if (!user) return null
  if (user.accountStatus === 'BLOCKED' || user.accountStatus === 'PENDING_REVIEW') return null
  // An ADMIN-kind session is only valid while the user still holds an elevated role.
  if (session.kind === 'ADMIN' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') return null

  // Sliding idle timer; throttle writes to once a minute.
  if (now - new Date(session.lastSeenAt).getTime() > 60_000) {
    await MongoSession.updateOne({ _id: session._id }, { $set: { lastSeenAt: new Date(now) } })
  }

  return {
    sessionId: String(session._id),
    kind: (session.kind as SessionKind) || 'USER',
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
      accountStatus: user.accountStatus,
      isVerified: Boolean(user.isVerified),
      mustResetPassword: Boolean(user.mustResetPassword),
    },
  }
}

export async function revokeSessionByToken(token: string | undefined | null, reason = 'logout') {
  if (!token) return
  await MongoSession.updateOne(
    { tokenHash: hashToken(token), revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date(), revokedReason: reason } }
  )
}

/** Revoke every live session for a user (password change, block, delete, "log out everywhere"). */
export async function revokeAllUserSessions(userId: string, reason: string, exceptTokenHash?: string) {
  const filter: Record<string, unknown> = { userId: new Types.ObjectId(userId), revokedAt: { $exists: false } }
  if (exceptTokenHash) filter.tokenHash = { $ne: exceptTokenHash }
  await MongoSession.updateMany(filter, { $set: { revokedAt: new Date(), revokedReason: reason } })
}

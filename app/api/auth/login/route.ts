import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongo } from '@/lib/mongodb'
import { MongoUser, MongoProfile } from '@/lib/mongodb-models'
import { createMember, publicUser } from '@/lib/accounts'
import { burnPasswordCheck, hashPassword, verifyPassword } from '@/lib/security/password'
import { createSession, revokeAllUserSessions } from '@/lib/security/session'
import { verifyGoogleIdToken, GoogleAuthNotConfiguredError } from '@/lib/security/google'
import { applySessionCookie, fail, getClientIp, isSameOriginRequest, readJson, serverError } from '@/lib/security/guard'
import { rateLimit } from '@/lib/security/rate-limit'

export const dynamic = 'force-dynamic'

const MAX_FAILED = 5
const LOCK_MS = 15 * 60_000

// `email`, `name`, `googleName` supplied by a client are IGNORED for Google sign-in:
// identity comes only from the cryptographically verified ID token.
const loginSchema = z.discriminatedUnion('provider', [
  z.object({ provider: z.literal('CREDENTIALS'), email: z.string().trim().toLowerCase().email().max(254), password: z.string().min(1).max(128) }),
  z.object({ provider: z.literal('GOOGLE'), idToken: z.string().min(20).max(4096) }),
])

const INVALID = 'Invalid email or password.'

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return fail(403, 'Cross-site request blocked.')
  try {
    const body = (await readJson(request)) as any
    // Backwards compatible: bodies without `provider` are treated as credentials logins.
    const parsed = loginSchema.safeParse(body && typeof body === 'object' && !body.provider ? { ...body, provider: 'CREDENTIALS' } : body)
    if (!parsed.success) return fail(400, 'Please provide valid sign-in details.')
    const d = parsed.data

    const ip = getClientIp(request)
    if (!rateLimit(`login:ip:${ip}`, 30, 15 * 60_000).allowed) return fail(429, 'Too many attempts. Please try again later.')
    if (d.provider === 'CREDENTIALS' && !rateLimit(`login:acct:${d.email}`, 8, 15 * 60_000).allowed) {
      return fail(429, 'Too many attempts. Please try again later.')
    }

    const mongo = await connectMongo()
    if (!mongo) return fail(503, 'Service temporarily unavailable.')

    const meta = { ip, userAgent: request.headers.get('user-agent') || undefined }
    let user: any

    if (d.provider === 'GOOGLE') {
      let identity
      try {
        identity = await verifyGoogleIdToken(d.idToken)
      } catch (e) {
        if (e instanceof GoogleAuthNotConfiguredError) return fail(503, 'Google sign-in is not available.')
        return fail(401, 'Google sign-in could not be verified.')
      }

      user = await MongoUser.findOne({ googleSub: identity.sub }).select('+passwordHash')
      if (!user) {
        user = await MongoUser.findOne({ email: identity.email }).select('+passwordHash')
        if (user) {
          if (user.role === 'ADMIN' || user.role === 'MODERATOR') return fail(401, 'Google sign-in could not be verified.')
          // Pre-hijacking defence: a password account whose e-mail was never verified may have been
          // registered by someone else. Linking Google proves ownership, so drop the unverified password.
          if (!user.isVerified && user.passwordHash) {
            user.passwordHash = undefined
            await MongoUser.updateOne({ _id: user._id }, { $unset: { passwordHash: 1 } })
            await revokeAllUserSessions(String(user._id), 'google_link_unverified_account')
          }
          user.googleSub = identity.sub
          user.isVerified = true
          user.mustResetPassword = false
          await MongoUser.updateOne({ _id: user._id }, { $set: { googleSub: identity.sub, isVerified: true, mustResetPassword: false } })
        } else {
          const created = await createMember({ email: identity.email, name: identity.name, googleSub: identity.sub, emailVerified: true, ip })
          user = created.user
        }
      }
      if (user.role === 'ADMIN' || user.role === 'MODERATOR') return fail(401, 'Google sign-in could not be verified.')
    } else {
      user = await MongoUser.findOne({ email: d.email }).select('+passwordHash')
      if (!user || user.role === 'ADMIN' || user.role === 'MODERATOR') {
        // admins must use /api/admin/auth; never reveal which case this was
        await burnPasswordCheck(d.password)
        return fail(401, INVALID)
      }
      if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
        return fail(429, 'Too many attempts. Please try again later.')
      }
      // Pre-remediation member accounts created before `passwordHash` existed in userSchema have
      // `passwordHash === undefined`. On their first login, bind and hash their password with Argon2id.
      if (!user.passwordHash && user.authProvider !== 'GOOGLE' && !user.googleSub) {
        const migratedHash = await hashPassword(d.password)
        user.passwordHash = migratedHash
        await MongoUser.updateOne(
          { _id: user._id },
          {
            $set: {
              passwordHash: migratedHash,
              authProvider: 'CREDENTIALS',
              mustResetPassword: false,
              passwordChangedAt: new Date(),
              failedLoginCount: 0,
              lastActiveAt: new Date(),
            },
            $unset: { lockedUntil: 1 },
          }
        )
      } else {
        const ok = await verifyPassword(user.passwordHash, d.password)
        if (!ok) {
          const updated: any = await MongoUser.findByIdAndUpdate(user._id, { $inc: { failedLoginCount: 1 } }, { returnDocument: 'after' })
          if (updated && updated.failedLoginCount >= MAX_FAILED) {
            await MongoUser.updateOne({ _id: user._id }, { $set: { lockedUntil: new Date(Date.now() + LOCK_MS), failedLoginCount: 0 } })
          }
          return fail(401, INVALID)
        }
        await MongoUser.updateOne({ _id: user._id }, { $set: { failedLoginCount: 0, lastActiveAt: new Date() }, $unset: { lockedUntil: 1 } })
      }
    }

    if (user.accountStatus === 'BLOCKED' || user.accountStatus === 'PENDING_REVIEW') {
      return fail(403, 'This account is not active. Please contact support.')
    }

    const profile = await MongoProfile.findOne({ userId: user._id }).lean()
    const { token } = await createSession(String(user._id), 'USER', meta)
    const res = NextResponse.json({ ok: true, user: publicUser(user, profile) })
    return applySessionCookie(res, token, 'USER')
  } catch (error) {
    return serverError('auth/login', error)
  }
}

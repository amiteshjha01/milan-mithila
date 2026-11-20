import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongo } from '@/lib/mongodb'
import { MongoUser } from '@/lib/mongodb-models'
import { publicUser } from '@/lib/accounts'
import { burnPasswordCheck, verifyPassword } from '@/lib/security/password'
import { createSession } from '@/lib/security/session'
import { applySessionCookie, fail, getClientIp, isSameOriginRequest, readJson, serverError } from '@/lib/security/guard'
import { rateLimit } from '@/lib/security/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * Administrator sign-in.
 * There are NO credentials in source code, no fallback passwords and no environment-variable
 * password comparison. Admin accounts live in the database with role ADMIN/MODERATOR and an
 * Argon2id hash, provisioned out-of-band by `scripts/provision-admin.ts`.
 * A successful login issues a short-lived (4h absolute / 30min idle) ADMIN-kind session.
 */
const schema = z.object({ email: z.string().trim().toLowerCase().min(3).max(254), password: z.string().min(1).max(128) })
const INVALID = 'Invalid administrator credentials.'
const MAX_FAILED = 5
const LOCK_MS = 30 * 60_000

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return fail(403, 'Cross-site request blocked.')
  try {
    const parsed = schema.safeParse(await readJson(request))
    if (!parsed.success) return fail(400, 'Please enter admin email and security key.')
    const { email, password } = parsed.data

    const ip = getClientIp(request)
    if (!rateLimit(`admin:ip:${ip}`, 10, 15 * 60_000).allowed || !rateLimit(`admin:acct:${email}`, 5, 15 * 60_000).allowed) {
      return fail(429, 'Too many attempts. Please try again later.')
    }

    const mongo = await connectMongo()
    if (!mongo) return fail(503, 'Service temporarily unavailable.')

    const user: any = await MongoUser.findOne({ email, role: { $in: ['ADMIN', 'MODERATOR'] } }).select('+passwordHash')
    if (!user) {
      await burnPasswordCheck(password)
      return fail(401, INVALID)
    }
    if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) return fail(429, 'Too many attempts. Please try again later.')

    const ok = await verifyPassword(user.passwordHash, password)
    if (!ok) {
      const updated: any = await MongoUser.findByIdAndUpdate(user._id, { $inc: { failedLoginCount: 1 } }, { returnDocument: 'after' })
      if (updated && updated.failedLoginCount >= MAX_FAILED) {
        await MongoUser.updateOne({ _id: user._id }, { $set: { lockedUntil: new Date(Date.now() + LOCK_MS), failedLoginCount: 0 } })
      }
      return fail(401, INVALID)
    }
    if (user.accountStatus !== 'ACTIVE') return fail(403, 'This account is not active.')

    await MongoUser.updateOne({ _id: user._id }, { $set: { failedLoginCount: 0, lastActiveAt: new Date() }, $unset: { lockedUntil: 1 } })
    const { token } = await createSession(String(user._id), 'ADMIN', { ip, userAgent: request.headers.get('user-agent') || undefined })
    const res = NextResponse.json({ ok: true, message: 'Admin authentication successful.', user: publicUser(user) })
    return applySessionCookie(res, token, 'ADMIN')
  } catch (error) {
    return serverError('admin/auth', error)
  }
}

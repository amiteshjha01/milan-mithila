import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongo } from '@/lib/mongodb'
import { MongoUser } from '@/lib/mongodb-models'
import { fail, getClientIp, isSameOriginRequest, readJson, serverError } from '@/lib/security/guard'
import { hashToken, revokeAllUserSessions } from '@/lib/security/session'
import { hashPassword, validatePasswordStrength } from '@/lib/security/password'
import { rateLimit } from '@/lib/security/rate-limit'

export const dynamic = 'force-dynamic'

const resetSchema = z.object({ token: z.string().min(20).max(200), password: z.string().min(1).max(128) })

/**
 * Consumes a single-use reset token, sets a new Argon2id hash, clears the
 * mandatory-reset flag, and revokes ALL existing sessions of the account.
 */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return fail(403, 'Cross-site request blocked.')
  try {
    if (!rateLimit(`reset:ip:${getClientIp(request)}`, 10, 60 * 60_000).allowed) return fail(429, 'Too many requests. Please try again later.')
    const parsed = resetSchema.safeParse(await readJson(request))
    if (!parsed.success) return fail(400, 'This reset link is invalid or has expired.')

    const mongo = await connectMongo()
    if (!mongo) return fail(503, 'Service temporarily unavailable.')

    const tokenHash = hashToken(parsed.data.token)
    const candidate: any = await MongoUser.findOne({ resetPasswordToken: tokenHash, resetPasswordExpires: { $gt: new Date() } }).lean()
    if (!candidate || candidate.role === 'ADMIN' || candidate.role === 'MODERATOR') return fail(400, 'This reset link is invalid or has expired.')

    const weak = validatePasswordStrength(parsed.data.password, candidate.email)
    if (weak) return fail(400, weak)

    const passwordHash = await hashPassword(parsed.data.password)
    // Atomic consume: only one request can win this token.
    const updated: any = await MongoUser.findOneAndUpdate(
      { _id: candidate._id, resetPasswordToken: tokenHash, resetPasswordExpires: { $gt: new Date() } },
      {
        $set: { passwordHash, mustResetPassword: false, passwordChangedAt: new Date(), failedLoginCount: 0, isVerified: true },
        $unset: { resetPasswordToken: 1, resetPasswordExpires: 1, lockedUntil: 1 },
      }
    )
    if (!updated) return fail(400, 'This reset link is invalid or has expired.')

    await revokeAllUserSessions(String(updated._id), 'password_reset')
    return NextResponse.json({ ok: true, message: 'Your password has been updated. Please sign in.' })
  } catch (error) {
    return serverError('auth/reset-password', error)
  }
}

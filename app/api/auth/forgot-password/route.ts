import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongo } from '@/lib/mongodb'
import { MongoUser } from '@/lib/mongodb-models'
import { fail, getClientIp, isSameOriginRequest, readJson, serverError } from '@/lib/security/guard'
import { generateToken, hashToken } from '@/lib/security/session'
import { rateLimit } from '@/lib/security/rate-limit'
import { sendPasswordResetEmail } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

const RESET_TTL_MS = 30 * 60_000
const forgotSchema = z.object({ email: z.string().trim().toLowerCase().email().max(254) })

// Identical for existing and non-existing accounts => no e-mail enumeration.
const GENERIC = 'If an account exists for this email, password reset instructions have been sent.'

function appBaseUrl(): string | null {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '')
  return process.env.NODE_ENV === 'production' ? null : 'http://localhost:3000'
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return fail(403, 'Cross-site request blocked.')
  try {
    const parsed = forgotSchema.safeParse(await readJson(request))
    if (!parsed.success) return fail(400, 'Please enter a valid email address.')
    const { email } = parsed.data

    const ip = getClientIp(request)
    if (!rateLimit(`forgot:ip:${ip}`, 10, 60 * 60_000).allowed || !rateLimit(`forgot:email:${email}`, 3, 60 * 60_000).allowed) {
      return fail(429, 'Too many requests. Please try again later.')
    }

    const mongo = await connectMongo()
    if (!mongo) return fail(503, 'Service temporarily unavailable.')

    const user: any = await MongoUser.findOne({ email }).lean()
    const base = appBaseUrl()
    // Privileged accounts recover through the operator runbook, not self-service e-mail.
    if (user && base && user.role !== 'ADMIN' && user.role !== 'MODERATOR' && user.accountStatus !== 'BLOCKED') {
      const token = generateToken()
      await MongoUser.updateOne(
        { _id: user._id },
        { $set: { resetPasswordToken: hashToken(token), resetPasswordExpires: new Date(Date.now() + RESET_TTL_MS) } }
      )
      await sendPasswordResetEmail(email, `${base}/reset-password?token=${encodeURIComponent(token)}`)
    }
    return NextResponse.json({ ok: true, message: GENERIC })
  } catch (error) {
    return serverError('auth/forgot-password', error)
  }
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongo } from '@/lib/mongodb'
import { MongoUser, MongoProfile } from '@/lib/mongodb-models'
import { createMember, publicUser } from '@/lib/accounts'
import { hashPassword, validatePasswordStrength } from '@/lib/security/password'
import { createSession } from '@/lib/security/session'
import { applySessionCookie, fail, getClientIp, isSameOriginRequest, readJson, serverError } from '@/lib/security/guard'
import { rateLimit } from '@/lib/security/rate-limit'

export const dynamic = 'force-dynamic'

const signupSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(128),
  // Privileged roles (MODERATOR/ADMIN) can never be self-assigned.
  role: z.enum(['SEEKER', 'PARENT', 'GUARDIAN']).default('SEEKER'),
  gender: z.enum(['Woman', 'Man', 'Non-binary', 'Prefer not to disclose']).default('Woman'),
  phone: z.string().trim().max(20).regex(/^[0-9+\-() ]*$/).optional(),
  currentCity: z.string().trim().max(80).default('Patna'),
  nativeDistrict: z.string().trim().max(80).default('Madhubani'),
  gotra: z.string().trim().max(60).optional(),
  profession: z.string().trim().max(80).default('Professional'),
})

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return fail(403, 'Cross-site request blocked.')
  try {
    const ip = getClientIp(request)
    if (!rateLimit(`signup:ip:${ip}`, 10, 60 * 60_000).allowed) return fail(429, 'Too many sign-up attempts. Please try again later.')

    const parsed = signupSchema.safeParse(await readJson(request))
    if (!parsed.success) return fail(400, 'Please fill all required registration details accurately.')
    const d = parsed.data

    const weak = validatePasswordStrength(d.password, d.email)
    if (weak) return fail(400, weak)

    const mongo = await connectMongo()
    if (!mongo) return fail(503, 'Service temporarily unavailable.')

    if (await MongoUser.exists({ email: d.email })) {
      return fail(409, 'An account with this email already exists. Please log in.')
    }

    const passwordHash = await hashPassword(d.password)
    let created
    try {
      created = await createMember({
        email: d.email,
        name: d.fullName,
        role: d.role,
        gender: d.gender,
        phone: d.phone,
        passwordHash,
        emailVerified: false,
        currentCity: d.currentCity,
        nativeDistrict: d.nativeDistrict,
        gotra: d.gotra,
        profession: d.profession,
        ip,
      })
    } catch (e: any) {
      if (e?.code === 11000) return fail(409, 'An account with this email already exists. Please log in.')
      throw e
    }

    const { token } = await createSession(String(created.user._id), 'USER', { ip, userAgent: request.headers.get('user-agent') || undefined })
    const res = NextResponse.json({ ok: true, user: publicUser(created.user, created.profile), profileCode: created.profile.profileCode })
    return applySessionCookie(res, token, 'USER')
  } catch (error) {
    return serverError('auth/signup', error)
  }
}

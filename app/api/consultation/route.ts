import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongo } from '@/lib/mongodb'
import { VipConsultation } from '@/lib/mongodb-models'
import { fail, getClientIp, isSameOriginRequest, readJson, serverError } from '@/lib/security/guard'
import { rateLimit } from '@/lib/security/rate-limit'

export const dynamic = 'force-dynamic'

const t = (max: number) => z.string().trim().max(max)
const reqSchema = z.object({
  candidateName: t(100).min(1),
  guardianName: t(100).optional(),
  relationship: t(60).optional(),
  phone: t(20).min(6).regex(/^[0-9+\-() ]+$/),
  email: z.string().trim().email().max(254).optional().or(z.literal('')),
  profession: t(100).optional(),
  tier: t(30).optional(),
  preferredDistrict: t(80).optional(),
  preferredTime: t(80).optional(),
  notes: t(1000).optional(),
})

/** Public lead form: validated, rate limited, same-origin only, and it never pretends to succeed when storage is down. */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return fail(403, 'Cross-site request blocked.')
  try {
    if (!rateLimit(`consult:${getClientIp(request)}`, 5, 60 * 60_000).allowed) return fail(429, 'Too many requests. Please try again later.')
    const parsed = reqSchema.safeParse(await readJson(request))
    if (!parsed.success) return fail(400, 'Please provide valid name and contact phone.')

    const mongo = await connectMongo()
    if (!mongo) return fail(503, 'Service temporarily unavailable.')

    const record = await VipConsultation.create(parsed.data)
    return NextResponse.json({
      ok: true,
      referenceId: `VIP-${String(record._id).slice(-6).toUpperCase()}`,
      message: 'Consultation request received by Relationship Management Desk',
    })
  } catch (error) {
    return serverError('consultation', error)
  }
}

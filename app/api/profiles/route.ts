import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MithilaProfile, MongoShortlist, MongoInterest } from '@/lib/mongodb-models'
import { authenticate, escapeRegex, serverError } from '@/lib/security/guard'
import {
  canViewProfile, getConnectionCodes, getInactiveUserIds, getViewer, normalizeLevel,
  relationTo, serializeProfileCard,
} from '@/lib/security/privacy'

export const dynamic = 'force-dynamic'

const str = z.string().trim().max(60).optional()
// currentUserId / currentUserName / currentUserGender are accepted (legacy clients) but IGNORED:
// the viewer is always the session user.
const querySchema = z.object({
  city: str, profession: str, nativeDistrict: str, gotra: str,
  q: z.string().trim().max(80).optional(),
  targetGender: str, gender: str,
})

const rx = (v: string) => ({ $regex: escapeRegex(v), $options: 'i' })

export async function GET(request: Request) {
  try {
    const result = await authenticate(request)
    if (!result.ok) return result.response
    const parsedQ = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams))
    const query = parsedQ.success ? parsedQ.data : {}

    const viewer = await getViewer(result.auth)
    const inactive = await getInactiveUserIds()

    const and: Record<string, any>[] = [
      { visibility: { $in: ['COMMUNITY', 'CONNECTIONS_ONLY'] } },
      { profileCode: { $not: /^MM-ADMIN/i } },
      { profession: { $ne: 'Platform Administrator' } },
      { userId: { $nin: [viewer.userId, ...inactive] } },
    ]

    // Gender rule derived from the viewer's own stored profile, never from client input.
    const me: any = await MithilaProfile.findOne({ userId: viewer.userId }, 'gender').lean()
    const g = String(me?.gender || '').toLowerCase()
    if (g === 'man') and.push({ gender: 'Woman' })
    else if (g === 'woman') and.push({ gender: 'Man' })

    if (query.city) and.push({ currentCity: rx(query.city) })
    if (query.profession) and.push({ profession: rx(query.profession) })
    if (query.nativeDistrict) and.push({ nativeDistrict: rx(query.nativeDistrict) })
    // Lineage filters must not act as an oracle for hidden data: they only match
    // profiles that have made their cultural information visible to members.
    const culturalOpen = { culturalVisibility: { $in: ['MEMBERS', null] } }
    if (query.gotra) and.push({ gotra: rx(query.gotra) }, culturalOpen)
    if (query.q) {
      const r = rx(query.q)
      and.push({
        $or: [
          { displayName: r }, { profileCode: r }, { profession: r }, { currentCity: r }, { nativeDistrict: r }, { introduction: r },
          { $and: [{ gotra: r }, culturalOpen] },
        ],
      })
    }

    const found: any[] = await MithilaProfile.find({ $and: and }).sort({ createdAt: -1 }).limit(100).lean()
    const connections = await getConnectionCodes(viewer)

    const [shortlists, interests]: any[] = await Promise.all([
      MongoShortlist.find({ userId: { $in: viewer.keys } }).lean(),
      MongoInterest.find({ senderId: { $in: viewer.keys } }).lean(),
    ])
    const shortlisted = new Set(shortlists.map((s: any) => s.profileId))
    const interested = new Set(interests.map((i: any) => i.receiverId))

    const profiles = found
      .map((p) => ({ p, relation: relationTo(p, viewer, connections) }))
      .filter(({ p, relation }) => canViewProfile(p, relation, true))
      // belt and braces: a CONNECTIONS-only cultural value must not satisfy gotra filters either
      .filter(({ p }) => !query.gotra || normalizeLevel(p.culturalVisibility ?? 'MEMBERS') === 'MEMBERS')
      .slice(0, 50)
      .map(({ p, relation }) => serializeProfileCard(p, relation, { shortlisted: shortlisted.has(p.profileCode), interested: interested.has(p.profileCode) }))

    const res = NextResponse.json({ profiles, count: profiles.length, source: 'mongodb' })
    res.headers.set('Cache-Control', 'private, no-store')
    return res
  } catch (error) {
    return serverError('profiles GET', error)
  }
}

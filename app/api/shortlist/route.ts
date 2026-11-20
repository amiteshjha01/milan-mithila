import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MongoShortlist, MongoProfile, MongoUser } from '@/lib/mongodb-models'
import { authenticate, fail, readJson, serverError } from '@/lib/security/guard'
import { canViewProfile, getConnectionCodes, getViewer, relationTo } from '@/lib/security/privacy'

export const dynamic = 'force-dynamic'

// userId is never accepted from the client; the owner is the session user.
const schema = z.object({
  profileId: z.string().trim().min(1).max(40).optional(),
  targetProfileId: z.string().trim().min(1).max(40).optional(),
})

export async function GET(request: Request) {
  try {
    const result = await authenticate(request)
    if (!result.ok) return result.response
    const viewer = await getViewer(result.auth)
    const items: any[] = await MongoShortlist.find({ userId: { $in: viewer.keys } }).sort({ createdAt: -1 }).lean()
    const res = NextResponse.json({
      ok: true,
      shortlists: items.map((i) => ({ _id: String(i._id), profileId: i.profileId, note: i.note, createdAt: i.createdAt })),
      count: items.length,
    })
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch (error) {
    return serverError('shortlist GET', error)
  }
}

export async function POST(request: Request) {
  try {
    const result = await authenticate(request)
    if (!result.ok) return result.response
    const parsed = schema.safeParse(await readJson(request))
    const profileId = parsed.success ? parsed.data.profileId || parsed.data.targetProfileId : undefined
    if (!profileId) return fail(400, 'Invalid profileId.')

    const viewer = await getViewer(result.auth)
    if (viewer.keys.includes(profileId)) return fail(400, 'You cannot shortlist your own profile.')

    // Removing an existing entry never requires the target to still be visible.
    const existing: any = await MongoShortlist.findOne({ userId: { $in: viewer.keys }, profileId })
    if (existing) {
      await MongoShortlist.deleteOne({ _id: existing._id })
      return NextResponse.json({ ok: true, action: 'removed', profileId })
    }

    const target: any = await MongoProfile.findOne({ profileCode: profileId }).lean()
    const owner: any = target ? await MongoUser.findById(target.userId, 'accountStatus').lean() : null
    const connections = await getConnectionCodes(viewer)
    if (!target || !canViewProfile(target, relationTo(target, viewer, connections), owner?.accountStatus === 'ACTIVE')) {
      return fail(404, 'Profile not found.')
    }
    await MongoShortlist.create({ userId: viewer.userId, profileId, note: 'Shortlisted by member' })
    return NextResponse.json({ ok: true, action: 'added', profileId })
  } catch (error) {
    return serverError('shortlist POST', error)
  }
}

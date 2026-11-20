import { NextResponse } from 'next/server'
import { MithilaProfile, MongoShortlist, MongoInterest, MongoUser } from '@/lib/mongodb-models'
import { authenticate, fail, serverError } from '@/lib/security/guard'
import { canViewProfile, getConnectionCodes, getViewer, relationTo, serializeProfileDetail } from '@/lib/security/privacy'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ profileId: string }> }) {
  try {
    const result = await authenticate(request)
    if (!result.ok) return result.response
    const { profileId } = await params
    // Lookup is by public profile code only (no raw ObjectId lookups).
    if (!/^MM-[A-Za-z0-9-]{1,30}$/.test(profileId)) return fail(404, 'Profile not found.')

    const viewer = await getViewer(result.auth)
    const p: any = await MithilaProfile.findOne({ profileCode: profileId }).lean()
    const owner: any = p ? await MongoUser.findById(p.userId, 'accountStatus').lean() : null
    const connections = p ? await getConnectionCodes(viewer) : new Set<string>()
    const relation = p ? relationTo(p, viewer, connections) : 'MEMBER'

    // 404 (not 403) for hidden profiles so their existence is not revealed.
    if (!p || !canViewProfile(p, relation, owner?.accountStatus === 'ACTIVE')) return fail(404, 'Profile not found.')

    const [shortlisted, interested] = await Promise.all([
      MongoShortlist.exists({ userId: { $in: viewer.keys }, profileId: p.profileCode }),
      MongoInterest.exists({ senderId: { $in: viewer.keys }, receiverId: p.profileCode }),
    ])
    const res = NextResponse.json({ ok: true, profile: serializeProfileDetail(p, relation, { shortlisted: Boolean(shortlisted), interested: Boolean(interested) }) })
    res.headers.set('Cache-Control', 'private, no-store')
    return res
  } catch (error) {
    return serverError('profiles/[id] GET', error)
  }
}

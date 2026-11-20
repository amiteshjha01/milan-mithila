import { NextResponse } from 'next/server'
import {
  MongoUser,
  MongoProfile,
  MongoShortlist,
  MongoInterest,
  MongoConversation,
  VipConsultation,
} from '@/lib/mongodb-models'
import { authenticate, serverError } from '@/lib/security/guard'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Independent server-side check: elevated ADMIN-kind session AND ADMIN/MODERATOR role.
    const result = await authenticate(request, { roles: ['ADMIN', 'MODERATOR'], adminSession: true })
    if (!result.ok) return result.response

    const [totalUsers, totalProfiles, verifiedProfiles, totalShortlists, totalInterests, totalConversations, totalVipConsultations] =
      await Promise.all([
        MongoUser.countDocuments(),
        MongoProfile.countDocuments(),
        MongoProfile.countDocuments({ verified: true }),
        MongoShortlist.countDocuments(),
        MongoInterest.countDocuments(),
        MongoConversation.countDocuments(),
        VipConsultation.countDocuments(),
      ])

    const vipConsultations = await VipConsultation.find().sort({ createdAt: -1 }).limit(20).lean()
    const [profiles, users]: any[] = await Promise.all([
      MongoProfile.find().sort({ createdAt: -1 }).lean(),
      MongoUser.find().sort({ createdAt: -1 }).lean(),
    ])
    const userMap = new Map(users.map((u: any) => [String(u._id), u]))

    const members = profiles.map((p: any) => {
      const u: any = userMap.get(String(p.userId)) || {}
      return {
        id: String(p._id),
        userId: String(p.userId),
        profileCode: p.profileCode,
        name: p.displayName,
        email: u.email || 'N/A',
        role: u.role || 'SEEKER',
        accountStatus: u.accountStatus || 'ACTIVE',
        verified: p.verified || false,
        verificationLabel: p.verificationLabel || 'Email not verified',
        gender: p.gender,
        age: p.age,
        city: p.currentCity,
        nativeDistrict: p.nativeDistrict,
        gotra: p.gotra,
        mool: p.mool,
        avatar: p.photos?.[0]?.url || '/images/placeholder-user.jpg',
        createdAt: p.createdAt,
      }
    })

    const res = NextResponse.json({
      ok: true,
      stats: { totalUsers, totalProfiles, verifiedProfiles, totalShortlists, totalInterests, totalConversations, totalVipConsultations },
      members,
      vipConsultations,
      database: { connected: true },
      viewerRole: result.auth.user.role,
    })
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch (error) {
    return serverError('admin/stats', error)
  }
}

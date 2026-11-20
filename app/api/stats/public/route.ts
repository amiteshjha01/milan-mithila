import { NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongodb'
import { MithilaProfile } from '@/lib/mongodb-models'
import { getInactiveUserIds } from '@/lib/security/privacy'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const conn = await connectMongo()
    if (!conn) {
      return NextResponse.json({ ok: true, totalProfiles: 0, districts: {} })
    }

    const inactive = await getInactiveUserIds()
    const match = {
      visibility: 'COMMUNITY',
      profileCode: { $not: /^MM-ADMIN/i },
      profession: { $ne: 'Platform Administrator' },
      ...(inactive.length > 0 ? { userId: { $nin: inactive } } : {}),
    }

    const [totalProfiles, grouped] = await Promise.all([
      MithilaProfile.countDocuments(match),
      MithilaProfile.aggregate([
        { $match: match },
        {
          $group: {
            _id: { $toLower: { $ifNull: ['$nativeDistrict', ''] } },
            count: { $sum: 1 },
          },
        },
      ]),
    ])

    const districts: Record<string, number> = {}
    for (const row of grouped) {
      if (row._id) districts[String(row._id).trim()] = row.count
    }

    const res = NextResponse.json({
      ok: true,
      totalProfiles,
      districts,
    })
    res.headers.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=300')
    return res
  } catch {
    return NextResponse.json({ ok: true, totalProfiles: 0, districts: {} })
  }
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MongoProfile } from '@/lib/mongodb-models'
import { authenticate, fail, readJson, serverError } from '@/lib/security/guard'

export const dynamic = 'force-dynamic'

// Client-supplied userId/email are not part of the schema and are ignored.
const settingsSchema = z.object({
  visibility: z.string().trim().max(30).optional(),
  culturalVisibility: z.string().trim().max(30).optional(),
  photoVisibility: z.string().trim().max(30).optional(),
  emailNotifs: z.boolean().optional(),
  familyAssistance: z.boolean().optional(),
})

const VIS: Record<string, string> = { COMMUNITY: 'COMMUNITY', CONNECTIONS: 'CONNECTIONS_ONLY', CONNECTIONS_ONLY: 'CONNECTIONS_ONLY', PAUSED: 'PAUSED' }
const CULT: Record<string, string> = { MEMBERS: 'MEMBERS', CONNECTIONS: 'CONNECTIONS', PRIVATE: 'PRIVATE' }
const PHOTO: Record<string, string> = { MEMBERS: 'MEMBERS', CONNECTIONS: 'CONNECTIONS' }

export async function GET(request: Request) {
  try {
    const result = await authenticate(request)
    if (!result.ok) return result.response
    const profile: any = await MongoProfile.findOne({ userId: result.auth.user.id }).lean()
    const res = NextResponse.json({
      ok: true,
      settings: {
        visibility: profile?.visibility === 'CONNECTIONS_ONLY' ? 'CONNECTIONS' : profile?.visibility || 'COMMUNITY',
        culturalVisibility: profile?.culturalVisibility || 'MEMBERS',
        photoVisibility: profile?.photoVisibility || 'MEMBERS',
        emailNotifs: true,
        familyAssistance: true,
      },
    })
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch (error) {
    return serverError('settings GET', error)
  }
}

export async function POST(request: Request) {
  try {
    const result = await authenticate(request)
    if (!result.ok) return result.response
    const parsed = settingsSchema.safeParse(await readJson(request))
    if (!parsed.success) return fail(400, 'Invalid settings payload.')
    const d = parsed.data

    const update: Record<string, string> = {}
    const apply = (key: string, raw: string | undefined, map: Record<string, string>) => {
      if (raw === undefined) return true
      const v = map[raw.toUpperCase()]
      if (!v) return false
      update[key] = v
      return true
    }
    if (!apply('visibility', d.visibility, VIS) || !apply('culturalVisibility', d.culturalVisibility, CULT) || !apply('photoVisibility', d.photoVisibility, PHOTO)) {
      return fail(400, 'Invalid visibility value.')
    }

    const updated = await MongoProfile.findOneAndUpdate({ userId: result.auth.user.id }, { $set: update }, { returnDocument: 'after', runValidators: true }).lean()
    if (!updated) return fail(404, 'Profile not found.')
    return NextResponse.json({ ok: true, message: 'Account privacy preferences updated successfully.' })
  } catch (error) {
    return serverError('settings POST', error)
  }
}

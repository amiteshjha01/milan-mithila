import { NextResponse } from 'next/server'
import { MongoProfile, MongoUser } from '@/lib/mongodb-models'
import { publicUser } from '@/lib/accounts'
import { authenticate, serverError } from '@/lib/security/guard'

export const dynamic = 'force-dynamic'

/** Returns the identity of the current server-side session (the only source of "who am I"). */
export async function GET(request: Request) {
  try {
    const result = await authenticate(request, { allowMustReset: true })
    if (!result.ok) return result.response
    const { auth } = result
    const [user, profile] = await Promise.all([
      MongoUser.findById(auth.user.id).lean(),
      MongoProfile.findOne({ userId: auth.user.id }).lean(),
    ])
    const res = NextResponse.json({ ok: true, user: publicUser(user, profile), sessionKind: auth.kind })
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch (error) {
    return serverError('auth/me', error)
  }
}

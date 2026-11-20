import { NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongodb'
import { authenticate, clearSessionCookie, fail, getSessionToken, isSameOriginRequest, serverError } from '@/lib/security/guard'
import { revokeSessionByToken } from '@/lib/security/session'

export const dynamic = 'force-dynamic'

/** Revokes the server-side session (not just the cookie) and clears the cookie. Idempotent. */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return fail(403, 'Cross-site request blocked.')
  try {
    if (await connectMongo()) await revokeSessionByToken(getSessionToken(request), 'logout')
    return clearSessionCookie(NextResponse.json({ ok: true }))
  } catch (error) {
    return serverError('auth/logout', error)
  }
}

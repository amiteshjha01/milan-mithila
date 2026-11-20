import { NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongodb'
import {
  SESSION_COOKIE_NAME,
  SESSION_POLICY,
  validateSessionToken,
  type SessionKind,
  type ValidSession,
} from '@/lib/security/session'

export type Role = 'SEEKER' | 'PARENT' | 'GUARDIAN' | 'MODERATOR' | 'ADMIN'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

/** Uniform JSON error helper. Never include internal error messages. */
export function fail(status: number, error: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, error, ...extra }, { status })
}

/** Log server-side, return a generic message to the client. */
export function serverError(scope: string, error: unknown) {
  const name = error instanceof Error ? error.name : 'Error'
  console.error(`[${scope}] ${name}`) // intentionally no message/body: may contain PII or secrets
  return fail(500, 'Something went wrong. Please try again.')
}

export function getClientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim().slice(0, 64)
  return request.headers.get('x-real-ip')?.slice(0, 64) || 'unknown'
}

export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx < 0) continue
    const k = part.slice(0, idx).trim()
    if (k) out[k] = decodeURIComponent(part.slice(idx + 1).trim())
  }
  return out
}

export function getSessionToken(request: Request): string | undefined {
  return parseCookies(request.headers.get('cookie'))[SESSION_COOKIE_NAME]
}

export function applySessionCookie(response: NextResponse, token: string, kind: SessionKind) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_POLICY[kind].absoluteMs / 1000),
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}

/**
 * CSRF defence for cookie-authenticated, state-changing requests:
 *  1. SameSite=Lax session cookie (not sent on cross-site POST), and
 *  2. strict Origin / Sec-Fetch-Site verification here (OWASP "verify origin with standard headers").
 * Requests carrying neither header are rejected.
 */
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || new URL(request.url).host
  if (origin) {
    const extra = (process.env.APP_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
    if (extra.includes(origin)) return true
    try {
      return new URL(origin).host === host
    } catch {
      return false
    }
  }
  const site = request.headers.get('sec-fetch-site')
  return site === 'same-origin' || site === 'none'
}

export type AuthContext = ValidSession

interface AuthOptions {
  /** Allowed roles. Omit for "any authenticated user". */
  roles?: Role[]
  /** Force CSRF check even for safe methods (default: only for state-changing methods). */
  csrf?: boolean
  /** Require an ADMIN-kind (short-lived, elevated) session. */
  adminSession?: boolean
  /** Allow users flagged mustResetPassword (only the account endpoints should). */
  allowMustReset?: boolean
}

type AuthResult = { ok: true; auth: AuthContext } | { ok: false; response: NextResponse }

/**
 * The single entry point for identity. User identity ALWAYS comes from the validated
 * server-side session; nothing from the request body/query is ever trusted as identity.
 * Fails closed: database unavailable => 503, never a demo session.
 */
export async function authenticate(request: Request, options: AuthOptions = {}): Promise<AuthResult> {
  const mutating = !SAFE_METHODS.has(request.method.toUpperCase())
  if ((mutating || options.csrf) && !isSameOriginRequest(request)) {
    return { ok: false, response: fail(403, 'Cross-site request blocked.') }
  }

  const mongo = await connectMongo()
  if (!mongo) return { ok: false, response: fail(503, 'Service temporarily unavailable.') }

  let session: ValidSession | null = null
  try {
    session = await validateSessionToken(getSessionToken(request))
  } catch {
    return { ok: false, response: fail(503, 'Service temporarily unavailable.') }
  }
  if (!session) return { ok: false, response: fail(401, 'Authentication required.') }

  if (session.user.mustResetPassword && !options.allowMustReset) {
    return { ok: false, response: fail(403, 'Password reset required.', { code: 'PASSWORD_RESET_REQUIRED' }) }
  }
  if (options.adminSession && session.kind !== 'ADMIN') {
    return { ok: false, response: fail(403, 'Administrator session required.') }
  }
  if (options.roles && !options.roles.includes(session.user.role as Role)) {
    return { ok: false, response: fail(403, 'You do not have permission to perform this action.') }
  }
  return { ok: true, auth: session }
}

export async function readJson(request: Request): Promise<unknown | null> {
  try {
    const text = await request.text()
    if (text.length > 6_000_000) return null
    return JSON.parse(text)
  } catch {
    return null
  }
}

export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/

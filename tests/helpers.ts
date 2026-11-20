import { NextResponse } from 'next/server'

const BASE = 'http://localhost:3000'

export interface CallOptions {
  body?: unknown
  cookie?: string
  /** default: same-origin. Pass null to omit the header, or a string for a foreign origin. */
  origin?: string | null
  params?: Record<string, string>
  headers?: Record<string, string>
}

export async function call(handler: (req: Request, ctx?: any) => Promise<Response> | Response, method: string, path: string, opts: CallOptions = {}) {
  const headers: Record<string, string> = { 'content-type': 'application/json', ...(opts.headers || {}) }
  if (opts.cookie) headers.cookie = opts.cookie
  if (opts.origin !== null) headers.origin = opts.origin ?? BASE
  const req = new Request(BASE + path, {
    method,
    headers,
    body: opts.body === undefined ? undefined : typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body),
  })
  const res = (await handler(req, opts.params ? { params: Promise.resolve(opts.params) } : undefined)) as Response
  const text = await res.text()
  let json: any = null
  try {
    json = JSON.parse(text)
  } catch {}
  const setCookie = res.headers.get('set-cookie') || ''
  return { status: res.status, json, text, setCookie, headers: res.headers }
}

/** Extract `name=value` from a Set-Cookie header, usable as a Cookie request header. */
export function cookieFrom(setCookie: string): string {
  const m = /(?:^|,\s*)((?:__Host-)?mm_session)=([^;]*)/.exec(setCookie)
  return m ? `${m[1]}=${m[2]}` : ''
}

export const STRONG_PASSWORD = 'correct-horse-Battery-9'

let counter = 0
export async function signup(overrides: Record<string, unknown> = {}) {
  const { POST } = await import('@/app/api/auth/signup/route')
  const n = ++counter
  const body = {
    fullName: `Test Member ${n}`,
    email: `member${n}-${Math.random().toString(36).slice(2, 6)}@example.com`,
    password: STRONG_PASSWORD,
    gender: 'Woman',
    ...overrides,
  }
  const r = await call(POST, 'POST', '/api/auth/signup', { body })
  if (r.status !== 200) throw new Error(`signup failed: ${r.status} ${r.text}`)
  return { cookie: cookieFrom(r.setCookie), email: body.email as string, userId: r.json.user.id as string, profileCode: r.json.profileCode as string, password: body.password as string }
}

export async function createAdmin(role: 'ADMIN' | 'MODERATOR' = 'ADMIN', password = 'Adm1n-Test-Secret-2026!') {
  const { MongoUser } = await import('@/lib/mongodb-models')
  const { hashPassword } = await import('@/lib/security/password')
  const email = `${role.toLowerCase()}-${Math.random().toString(36).slice(2, 6)}@ops.example.org`
  const user = await MongoUser.create({ email, name: role, role, isVerified: true, passwordHash: await hashPassword(password) })
  const { POST } = await import('@/app/api/admin/auth/route')
  const r = await call(POST, 'POST', '/api/admin/auth', { body: { email, password } })
  if (r.status !== 200) throw new Error(`admin login failed: ${r.status} ${r.text}`)
  return { cookie: cookieFrom(r.setCookie), email, password, userId: String(user._id) }
}

export { NextResponse }

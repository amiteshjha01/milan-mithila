import { describe, expect, it, vi } from 'vitest'
import crypto from 'node:crypto'
import { OAuth2Client } from 'google-auth-library'
import { call, cookieFrom, signup, STRONG_PASSWORD } from './helpers'

const sentLinks: { to: string; url: string }[] = []
vi.mock('@/lib/mailer', () => ({
  sendPasswordResetEmail: async (to: string, url: string) => {
    sentLinks.push({ to, url })
  },
}))

const login = async (body: unknown, opts: any = {}) => (await import('@/app/api/auth/login/route')).POST && call((await import('@/app/api/auth/login/route')).POST, 'POST', '/api/auth/login', { body, ...opts })
const me = async (cookie?: string) => call((await import('@/app/api/auth/me/route')).GET, 'GET', '/api/auth/me', { cookie })

describe('Signup and password storage', () => {
  it('signs up with a password and sets an HttpOnly, SameSite session cookie', async () => {
    const { POST } = await import('@/app/api/auth/signup/route')
    const r = await call(POST, 'POST', '/api/auth/signup', { body: { fullName: 'Asha Jha', email: 'asha@example.com', password: STRONG_PASSWORD } })
    expect(r.status).toBe(200)
    expect(r.json.ok).toBe(true)
    expect(r.setCookie).toMatch(/mm_session=/)
    expect(r.setCookie).toMatch(/HttpOnly/i)
    expect(r.setCookie).toMatch(/SameSite=lax/i)
    expect(r.setCookie).toMatch(/Path=\//)
  })

  it('stores the password only as an Argon2id hash and never returns or leaks it', async () => {
    const u = await signup()
    const { MongoUser } = await import('@/lib/mongodb-models')
    const raw: any = await MongoUser.collection.findOne({ email: u.email })
    expect(raw.passwordHash).toMatch(/^\$argon2id\$/)
    expect(raw.passwordHash).not.toContain(u.password)
    expect(JSON.stringify(raw)).not.toContain(u.password)
    const meRes = await me(u.cookie)
    expect(meRes.text).not.toContain('passwordHash')
    expect(meRes.text).not.toContain(u.password)
  })

  it('rejects weak/short passwords and privileged role self-assignment', async () => {
    const { POST } = await import('@/app/api/auth/signup/route')
    const weak = await call(POST, 'POST', '/api/auth/signup', { body: { fullName: 'Weak One', email: 'weak@example.com', password: 'short' } })
    expect(weak.status).toBe(400)
    const common = await call(POST, 'POST', '/api/auth/signup', { body: { fullName: 'Weak Two', email: 'weak2@example.com', password: 'password123' } })
    expect(common.status).toBe(400)
    const esc = await call(POST, 'POST', '/api/auth/signup', { body: { fullName: 'Evil One', email: 'evil@example.com', password: STRONG_PASSWORD, role: 'ADMIN' } })
    expect(esc.status).toBe(400)
  })

  it('verifies hashes with the argon2 library (unit)', async () => {
    const { hashPassword, verifyPassword } = await import('@/lib/security/password')
    const h = await hashPassword('Another-Strong-Pass-1')
    expect(await verifyPassword(h, 'Another-Strong-Pass-1')).toBe(true)
    expect(await verifyPassword(h, 'Another-Strong-Pass-2')).toBe(false)
    expect(await verifyPassword('plaintext-value', 'plaintext-value')).toBe(false) // never compares plaintext
  })
})

describe('Login: password verification and bypass attempts', () => {
  it('accepts the correct password', async () => {
    const u = await signup()
    const r = await login({ email: u.email, password: u.password, provider: 'CREDENTIALS' })
    expect(r.status).toBe(200)
    expect(cookieFrom(r.setCookie)).toMatch(/mm_session=/)
    expect(r.json.user.email).toBe(u.email)
  })

  it('rejects an incorrect password', async () => {
    const u = await signup()
    const r = await login({ email: u.email, password: 'wrong-Password-123', provider: 'CREDENTIALS' })
    expect(r.status).toBe(401)
    expect(r.setCookie).toBe('')
  })

  it('rejects email-only login (the old authentication bypass)', async () => {
    const u = await signup()
    for (const body of [{ email: u.email }, { email: u.email, provider: 'CREDENTIALS' }, { email: u.email, password: '' }, { email: u.email, password: null }]) {
      const r = await login(body)
      expect([400, 401]).toContain(r.status)
      expect(r.setCookie).toBe('')
    }
  })

  it('rejects client-supplied Google identity without a token', async () => {
    const u = await signup()
    const r = await login({ email: u.email, provider: 'GOOGLE', googleName: 'Anything' })
    expect(r.status).toBe(400)
    expect(r.setCookie).toBe('')
  })

  it('does not reveal whether the email exists', async () => {
    const u = await signup()
    const a = await login({ email: u.email, password: 'wrong-Password-123' })
    const b = await login({ email: 'nobody@example.com', password: 'wrong-Password-123' })
    expect(a.status).toBe(b.status)
    expect(a.json.error).toBe(b.json.error)
  })

  it('rejects a legacy plaintext "passwordHash" (never compares plaintext)', async () => {
    const { MongoUser } = await import('@/lib/mongodb-models')
    await MongoUser.collection.insertOne({ email: 'legacy@example.com', name: 'Legacy', role: 'SEEKER', accountStatus: 'ACTIVE', passwordHash: 'oldplain123', createdAt: new Date() })
    const r = await login({ email: 'legacy@example.com', password: 'oldplain123' })
    expect(r.status).toBe(401)
  })

  it('refuses administrators on the member login endpoint', async () => {
    const { createAdmin } = await import('./helpers')
    const a = await createAdmin('ADMIN')
    const r = await login({ email: a.email, password: a.password })
    expect(r.status).toBe(401)
  })

  it('locks the account after repeated failures and rate-limits brute force', async () => {
    const u = await signup()
    const statuses: number[] = []
    for (let i = 0; i < 10; i++) statuses.push((await login({ email: u.email, password: `wrong-pass-${i}-xx` })).status)
    expect(statuses.slice(0, 5).every((s) => s === 401)).toBe(true)
    expect(statuses.slice(5).every((s) => s === 429)).toBe(true)
    const good = await login({ email: u.email, password: u.password })
    expect(good.status).toBe(429) // correct password cannot bypass the lock
  })
})

describe('Google OAuth token validation', () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
  const pem = publicKey.export({ type: 'spki', format: 'pem' }).toString()
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const aud = 'test-client-id.apps.googleusercontent.com'
  const sign = (over: Record<string, unknown> = {}, signer = privateKey) => {
    const now = Math.floor(Date.now() / 1000)
    const head = b64({ alg: 'RS256', kid: 'k1', typ: 'JWT' })
    const body = b64({ iss: 'https://accounts.google.com', aud, sub: 'g-123', email: 'gu@example.com', email_verified: true, name: 'G User', iat: now - 10, exp: now + 3000, ...over })
    const sig = crypto.sign('RSA-SHA256', Buffer.from(`${head}.${body}`), signer).toString('base64url')
    return `${head}.${body}.${sig}`
  }
  const mockCerts = () => vi.spyOn(OAuth2Client.prototype, 'getFederatedSignonCertsAsync').mockResolvedValue({ certs: { k1: pem }, format: 'PEM' } as any)

  it('rejects garbage and malformed tokens', async () => {
    mockCerts()
    for (const t of ['not-a-token-at-all-not-a-token', 'a.b.c', 'x'.repeat(100)]) {
      const r = await login({ provider: 'GOOGLE', idToken: t })
      expect([400, 401]).toContain(r.status)
      expect(r.setCookie).toBe('')
    }
    vi.restoreAllMocks()
  })

  it('rejects wrong audience, wrong issuer, expired, unverified email and forged signature', async () => {
    mockCerts()
    const other = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey
    const bad = [
      sign({ aud: 'someone-elses-client-id' }),
      sign({ iss: 'https://evil.example.com' }),
      sign({ exp: Math.floor(Date.now() / 1000) - 3600, iat: Math.floor(Date.now() / 1000) - 7200 }),
      sign({ email_verified: false }),
      sign({}, other),
    ]
    for (const t of bad) {
      const r = await login({ provider: 'GOOGLE', idToken: t })
      expect(r.status).toBe(401)
    }
    vi.restoreAllMocks()
  })

  it('accepts a valid token, and takes identity only from the token', async () => {
    mockCerts()
    const r = await login({ provider: 'GOOGLE', idToken: sign(), email: 'attacker-chosen@example.com' })
    expect(r.status).toBe(200)
    expect(r.json.user.email).toBe('gu@example.com')
    expect(cookieFrom(r.setCookie)).toMatch(/mm_session=/)
    vi.restoreAllMocks()
  })

  it('cannot be used to take over an admin account', async () => {
    mockCerts()
    const { createAdmin } = await import('./helpers')
    const a = await createAdmin('ADMIN')
    const r = await login({ provider: 'GOOGLE', idToken: sign({ email: a.email, sub: 'g-admin' }) })
    expect(r.status).toBe(401)
    vi.restoreAllMocks()
  })

  it('drops an unverified password account when its email is claimed through Google (pre-hijack defence)', async () => {
    mockCerts()
    const u = await signup({ email: 'gu@example.com' })
    const r = await login({ provider: 'GOOGLE', idToken: sign() })
    expect(r.status).toBe(200)
    expect((await login({ email: 'gu@example.com', password: u.password })).status).toBe(401)
    expect((await me(u.cookie)).status).toBe(401) // attacker's earlier session is revoked
    vi.restoreAllMocks()
  })
})

describe('Sessions: cookie, expiry, revocation, CSRF', () => {
  it('requires a session for /api/auth/me', async () => {
    expect((await me()).status).toBe(401)
    expect((await me('mm_session=forged-token-value-forged-token-value')).status).toBe(401)
  })

  it('does not trust localStorage-style identity: an unsigned cookie with a user id is rejected', async () => {
    const u = await signup()
    expect((await me(`mm_session=${u.userId}`)).status).toBe(401)
  })

  it('stores only a hash of the session token', async () => {
    const u = await signup()
    const { MongoSession } = await import('@/lib/mongodb-models')
    const token = u.cookie.split('=')[1]
    const rows = await MongoSession.collection.find({}).toArray()
    expect(rows.length).toBe(1)
    expect(JSON.stringify(rows)).not.toContain(token)
  })

  it('expires sessions after the absolute lifetime', async () => {
    const u = await signup()
    expect((await me(u.cookie)).status).toBe(200)
    const { MongoSession } = await import('@/lib/mongodb-models')
    await MongoSession.updateMany({}, { $set: { expiresAt: new Date(Date.now() - 1000) } })
    expect((await me(u.cookie)).status).toBe(401)
  })

  it('expires sessions after the idle timeout', async () => {
    const u = await signup()
    const { MongoSession } = await import('@/lib/mongodb-models')
    await MongoSession.updateMany({}, { $set: { lastSeenAt: new Date(Date.now() - 3 * 24 * 3600_000) } })
    expect((await me(u.cookie)).status).toBe(401)
  })

  it('revokes the server-side session on logout (a captured cookie stops working)', async () => {
    const u = await signup()
    const { POST } = await import('@/app/api/auth/logout/route')
    const r = await call(POST, 'POST', '/api/auth/logout', { cookie: u.cookie })
    expect(r.status).toBe(200)
    expect(r.setCookie).toMatch(/Max-Age=0/i)
    expect((await me(u.cookie)).status).toBe(401) // replaying the old cookie fails
  })

  it('revokes sessions when an admin blocks the account', async () => {
    const u = await signup()
    const { createAdmin } = await import('./helpers')
    const admin = await createAdmin('ADMIN')
    const { POST } = await import('@/app/api/admin/users/route')
    const r = await call(POST, 'POST', '/api/admin/users', { cookie: admin.cookie, body: { action: 'CHANGE_STATUS', userId: u.userId, status: 'BLOCKED' } })
    expect(r.status).toBe(200)
    expect((await me(u.cookie)).status).toBe(401)
  })

  it('blocks cross-site state-changing requests (CSRF)', async () => {
    const u = await signup()
    const { POST } = await import('@/app/api/settings/route')
    const evil = await call(POST, 'POST', '/api/settings', { cookie: u.cookie, origin: 'https://evil.example.com', body: { visibility: 'PAUSED' } })
    expect(evil.status).toBe(403)
    const none = await call(POST, 'POST', '/api/settings', { cookie: u.cookie, origin: null, body: { visibility: 'PAUSED' } })
    expect(none.status).toBe(403)
    const ok = await call(POST, 'POST', '/api/settings', { cookie: u.cookie, body: { visibility: 'PAUSED' } })
    expect(ok.status).toBe(200)
    const lg = await login({ email: u.email, password: u.password }, { origin: 'https://evil.example.com' })
    expect(lg.status).toBe(403) // login CSRF
  })
})

describe('Account recovery', () => {
  const forgot = async (email: string) => call((await import('@/app/api/auth/forgot-password/route')).POST, 'POST', '/api/auth/forgot-password', { body: { email } })
  const reset = async (token: string, password: string) => call((await import('@/app/api/auth/reset-password/route')).POST, 'POST', '/api/auth/reset-password', { body: { token, password } })
  const tokenOf = () => new URL(sentLinks[sentLinks.length - 1].url).searchParams.get('token')!

  it('never returns the reset token and answers identically for unknown emails', async () => {
    const u = await signup()
    const known = await forgot(u.email)
    const unknown = await forgot('ghost@example.com')
    expect(known.status).toBe(200)
    expect(known.json).toEqual(unknown.json)
    expect(known.text).not.toMatch(/token|reset_/i)
  })

  it('resets with a single-use token, revokes old sessions and stores a hashed token', async () => {
    const u = await signup()
    sentLinks.length = 0
    await forgot(u.email)
    expect(sentLinks.length).toBe(1)
    const token = tokenOf()
    const { MongoUser } = await import('@/lib/mongodb-models')
    const raw: any = await MongoUser.collection.findOne({ email: u.email })
    expect(raw.resetPasswordToken).not.toBe(token)
    expect(raw.resetPasswordToken).toHaveLength(64)

    expect((await reset(token, 'short')).status).toBe(400)
    const ok = await reset(token, 'Brand-New-Passphrase-77')
    expect(ok.status).toBe(200)
    expect((await reset(token, 'Another-New-Passphrase-88')).status).toBe(400) // single use
    expect((await me(u.cookie)).status).toBe(401) // old sessions revoked
    expect((await login({ email: u.email, password: u.password })).status).toBe(401)
    expect((await login({ email: u.email, password: 'Brand-New-Passphrase-77' })).status).toBe(200)
  })

  it('rejects expired reset tokens', async () => {
    const u = await signup()
    sentLinks.length = 0
    await forgot(u.email)
    const { MongoUser } = await import('@/lib/mongodb-models')
    await MongoUser.collection.updateOne({ email: u.email }, { $set: { resetPasswordExpires: new Date(Date.now() - 1000) } })
    expect((await reset(tokenOf(), 'Brand-New-Passphrase-77')).status).toBe(400)
  })

  it('legacy plaintext accounts are forced through reset and can recover', async () => {
    const { MongoUser } = await import('@/lib/mongodb-models')
    await MongoUser.collection.insertOne({ email: 'old@example.com', name: 'Old User', role: 'SEEKER', accountStatus: 'ACTIVE', passwordHash: 'plain-old', createdAt: new Date() })
    expect((await login({ email: 'old@example.com', password: 'plain-old' })).status).toBe(401)
    sentLinks.length = 0
    await forgot('old@example.com')
    expect((await reset(tokenOf(), 'Recovered-Passphrase-55')).status).toBe(200)
    expect((await login({ email: 'old@example.com', password: 'Recovered-Passphrase-55' })).status).toBe(200)
  })
})

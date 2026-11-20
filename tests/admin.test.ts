import { describe, expect, it } from 'vitest'
import { call, createAdmin, signup, STRONG_PASSWORD } from './helpers'

const adminLogin = async (body: unknown) =>
  call((await import('@/app/api/admin/auth/route')).POST, 'POST', '/api/admin/auth', { body })
const adminStats = async (cookie?: string) =>
  call((await import('@/app/api/admin/stats/route')).GET, 'GET', '/api/admin/stats', { cookie })
const adminUsers = async (body: unknown, cookie?: string) =>
  call((await import('@/app/api/admin/users/route')).POST, 'POST', '/api/admin/users', { body, cookie })

describe('Admin authentication & hardcoded credential removal', () => {
  it('rejects all previously hardcoded fallback admin credentials and auto-provisioning', async () => {
    const legacyAttempts = [
      { email: 'admin@mithilamilan.com', password: 'MithilaAdmin@2026' },
      { email: 'admin@mithilamilan.com', password: 'Admin1234' },
      { email: 'admin@mithila.com', password: 'MithilaAdmin@2026' },
      { email: 'admin', password: 'Admin1234' },
    ]
    for (const creds of legacyAttempts) {
      const r = await adminLogin(creds)
      expect(r.status).toBe(401)
      expect(r.setCookie).toBe('')
    }
    const { MongoUser } = await import('@/lib/mongodb-models')
    expect(await MongoUser.countDocuments({ role: 'ADMIN' })).toBe(0)
  })

  it('rejects regular member accounts attempting to log in via /api/admin/auth', async () => {
    const member = await signup()
    const r = await adminLogin({ email: member.email, password: member.password })
    expect(r.status).toBe(401)
    expect(r.setCookie).toBe('')
  })

  it('authenticates a provisioned ADMIN account with Argon2id hash and issues an ADMIN session', async () => {
    const admin = await createAdmin('ADMIN')
    expect(admin.cookie).toMatch(/mm_session=/)
    const me = await call((await import('@/app/api/auth/me/route')).GET, 'GET', '/api/auth/me', { cookie: admin.cookie })
    expect(me.status).toBe(200)
    expect(me.json.sessionKind).toBe('ADMIN')
    expect(me.json.user.role).toBe('ADMIN')
  })
})

describe('Admin API authorization & RBAC', () => {
  it('rejects unauthenticated requests to /api/admin/stats and /api/admin/users (401)', async () => {
    const u = await signup()
    expect((await adminStats()).status).toBe(401)
    expect((await adminUsers({ action: 'CHANGE_STATUS', userId: u.userId, status: 'BLOCKED' })).status).toBe(401)
    expect((await adminUsers({ action: 'DELETE_MEMBER', userId: u.userId })).status).toBe(401)
  })

  it('rejects non-admin (SEEKER / PARENT / GUARDIAN) sessions on all admin APIs (403)', async () => {
    const seeker = await signup({ role: 'SEEKER' })
    const parent = await signup({ role: 'PARENT' })
    const target = await signup()

    for (const caller of [seeker, parent]) {
      expect((await adminStats(caller.cookie)).status).toBe(403)
      expect((await adminUsers({ action: 'CHANGE_STATUS', userId: target.userId, status: 'BLOCKED' }, caller.cookie)).status).toBe(403)
      expect((await adminUsers({ action: 'DELETE_MEMBER', userId: target.userId }, caller.cookie)).status).toBe(403)
    }
  })

  it('rejects a USER-kind session even if the user role was somehow mutated in DB without /api/admin/auth', async () => {
    const u = await signup()
    const { MongoUser } = await import('@/lib/mongodb-models')
    await MongoUser.updateOne({ _id: u.userId }, { $set: { role: 'ADMIN' } })
    // Still holds a USER session, not an ADMIN session
    expect((await adminStats(u.cookie)).status).toBe(403)
  })

  it('enforces RBAC between MODERATOR and ADMIN on /api/admin/users', async () => {
    const mod = await createAdmin('MODERATOR')
    const admin = await createAdmin('ADMIN')
    const member = await signup()

    // Moderator can read stats and change member status
    expect((await adminStats(mod.cookie)).status).toBe(200)
    const pauseRes = await adminUsers({ action: 'CHANGE_STATUS', userId: member.userId, status: 'PAUSED' }, mod.cookie)
    expect(pauseRes.status).toBe(200)

    // Moderator CANNOT permanently delete a member
    const delByMod = await adminUsers({ action: 'DELETE_MEMBER', userId: member.userId }, mod.cookie)
    expect(delByMod.status).toBe(403)

    // Admin CAN permanently delete a member
    const delByAdmin = await adminUsers({ action: 'DELETE_MEMBER', userId: member.userId }, admin.cookie)
    expect(delByAdmin.status).toBe(200)
  })

  it('prevents admins from deleting or blocking themselves or other privileged accounts', async () => {
    const admin1 = await createAdmin('ADMIN')
    const admin2 = await createAdmin('ADMIN')
    expect((await adminUsers({ action: 'DELETE_MEMBER', userId: admin1.userId }, admin1.cookie)).status).toBe(403)
    expect((await adminUsers({ action: 'CHANGE_STATUS', userId: admin2.userId, status: 'BLOCKED' }, admin1.cookie)).status).toBe(403)
    expect((await adminUsers({ action: 'DELETE_MEMBER', userId: admin2.userId }, admin1.cookie)).status).toBe(403)
  })
})

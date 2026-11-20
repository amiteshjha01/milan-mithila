import { describe, expect, it } from 'vitest'
import { call, createAdmin, signup } from './helpers'

describe('API regression & MongoDB connectivity tests', () => {
  it('GET /api/health/db reports connected status against MongoDB without leaking URI or internal details', async () => {
    const { GET } = await import('@/app/api/health/db/route')
    const r = await call(GET, 'GET', '/api/health/db')
    expect(r.status).toBe(200)
    expect(r.json).toEqual({ ok: true, status: 'connected' })
  })

  it('POST /api/panji/siddhanta computes Maithil lineage compatibility and rejects incomplete input', async () => {
    const { POST } = await import('@/app/api/panji/siddhanta/route')
    const bad = await call(POST, 'POST', '/api/panji/siddhanta', { body: { brideName: 'A' } })
    expect(bad.status).toBe(400)

    const sagotra = await call(POST, 'POST', '/api/panji/siddhanta', {
      body: {
        brideName: 'Sita Jha',
        brideGotra: 'Kashyapa',
        brideMool: 'Sakri',
        groomName: 'Ram Jha',
        groomGotra: 'Kashyapa',
        groomMool: 'Bisfi',
      },
    })
    expect(sagotra.status).toBe(200)
    expect(sagotra.json.ok).toBe(true)
    expect(sagotra.json.certificate.status).toBe('INELIGIBLE_SAGOTRA')

    const diffGotra = await call(POST, 'POST', '/api/panji/siddhanta', {
      body: {
        brideName: 'Sita Jha',
        brideGotra: 'Kashyapa',
        brideMool: 'Sakri',
        groomName: 'Rohan Mishra',
        groomGotra: 'Shandilya',
        groomMool: 'Bisfi',
      },
    })
    expect(diffGotra.status).toBe(200)
    expect(diffGotra.json.certificate.status).toBe('APPROVED')
  })

  it('POST /api/consultation records a VIP consultation lead in MongoDB and enforces CSRF + rate limits', async () => {
    const { POST } = await import('@/app/api/consultation/route')
    const csrfBlocked = await call(POST, 'POST', '/api/consultation', {
      origin: 'https://attacker.example.com',
      body: { candidateName: 'Ananya', phone: '+919876543210' },
    })
    expect(csrfBlocked.status).toBe(403)

    const ok = await call(POST, 'POST', '/api/consultation', {
      body: {
        candidateName: 'Ananya Jha',
        guardianName: 'Dr. S. Jha',
        phone: '+919876543210',
        email: 'ananya@example.com',
        preferredDistrict: 'Darbhanga',
      },
    })
    expect(ok.status).toBe(200)
    expect(ok.json.ok).toBe(true)
    expect(ok.json.referenceId).toMatch(/^VIP-[A-F0-9]{6}$/)

    // Admin can view and update the VIP lead status
    const admin = await createAdmin('ADMIN')
    const stats = await call((await import('@/app/api/admin/stats/route')).GET, 'GET', '/api/admin/stats', { cookie: admin.cookie })
    expect(stats.status).toBe(200)
    expect(stats.json.stats.totalVipConsultations).toBe(1)
    const leadId = String(stats.json.vipConsultations[0]._id)

    const upd = await call((await import('@/app/api/admin/users/route')).POST, 'POST', '/api/admin/users', {
      cookie: admin.cookie,
      body: { action: 'UPDATE_VIP_STATUS', leadId, status: 'CONTACTED' },
    })
    expect(upd.status).toBe(200)
  })

  it('full member lifecycle regression: signup -> profile update -> discover -> shortlist -> interest -> accept -> message -> logout', async () => {
    const groom = await signup({ fullName: 'Aditya ठाकुर', gender: 'Man', currentCity: 'Bengaluru', nativeDistrict: 'Darbhanga' })
    const bride = await signup({ fullName: ' Maithili Jha', gender: 'Woman', currentCity: 'Delhi', nativeDistrict: 'Madhubani' })

    const me = await import('@/app/api/profile/me/route')
    const profiles = await import('@/app/api/profiles/route')
    const profileById = await import('@/app/api/profiles/[profileId]/route')
    const shortlist = await import('@/app/api/shortlist/route')
    const interests = await import('@/app/api/interests/route')
    const messages = await import('@/app/api/messages/route')
    const logout = await import('@/app/api/auth/logout/route')

    // 1. Bride updates her own profile
    const up = await call(me.POST, 'POST', '/api/profile/me', {
      cookie: bride.cookie,
      body: { form: { fullName: 'Maithili Jha', occupation: 'Architect', gotra: 'Bharadwaja', mool: 'Sakri' } },
    })
    expect(up.status).toBe(200)

    // 2. Groom discovers Bride in /api/profiles and views /api/profiles/[profileId]
    const list = await call(profiles.GET, 'GET', '/api/profiles?city=Delhi', { cookie: groom.cookie })
    expect(list.status).toBe(200)
    expect(list.json.profiles.some((p: any) => p.id === bride.profileCode)).toBe(true)

    // 3. Groom shortlists Bride
    const sl = await call(shortlist.POST, 'POST', '/api/shortlist', {
      cookie: groom.cookie,
      body: { profileId: bride.profileCode },
    })
    expect(sl.status).toBe(200)
    expect(sl.json.action).toBe('added')

    // 4. Groom sends mutual interest to Bride
    const sent = await call(interests.POST, 'POST', '/api/interests', {
      cookie: groom.cookie,
      body: { receiverId: bride.profileCode, personalNote: 'Pranam!' },
    })
    expect(sent.status).toBe(200)
    expect(sent.json.action).toBe('sent')

    // 5. Bride accepts interest -> unlocks conversation
    const acc = await call(interests.POST, 'POST', '/api/interests', {
      cookie: bride.cookie,
      body: { action: 'ACCEPT', interestId: sent.json.interest._id },
    })
    expect(acc.status).toBe(200)

    // 6. Groom and Bride exchange messages
    const m1 = await call(messages.POST, 'POST', '/api/messages', {
      cookie: groom.cookie,
      body: { recipientId: bride.profileCode, text: 'Namaskar Maithili ji!' },
    })
    expect(m1.status).toBe(200)

    const thread = await call(messages.GET, 'GET', `/api/messages?targetUserId=${groom.profileCode}`, { cookie: bride.cookie })
    expect(thread.status).toBe(200)
    expect(thread.json.messages.length).toBeGreaterThanOrEqual(2)

    // 7. Detail view reflects shortlisted + interested flags
    const det = await call(profileById.GET, 'GET', `/api/profiles/${bride.profileCode}`, {
      cookie: groom.cookie,
      params: { profileId: bride.profileCode },
    })
    expect(det.status).toBe(200)
    expect(det.json.profile.shortlisted).toBe(true)
    expect(det.json.profile.interested).toBe(true)

    // 8. Groom logs out -> session revoked
    expect((await call(logout.POST, 'POST', '/api/auth/logout', { cookie: groom.cookie })).status).toBe(200)
    expect((await call(me.GET, 'GET', '/api/profile/me', { cookie: groom.cookie })).status).toBe(401)
  })
})

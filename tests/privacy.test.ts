import { describe, expect, it } from 'vitest'
import { call, signup } from './helpers'
import { HIDDEN_TEXT, PLACEHOLDER_PHOTO } from '@/lib/security/privacy'

describe('Server-side profile privacy & visibility enforcement', () => {
  it('enforces PAUSED and CONNECTIONS_ONLY profile visibility in list and detail APIs', async () => {
    const viewer = await signup({ gender: 'Man' })
    const pausedUser = await signup({ fullName: 'Paused Member', gender: 'Woman' })
    const connOnlyUser = await signup({ fullName: 'Connections Only Member', gender: 'Woman' })

    const settings = await import('@/app/api/settings/route')
    const profiles = await import('@/app/api/profiles/route')
    const profileById = await import('@/app/api/profiles/[profileId]/route')
    const interests = await import('@/app/api/interests/route')

    // Connect viewer <-> connOnlyUser BEFORE setting CONNECTIONS_ONLY? No: test unconnected first
    await call(settings.POST, 'POST', '/api/settings', { cookie: pausedUser.cookie, body: { visibility: 'PAUSED' } })
    await call(settings.POST, 'POST', '/api/settings', { cookie: connOnlyUser.cookie, body: { visibility: 'CONNECTIONS_ONLY' } })

    // Unconnected viewer cannot see either in /api/profiles or /api/profiles/[id]
    const list1 = await call(profiles.GET, 'GET', '/api/profiles', { cookie: viewer.cookie })
    const ids1 = list1.json.profiles.map((p: any) => p.id)
    expect(ids1).not.toContain(pausedUser.profileCode)
    expect(ids1).not.toContain(connOnlyUser.profileCode)

    const detailPaused = await call(profileById.GET, 'GET', `/api/profiles/${pausedUser.profileCode}`, {
      cookie: viewer.cookie,
      params: { profileId: pausedUser.profileCode },
    })
    expect(detailPaused.status).toBe(404)

    const detailConnOnly = await call(profileById.GET, 'GET', `/api/profiles/${connOnlyUser.profileCode}`, {
      cookie: viewer.cookie,
      params: { profileId: connOnlyUser.profileCode },
    })
    expect(detailConnOnly.status).toBe(404)

    // Owner CAN still view their own PAUSED profile
    const selfDetail = await call(profileById.GET, 'GET', `/api/profiles/${pausedUser.profileCode}`, {
      cookie: pausedUser.cookie,
      params: { profileId: pausedUser.profileCode },
    })
    expect(selfDetail.status).toBe(200)

    // Once connOnlyUser initiates & viewer accepts an interest, viewer CAN see connOnlyUser
    const sent = await call(interests.POST, 'POST', '/api/interests', {
      cookie: connOnlyUser.cookie,
      body: { receiverId: viewer.profileCode },
    })
    await call(interests.POST, 'POST', '/api/interests', {
      cookie: viewer.cookie,
      body: { action: 'ACCEPT', interestId: sent.json.interest._id },
    })

    const detailAfterConnect = await call(profileById.GET, 'GET', `/api/profiles/${connOnlyUser.profileCode}`, {
      cookie: viewer.cookie,
      params: { profileId: connOnlyUser.profileCode },
    })
    expect(detailAfterConnect.status).toBe(200)
    expect(detailAfterConnect.json.profile.id).toBe(connOnlyUser.profileCode)
  })

  it('redacts Gotra, Mool, cultural details, and family details when restricted, and blocks search-oracle leaks', async () => {
    const viewer = await signup({ gender: 'Man' })
    const bride = await signup({
      fullName: 'Priya Mishra',
      gender: 'Woman',
      gotra: 'ShandilyaSecret',
    })

    const me = await import('@/app/api/profile/me/route')
    const settings = await import('@/app/api/settings/route')
    const profiles = await import('@/app/api/profiles/route')
    const profileById = await import('@/app/api/profiles/[profileId]/route')

    // Populate sensitive cultural + family fields and set familyVisibility to 'Only me' (PRIVATE)
    await call(me.POST, 'POST', '/api/profile/me', {
      cookie: bride.cookie,
      body: {
        form: {
          fullName: 'Priya Mishra',
          gotra: 'ShandilyaSecret',
          mool: 'KoilakhSecret',
          ancestralVillage: 'BisfiSecret',
          kul: 'SecretKul',
          pravara: 'SecretPravara',
          fatherOccupation: 'Retired Judge Secret',
          motherOccupation: 'Professor Secret',
          siblings: 'Two sisters secret',
          familyValues: 'Confidential family values',
          familyDescription: 'Private family summary text',
          familyVisibility: 'Only me',
          culturalVisibility: 'Only me',
          gotraPreference: 'Avoid ShandilyaSecret',
          moolPreference: 'Avoid KoilakhSecret',
        },
      },
    })
    await call(settings.POST, 'POST', '/api/settings', {
      cookie: bride.cookie,
      body: { culturalVisibility: 'PRIVATE' },
    })

    // 1. Detail view for unconnected member must NOT contain any of the secret strings
    const detail = await call(profileById.GET, 'GET', `/api/profiles/${bride.profileCode}`, {
      cookie: viewer.cookie,
      params: { profileId: bride.profileCode },
    })
    expect(detail.status).toBe(200)
    expect(detail.json.profile.gotra).toBe(HIDDEN_TEXT)
    expect(detail.json.profile.mool).toBe(HIDDEN_TEXT)
    expect(detail.json.profile.ancestralVillage).toBe(HIDDEN_TEXT)
    expect(detail.json.profile.familySummary).toBe(HIDDEN_TEXT)
    expect(detail.json.profile.fatherOccupation).toBeUndefined()
    expect(detail.json.profile.motherOccupation).toBeUndefined()
    expect(detail.json.profile.siblings).toBeUndefined()
    for (const secret of [
      'ShandilyaSecret',
      'KoilakhSecret',
      'BisfiSecret',
      'SecretKul',
      'SecretPravara',
      'Retired Judge Secret',
      'Professor Secret',
      'Two sisters secret',
      'Confidential family values',
      'Private family summary text',
    ]) {
      expect(detail.text).not.toContain(secret)
    }

    // 2. Search view must not leak them AND filtering by ?gotra=ShandilyaSecret must not act as an oracle
    const byGotra = await call(profiles.GET, 'GET', '/api/profiles?gotra=ShandilyaSecret', { cookie: viewer.cookie })
    expect(byGotra.json.profiles.map((p: any) => p.id)).not.toContain(bride.profileCode)

    const byQuery = await call(profiles.GET, 'GET', '/api/profiles?q=ShandilyaSecret', { cookie: viewer.cookie })
    expect(byQuery.json.profiles.map((p: any) => p.id)).not.toContain(bride.profileCode)
  })

  it('prevents unauthorized users from accessing private/connection-only photographs', async () => {
    const viewer = await signup({ gender: 'Man' })
    const bride = await signup({ gender: 'Woman' })
    const me = await import('@/app/api/profile/me/route')
    const settings = await import('@/app/api/settings/route')
    const profileById = await import('@/app/api/profiles/[profileId]/route')
    const interests = await import('@/app/api/interests/route')

    const privatePhotoUrl = 'https://cdn.example.com/private-portrait-secret-999.jpg'
    await call(me.POST, 'POST', '/api/profile/me', {
      cookie: bride.cookie,
      body: {
        form: {
          photos: [{ url: privatePhotoUrl, primary: true, visibility: 'MUTUAL_CONSENT' }],
        },
      },
    })

    // Unconnected member gets placeholder only, never the private photo URL
    const before = await call(profileById.GET, 'GET', `/api/profiles/${bride.profileCode}`, {
      cookie: viewer.cookie,
      params: { profileId: bride.profileCode },
    })
    expect(before.status).toBe(200)
    expect(before.json.profile.photos).toEqual([PLACEHOLDER_PHOTO])
    expect(before.text).not.toContain(privatePhotoUrl)

    // Also test profile-wide photoVisibility=CONNECTIONS even when photo item is MEMBERS_ONLY
    await call(me.POST, 'POST', '/api/profile/me', {
      cookie: bride.cookie,
      body: { form: { photos: [{ url: privatePhotoUrl, primary: true, visibility: 'MEMBERS_ONLY' }] } },
    })
    await call(settings.POST, 'POST', '/api/settings', {
      cookie: bride.cookie,
      body: { photoVisibility: 'CONNECTIONS' },
    })
    const gated = await call(profileById.GET, 'GET', `/api/profiles/${bride.profileCode}`, {
      cookie: viewer.cookie,
      params: { profileId: bride.profileCode },
    })
    expect(gated.text).not.toContain(privatePhotoUrl)

    // After mutual interest acceptance, the connected member CAN view the photo
    const sent = await call(interests.POST, 'POST', '/api/interests', {
      cookie: viewer.cookie,
      body: { receiverId: bride.profileCode },
    })
    await call(interests.POST, 'POST', '/api/interests', {
      cookie: bride.cookie,
      body: { action: 'ACCEPT', interestId: sent.json.interest._id },
    })
    const after = await call(profileById.GET, 'GET', `/api/profiles/${bride.profileCode}`, {
      cookie: viewer.cookie,
      params: { profileId: bride.profileCode },
    })
    expect(after.json.profile.photos).toContain(privatePhotoUrl)
  })

  it('never exposes contact info (email/phone) on profile endpoints and escapes regex metacharacters', async () => {
    const viewer = await signup({ gender: 'Man' })
    const bride = await signup({ email: 'secret-contact@example.com', phone: '+919999988888', gender: 'Woman' })
    const profiles = await import('@/app/api/profiles/route')
    const profileById = await import('@/app/api/profiles/[profileId]/route')

    const detail = await call(profileById.GET, 'GET', `/api/profiles/${bride.profileCode}`, {
      cookie: viewer.cookie,
      params: { profileId: bride.profileCode },
    })
    expect(detail.text).not.toContain('secret-contact@example.com')
    expect(detail.text).not.toContain('9999988888')

    // Hostile regex input in search parameters must not throw 500 or execute unescaped regex
    const hostile = await call(
      profiles.GET,
      'GET',
      `/api/profiles?q=${encodeURIComponent('([a-z]+)+$')}&city=${encodeURIComponent('.*')}`,
      { cookie: viewer.cookie }
    )
    expect(hostile.status).toBe(200)
    expect(hostile.json.count).toBe(0)
  })
})

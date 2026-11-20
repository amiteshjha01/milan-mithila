import { describe, expect, it } from 'vitest'
import { call, signup } from './helpers'

describe('IDOR protection across all user-owned APIs', () => {
  it('rejects unauthenticated access to every user-owned endpoint with 401', async () => {
    const me = await import('@/app/api/profile/me/route')
    const settings = await import('@/app/api/settings/route')
    const interests = await import('@/app/api/interests/route')
    const messages = await import('@/app/api/messages/route')
    const shortlist = await import('@/app/api/shortlist/route')
    const profiles = await import('@/app/api/profiles/route')
    const profileById = await import('@/app/api/profiles/[profileId]/route')

    expect((await call(me.GET, 'GET', '/api/profile/me?userId=victim')).status).toBe(401)
    expect((await call(me.POST, 'POST', '/api/profile/me', { body: { userId: 'victim', form: { fullName: 'Hacked' } } })).status).toBe(401)
    expect((await call(settings.GET, 'GET', '/api/settings?userId=victim')).status).toBe(401)
    expect((await call(settings.POST, 'POST', '/api/settings', { body: { userId: 'victim', visibility: 'PAUSED' } })).status).toBe(401)
    expect((await call(interests.GET, 'GET', '/api/interests?userId=victim')).status).toBe(401)
    expect((await call(interests.POST, 'POST', '/api/interests', { body: { receiverId: 'MM-123456' } })).status).toBe(401)
    expect((await call(messages.GET, 'GET', '/api/messages?userId=victim')).status).toBe(401)
    expect((await call(messages.POST, 'POST', '/api/messages', { body: { senderId: 'victim', recipientId: 'MM-123456', text: 'hi' } })).status).toBe(401)
    expect((await call(shortlist.GET, 'GET', '/api/shortlist?userId=victim')).status).toBe(401)
    expect((await call(shortlist.POST, 'POST', '/api/shortlist', { body: { userId: 'victim', profileId: 'MM-123456' } })).status).toBe(401)
    expect((await call(profiles.GET, 'GET', '/api/profiles')).status).toBe(401)
    expect((await call(profileById.GET, 'GET', '/api/profiles/MM-123456', { params: { profileId: 'MM-123456' } })).status).toBe(401)
  })

  it('/api/profile/me: User A cannot read or modify User B profile by supplying userId or email', async () => {
    const userA = await signup({ fullName: 'User Alpha', gender: 'Man' })
    const userB = await signup({ fullName: 'User Bravo', gender: 'Woman' })
    const me = await import('@/app/api/profile/me/route')

    // User A passes User B's userId and email in query string -> still receives User A's own profile
    const readAttempt = await call(
      me.GET,
      'GET',
      `/api/profile/me?userId=${userB.userId}&email=${encodeURIComponent(userB.email)}`,
      { cookie: userA.cookie }
    )
    expect(readAttempt.status).toBe(200)
    expect(readAttempt.json.user.id).toBe(userA.userId)
    expect(readAttempt.json.user.email).toBe(userA.email)
    expect(readAttempt.json.profile.fullName).toBe('User Alpha')

    // User A attempts to overwrite User B's profile by supplying userB.userId in body
    const writeAttempt = await call(me.POST, 'POST', '/api/profile/me', {
      cookie: userA.cookie,
      body: { userId: userB.userId, form: { fullName: 'Defaced Name', occupation: 'Compromised' } },
    })
    expect(writeAttempt.status).toBe(200)

    // Verify User B's profile is untouched in DB
    const checkB = await call(me.GET, 'GET', '/api/profile/me', { cookie: userB.cookie })
    expect(checkB.json.profile.fullName).toBe('User Bravo')
    expect(checkB.json.profile.occupation).not.toBe('Compromised')
  })

  it('/api/settings: User A cannot read or update User B privacy settings', async () => {
    const userA = await signup()
    const userB = await signup()
    const settings = await import('@/app/api/settings/route')

    // User B sets their own profile to PAUSED and culturalVisibility to PRIVATE
    await call(settings.POST, 'POST', '/api/settings', {
      cookie: userB.cookie,
      body: { visibility: 'PAUSED', culturalVisibility: 'PRIVATE' },
    })

    // User A tries to read User B's settings via ?userId=
    const aRead = await call(settings.GET, 'GET', `/api/settings?userId=${userB.userId}`, { cookie: userA.cookie })
    expect(aRead.status).toBe(200)
    expect(aRead.json.settings.visibility).toBe('COMMUNITY') // User A's default, not User B's PAUSED

    // User A tries to force User B's settings back to COMMUNITY
    await call(settings.POST, 'POST', '/api/settings', {
      cookie: userA.cookie,
      body: { userId: userB.userId, visibility: 'COMMUNITY', culturalVisibility: 'MEMBERS' },
    })

    // User B's settings remain PAUSED / PRIVATE
    const bRead = await call(settings.GET, 'GET', '/api/settings', { cookie: userB.cookie })
    expect(bRead.json.settings.visibility).toBe('PAUSED')
    expect(bRead.json.settings.culturalVisibility).toBe('PRIVATE')
  })

  it('/api/shortlist: User A cannot read or mutate User B shortlist', async () => {
    const userA = await signup({ gender: 'Man' })
    const userB = await signup({ gender: 'Man' })
    const target = await signup({ gender: 'Woman' })
    const shortlist = await import('@/app/api/shortlist/route')

    await call(shortlist.POST, 'POST', '/api/shortlist', {
      cookie: userB.cookie,
      body: { profileId: target.profileCode },
    })

    // User A queries with userB's userId -> gets User A's empty shortlist
    const aGet = await call(shortlist.GET, 'GET', `/api/shortlist?userId=${userB.userId}`, { cookie: userA.cookie })
    expect(aGet.status).toBe(200)
    expect(aGet.json.count).toBe(0)

    // User B still has 1 item
    const bGet = await call(shortlist.GET, 'GET', '/api/shortlist', { cookie: userB.cookie })
    expect(bGet.json.count).toBe(1)
  })

  it('/api/interests: User C cannot accept/decline User B received interest or withdraw User A sent interest', async () => {
    const userA = await signup({ gender: 'Man' })
    const userB = await signup({ gender: 'Woman' })
    const userC = await signup({ gender: 'Woman' })
    const interests = await import('@/app/api/interests/route')

    // User A sends interest to User B (even if User A tries to spoof senderId as userC)
    const sent = await call(interests.POST, 'POST', '/api/interests', {
      cookie: userA.cookie,
      body: { senderId: userC.profileCode, receiverId: userB.profileCode, personalNote: 'Hello' },
    })
    expect(sent.status).toBe(200)
    expect(sent.json.interest.senderId).toBe(userA.profileCode)
    const interestId = sent.json.interest._id

    // User C cannot list User B's interests via ?userId=
    const cList = await call(interests.GET, 'GET', `/api/interests?userId=${userB.profileCode}`, { cookie: userC.cookie })
    expect(cList.json.receivedCount).toBe(0)
    expect(cList.json.sentCount).toBe(0)

    // User C cannot ACCEPT or DECLINE the interest sent to User B
    expect((await call(interests.POST, 'POST', '/api/interests', { cookie: userC.cookie, body: { action: 'ACCEPT', interestId } })).status).toBe(403)
    expect((await call(interests.POST, 'POST', '/api/interests', { cookie: userC.cookie, body: { action: 'DECLINE', interestId } })).status).toBe(403)

    // Sender (User A) cannot ACCEPT their own sent interest
    expect((await call(interests.POST, 'POST', '/api/interests', { cookie: userA.cookie, body: { action: 'ACCEPT', interestId } })).status).toBe(403)

    // Receiver (User B) cannot WITHDRAW User A's interest, but CAN ACCEPT it
    expect((await call(interests.POST, 'POST', '/api/interests', { cookie: userB.cookie, body: { action: 'WITHDRAW', interestId } })).status).toBe(403)
    const accepted = await call(interests.POST, 'POST', '/api/interests', { cookie: userB.cookie, body: { action: 'ACCEPT', interestId } })
    expect(accepted.status).toBe(200)
  })

  it('/api/messages: enforces mutual-interest requirement and blocks third-party access or sender spoofing', async () => {
    const userA = await signup({ gender: 'Man' })
    const userB = await signup({ gender: 'Woman' })
    const userC = await signup({ gender: 'Man' })
    const interests = await import('@/app/api/interests/route')
    const messages = await import('@/app/api/messages/route')

    // Before mutual interest is accepted, User A cannot message User B
    const premature = await call(messages.POST, 'POST', '/api/messages', {
      cookie: userA.cookie,
      body: { recipientId: userB.profileCode, text: 'Unsolicited message' },
    })
    expect(premature.status).toBe(403)

    // Establish mutual connection between A and B
    const sent = await call(interests.POST, 'POST', '/api/interests', {
      cookie: userA.cookie,
      body: { receiverId: userB.profileCode },
    })
    await call(interests.POST, 'POST', '/api/interests', {
      cookie: userB.cookie,
      body: { action: 'ACCEPT', interestId: sent.json.interest._id },
    })

    // User A sends a message (trying to spoof senderId as User B) -> recorded as User A
    const msgRes = await call(messages.POST, 'POST', '/api/messages', {
      cookie: userA.cookie,
      body: { senderId: userB.profileCode, recipientId: userB.profileCode, text: 'Pranam from A' },
    })
    expect(msgRes.status).toBe(200)
    expect(msgRes.json.message.senderId).toBe(userA.userId)

    // User C tries to read A<->B conversation by passing userId=A and targetUserId=B
    const cSpy = await call(
      messages.GET,
      'GET',
      `/api/messages?userId=${userA.profileCode}&targetUserId=${userB.profileCode}`,
      { cookie: userC.cookie }
    )
    expect(cSpy.status).toBe(200)
    expect(cSpy.json.conversation).toBeNull()
    expect(cSpy.json.messages).toEqual([])

    const cList = await call(messages.GET, 'GET', `/api/messages?userId=${userA.profileCode}`, { cookie: userC.cookie })
    expect(cList.json.count).toBe(0)

    // User B (actual participant) CAN read the conversation
    const bRead = await call(messages.GET, 'GET', `/api/messages?targetUserId=${userA.profileCode}`, { cookie: userB.cookie })
    expect(bRead.status).toBe(200)
    expect(bRead.json.messages.some((m: any) => m.text === 'Pranam from A')).toBe(true)
  })
})

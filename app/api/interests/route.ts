import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MongoInterest, MongoConversation, MongoProfile, MongoUser } from '@/lib/mongodb-models'
import { authenticate, fail, readJson, serverError, OBJECT_ID_RE } from '@/lib/security/guard'
import { canViewProfile, getConnectionCodes, getViewer, relationTo } from '@/lib/security/privacy'
import { rateLimit } from '@/lib/security/rate-limit'

export const dynamic = 'force-dynamic'

const interestSchema = z.object({
  action: z.enum(['TOGGLE', 'ACCEPT', 'DECLINE', 'WITHDRAW']).default('TOGGLE'),
  interestId: z.string().regex(OBJECT_ID_RE).optional(),
  receiverId: z.string().trim().max(40).optional(),
  personalNote: z.string().trim().max(500).optional(),
  // `senderId` / `userId` from clients are intentionally not accepted: the sender is the session user.
})

const view = (i: any) => ({
  _id: String(i._id), senderId: i.senderId, receiverId: i.receiverId, status: i.status,
  personalNote: i.personalNote, respondedAt: i.respondedAt, createdAt: i.createdAt, updatedAt: i.updatedAt,
})

export async function GET(request: Request) {
  try {
    const result = await authenticate(request)
    if (!result.ok) return result.response
    const viewer = await getViewer(result.auth)
    const [sent, received] = await Promise.all([
      MongoInterest.find({ senderId: { $in: viewer.keys } }).sort({ createdAt: -1 }).lean(),
      MongoInterest.find({ receiverId: { $in: viewer.keys } }).sort({ createdAt: -1 }).lean(),
    ])
    const res = NextResponse.json({
      ok: true,
      sent: sent.map(view),
      received: received.map(view),
      interests: sent.map(view),
      sentCount: sent.length,
      receivedCount: received.length,
    })
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch (error) {
    return serverError('interests GET', error)
  }
}

export async function POST(request: Request) {
  try {
    const result = await authenticate(request)
    if (!result.ok) return result.response
    if (!rateLimit(`interest:${result.auth.user.id}`, 60, 60 * 60_000).allowed) return fail(429, 'Too many actions. Please try again later.')

    const parsed = interestSchema.safeParse(await readJson(request))
    if (!parsed.success) return fail(400, 'Invalid input.')
    const { action, interestId, receiverId, personalNote } = parsed.data
    const viewer = await getViewer(result.auth)

    if (action === 'ACCEPT' || action === 'DECLINE' || action === 'WITHDRAW') {
      if (!interestId) return fail(400, 'interestId is required.')
      const interest: any = await MongoInterest.findById(interestId)
      if (!interest) return fail(404, 'Interest not found.')
      const isReceiver = viewer.keys.includes(interest.receiverId)
      const isSender = viewer.keys.includes(interest.senderId)
      if (action === 'WITHDRAW' ? !isSender : !isReceiver) return fail(403, 'You do not have permission to modify this interest.')
      if (interest.status !== 'PENDING') return fail(409, 'This interest has already been responded to.')

      if (action === 'WITHDRAW') {
        interest.status = 'WITHDRAWN'
        interest.respondedAt = new Date()
        await interest.save()
        return NextResponse.json({ ok: true, message: 'Interest withdrawn', interest: view(interest) })
      }
      interest.status = action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED'
      interest.respondedAt = new Date()
      await interest.save()

      if (action === 'ACCEPT') {
        const existing = await MongoConversation.findOne({ participants: { $all: [interest.senderId, interest.receiverId] } })
        if (!existing) {
          await MongoConversation.create({
            participants: [interest.senderId, interest.receiverId],
            lastMessageText: 'Interest accepted! Both members may now communicate.',
            lastMessageAt: new Date(),
            status: 'ACTIVE',
            messages: [{ senderId: interest.receiverId, text: 'Namaskar! I accepted your mutual interest invitation. Pleased to make your acquaintance.', sentAt: new Date(), isRead: true }],
          })
        }
        return NextResponse.json({ ok: true, message: 'Interest accepted and chat unlocked', interest: view(interest) })
      }
      return NextResponse.json({ ok: true, message: 'Interest declined', interest: view(interest) })
    }

    // TOGGLE: send or withdraw a pending interest. Sender is ALWAYS the session user's profile.
    if (!receiverId) return fail(400, 'Unrecognized action or missing parameters.')
    if (!viewer.profileCode) return fail(403, 'Create your profile before sending interests.')
    if (viewer.keys.includes(receiverId)) return fail(400, 'You cannot send an interest to yourself.')

    const target: any = await MongoProfile.findOne({ profileCode: receiverId }).lean()
    const owner: any = target ? await MongoUser.findById(target.userId, 'accountStatus').lean() : null
    const connections = await getConnectionCodes(viewer)
    const ownerActive = owner?.accountStatus === 'ACTIVE'
    if (!target || !canViewProfile(target, relationTo(target, viewer, connections), ownerActive)) return fail(404, 'Profile not found.')

    const existing: any = await MongoInterest.findOne({ senderId: { $in: viewer.keys }, receiverId })
    if (existing) {
      if (existing.status === 'PENDING') {
        await MongoInterest.deleteOne({ _id: existing._id })
        return NextResponse.json({ ok: true, action: 'withdrawn', receiverId })
      }
      if (existing.status === 'WITHDRAWN') {
        existing.status = 'PENDING'
        existing.senderId = viewer.profileCode
        await existing.save()
        return NextResponse.json({ ok: true, action: 'sent', receiverId, interest: view(existing) })
      }
      return fail(409, `This interest is already ${existing.status.toLowerCase()}.`)
    }
    const created = await MongoInterest.create({
      senderId: viewer.profileCode,
      receiverId,
      status: 'PENDING',
      personalNote: personalNote || 'Namaskar! Resonated with your profile and values.',
    })
    return NextResponse.json({ ok: true, action: 'sent', receiverId, interest: view(created) })
  } catch (error) {
    return serverError('interests POST', error)
  }
}

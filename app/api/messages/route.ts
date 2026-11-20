import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MongoConversation, MongoInterest } from '@/lib/mongodb-models'
import { authenticate, fail, readJson, serverError } from '@/lib/security/guard'
import { getViewer, type Viewer } from '@/lib/security/privacy'
import { isSafeLinkUrl } from '@/lib/security/images'
import { rateLimit } from '@/lib/security/rate-limit'

export const dynamic = 'force-dynamic'

const attachmentSchema = z
  .object({
    id: z.string().max(100).optional(),
    type: z.enum(['image', 'video', 'pdf']).optional(),
    name: z.string().max(200).optional(),
    size: z.string().max(30).optional(),
    duration: z.string().max(20).optional(),
    url: z.string().max(2048).optional(),
  })
  .strict()

const postSchema = z.object({
  // senderId from the client is ignored; the sender is the session user's profile.
  recipientId: z.string().trim().min(1).max(40),
  text: z.string().trim().max(2000).optional(),
  attachment: attachmentSchema.optional(),
  isChaiInvite: z.boolean().optional(),
  chaiDetails: z.record(z.string().max(50), z.union([z.string().max(300), z.number(), z.boolean()])).optional(),
})

const mine = (viewer: Viewer, id: string) => viewer.keys.includes(id)

/** Messages as seen by `viewer`: own messages carry the viewer's user id, theirs carry the peer's profile code. */
function shapeConversation(conv: any, viewer: Viewer) {
  const peer = (conv.participants as string[]).find((p) => !mine(viewer, p)) || ''
  return {
    _id: String(conv._id),
    participants: [viewer.profileCode || viewer.userId, peer],
    status: conv.status,
    lastMessageText: conv.lastMessageText,
    lastMessageAt: conv.lastMessageAt,
    messages: (conv.messages || []).map((m: any) => ({
      _id: m._id ? String(m._id) : undefined,
      senderId: mine(viewer, m.senderId) ? viewer.userId : m.senderId,
      text: m.text,
      sentAt: m.sentAt,
      isRead: m.isRead,
      attachment: m.attachment,
      isChaiInvite: m.isChaiInvite,
      chaiDetails: m.chaiDetails,
    })),
  }
}

export async function GET(request: Request) {
  try {
    const result = await authenticate(request)
    if (!result.ok) return result.response
    const viewer = await getViewer(result.auth)
    const target = new URL(request.url).searchParams.get('targetUserId')

    if (target) {
      // Participation is enforced in the query itself: a conversation the viewer is not part of can never match.
      const conv: any = await MongoConversation.findOne({
        $and: [{ participants: { $in: viewer.keys } }, { participants: target }],
      }).lean()
      const res = NextResponse.json(
        conv ? { ok: true, conversation: shapeConversation(conv, viewer), messages: shapeConversation(conv, viewer).messages } : { ok: true, conversation: null, messages: [] }
      )
      res.headers.set('Cache-Control', 'no-store')
      return res
    }

    const convs: any[] = await MongoConversation.find({ participants: { $in: viewer.keys } }).sort({ lastMessageAt: -1 }).lean()
    const res = NextResponse.json({ ok: true, conversations: convs.map((c) => shapeConversation(c, viewer)), count: convs.length })
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch (error) {
    return serverError('messages GET', error)
  }
}

export async function POST(request: Request) {
  try {
    const result = await authenticate(request)
    if (!result.ok) return result.response
    if (!rateLimit(`msg:${result.auth.user.id}`, 120, 60 * 60_000).allowed) return fail(429, 'Too many messages. Please slow down.')

    const parsed = postSchema.safeParse(await readJson(request))
    if (!parsed.success) return fail(400, 'Invalid message payload.')
    const { recipientId, text, isChaiInvite, chaiDetails } = parsed.data
    let attachment = parsed.data.attachment
    if (!text && !attachment && !isChaiInvite) return fail(400, 'Message is empty.')

    const viewer = await getViewer(result.auth)
    if (!viewer.profileCode) return fail(403, 'Create your profile before messaging.')
    if (mine(viewer, recipientId)) return fail(400, 'You cannot message yourself.')

    // Only mutually connected members (ACCEPTED interest) may exchange messages.
    const connected = await MongoInterest.exists({
      status: 'ACCEPTED',
      $or: [
        { senderId: { $in: viewer.keys }, receiverId: recipientId },
        { receiverId: { $in: viewer.keys }, senderId: recipientId },
      ],
    })
    if (!connected) return fail(403, 'You can message a member only after a mutual interest is accepted.')

    // Attachment links are limited to https / same-site paths; anything else is dropped.
    if (attachment?.url && !isSafeLinkUrl(attachment.url)) attachment = { ...attachment, url: undefined }

    let conv: any = await MongoConversation.findOne({ $and: [{ participants: { $in: viewer.keys } }, { participants: recipientId }] })
    if (conv && conv.status === 'BLOCKED') return fail(403, 'This conversation is blocked.')
    const content = text || (isChaiInvite ? 'Chai introduction scheduled' : 'Shared an attachment')
    if (!conv) {
      conv = await MongoConversation.create({ participants: [viewer.profileCode, recipientId], lastMessageText: content, lastMessageAt: new Date(), status: 'ACTIVE', messages: [] })
    }

    const newMessage = {
      senderId: viewer.profileCode,
      text: content,
      sentAt: new Date(),
      isRead: false,
      ...(attachment ? { attachment } : {}),
      ...(isChaiInvite ? { isChaiInvite, chaiDetails } : {}),
    }
    conv.messages.push(newMessage as any)
    conv.lastMessageText = content
    conv.lastMessageAt = new Date()
    await conv.save()

    return NextResponse.json({ ok: true, message: { ...newMessage, senderId: viewer.userId }, conversationId: String(conv._id) })
  } catch (error) {
    return serverError('messages POST', error)
  }
}

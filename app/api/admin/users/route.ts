import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MongoUser, MongoProfile, MongoInterest, MongoShortlist, MongoConversation, MongoSession, VipConsultation } from '@/lib/mongodb-models'
import { authenticate, fail, readJson, serverError, OBJECT_ID_RE } from '@/lib/security/guard'
import { revokeAllUserSessions } from '@/lib/security/session'

export const dynamic = 'force-dynamic'

const id = z.string().regex(OBJECT_ID_RE)
const bodySchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('TOGGLE_VERIFY'), profileId: id }),
  z.object({ action: z.literal('CHANGE_STATUS'), userId: id, status: z.enum(['ACTIVE', 'PAUSED', 'PENDING_REVIEW', 'BLOCKED']) }),
  z.object({ action: z.literal('DELETE_MEMBER'), profileId: id.optional(), userId: id }),
  z.object({ action: z.literal('UPDATE_VIP_STATUS'), leadId: id, status: z.enum(['NEW', 'CONTACTED', 'CONVERTED']) }),
])

/**
 * RBAC matrix (enforced here, independent of /api/admin/stats and of the UI):
 *   TOGGLE_VERIFY, UPDATE_VIP_STATUS  -> ADMIN, MODERATOR
 *   CHANGE_STATUS                     -> ADMIN, MODERATOR (never on privileged accounts or oneself)
 *   DELETE_MEMBER                     -> ADMIN only (never on privileged accounts or oneself)
 */
export async function POST(request: Request) {
  try {
    const result = await authenticate(request, { roles: ['ADMIN', 'MODERATOR'], adminSession: true })
    if (!result.ok) return result.response
    const actor = result.auth.user

    const parsed = bodySchema.safeParse(await readJson(request))
    if (!parsed.success) return fail(400, 'Unrecognized action or invalid parameters.')
    const d = parsed.data

    if (d.action === 'TOGGLE_VERIFY') {
      const profile: any = await MongoProfile.findById(d.profileId)
      if (!profile) return fail(404, 'Profile not found.')
      profile.verified = !profile.verified
      profile.verificationLabel = profile.verified ? 'Admin Verified ✓' : 'Self-Reported'
      await profile.save()
      return NextResponse.json({ ok: true, message: `Profile verification set to ${profile.verified}`, verified: profile.verified })
    }

    if (d.action === 'UPDATE_VIP_STATUS') {
      const r = await VipConsultation.findByIdAndUpdate(d.leadId, { status: d.status })
      if (!r) return fail(404, 'Lead not found.')
      return NextResponse.json({ ok: true, message: `VIP consultation updated to ${d.status}` })
    }

    // Remaining actions target a user account.
    const target: any = await MongoUser.findById(d.userId).lean()
    if (!target) return fail(404, 'User not found.')
    if (String(target._id) === actor.id) return fail(403, 'You cannot perform this action on your own account.')
    if (target.role === 'ADMIN' || target.role === 'MODERATOR') return fail(403, 'Privileged accounts cannot be modified through this API.')

    if (d.action === 'CHANGE_STATUS') {
      await MongoUser.updateOne({ _id: target._id }, { $set: { accountStatus: d.status } })
      if (d.status === 'BLOCKED' || d.status === 'PENDING_REVIEW') await revokeAllUserSessions(String(target._id), 'account_status_change')
      return NextResponse.json({ ok: true, message: `User status changed to ${d.status}`, userId: String(target._id), status: d.status })
    }

    // DELETE_MEMBER
    if (actor.role !== 'ADMIN') return fail(403, 'You do not have permission to perform this action.')
    const profile: any = await MongoProfile.findOne({ userId: target._id }).lean()
    if (profile) {
      const codes = [profile.profileCode, String(target._id)]
      await Promise.all([
        MongoInterest.deleteMany({ $or: [{ senderId: { $in: codes } }, { receiverId: { $in: codes } }] }),
        MongoShortlist.deleteMany({ $or: [{ userId: { $in: codes } }, { profileId: profile.profileCode }] }),
        MongoConversation.deleteMany({ participants: { $in: codes } }),
        MongoProfile.deleteOne({ _id: profile._id }),
      ])
    }
    await MongoSession.deleteMany({ userId: target._id })
    await MongoUser.deleteOne({ _id: target._id })
    return NextResponse.json({ ok: true, message: 'Member and profile deleted.' })
  } catch (error) {
    return serverError('admin/users', error)
  }
}

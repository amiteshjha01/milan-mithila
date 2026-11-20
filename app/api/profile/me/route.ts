import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MongoUser, MongoProfile } from '@/lib/mongodb-models'
import { generateProfileCode } from '@/lib/accounts'
import { authenticate, fail, readJson, serverError } from '@/lib/security/guard'
import { normalizeLevel } from '@/lib/security/privacy'
import { isSafeImageUrl } from '@/lib/security/images'
import { calculateProfileCompletion } from '@/lib/profile-completion'

export const dynamic = 'force-dynamic'

const levelLabel = (v: unknown) => {
  const l = normalizeLevel(v)
  return l === 'MEMBERS' ? 'Members only' : l === 'CONNECTIONS' ? 'Connections only' : 'Only me'
}

/** Form label -> stored enum. 'Everyone' is treated as MEMBERS: profiles are never exposed to anonymous visitors. */
function labelToLevel(label: string): 'MEMBERS' | 'CONNECTIONS' | 'PRIVATE' | null {
  const v = label.trim().toLowerCase()
  if (v === 'members only' || v === 'everyone' || v === 'members') return 'MEMBERS'
  if (v === 'connections only' || v === 'connections') return 'CONNECTIONS'
  if (v === 'only me' || v === 'private') return 'PRIVATE'
  return null
}

const s = (max = 300) => z.string().trim().max(max)
// Unknown keys (userId, role, visibility, verified, profileCode, ...) are stripped: they can never be written.
const formSchema = z
  .object({
    fullName: s(100), gender: s(40), dateOfBirth: s(40), height: s(40), maritalStatus: s(60), motherTongue: s(60),
    currentLocation: s(120), nativeDistrict: s(80), nativeVillage: s(80), country: s(60),
    highestQualification: s(80), degree: s(120), college: s(160), occupation: s(120), workingSector: s(60),
    employer: s(160), annualIncome: s(80), workLocation: s(120), professionalDescription: s(2000),
    fatherOccupation: s(120), motherOccupation: s(120), siblings: s(120), familyType: s(60), familyValues: s(300),
    familyVillage: s(120), familyDescription: s(2000), familyVisibility: s(40),
    community: s(80), subCommunity: s(80), gotra: s(80), mool: s(80), ancestralVillage: s(120), kul: s(80),
    pravara: s(80), kuldevi: s(80), panjiAvailability: z.enum(['known', 'not-known', 'not-applicable', 'private']),
    maternalLineage: s(1000), culturalVisibility: s(40),
    ageRange: s(60), heightRange: s(60), educationPreference: s(120), professionPreference: s(120),
    locationPreference: s(120), communityPreference: s(120), lifestylePreference: s(120),
    employmentPreference: s(120), familyPreference: s(120), gotraPreference: s(120), moolPreference: s(120),
    relocationPreference: s(120),
    photos: z
      .array(
        z.object({
          src: z.string().max(2_800_000).optional(),
          url: z.string().max(2_800_000).optional(),
          alt: s(160).optional(),
          primary: z.boolean().optional(),
          visibility: s(40).optional(),
        })
      )
      .max(8),
  })
  .partial()

const bodySchema = z.object({ form: formSchema })

const PHOTO_LEVELS: Record<string, string> = { PUBLIC: 'PUBLIC', MEMBERS_ONLY: 'MEMBERS_ONLY', MUTUAL_CONSENT: 'MUTUAL_CONSENT' }

export function computeAgeFromDob(dob: unknown, fallback = 27): number {
  if (!dob) return fallback
  const d = new Date(dob as string | Date)
  if (isNaN(d.getTime())) return fallback
  const today = new Date()
  let age = today.getUTCFullYear() - d.getUTCFullYear()
  const m = today.getUTCMonth() - d.getUTCMonth()
  if (m < 0 || (m === 0 && today.getUTCDate() < d.getUTCDate())) age--
  return age >= 18 && age <= 100 ? age : fallback
}

export function formatDobIsoDate(dob: unknown): string {
  if (!dob) return '1998-01-01'
  const d = new Date(dob as string | Date)
  if (isNaN(d.getTime())) return '1998-01-01'
  return d.toISOString().slice(0, 10)
}

export async function GET(request: Request) {
  try {
    // Identity comes only from the session. Any ?userId= / ?email= is ignored.
    const result = await authenticate(request, { allowMustReset: false })
    if (!result.ok) return result.response
    const user: any = await MongoUser.findById(result.auth.user.id).lean()
    if (!user) return fail(401, 'Authentication required.')

    let profile: any = await MongoProfile.findOne({ userId: user._id }).lean()
    if (!profile && (user.role === 'ADMIN' || user.role === 'MODERATOR')) {
      return NextResponse.json({
        ok: true,
        user: { id: String(user._id), name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
        profile: null,
      })
    }
    if (!profile) {
      const initialProfile = {
        userId: user._id,
        profileCode: await generateProfileCode(),
        displayName: user.name,
        gender: 'Prefer not to disclose',
        age: 27, height: '5 ft 6 in', maritalStatus: 'Never married', motherTongue: 'Maithili',
        currentCity: 'Patna', currentState: 'Bihar', country: 'India', nativeDistrict: 'Madhubani',
        highestQualification: 'Postgraduate', profession: 'Professional', workingSector: 'Private sector',
        introduction: `Namaskar. I am ${user.name}.`,
        verified: false, verificationLabel: 'Email not verified',
      }
      profile = (
        await MongoProfile.create({
          ...initialProfile,
          profileCompletion: calculateProfileCompletion(initialProfile).percentage,
        })
      ).toObject()
    }

    const res = NextResponse.json({
      ok: true,
      user: {
        id: String(user._id), name: user.name, email: user.email, role: user.role,
        isVerified: user.isVerified, gender: profile.gender || 'Man',
      },
      profile: {
        id: String(profile._id),
        profileCode: profile.profileCode,
        fullName: profile.displayName || user.name,
        gender: profile.gender || 'Man',
        dateOfBirth: formatDobIsoDate(profile.dateOfBirth),
        age: profile.dateOfBirth ? computeAgeFromDob(profile.dateOfBirth, profile.age || 27) : profile.age || 27,
        height: profile.height || '5 ft 6 in',
        maritalStatus: profile.maritalStatus || 'Never married',
        motherTongue: profile.motherTongue || 'Maithili',
        currentLocation: `${profile.currentCity || 'Patna'}${profile.currentState ? ', ' + profile.currentState : ''}`,
        currentCity: profile.currentCity || 'Patna',
        currentState: profile.currentState || 'Bihar',
        nativeDistrict: profile.nativeDistrict || 'Madhubani',
        nativeVillage: profile.nativeVillage || profile.nativeDistrict || 'Madhubani',
        country: profile.country || 'India',
        highestQualification: profile.highestQualification || 'Postgraduate',
        degree: profile.degree || profile.highestQualification || 'Graduate',
        college: profile.college || 'University',
        occupation: profile.profession || 'Professional',
        workingSector: profile.workingSector || 'Private sector',
        employer: profile.employer || '',
        annualIncome: profile.annualIncome || 'Prefer not to disclose',
        workLocation: profile.workLocation || profile.currentCity || 'Patna',
        professionalDescription: profile.introduction || '',
        fatherOccupation: profile.fatherOccupation || '',
        motherOccupation: profile.motherOccupation || '',
        siblings: profile.siblings || 'None specified',
        familyType: profile.familyType || 'Nuclear',
        familyValues: profile.familyValues || 'Progressive with strong roots',
        familyVillage: profile.familyVillage || profile.nativeVillage || 'Madhubani',
        familyDescription: profile.familySummary || '',
        familyVisibility: levelLabel(profile.familyVisibility ?? 'MEMBERS'),
        community: profile.community || 'Maithil community',
        subCommunity: profile.subCommunity || '',
        gotra: profile.gotra || 'Kashyapa',
        mool: profile.mool || 'Sakri',
        ancestralVillage: profile.ancestralVillage || profile.nativeDistrict || 'Madhubani',
        kul: profile.kul || 'Not known',
        pravara: profile.pravara || 'Not applicable',
        kuldevi: profile.kuldevi || 'Prefer not to disclose',
        panjiAvailability: profile.panjiAvailability || 'not-known',
        maternalLineage: profile.maternalLineage || '',
        culturalVisibility: levelLabel(profile.culturalVisibility ?? 'MEMBERS'),
        ageRange: profile.partnerPreferences?.ageRange || '24–32 years',
        heightRange: profile.partnerPreferences?.heightRange || '5 ft 2 in – 6 ft 0 in',
        educationPreference: profile.partnerPreferences?.education || 'Graduate or above',
        professionPreference: profile.partnerPreferences?.profession || 'Stable meaningful work',
        locationPreference: profile.partnerPreferences?.location || 'Open to discussion',
        communityPreference: profile.partnerPreferences?.communityPreference || 'Open to conversation',
        lifestylePreference: profile.partnerPreferences?.lifestyle || 'Balanced',
        employmentPreference: profile.partnerPreferences?.employmentPreference || 'Professional',
        relocationPreference: profile.relocationPreference || 'Open to discussion',
        familyPreference: profile.partnerPreferences?.familyPreference || 'Respectful family',
        gotraPreference: profile.partnerPreferences?.gotraPreference || '',
        moolPreference: profile.partnerPreferences?.moolPreference || '',
        photos: profile.photos || [],
        profileCompletion: calculateProfileCompletion(profile).percentage,
        verified: Boolean(profile.verified),
        verificationLabel: profile.verificationLabel || 'Email not verified',
      },
    })
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch (error) {
    return serverError('profile/me GET', error)
  }
}

export async function POST(request: Request) {
  try {
    const result = await authenticate(request)
    if (!result.ok) return result.response

    const parsed = bodySchema.safeParse(await readJson(request))
    if (!parsed.success) return fail(400, 'Invalid profile data.')
    const form = parsed.data.form

    const user: any = await MongoUser.findById(result.auth.user.id)
    if (!user) return fail(401, 'Authentication required.')
    const existing: any = await MongoProfile.findOne({ userId: user._id }).lean()
    if (!existing) return fail(404, 'Profile not found.')

    const set: Record<string, any> = {}
    const put = (k: string, v: unknown) => { if (v !== undefined) set[k] = v }

    put('displayName', form.fullName || undefined)
    put('gender', form.gender && ['Woman', 'Man', 'Non-binary', 'Prefer not to disclose'].includes(form.gender) ? form.gender : undefined)
    put('dateOfBirth', form.dateOfBirth ? new Date(form.dateOfBirth) : undefined)
    if (set.dateOfBirth && isNaN(set.dateOfBirth.getTime())) {
      delete set.dateOfBirth
    } else if (set.dateOfBirth) {
      set.age = computeAgeFromDob(set.dateOfBirth, existing.age || 27)
    }
    put('height', form.height); put('maritalStatus', form.maritalStatus); put('motherTongue', form.motherTongue)
    if (form.currentLocation) {
      put('currentCity', form.currentLocation.split(',')[0]?.trim() || form.currentLocation)
      put('currentState', form.currentLocation.split(',')[1]?.trim() || 'Bihar')
    }
    put('nativeDistrict', form.nativeDistrict); put('nativeVillage', form.nativeVillage); put('country', form.country)
    put('highestQualification', form.highestQualification); put('degree', form.degree); put('college', form.college)
    put('profession', form.occupation); put('workingSector', form.workingSector); put('employer', form.employer)
    put('annualIncome', form.annualIncome); put('workLocation', form.workLocation)
    put('introduction', form.professionalDescription)
    put('fatherOccupation', form.fatherOccupation); put('motherOccupation', form.motherOccupation); put('siblings', form.siblings)
    put('familyType', form.familyType); put('familyValues', form.familyValues); put('familyVillage', form.familyVillage)
    put('familySummary', form.familyDescription)
    put('community', form.community); put('subCommunity', form.subCommunity); put('gotra', form.gotra); put('mool', form.mool)
    put('ancestralVillage', form.ancestralVillage); put('kul', form.kul); put('pravara', form.pravara); put('kuldevi', form.kuldevi)
    put('panjiAvailability', form.panjiAvailability); put('maternalLineage', form.maternalLineage)
    put('relocationPreference', form.relocationPreference)

    // Privacy levels: only applied when the user actually changed them in the form (so a stale
    // label can never silently downgrade a stricter value chosen in Settings).
    if (form.familyVisibility && form.familyVisibility !== levelLabel(existing.familyVisibility ?? 'MEMBERS')) {
      const lvl = labelToLevel(form.familyVisibility)
      if (lvl) set.familyVisibility = lvl
    }
    if (form.culturalVisibility && form.culturalVisibility !== levelLabel(existing.culturalVisibility ?? 'MEMBERS')) {
      const lvl = labelToLevel(form.culturalVisibility)
      if (lvl) set.culturalVisibility = lvl
    }

    set.partnerPreferences = {
      ...(existing.partnerPreferences || {}),
      ...Object.fromEntries(
        Object.entries({
          ageRange: form.ageRange, heightRange: form.heightRange, education: form.educationPreference,
          profession: form.professionPreference, location: form.locationPreference,
          communityPreference: form.communityPreference, lifestyle: form.lifestylePreference,
          employmentPreference: form.employmentPreference, familyPreference: form.familyPreference,
          gotraPreference: form.gotraPreference, moolPreference: form.moolPreference,
        }).filter(([, v]) => v !== undefined)
      ),
    }

    if (form.photos) {
      const photos: any[] = []
      for (const [index, ph] of form.photos.entries()) {
        const url = ph.src || ph.url
        if (!url || !isSafeImageUrl(url)) return fail(400, 'One of the photographs is not a supported image (PNG, JPEG or WebP, max 2 MB).')
        photos.push({
          url,
          alt: ph.alt || form.fullName || 'Member profile photograph',
          isPrimary: Boolean(ph.primary || index === 0),
          visibility: PHOTO_LEVELS[String(ph.visibility || '').toUpperCase().replace(/[\s-]+/g, '_')] || 'MEMBERS_ONLY',
        })
      }
      set.photos = photos
    }
    const mergedForCompletion = {
      ...existing,
      ...set,
      partnerPreferences: set.partnerPreferences || existing.partnerPreferences,
      photos: set.photos ?? existing.photos,
    }
    set.profileCompletion = calculateProfileCompletion(mergedForCompletion).percentage

    if (set.displayName && set.displayName !== user.name) await MongoUser.updateOne({ _id: user._id }, { name: set.displayName })

    const updated: any = await MongoProfile.findOneAndUpdate({ userId: user._id }, { $set: set }, { returnDocument: 'after', runValidators: true }).lean()
    const primary = updated?.photos?.find((p: any) => p.isPrimary)?.url || updated?.photos?.[0]?.url || '/images/placeholder-user.jpg'

    return NextResponse.json({
      ok: true,
      profile: {
        id: String(updated._id),
        profileCode: updated.profileCode,
        displayName: updated.displayName,
        profileCompletion: updated.profileCompletion,
      },
      user: {
        id: String(user._id), name: updated.displayName || user.name, email: user.email, role: user.role,
        avatar: primary, gender: updated.gender, isVerified: user.isVerified,
      },
    })
  } catch (error) {
    return serverError('profile/me POST', error)
  }
}

import { MongoInterest, MongoProfile, MongoUser } from '@/lib/mongodb-models'

/**
 * Server-side profile privacy engine.
 * Every profile response is built by an explicit WHITELIST serializer from this file,
 * so a field that is not listed here (contact details, documents, anything added to the
 * schema later) can never leak by accident. Nothing here relies on frontend hiding.
 */
export const PLACEHOLDER_PHOTO = '/images/placeholder-user.jpg'
export const HIDDEN_TEXT = 'Hidden by member'

export type Relation = 'SELF' | 'ADMIN' | 'CONNECTION' | 'MEMBER'
type Level = 'MEMBERS' | 'CONNECTIONS' | 'PRIVATE'

export interface Viewer {
  userId: string
  role: string
  profileCode: string | null
  /** identifiers under which this viewer's own records may be stored (profile code + legacy user id) */
  keys: string[]
}

export async function getViewer(auth: { user: { id: string; role: string } }): Promise<Viewer> {
  const profile: any = await MongoProfile.findOne({ userId: auth.user.id }, 'profileCode').lean()
  const profileCode: string | null = profile?.profileCode ?? null
  return {
    userId: auth.user.id,
    role: auth.user.role,
    profileCode,
    keys: profileCode ? [profileCode, auth.user.id] : [auth.user.id],
  }
}

/** Profile codes the viewer is connected with (an ACCEPTED interest in either direction). */
export async function getConnectionCodes(viewer: Viewer): Promise<Set<string>> {
  const accepted: any[] = await MongoInterest.find({
    status: 'ACCEPTED',
    $or: [{ senderId: { $in: viewer.keys } }, { receiverId: { $in: viewer.keys } }],
  }).lean()
  const out = new Set<string>()
  for (const i of accepted) {
    if (viewer.keys.includes(i.senderId)) out.add(i.receiverId)
    if (viewer.keys.includes(i.receiverId)) out.add(i.senderId)
  }
  return out
}

export function relationTo(profile: any, viewer: Viewer, connections: Set<string>): Relation {
  if (String(profile.userId) === viewer.userId) return 'SELF'
  if (viewer.role === 'ADMIN') return 'ADMIN'
  if (connections.has(profile.profileCode)) return 'CONNECTION'
  return 'MEMBER'
}

/** Map stored (possibly legacy/garbled) values to a Level. Unknown => most restrictive. */
export function normalizeLevel(value: unknown): Level {
  const v = String(value ?? '').trim().toUpperCase().replace(/[\s-]+/g, '_')
  if (v === 'MEMBERS' || v === 'MEMBERS_ONLY' || v === 'COMMUNITY') return 'MEMBERS'
  if (v === 'CONNECTIONS' || v === 'CONNECTIONS_ONLY') return 'CONNECTIONS'
  return 'PRIVATE'
}

function levelAllows(level: Level, relation: Relation): boolean {
  if (relation === 'SELF' || relation === 'ADMIN') return true
  if (level === 'MEMBERS') return true
  if (level === 'CONNECTIONS') return relation === 'CONNECTION'
  return false
}

export type ProfileVisibility = 'COMMUNITY' | 'CONNECTIONS_ONLY' | 'PAUSED'
export function normalizeProfileVisibility(value: unknown): ProfileVisibility {
  const v = String(value ?? '').trim().toUpperCase()
  if (v === 'COMMUNITY') return 'COMMUNITY'
  if (v === 'CONNECTIONS_ONLY') return 'CONNECTIONS_ONLY'
  return 'PAUSED' // unknown / legacy => fail closed
}

export function isSystemProfile(profile: any): boolean {
  return /^MM-ADMIN/i.test(String(profile?.profileCode || '')) || profile?.profession === 'Platform Administrator'
}

/** Can this viewer see that the profile exists at all? */
export function canViewProfile(profile: any, relation: Relation, ownerActive: boolean): boolean {
  if (relation === 'SELF') return true
  if (isSystemProfile(profile)) return false
  if (relation === 'ADMIN') return true
  if (!ownerActive) return false
  const vis = normalizeProfileVisibility(profile.visibility)
  if (vis === 'PAUSED') return false
  if (vis === 'CONNECTIONS_ONLY') return relation === 'CONNECTION'
  return true
}

export interface FieldAccess {
  cultural: boolean
  family: boolean
  photos: boolean
  relation: Relation
}

export function fieldAccess(profile: any, relation: Relation): FieldAccess {
  return {
    relation,
    cultural: levelAllows(normalizeLevel(profile.culturalVisibility ?? 'MEMBERS'), relation),
    family: levelAllows(normalizeLevel(profile.familyVisibility ?? 'MEMBERS'), relation),
    photos: true, // photos are filtered individually, see visiblePhotoUrls
  }
}

/** URLs of the photos this viewer may see. Restricted photos are dropped, never merely hidden. */
export function visiblePhotos(profile: any, relation: Relation): any[] {
  const photos: any[] = Array.isArray(profile.photos) ? profile.photos : []
  if (relation === 'SELF' || relation === 'ADMIN') return photos
  const profileLevel = !profile.photoVisibility || profile.photoVisibility === 'MEMBERS' ? 'MEMBERS' : 'CONNECTIONS' // unknown => stricter
  if (profileLevel === 'CONNECTIONS' && relation !== 'CONNECTION') return []
  return photos.filter((ph) => {
    const v = String(ph?.visibility || 'MEMBERS_ONLY').toUpperCase()
    if (v === 'PUBLIC' || v === 'MEMBERS_ONLY') return true
    if (v === 'MUTUAL_CONSENT') return relation === 'CONNECTION'
    return false
  })
}

export function photoUrlsFor(profile: any, relation: Relation): string[] {
  const urls = visiblePhotos(profile, relation).map((p: any) => p.url).filter(Boolean)
  return urls.length ? urls : [PLACEHOLDER_PHOTO]
}

const initialsOf = (name: string) =>
  String(name || '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

/**
 * Hidden user ids: accounts that must not appear in search/detail for other members.
 */
export async function getInactiveUserIds(): Promise<string[]> {
  const rows: any[] = await MongoUser.find({ accountStatus: { $in: ['BLOCKED', 'PENDING_REVIEW', 'PAUSED'] } }, '_id').lean()
  return rows.map((r) => String(r._id))
}

/** List-card projection (discover / dashboard / interests). */
export function serializeProfileCard(p: any, relation: Relation, flags: { shortlisted: boolean; interested: boolean }) {
  const access = fieldAccess(p, relation)
  const photos = photoUrlsFor(p, relation)
  const hidden = HIDDEN_TEXT
  return {
    id: p.profileCode,
    name: p.displayName,
    gender: p.gender,
    age: p.age,
    height: p.height || '5 ft 6 in',
    education: p.highestQualification || 'Graduate',
    profession: p.profession || 'Professional',
    sector: p.workingSector || 'Private sector',
    income: p.annualIncome || 'Prefer not to disclose',
    city: p.currentCity,
    nativeDistrict: p.nativeDistrict,
    country: p.country || 'India',
    motherTongue: p.motherTongue || 'Maithili',
    maritalStatus: p.maritalStatus || 'Never married',
    familyType: access.family ? p.familyType || 'Nuclear' : hidden,
    familyValues: access.family ? p.familyValues || 'Progressive with strong roots' : hidden,
    familyLocation: access.family ? p.familyLocation || `${p.nativeDistrict}, Bihar` : hidden,
    familyBackground: access.family ? p.familySummary || 'A respected Maithil family with strong cultural roots.' : hidden,
    community: p.community || 'Maithil community',
    subCommunity: access.cultural ? p.subCommunity : undefined,
    gotra: access.cultural ? p.gotra : hidden,
    mool: access.cultural ? p.mool : hidden,
    ancestralVillage: access.cultural ? p.ancestralVillage || p.nativeVillage : hidden,
    kul: access.cultural ? p.kul || 'Kashyap Kul' : hidden,
    pravara: access.cultural ? p.pravara || 'Traya Pravara' : hidden,
    diet: p.partnerPreferences?.diet || 'Open to conversation',
    lifestyle: p.partnerPreferences?.lifestyle || 'Balanced',
    relocation: 'Open to discussion',
    horoscope: 'Not disclosed',
    introduction: p.introduction,
    profileCompletion: p.profileCompletion || 88,
    availability: 'Active today',
    verified: p.verified,
    verificationLabel: p.verificationLabel || 'Email not verified',
    joinedDaysAgo: 1,
    active: true,
    recommended: true,
    shortlisted: flags.shortlisted,
    interested: flags.interested,
    image: photos[0],
    avatar: photos[0],
    photos,
    initials: initialsOf(p.displayName),
    restricted: { cultural: !access.cultural, family: !access.family, photos: visiblePhotos(p, relation).length === 0 && (p.photos?.length ?? 0) > 0 },
  }
}

/** Full detail projection of another member's profile. */
export function serializeProfileDetail(p: any, relation: Relation, flags: { shortlisted: boolean; interested: boolean }) {
  const access = fieldAccess(p, relation)
  const card = serializeProfileCard(p, relation, flags)
  const hidden = HIDDEN_TEXT
  return {
    ...card,
    degree: p.degree || p.highestQualification,
    company: p.employer || 'Private Organization',
    workingSector: p.workingSector || 'Private sector',
    languages: p.languages || ['Maithili', 'Hindi', 'English'],
    fatherOccupation: access.family ? p.fatherOccupation : undefined,
    motherOccupation: access.family ? p.motherOccupation : undefined,
    siblings: access.family ? p.siblings : undefined,
    familySummary: access.family ? p.familySummary || 'A respected family with deep cultural roots in Mithilanchal.' : hidden,
    panjiAvailability: access.cultural ? p.panjiAvailability : undefined,
    partnerPreferences: {
      ageRange: p.partnerPreferences?.ageRange || '24–32 years',
      heightRange: p.partnerPreferences?.heightRange || '5 ft 2 in – 6 ft 0 in',
      education: p.partnerPreferences?.education || 'Graduate or above',
      profession: p.partnerPreferences?.profession || 'Stable meaningful work',
      location: p.partnerPreferences?.location || 'Open to discussion',
      diet: p.partnerPreferences?.diet,
      lifestyle: p.partnerPreferences?.lifestyle,
      communityPreference: p.partnerPreferences?.communityPreference,
      // lineage preferences are cultural information and follow the cultural visibility gate
      ...(access.cultural
        ? { gotraPreference: p.partnerPreferences?.gotraPreference, moolPreference: p.partnerPreferences?.moolPreference }
        : {}),
    },
  }
}

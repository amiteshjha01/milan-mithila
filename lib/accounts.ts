import { randomInt } from 'node:crypto'
import { MongoProfile, MongoUser } from '@/lib/mongodb-models'

export const PLACEHOLDER_AVATAR = '/images/placeholder-user.jpg'

/** The ONLY shape in which a user is ever sent to a browser. No hashes, tokens or internal flags. */
export function publicUser(user: any, profile?: any) {
  const primary = profile?.photos?.find((p: any) => p.isPrimary) || profile?.photos?.[0]
  return {
    id: String(user._id ?? user.id),
    name: profile?.displayName || user.name,
    email: user.email,
    role: user.role,
    avatar: primary?.url || PLACEHOLDER_AVATAR,
    isVerified: Boolean(user.isVerified),
    gender: profile?.gender,
  }
}

export async function generateProfileCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = `MM-${randomInt(100000, 999999)}`
    if (!(await MongoProfile.exists({ profileCode: code }))) return code
  }
  return `MM-${Date.now()}`
}

interface NewMember {
  email: string
  name: string
  role?: 'SEEKER' | 'PARENT' | 'GUARDIAN'
  gender?: string
  phone?: string
  passwordHash?: string
  googleSub?: string
  emailVerified?: boolean
  currentCity?: string
  nativeDistrict?: string
  gotra?: string
  profession?: string
  ip?: string
}

/** Creates a user + starter profile. Role is NEVER above SEEKER/PARENT/GUARDIAN here. */
export async function createMember(d: NewMember) {
  const email = d.email.toLowerCase().trim()
  const nativeDistrict = d.nativeDistrict || 'Madhubani'
  const user = await MongoUser.create({
    email,
    name: d.name.trim(),
    passwordHash: d.passwordHash,
    authProvider: d.googleSub ? 'GOOGLE' : 'CREDENTIALS',
    googleSub: d.googleSub,
    role: d.role || 'SEEKER',
    phone: d.phone,
    isVerified: Boolean(d.emailVerified),
    consentLogs: [{ consentType: 'REGISTRATION_CONSENT_DPDP_2023', grantedAt: new Date(), version: '2026.1', ipAddress: d.ip }],
  })

  const profileCode = await generateProfileCode()
  const profile = await MongoProfile.create({
    userId: user._id,
    profileCode,
    displayName: d.name.trim(),
    gender: d.gender || 'Prefer not to disclose',
    age: 27,
    height: '5 ft 6 in',
    maritalStatus: 'Never married',
    motherTongue: 'Maithili',
    languages: ['Maithili', 'Hindi', 'English'],
    introduction: `Namaskar. I am ${d.name.trim()} from ${nativeDistrict}. Looking for a grounded and culturally rooted life partner.`,
    currentCity: d.currentCity || 'Patna',
    currentState: 'Bihar',
    country: 'India',
    nativeDistrict,
    nativeVillage: nativeDistrict,
    highestQualification: 'Postgraduate',
    profession: d.profession || 'Professional',
    workingSector: 'Private sector',
    community: 'Maithil community',
    gotra: d.gotra || 'Kashyapa',
    mool: 'Sakri',
    ancestralVillage: nativeDistrict,
    verified: false,
    verificationLabel: d.emailVerified ? 'Email verified' : 'Email not verified',
    emailVerified: Boolean(d.emailVerified),
    photos: [{ url: PLACEHOLDER_AVATAR, alt: d.name, isPrimary: true, visibility: 'MEMBERS_ONLY' }],
  })
  return { user, profile }
}

export function normalizeEmail(email: string) {
  return email.toLowerCase().trim()
}

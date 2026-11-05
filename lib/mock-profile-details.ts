import { discoverProfiles, type DiscoverProfile } from '@/lib/mock-discover'

export type DetailValue = { label: string; value?: string; status?: 'shared' | 'not-disclosed' | 'not-applicable' | 'pending' }

export type ProfileDetail = DiscoverProfile & {
  dateOfBirth: string
  languages: string[]
  gallery: { src?: string; alt: string; visibility: 'shared' | 'members-only' | 'restricted' }[]
  employer?: string
  workLocation?: string
  professionalIntroduction: string
  fatherOccupation?: string
  motherOccupation?: string
  siblings: string
  partnerExpectations: DetailValue[]
  lineageInformation?: string
  panjiAvailability: string
  kuldevi?: string
}

const detailOverrides: Record<string, Partial<ProfileDetail>> = {
  'MM-240184': { dateOfBirth: '14 June 1997', languages: ['Maithili', 'Hindi', 'English'], gallery: [{ src: '/images/discover-aarav.png', alt: 'Aarav smiling in warm natural light', visibility: 'members-only' }, { alt: 'Additional photo restricted by profile owner', visibility: 'restricted' }, { alt: 'Additional photo not shared yet', visibility: 'restricted' }], employer: 'Northstar Design Studio', workLocation: 'Bengaluru', professionalIntroduction: 'I enjoy making complex things feel simple. Outside work, you will usually find me reading, walking through a new neighbourhood, or planning a slow weekend with family.', fatherOccupation: 'Retired bank manager', motherOccupation: 'School teacher', siblings: 'One younger sister', lineageInformation: 'My family has roots around Darbhanga and Sakri.', panjiAvailability: 'Not known', kuldevi: 'Prefer not to disclose', partnerExpectations: [{ label: 'Age range', value: '27–33 years' }, { label: 'Height', value: '5 ft 5 in – 6 ft 1 in' }, { label: 'Education', value: 'Thoughtful and curious' }, { label: 'Profession', value: 'Stable, meaningful work' }, { label: 'Location', value: 'Open to Bengaluru, Delhi, or Mumbai' }, { label: 'Family values', value: 'Warm, respectful, and grounded' }] },
  'MM-240176': { dateOfBirth: '22 September 1995', languages: ['Maithili', 'Hindi', 'English'], gallery: [{ src: '/images/discover-riya.png', alt: 'Riya smiling in soft natural light', visibility: 'members-only' }, { alt: 'Gallery photo restricted by profile owner', visibility: 'restricted' }], employer: 'Cedar & Co.', workLocation: 'Mumbai', professionalIntroduction: 'I work in strategy and care about building a life that has both ambition and ease in it. I value honest conversation, family time, and a little spontaneity.', fatherOccupation: 'Small business owner', motherOccupation: 'Homemaker', siblings: 'One elder brother', lineageInformation: 'My maternal family has roots in Madhubani.', panjiAvailability: 'Prefer not to disclose', kuldevi: 'Prefer not to disclose', partnerExpectations: [{ label: 'Age range', value: '29–35 years' }, { label: 'Height', value: '5 ft 7 in or above' }, { label: 'Education', value: 'Open to conversation' }, { label: 'Profession', value: 'Purposeful work' }, { label: 'Location', value: 'Open to Mumbai, Bengaluru, or Delhi' }, { label: 'Lifestyle', value: 'Balanced and community-minded' }] },
  'MM-240211': { dateOfBirth: '03 March 1995', languages: ['Maithili', 'Hindi', 'English'], gallery: [{ src: '/images/discover-dev.png', alt: 'Dev in warm natural light', visibility: 'members-only' }, { alt: 'Additional photo not shared yet', visibility: 'restricted' }], employer: 'Dev Verma Studio', workLocation: 'Pune', professionalIntroduction: 'I am an architect who likes the quiet details: good light, old buildings, and a long conversation over tea. I make time for family and for the things that keep me curious.', fatherOccupation: 'Civil engineer', motherOccupation: 'College lecturer', siblings: 'One younger brother', lineageInformation: 'Our family home is near Bisfi, Madhubani.', panjiAvailability: 'Not applicable', kuldevi: 'Not disclosed', partnerExpectations: [{ label: 'Age range', value: '27–34 years' }, { label: 'Height', value: '5 ft 3 in or above' }, { label: 'Education', value: 'Curious and self-directed' }, { label: 'Profession', value: 'Open to different paths' }, { label: 'Location', value: 'Open to relocation' }, { label: 'Family values', value: 'Independent and connected' }] },
  'MM-240198': { dateOfBirth: '18 November 1997', languages: ['Hindi', 'English', 'Maithili'], gallery: [{ src: '/images/discover-anjali.png', alt: 'Anjali in soft daylight', visibility: 'members-only' }, { alt: 'Additional photo restricted by profile owner', visibility: 'restricted' }], employer: 'Civic Futures Lab', workLocation: 'Bengaluru', professionalIntroduction: 'A listener by profession and a reader by habit. I am happiest when a day has a little work, a little music, and time with people I care about.', fatherOccupation: 'School principal', motherOccupation: 'Homemaker', siblings: 'No siblings', lineageInformation: 'My family has roots in Saharsa.', panjiAvailability: 'Not disclosed', kuldevi: 'Prefer not to disclose', partnerExpectations: [{ label: 'Age range', value: '28–34 years' }, { label: 'Height', value: '5 ft 6 in or above' }, { label: 'Education', value: 'Open to conversation' }, { label: 'Profession', value: 'Work with a sense of purpose' }, { label: 'Location', value: 'Open to Bengaluru or Delhi' }, { label: 'Lifestyle', value: 'Balanced and community-minded' }] },
}

export const profileDetails: ProfileDetail[] = discoverProfiles.map((profile) => ({ ...profile, dateOfBirth: 'Prefer not to disclose', languages: [profile.motherTongue, 'Hindi'], gallery: [{ src: profile.image, alt: `${profile.name} profile photograph`, visibility: 'members-only' }], professionalIntroduction: profile.introduction, siblings: 'Prefer not to disclose', panjiAvailability: 'Prefer not to disclose', partnerExpectations: [], ...detailOverrides[profile.id] }))

export function getProfileDetail(profileId: string) {
  return profileDetails.find((profile) => profile.id.toLowerCase() === profileId.toLowerCase())
}

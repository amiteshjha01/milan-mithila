export type PreferenceMode = 'strict' | 'flexible'
export type Disclosure = 'known' | 'not-known' | 'not-applicable' | 'private'

export type ProfileForm = {
  fullName: string
  gender: string
  dateOfBirth: string
  height: string
  maritalStatus: string
  motherTongue: string
  currentLocation: string
  nativeDistrict: string
  nativeVillage: string
  country: string
  highestQualification: string
  degree: string
  college: string
  occupation: string
  workingSector: string
  employer: string
  annualIncome: string
  workLocation: string
  professionalDescription: string
  fatherOccupation: string
  motherOccupation: string
  siblings: string
  familyType: string
  familyValues: string
  familyVillage: string
  familyDescription: string
  familyVisibility: string
  community: string
  subCommunity: string
  gotra: string
  mool: string
  ancestralVillage: string
  kul: string
  pravara: string
  kuldevi: string
  panjiAvailability: Disclosure
  maternalLineage: string
  culturalVisibility: string
  ageRange: string
  heightRange: string
  educationPreference: string
  professionPreference: string
  locationPreference: string
  communityPreference: string
  lifestylePreference: string
  employmentPreference: string
  relocationPreference: string
  familyPreference: string
  gotraPreference: string
  moolPreference: string
}

export const profileDefaults: ProfileForm = {
  fullName: 'Verified Member', gender: 'Man', dateOfBirth: '1998-01-01', height: '5 ft 6 in', maritalStatus: 'Never married', motherTongue: 'Maithili', currentLocation: 'Patna, Bihar', nativeDistrict: 'Madhubani', nativeVillage: 'Madhubani', country: 'India',
  highestQualification: 'Postgraduate', degree: 'Graduate', college: 'University', occupation: 'Professional', workingSector: 'Private sector', employer: '', annualIncome: 'Prefer not to disclose', workLocation: 'Patna', professionalDescription: '',
  fatherOccupation: '', motherOccupation: '', siblings: 'None specified', familyType: 'Nuclear', familyValues: 'Progressive with strong roots', familyVillage: 'Madhubani', familyDescription: '', familyVisibility: 'Members only',
  community: 'Maithil community', subCommunity: '', gotra: 'Kashyapa', mool: 'Sakri', ancestralVillage: 'Madhubani', kul: 'Not known', pravara: 'Not applicable', kuldevi: 'Prefer not to disclose', panjiAvailability: 'not-known', maternalLineage: '', culturalVisibility: 'Members only',
  ageRange: '24–32 years', heightRange: '5 ft 2 in – 6 ft 0 in', educationPreference: 'Graduate or above', professionPreference: 'Stable meaningful work', locationPreference: 'Open to discussion', communityPreference: 'Open to conversation', lifestylePreference: 'Balanced', employmentPreference: 'Professional', relocationPreference: 'Open to discussion', familyPreference: 'Respectful family', gotraPreference: '', moolPreference: '',
}

export const completionItems = [
  { label: 'Personal information', detail: 'Everything looks good', complete: true, section: 'personal' },
  { label: 'Education & career', detail: 'Add a short professional story', complete: false, section: 'career' },
  { label: 'Family background', detail: 'Add your family description', complete: false, section: 'family' },
  { label: 'Cultural information', detail: 'Review visibility choices', complete: false, section: 'cultural' },
  { label: 'Photos', detail: 'Add one more photograph', complete: false, section: 'photos' },
  { label: 'Partner preferences', detail: 'A thoughtful beginning', complete: true, section: 'preferences' },
]

export const profilePhotos = [
  { id: 'primary', src: '/images/placeholder-user.jpg', alt: 'Profile photograph', primary: true },
  { id: 'gallery-1', src: '', alt: 'Gallery photo placeholder', primary: false },
  { id: 'gallery-2', src: '', alt: 'Gallery photo placeholder', primary: false },
]

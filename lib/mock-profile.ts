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
  fullName: 'Mitali Sharma', gender: 'Woman', dateOfBirth: '1998-06-14', height: '5 ft 4 in', maritalStatus: 'Never married', motherTongue: 'Maithili', currentLocation: 'New Delhi, Delhi', nativeDistrict: 'Madhubani', nativeVillage: 'Sakri', country: 'India',
  highestQualification: 'Postgraduate', degree: 'MBA · Finance', college: 'Delhi University', occupation: 'Strategy Consultant', workingSector: 'Private sector', employer: 'Northstar Advisory', annualIncome: 'Prefer not to disclose', workLocation: 'New Delhi', professionalDescription: 'I enjoy solving thoughtful problems, working with people, and keeping a little room for curiosity outside of work.',
  fatherOccupation: 'Retired civil engineer', motherOccupation: 'School teacher', siblings: 'One younger sister', familyType: 'Nuclear', familyValues: 'Progressive with strong roots', familyVillage: 'Sakri, Madhubani', familyDescription: 'A close-knit family that values education, kindness, and staying connected to our Mithila roots.', familyVisibility: 'Members only',
  community: 'Maithil Brahmin', subCommunity: 'Prefer not to disclose', gotra: 'Kashyapa', mool: 'Sakri', ancestralVillage: 'Sakri, Madhubani', kul: 'Not known', pravara: 'Not applicable', kuldevi: 'Prefer not to disclose', panjiAvailability: 'not-known', maternalLineage: 'My maternal family has roots in Darbhanga.', culturalVisibility: 'Members only',
  ageRange: '27–33 years', heightRange: '5 ft 5 in – 6 ft 1 in', educationPreference: 'Postgraduate or equivalent', professionPreference: 'Thoughtful, stable work', locationPreference: 'Open to Delhi NCR, Bengaluru, Mumbai', communityPreference: 'Open to conversation', lifestylePreference: 'Balanced and community-minded', employmentPreference: 'Professional / self-employed', relocationPreference: 'Open to discussion', familyPreference: 'Warm and respectful family', gotraPreference: '', moolPreference: '',
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
  { id: 'primary', src: '/images/mitali-profile.png', alt: 'Mitali in warm natural light', primary: true },
  { id: 'gallery-1', src: '', alt: 'Gallery photo placeholder', primary: false },
  { id: 'gallery-2', src: '', alt: 'Gallery photo placeholder', primary: false },
]

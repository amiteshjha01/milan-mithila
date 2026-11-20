import { discoverProfiles, type DiscoverProfile } from '@/lib/mock-discover'

export type DetailValue = { label: string; value?: string; status?: 'shared' | 'not-disclosed' | 'not-applicable' | 'pending' }

export type GunaItem = {
  name: string
  aspect: string
  obtained: number
  maximum: number
  interpretation: string
}

export type GunaMilanData = {
  score: number
  maxScore: number
  verdict: string
  manglikStatus: string
  details: GunaItem[]
}

export type FamilyCompanionData = {
  elderSummary: string
  parentalApprovalStatus: string
  ancestralMoolOrigin: string
  villageSettlement: string
  preferredElderContactMode: string
  familyValuesReflection: string
}

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
  familyCompanion?: FamilyCompanionData
  gunaMilan?: GunaMilanData
}

const sampleGunaData: GunaMilanData = {
  score: 31,
  maxScore: 36,
  verdict: 'Uttam Milan (Highly Auspicious Match)',
  manglikStatus: 'Non-Manglik (Anukul)',
  details: [
    { name: 'Varna (वर्ण)', aspect: 'Work & Spiritual Temperament', obtained: 1, maximum: 1, interpretation: 'High mutual intellectual and philosophical compatibility.' },
    { name: 'Vashya (वश्य)', aspect: 'Mutual Dominance & Harmony', obtained: 2, maximum: 2, interpretation: 'Natural respect with balanced decision-making between equals.' },
    { name: 'Tara (तारा)', aspect: 'Health, Longevity & Destiny', obtained: 3, maximum: 3, interpretation: 'Sampat Tara indicating growth, stability, and enduring well-being.' },
    { name: 'Yoni (योनि)', aspect: 'Biological & Emotional Affinity', obtained: 3, maximum: 4, interpretation: 'Warm emotional resonance and mutual comfort in daily companionship.' },
    { name: 'Graha Maitri (ग्रह मैत्री)', aspect: 'Intellectual Friendship', obtained: 5, maximum: 5, interpretation: 'Friendly planetary lords (Mitra) fostering deep conversational ease.' },
    { name: 'Gana (गण)', aspect: 'Temperament & Behavior', obtained: 6, maximum: 6, interpretation: 'Deva-Deva Gana match: gentle, understanding, and peaceful home life.' },
    { name: 'Bhakoot (भकूट)', aspect: 'Family Growth & Prosperity', obtained: 7, maximum: 7, interpretation: 'Auspicious placement supporting shared financial growth and joy.' },
    { name: 'Nadi (नाड़ी)', aspect: 'Physiological Balance & Genetic Health', obtained: 4, maximum: 8, interpretation: 'Different Nadi branches ensuring positive vitality and lineage health.' },
  ],
}

const detailOverrides: Record<string, Partial<ProfileDetail>> = {
  'MM-240184': {
    dateOfBirth: '14 June 1997',
    languages: ['Maithili', 'Hindi', 'English'],
    gallery: [
      { src: '/images/discover-aarav.png', alt: 'Aarav smiling in warm natural light', visibility: 'members-only' },
      { alt: 'Additional photo restricted by profile owner', visibility: 'restricted' },
      { alt: 'Additional photo not shared yet', visibility: 'restricted' }
    ],
    employer: 'Northstar Design Studio',
    workLocation: 'Bengaluru',
    professionalIntroduction: 'I enjoy making complex things feel simple. Outside work, you will usually find me reading, walking through a new neighbourhood, or planning a slow weekend with family.',
    fatherOccupation: 'Retired bank manager',
    motherOccupation: 'School teacher',
    siblings: 'One younger sister',
    lineageInformation: 'My family has roots around Darbhanga and Sakri.',
    panjiAvailability: 'Available for traditional consultation',
    kuldevi: 'Maa Bhagwati (Darbhanga)',
    familyCompanion: {
      elderSummary: 'Parents are based in Darbhanga. Father is a retired public sector bank officer; mother taught literature for 28 years.',
      parentalApprovalStatus: 'Parents actively supportive and ready for respectful family conversation',
      ancestralMoolOrigin: 'Sakri, Darbhanga Basin',
      villageSettlement: 'Ancestral home in Sakri with family visits during festivals',
      preferredElderContactMode: 'Elder-to-elder telephone call following seeker mutual agreement',
      familyValuesReflection: 'A traditional, cultured household that treasures education, reading, and simple living.'
    },
    gunaMilan: sampleGunaData,
    partnerExpectations: [
      { label: 'Age range', value: '27–33 years' },
      { label: 'Height', value: '5 ft 5 in – 6 ft 1 in' },
      { label: 'Education', value: 'Thoughtful and curious' },
      { label: 'Profession', value: 'Stable, meaningful work' },
      { label: 'Location', value: 'Open to Bengaluru, Delhi, or Mumbai' },
      { label: 'Family values', value: 'Warm, respectful, and grounded' }
    ]
  },
  'MM-240176': {
    dateOfBirth: '22 September 1995',
    languages: ['Maithili', 'Hindi', 'English'],
    gallery: [
      { src: '/images/discover-riya.png', alt: 'Riya smiling in soft natural light', visibility: 'members-only' },
      { alt: 'Gallery photo restricted by profile owner', visibility: 'restricted' }
    ],
    employer: 'Cedar & Co.',
    workLocation: 'Mumbai',
    professionalIntroduction: 'I work in strategy and care about building a life that has both ambition and ease in it. I value honest conversation, family time, and a little spontaneity.',
    fatherOccupation: 'Small business owner',
    motherOccupation: 'Homemaker',
    siblings: 'One elder brother',
    lineageInformation: 'My maternal family has roots in Madhubani.',
    panjiAvailability: 'Family maintains genealogical notes',
    kuldevi: 'Maa Uchattha Bhagwati',
    familyCompanion: {
      elderSummary: 'Respected family in Madhubani with branches in Mumbai. Values culture and progressive education.',
      parentalApprovalStatus: 'Seeker leads discussion; family available for cordial introductory meeting',
      ancestralMoolOrigin: 'Jhanjharpur, Madhubani',
      villageSettlement: 'Jhanjharpur ancestral roots',
      preferredElderContactMode: 'Video call or family visit in Mumbai/Patna',
      familyValuesReflection: 'Believes in mutual respect, non-commercial matrimony, and strict anti-dowry values.'
    },
    gunaMilan: {
      ...sampleGunaData,
      score: 29,
      verdict: 'Shubh Milan (Auspicious Compatibility)',
      manglikStatus: 'Partial Manglik (Mitigated by Jupiter Aspect)',
    },
    partnerExpectations: [
      { label: 'Age range', value: '29–35 years' },
      { label: 'Height', value: '5 ft 7 in or above' },
      { label: 'Education', value: 'Open to conversation' },
      { label: 'Profession', value: 'Purposeful work' },
      { label: 'Location', value: 'Open to Mumbai, Bengaluru, or Delhi' },
      { label: 'Lifestyle', value: 'Balanced and community-minded' }
    ]
  },
  'MM-240211': {
    dateOfBirth: '03 March 1995',
    languages: ['Maithili', 'Hindi', 'English'],
    gallery: [
      { src: '/images/discover-dev.png', alt: 'Dev in warm natural light', visibility: 'members-only' },
      { alt: 'Additional photo not shared yet', visibility: 'restricted' }
    ],
    employer: 'Dev Verma Studio',
    workLocation: 'Pune',
    professionalIntroduction: 'I am an architect who likes the quiet details: good light, old buildings, and a long conversation over tea. I make time for family and for the things that keep me curious.',
    fatherOccupation: 'Civil engineer',
    motherOccupation: 'College lecturer',
    siblings: 'One younger brother',
    lineageInformation: 'Our family home is near Bisfi, Madhubani.',
    panjiAvailability: 'Not applicable',
    kuldevi: 'Not disclosed',
    familyCompanion: {
      elderSummary: 'A family of teachers, engineers, and builders with roots in historic Bisfi.',
      parentalApprovalStatus: 'Family is open, cordial, and values genuine connection over formal rituals',
      ancestralMoolOrigin: 'Bisfi, Madhubani',
      villageSettlement: 'Vidyapati Nagar / Bisfi belt',
      preferredElderContactMode: 'Direct conversation after seeker comfort',
      familyValuesReflection: 'Strong focus on integrity, artistic values, and equality.'
    },
    gunaMilan: {
      ...sampleGunaData,
      score: 33,
      verdict: 'Param Shubh Milan (Exemplary Compatibility)',
      manglikStatus: 'Non-Manglik (Anukul)',
    },
    partnerExpectations: [
      { label: 'Age range', value: '27–34 years' },
      { label: 'Height', value: '5 ft 3 in or above' },
      { label: 'Education', value: 'Curious and self-directed' },
      { label: 'Profession', value: 'Open to different paths' },
      { label: 'Location', value: 'Open to relocation' },
      { label: 'Family values', value: 'Independent and connected' }
    ]
  },
  'MM-240198': {
    dateOfBirth: '18 November 1997',
    languages: ['Hindi', 'English', 'Maithili'],
    gallery: [
      { src: '/images/discover-anjali.png', alt: 'Anjali in soft daylight', visibility: 'members-only' },
      { alt: 'Additional photo restricted by profile owner', visibility: 'restricted' }
    ],
    employer: 'Civic Futures Lab',
    workLocation: 'Bengaluru',
    professionalIntroduction: 'A listener by profession and a reader by habit. I am happiest when a day has a little work, a little music, and time with people I care about.',
    fatherOccupation: 'School principal',
    motherOccupation: 'Homemaker',
    siblings: 'No siblings',
    lineageInformation: 'My family has roots in Saharsa.',
    panjiAvailability: 'Not disclosed',
    kuldevi: 'Prefer not to disclose',
    familyCompanion: {
      elderSummary: 'Warm nuclear family with deep educational traditions in Saharsa.',
      parentalApprovalStatus: 'Parents encourage daughter’s independent choice while offering blessings',
      ancestralMoolOrigin: 'Ujan / Saharsa region',
      villageSettlement: 'Family visits Saharsa every Chhath Puja',
      preferredElderContactMode: 'Warm telephonic conversation',
      familyValuesReflection: 'Simplicity, truthfulness, and progressive outlook.'
    },
    gunaMilan: sampleGunaData,
    partnerExpectations: [
      { label: 'Age range', value: '28–34 years' },
      { label: 'Height', value: '5 ft 6 in or above' },
      { label: 'Education', value: 'Open to conversation' },
      { label: 'Profession', value: 'Work with a sense of purpose' },
      { label: 'Location', value: 'Open to Bengaluru or Delhi' },
      { label: 'Lifestyle', value: 'Balanced and community-minded' }
    ]
  },
  'MM-240225': {
    dateOfBirth: '12 January 1994',
    languages: ['Maithili', 'Hindi', 'English'],
    gallery: [
      { src: '/images/discover-aarav.png', alt: 'Madhav in thoughtful pose', visibility: 'members-only' }
    ],
    employer: 'National Institute of Policy Studies',
    workLocation: 'New Delhi',
    professionalIntroduction: 'I research economic history and regional development. Looking for someone grounded, fond of ideas, and with a warm relationship with their family.',
    fatherOccupation: 'College professor',
    motherOccupation: 'Writer',
    siblings: 'One elder sister',
    lineageInformation: 'Ancestral roots in Koilakh, Madhubani district.',
    panjiAvailability: 'Recorded in Koilakh genealogical registry',
    kuldevi: 'Maa Kali (Koilakh)',
    familyCompanion: {
      elderSummary: 'Scholarly lineage from Koilakh, renowned center of Maithil Sanskrit and literary traditions.',
      parentalApprovalStatus: 'Parents warmly welcome alliance inquiries',
      ancestralMoolOrigin: 'Koilakh, Madhubani',
      villageSettlement: 'Koilakh ancestral settlement',
      preferredElderContactMode: 'Formal introduction in Delhi or Darbhanga',
      familyValuesReflection: 'Academic rigor, cultural reverence, and warm hospitality.'
    },
    gunaMilan: {
      ...sampleGunaData,
      score: 30,
      verdict: 'Uttam Milan (Highly Auspicious)',
      manglikStatus: 'Non-Manglik',
    },
    partnerExpectations: [
      { label: 'Age range', value: '26–33 years' },
      { label: 'Height', value: '5 ft 2 in or above' },
      { label: 'Education', value: 'Curious and well-read' },
      { label: 'Profession', value: 'Open to diverse fields' },
      { label: 'Location', value: 'Open to New Delhi or Patna' }
    ]
  },
  'MM-240230': {
    dateOfBirth: '05 August 1996',
    languages: ['Maithili', 'Hindi', 'Bengali', 'English'],
    gallery: [
      { src: '/images/discover-dev.png', alt: 'Saurav in outdoor setting', visibility: 'members-only' }
    ],
    employer: 'Mithila Green Solutions',
    workLocation: 'Kolkata',
    professionalIntroduction: 'Entrepreneur focused on sustainable technology. Passionate about innovation, music, and retaining strong ties to our Maithil heritage.',
    fatherOccupation: 'Business owner',
    motherOccupation: 'Homemaker',
    siblings: 'Two younger brothers',
    lineageInformation: 'Family traces lineage to Ujan, Mithila.',
    panjiAvailability: 'Available upon family request',
    kuldevi: 'Not disclosed',
    familyCompanion: {
      elderSummary: 'Enterprising business family based in Kolkata with unbroken cultural ties to Mithila.',
      parentalApprovalStatus: 'Seeker and elders coordinate introductions jointly',
      ancestralMoolOrigin: 'Ujan, Mithila',
      villageSettlement: 'Ujan roots',
      preferredElderContactMode: 'Meeting in Kolkata or Darbhanga',
      familyValuesReflection: 'Hard work, community generosity, and family unity.'
    },
    gunaMilan: sampleGunaData,
    partnerExpectations: [
      { label: 'Age range', value: '25–31 years' },
      { label: 'Height', value: '5 ft 3 in or above' },
      { label: 'Education', value: 'Graduate or Postgraduate' },
      { label: 'Profession', value: 'Independent and driven' },
      { label: 'Location', value: 'Kolkata, Delhi, or Bengaluru' }
    ]
  },
}

export const profileDetails: ProfileDetail[] = discoverProfiles.map((profile) => ({ ...profile, dateOfBirth: 'Prefer not to disclose', languages: [profile.motherTongue, 'Hindi'], gallery: [{ src: profile.image, alt: `${profile.name} profile photograph`, visibility: 'members-only' }], professionalIntroduction: profile.introduction, siblings: 'Prefer not to disclose', panjiAvailability: 'Prefer not to disclose', partnerExpectations: [], ...detailOverrides[profile.id] }))

const slugMap: Record<string, string> = {
  aarav: 'MM-240184',
  riya: 'MM-240176',
  dev: 'MM-240211',
  anjali: 'MM-240198',
  madhav: 'MM-240225',
  saurav: 'MM-240230',
}

export function getProfileDetail(profileId: string) {
  const normalized = profileId.toLowerCase().trim()
  const targetId = slugMap[normalized] || normalized
  return profileDetails.find((profile) => profile.id.toLowerCase() === targetId || profile.name.toLowerCase().startsWith(normalized))
}

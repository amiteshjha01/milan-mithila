export type DiscoverTab = 'recommended' | 'recently-joined' | 'active' | 'shortlisted' | 'new-matches'
export type SortOption = 'relevance' | 'newest' | 'age'
export type FilterValues = Record<string, string[]>

export type DiscoverProfile = {
  id: string
  name: string
  gender: string
  age: number
  height: string
  education: string
  profession: string
  sector: string
  income: string
  city: string
  nativeDistrict: string
  country: string
  motherTongue: string
  maritalStatus: string
  familyType: string
  familyValues: string
  familyLocation: string
  familyBackground: string
  community?: string
  subCommunity?: string
  gotra?: string
  mool?: string
  ancestralVillage?: string
  kul?: string
  pravara?: string
  diet: string
  lifestyle: string
  relocation: string
  horoscope: string
  introduction: string
  profileCompletion: number
  availability: string
  verified: boolean
  verificationLabel: string
  joinedDaysAgo: number
  active: boolean
  recommended: boolean
  shortlisted: boolean
  interested: boolean
  image: string
  initials: string
}

export const discoverProfiles: DiscoverProfile[] = [
  { id: 'MM-240184', name: 'Aarav N.', gender: 'Man', age: 29, height: '5 ft 10 in', education: 'MS, Computer Science', profession: 'Product designer', sector: 'Private sector', income: 'Prefer not to disclose', city: 'Bengaluru', nativeDistrict: 'Darbhanga', country: 'India', motherTongue: 'Maithili', maritalStatus: 'Never married', familyType: 'Nuclear', familyValues: 'Progressive with strong roots', familyLocation: 'Darbhanga, Bihar', familyBackground: 'A close-knit family with roots in Darbhanga and a warm, curious outlook.', community: 'Maithil Brahmin', gotra: 'Kashyapa', mool: 'Sakri', ancestralVillage: 'Sakri', kul: 'Not known', pravara: 'Not applicable', diet: 'Open to conversation', lifestyle: 'Balanced', relocation: 'Open to discussion', horoscope: 'Not disclosed', introduction: 'Curious, grounded, and looking for a relationship built on kindness, humor, and shared direction.', profileCompletion: 91, availability: 'Active today', verified: true, verificationLabel: 'Identity verified', joinedDaysAgo: 18, active: true, recommended: true, shortlisted: false, interested: false, image: '/images/discover-aarav.png', initials: 'AN' },
  { id: 'MM-240176', name: 'Riya S.', gender: 'Woman', age: 30, height: '5 ft 5 in', education: 'MBA, Finance', profession: 'Strategy lead', sector: 'Private sector', income: 'Prefer not to disclose', city: 'Mumbai', nativeDistrict: 'Madhubani', country: 'India', motherTongue: 'Maithili', maritalStatus: 'Never married', familyType: 'Joint', familyValues: 'Warm and respectful', familyLocation: 'Madhubani, Bihar', familyBackground: 'Contemporary city life with a strong family connection near Madhubani.', community: 'Maithil Brahmin', subCommunity: 'Prefer not to disclose', gotra: 'Bharadwaja', mool: 'Jhanjharpur', ancestralVillage: 'Jhanjharpur', kul: 'Prefer not to disclose', pravara: 'Not known', diet: 'Vegetarian', lifestyle: 'Community-minded', relocation: 'Open to discussion', horoscope: 'Not disclosed', introduction: 'Warm, ambitious, and drawn to people who make space for both tradition and change.', profileCompletion: 86, availability: 'Active yesterday', verified: true, verificationLabel: 'Email verified', joinedDaysAgo: 33, active: true, recommended: true, shortlisted: true, interested: false, image: '/images/discover-riya.png', initials: 'RS' },
  { id: 'MM-240211', name: 'Dev V.', gender: 'Man', age: 31, height: '6 ft 0 in', education: 'B.Arch, Architecture', profession: 'Architect', sector: 'Self-employed', income: 'Prefer not to disclose', city: 'Pune', nativeDistrict: 'Madhubani', country: 'India', motherTongue: 'Maithili', maritalStatus: 'Never married', familyType: 'Nuclear', familyValues: 'Progressive with strong roots', familyLocation: 'Madhubani, Bihar', familyBackground: 'A family of teachers and builders who value education and independence.', community: 'Maithil community', gotra: 'Vashishtha', mool: 'Bisfi', ancestralVillage: 'Bisfi', kul: 'Not applicable', pravara: 'Not disclosed', diet: 'Open to conversation', lifestyle: 'Active', relocation: 'Open to discussion', horoscope: 'Prefer not to disclose', introduction: 'I care about making beautiful, useful spaces and keeping life generous outside the studio.', profileCompletion: 84, availability: 'Active 2h ago', verified: false, verificationLabel: 'Profile details shared', joinedDaysAgo: 4, active: true, recommended: true, shortlisted: false, interested: false, image: '/images/discover-dev.png', initials: 'DV' },
  { id: 'MM-240198', name: 'Anjali P.', gender: 'Woman', age: 28, height: '5 ft 4 in', education: 'MA, Sociology', profession: 'UX researcher', sector: 'Non-profit', income: 'Prefer not to disclose', city: 'Bengaluru', nativeDistrict: 'Saharsa', country: 'India', motherTongue: 'Hindi', maritalStatus: 'Never married', familyType: 'Nuclear', familyValues: 'Service and learning', familyLocation: 'Saharsa, Bihar', familyBackground: 'A small, warm family that enjoys long conversations and shared meals.', community: 'Prefer not to disclose', gotra: 'Not disclosed', mool: 'Not disclosed', ancestralVillage: 'Not disclosed', kul: 'Not applicable', pravara: 'Not applicable', diet: 'Vegetarian', lifestyle: 'Balanced', relocation: 'Open to Bengaluru or Delhi', horoscope: 'Not disclosed', introduction: 'A listener by profession, a reader by habit, and someone who believes good things take attention.', profileCompletion: 79, availability: 'Active this week', verified: true, verificationLabel: 'Email verified', joinedDaysAgo: 2, active: true, recommended: false, shortlisted: false, interested: false, image: '/images/discover-anjali.png', initials: 'AP' },
]

export const filterGroups = [
  { key: 'age', label: 'Age', options: ['24–27 years', '28–31 years', '32–36 years'] },
  { key: 'height', label: 'Height', options: ['5 ft 0 in – 5 ft 4 in', '5 ft 5 in – 5 ft 9 in', '5 ft 10 in – 6 ft 2 in'] },
  { key: 'maritalStatus', label: 'Marital status', options: ['Never married', 'Divorced', 'Widowed', 'Prefer not to disclose'] },
  { key: 'education', label: 'Education', options: ['Undergraduate', 'Postgraduate', 'Doctorate', 'Prefer not to disclose'] },
  { key: 'profession', label: 'Profession', options: ['Technology & design', 'Finance & strategy', 'Architecture', 'Research & education', 'Healthcare'] },
  { key: 'sector', label: 'Employment sector', options: ['Private sector', 'Public sector', 'Non-profit', 'Self-employed', 'Student'] },
  { key: 'income', label: 'Annual income', options: ['Prefer not to disclose', '₹5–10 lakh', '₹10–20 lakh', '₹20 lakh+'] },
  { key: 'city', label: 'Current location', options: ['Bengaluru', 'Mumbai', 'Pune', 'New Delhi', 'Kolkata'] },
  { key: 'nativeDistrict', label: 'Native district', options: ['Madhubani', 'Darbhanga', 'Saharsa', 'Muzaffarpur', 'Patna'] },
  { key: 'country', label: 'Country', options: ['India', 'United States', 'United Kingdom', 'Canada'] },
  { key: 'motherTongue', label: 'Mother tongue', options: ['Maithili', 'Hindi', 'English', 'Other'] },
  { key: 'familyType', label: 'Family type', options: ['Nuclear', 'Joint', 'Extended', 'Prefer not to disclose'] },
  { key: 'familyValues', label: 'Family values', options: ['Progressive with strong roots', 'Warm and respectful', 'Service and learning', 'Prefer not to disclose'] },
  { key: 'familyLocation', label: 'Family location', options: ['Bihar', 'Delhi NCR', 'Maharashtra', 'Karnataka', 'West Bengal'] },
  { key: 'community', label: 'Community', options: ['Maithil Brahmin', 'Maithil Kayastha', 'Maithil community', 'Prefer not to disclose'] },
  { key: 'subCommunity', label: 'Sub-community', options: ['User-entered value', 'Prefer not to disclose'] },
  { key: 'gotra', label: 'Gotra', options: ['User-entered value', 'Not known', 'Not applicable', 'Prefer not to disclose'] },
  { key: 'mool', label: 'Mool', options: ['User-entered value', 'Not known', 'Not applicable', 'Prefer not to disclose'] },
  { key: 'ancestralVillage', label: 'Ancestral village', options: ['User-entered value', 'Prefer not to disclose'] },
  { key: 'kul', label: 'Kul', options: ['User-entered value', 'Not known', 'Not applicable', 'Prefer not to disclose'] },
  { key: 'pravara', label: 'Pravara', options: ['User-entered value', 'Not known', 'Not applicable', 'Prefer not to disclose'] },
  { key: 'diet', label: 'Diet preference', options: ['Vegetarian', 'Non-vegetarian', 'Open to conversation', 'Prefer not to disclose'] },
  { key: 'lifestyle', label: 'Lifestyle', options: ['Balanced', 'Active', 'Community-minded', 'Prefer not to disclose'] },
  { key: 'relocation', label: 'Relocation preference', options: ['Open to discussion', 'Open to Bengaluru or Delhi', 'Prefer to stay near family', 'Prefer not to disclose'] },
  { key: 'horoscope', label: 'Horoscope preferences', options: ['Shared privately', 'Not disclosed', 'Prefer not to disclose'] },
]

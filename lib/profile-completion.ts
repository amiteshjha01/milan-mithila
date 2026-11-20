export type CompletionSectionKey = 'personal' | 'career' | 'family' | 'cultural' | 'photos' | 'preferences'

export interface CompletionSectionItem {
  section: CompletionSectionKey
  label: string
  detail: string
  complete: boolean
}

export interface ProfileCompletionResult {
  percentage: number
  completedCount: number
  totalCount: number
  items: CompletionSectionItem[]
}

const isNonEmpty = (value: unknown): boolean => {
  if (typeof value !== 'string') return Boolean(value)
  const trimmed = value.trim()
  if (!trimmed) return false
  const lower = trimmed.toLowerCase()
  return (
    lower !== 'prefer not to disclose' &&
    lower !== 'not specified' &&
    lower !== 'none specified' &&
    lower !== 'not known' &&
    lower !== 'not disclosed'
  )
}

const isRealPhoto = (photo: any): boolean => {
  const url = typeof photo === 'string' ? photo : photo?.src || photo?.url
  if (!url || typeof url !== 'string') return false
  return !url.includes('placeholder')
}

/**
 * Single source of truth for profile completion across the backend API,
 * Dashboard Overview, Discover cards, and Profile Management.
 * Accepts either a MongoDB Profile document or a frontend ProfileForm (+ optional photos array).
 */
export function calculateProfileCompletion(
  source: Record<string, any> | null | undefined,
  explicitPhotos?: any[]
): ProfileCompletionResult {
  if (!source) {
    return {
      percentage: 0,
      completedCount: 0,
      totalCount: 6,
      items: [],
    }
  }

  const fullName = source.fullName ?? source.displayName
  const gender = source.gender
  const location = source.currentLocation ?? source.currentCity
  const nativeDistrict = source.nativeDistrict

  const highestQualification = source.highestQualification ?? source.education
  const occupation = source.occupation ?? source.profession

  const familyType = source.familyType
  const familyDetails =
    source.familyValues ||
    source.familyDescription ||
    source.familySummary ||
    source.fatherOccupation ||
    source.motherOccupation ||
    source.familyVillage

  const community = source.community
  const gotra = source.gotra
  const mool = source.mool

  const photos = Array.isArray(explicitPhotos)
    ? explicitPhotos
    : Array.isArray(source.photos)
      ? source.photos
      : []
  const realPhotos = photos.filter(isRealPhoto)

  const prefs = source.partnerPreferences || {}
  const ageRange = source.ageRange ?? prefs.ageRange
  const prefDetail =
    source.educationPreference ??
    prefs.education ??
    source.professionPreference ??
    prefs.profession ??
    source.locationPreference ??
    prefs.location

  const isPersonalComplete = Boolean(isNonEmpty(fullName) && isNonEmpty(gender) && isNonEmpty(location) && isNonEmpty(nativeDistrict))
  const isCareerComplete = Boolean(isNonEmpty(highestQualification) && isNonEmpty(occupation))
  const isFamilyComplete = Boolean(isNonEmpty(familyType) && isNonEmpty(familyDetails))
  const isCulturalComplete = Boolean(isNonEmpty(community) && isNonEmpty(gotra) && isNonEmpty(mool))
  const isPhotosComplete = realPhotos.length > 0
  const isPreferencesComplete = Boolean(isNonEmpty(ageRange) && isNonEmpty(prefDetail))

  const items: CompletionSectionItem[] = [
    {
      section: 'personal',
      label: 'Personal information',
      detail: isPersonalComplete ? 'Everything looks good' : 'Add basic personal details',
      complete: isPersonalComplete,
    },
    {
      section: 'career',
      label: 'Education & career',
      detail: isCareerComplete ? 'Education & career details recorded' : 'Add your education & professional details',
      complete: isCareerComplete,
    },
    {
      section: 'family',
      label: 'Family background',
      detail: isFamilyComplete ? 'Family background recorded' : 'Add your family description',
      complete: isFamilyComplete,
    },
    {
      section: 'cultural',
      label: 'Cultural information',
      detail: isCulturalComplete ? 'Gotra & Mool recorded' : 'Add your ancestral Gotra & Mool',
      complete: isCulturalComplete,
    },
    {
      section: 'photos',
      label: 'Photos',
      detail: isPhotosComplete
        ? `${realPhotos.length} photograph${realPhotos.length > 1 ? 's' : ''} uploaded`
        : 'Add at least one photograph',
      complete: isPhotosComplete,
    },
    {
      section: 'preferences',
      label: 'Partner preferences',
      detail: isPreferencesComplete ? 'Partner preferences set' : 'Define your partner preferences',
      complete: isPreferencesComplete,
    },
  ]

  const completedCount = items.filter((item) => item.complete).length
  const totalCount = items.length
  const percentage = Math.round((completedCount / totalCount) * 100)

  return {
    percentage,
    completedCount,
    totalCount,
    items,
  }
}

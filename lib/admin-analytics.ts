import {
  MongoUser,
  MongoProfile,
  MongoShortlist,
  MongoInterest,
  MongoConversation,
  MongoSession,
  VipConsultation,
  MongoGrievance,
} from '@/lib/mongodb-models'
import { calculateProfileCompletion } from '@/lib/profile-completion'

export type AnalyticsRange = '7d' | '30d' | '90d' | 'all'

export interface DistributionItem {
  label: string
  count: number
  percentage: number
}

export interface TimelinePoint {
  date: string // YYYY-MM-DD
  label: string // e.g. "Nov 14"
  signups: number
  interests: number
  shortlists: number
  vipLeads: number
  cumulativeMembers: number
}

export interface AdminInsight {
  level: 'info' | 'warning' | 'success' | 'action'
  title: string
  detail: string
  metric?: string
}

export interface PeriodDelta {
  current: number
  previous: number
  deltaPct: number | null // null when previous === 0 and current === 0
}

export interface ActivityFeedItem {
  id: string
  type: 'SIGNUP' | 'INTEREST' | 'SHORTLIST' | 'VIP_LEAD'
  title: string
  subtitle: string
  timestamp: string
  badge: string
}

export interface ActionQueueMember {
  id: string
  profileCode: string
  name: string
  city: string
  nativeDistrict: string
  completion: number
  createdAt: string
}

export interface PopularProfileItem {
  profileCode: string
  name: string
  city: string
  gotra: string
  verified: boolean
  interestsReceived: number
  shortlistsReceived: number
  demandScore: number
}

export interface AdminAnalyticsPayload {
  generatedAt: string
  range: AnalyticsRange
  healthScore: {
    overall: number
    grade: string
    status: 'Excellent' | 'Strong' | 'Developing' | 'Needs Attention'
    pillars: {
      trust: number
      quality: number
      balance: number
      velocity: number
    }
  }
  periodComparison: {
    windowDays: number
    signups: PeriodDelta
    interests: PeriodDelta
    shortlists: PeriodDelta
    vipLeads: PeriodDelta
  }
  liquidity: {
    genderRatioLabel: string
    interestsPerMember: number
    shortlistsPerMember: number
    matchToChatRate: number
    verifiedShare: number
  }
  overview: {
    totalMembers: number
    verifiedProfiles: number
    unverifiedProfiles: number
    verificationRate: number
    avgProfileCompletion: number
    highCompletionProfiles: number // >= 80%
    highCompletionRate: number
    activeUsers24h: number
    activeUsers7d: number
    activeUsers30d: number
    activeSessions: number
    totalConversations: number
    totalMessages: number
    avgMessagesPerConversation: number
    chaiInvitesSent: number
    openGrievances: number
    totalGrievances: number
  }
  funnel: {
    totalMembers: number
    verifiedMembers: number
    profilesWithPhotos: number
    shortlistsRecorded: number
    interestsSent: number
    interestsPending: number
    interestsAccepted: number
    interestsDeclined: number
    interestsWithdrawn: number
    interestAcceptanceRate: number
    activeConversations: number
  }
  vipPipeline: {
    total: number
    newLeads: number
    contacted: number
    converted: number
    conversionRate: number
    byTier: DistributionItem[]
  }
  demographics: {
    gender: DistributionItem[]
    ageBuckets: DistributionItem[]
    avgAge: number
    medianAge: number
    maritalStatus: DistributionItem[]
    familyType: DistributionItem[]
    accountRoles: DistributionItem[]
    accountStatus: DistributionItem[]
    authProviders: DistributionItem[]
  }
  geography: {
    topNativeDistricts: DistributionItem[]
    topCurrentCities: DistributionItem[]
    topCountries: DistributionItem[]
  }
  cultural: {
    communities: DistributionItem[]
    topGotras: DistributionItem[]
    topMools: DistributionItem[]
    panjiAvailability: DistributionItem[]
  }
  career: {
    workingSectors: DistributionItem[]
    topProfessions: DistributionItem[]
    topQualifications: DistributionItem[]
  }
  completionBreakdown: {
    section: string
    label: string
    completed: number
    total: number
    percentage: number
  }[]
  privacyTrust: {
    profileVisibility: DistributionItem[]
    photoVisibility: DistributionItem[]
    culturalVisibility: DistributionItem[]
    emailVerifiedCount: number
    phoneVerifiedCount: number
    identityVerifiedCount: number
    consentLogsRecorded: number
  }
  timeline: TimelinePoint[]
  recentActivity: ActivityFeedItem[]
  pendingVerifications: ActionQueueMember[]
  topDemandedProfiles: PopularProfileItem[]
  insights: AdminInsight[]
}

const pct = (part: number, total: number): number => {
  if (!total || total <= 0) return 0
  return Math.round((part / total) * 1000) / 10
}

function buildDistribution(
  values: Array<string | null | undefined>,
  fallbackLabel = 'Not specified',
  limit = 10
): DistributionItem[] {
  const counts = new Map<string, number>()
  const total = values.length
  for (const raw of values) {
    const cleaned = typeof raw === 'string' ? raw.trim() : ''
    const key = cleaned || fallbackLabel
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({
      label,
      count,
      percentage: pct(count, total),
    }))
}

function toIsoDate(d: Date): string {
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatShortDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1))
  return dt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

function computePeriodDelta(records: any[], nowMs: number, windowDays: number): PeriodDelta {
  const msDay = 24 * 60 * 60 * 1000
  const currentStart = nowMs - windowDays * msDay
  const prevStart = nowMs - 2 * windowDays * msDay
  let current = 0
  let previous = 0
  for (const r of records) {
    if (!r?.createdAt) continue
    const t = new Date(r.createdAt).getTime()
    if (!Number.isFinite(t)) continue
    if (t >= currentStart && t <= nowMs) current += 1
    else if (t >= prevStart && t < currentStart) previous += 1
  }
  let deltaPct: number | null = null
  if (previous === 0 && current === 0) deltaPct = null
  else if (previous === 0) deltaPct = 100
  else deltaPct = Math.round(((current - previous) / previous) * 100)
  return { current, previous, deltaPct }
}

function gradeFromScore(score: number): { grade: string; status: 'Excellent' | 'Strong' | 'Developing' | 'Needs Attention' } {
  if (score >= 90) return { grade: 'A+', status: 'Excellent' }
  if (score >= 80) return { grade: 'A', status: 'Strong' }
  if (score >= 70) return { grade: 'B+', status: 'Strong' }
  if (score >= 60) return { grade: 'B', status: 'Developing' }
  if (score >= 45) return { grade: 'C', status: 'Developing' }
  return { grade: 'D', status: 'Needs Attention' }
}

export function normalizeRange(raw?: string | null): AnalyticsRange {
  if (raw === '7d' || raw === '30d' || raw === '90d' || raw === 'all') return raw
  return '30d'
}

export async function computeAdminAnalytics(range: AnalyticsRange = '30d'): Promise<AdminAnalyticsPayload> {
  const now = new Date()
  const nowMs = now.getTime()
  const memberUserFilter = { role: { $nin: ['ADMIN', 'MODERATOR'] } }
  const memberProfileFilter = {
    profileCode: { $not: /^MM-ADMIN/i },
    profession: { $ne: 'Platform Administrator' },
  }

  const [
    users,
    profiles,
    interests,
    shortlists,
    conversations,
    vipConsultations,
    activeSessionsCount,
    grievances,
  ]: any[] = await Promise.all([
    MongoUser.find(memberUserFilter).lean(),
    MongoProfile.find(memberProfileFilter).lean(),
    MongoInterest.find().lean(),
    MongoShortlist.find().lean(),
    MongoConversation.find().lean(),
    VipConsultation.find().lean(),
    MongoSession.countDocuments({
      revokedAt: { $exists: false },
      expiresAt: { $gt: now },
    }),
    MongoGrievance.find().lean(),
  ])

  const userMap = new Map<string, any>(users.map((u: any) => [String(u._id), u]))
  const memberProfiles = profiles.filter((p: any) => {
    const u = userMap.get(String(p.userId))
    return !u || (u.role !== 'ADMIN' && u.role !== 'MODERATOR')
  })

  const profileByCode = new Map<string, any>(memberProfiles.map((p: any) => [String(p.profileCode), p]))
  const profileById = new Map<string, any>(memberProfiles.map((p: any) => [String(p._id), p]))
  const profileByUserId = new Map<string, any>(memberProfiles.map((p: any) => [String(p.userId), p]))

  const resolveProfileName = (ref: string | undefined): string => {
    if (!ref) return 'Member'
    const p = profileByCode.get(ref) || profileById.get(ref) || profileByUserId.get(ref)
    return p?.displayName || ref
  }

  const totalMembers = memberProfiles.length
  const verifiedProfiles = memberProfiles.filter((p: any) => Boolean(p.verified)).length
  const unverifiedProfiles = Math.max(0, totalMembers - verifiedProfiles)

  // Profile completion calculation
  const sectionCounts: Record<string, { label: string; completed: number }> = {
    personal: { label: 'Personal Information', completed: 0 },
    career: { label: 'Education & Career', completed: 0 },
    family: { label: 'Family Background', completed: 0 },
    cultural: { label: 'Cultural Lineage (Gotra & Mool)', completed: 0 },
    photos: { label: 'Profile Photographs', completed: 0 },
    preferences: { label: 'Partner Preferences', completed: 0 },
  }

  let completionSum = 0
  let highCompletionProfiles = 0
  let profilesWithPhotos = 0
  const pendingVerifications: ActionQueueMember[] = []

  for (const p of memberProfiles) {
    const comp = calculateProfileCompletion(p)
    completionSum += comp.percentage
    if (comp.percentage >= 80) highCompletionProfiles += 1
    for (const item of comp.items) {
      if (item.complete && sectionCounts[item.section]) {
        sectionCounts[item.section].completed += 1
      }
      if (item.section === 'photos' && item.complete) {
        profilesWithPhotos += 1
      }
    }
    if (!p.verified) {
      pendingVerifications.push({
        id: String(p._id),
        profileCode: p.profileCode,
        name: p.displayName,
        city: p.currentCity || 'Not set',
        nativeDistrict: p.nativeDistrict || 'Not set',
        completion: comp.percentage,
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : now.toISOString(),
      })
    }
  }

  pendingVerifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const avgProfileCompletion = totalMembers > 0 ? Math.round(completionSum / totalMembers) : 0
  const completionBreakdown = Object.entries(sectionCounts).map(([section, info]) => ({
    section,
    label: info.label,
    completed: info.completed,
    total: totalMembers,
    percentage: pct(info.completed, totalMembers),
  }))

  // Active users windows
  const msDay = 24 * 60 * 60 * 1000
  const cutoff24h = nowMs - msDay
  const cutoff7d = nowMs - 7 * msDay
  const cutoff30d = nowMs - 30 * msDay

  let activeUsers24h = 0
  let activeUsers7d = 0
  let activeUsers30d = 0
  let consentLogsRecorded = 0

  for (const u of users) {
    const lastActive = u.lastActiveAt ? new Date(u.lastActiveAt).getTime() : u.updatedAt ? new Date(u.updatedAt).getTime() : 0
    if (lastActive >= cutoff24h) activeUsers24h += 1
    if (lastActive >= cutoff7d) activeUsers7d += 1
    if (lastActive >= cutoff30d) activeUsers30d += 1
    if (Array.isArray(u.consentLogs)) consentLogsRecorded += u.consentLogs.length
  }

  // Interests & Conversations
  const interestsPending = interests.filter((i: any) => i.status === 'PENDING').length
  const interestsAccepted = interests.filter((i: any) => i.status === 'ACCEPTED').length
  const interestsDeclined = interests.filter((i: any) => i.status === 'DECLINED').length
  const interestsWithdrawn = interests.filter((i: any) => i.status === 'WITHDRAWN').length
  const decidedInterests = interestsAccepted + interestsDeclined
  const interestAcceptanceRate = decidedInterests > 0 ? pct(interestsAccepted, decidedInterests) : pct(interestsAccepted, interests.length)

  let totalMessages = 0
  let chaiInvitesSent = 0
  let activeConversations = 0
  for (const c of conversations) {
    if (c.status !== 'BLOCKED' && c.status !== 'ARCHIVED') activeConversations += 1
    const msgs = Array.isArray(c.messages) ? c.messages : []
    totalMessages += msgs.length
    chaiInvitesSent += msgs.filter((m: any) => Boolean(m?.isChaiInvite)).length
  }
  const avgMessagesPerConversation =
    conversations.length > 0 ? Math.round((totalMessages / conversations.length) * 10) / 10 : 0

  // Top Demanded Profiles (by interests received + shortlists received)
  const demandMap = new Map<string, { interests: number; shortlists: number }>()
  for (const i of interests) {
    const key = String(i.receiverId || '')
    if (!key) continue
    const cur = demandMap.get(key) || { interests: 0, shortlists: 0 }
    cur.interests += 1
    demandMap.set(key, cur)
  }
  for (const s of shortlists) {
    const key = String(s.profileId || '')
    if (!key) continue
    const cur = demandMap.get(key) || { interests: 0, shortlists: 0 }
    cur.shortlists += 1
    demandMap.set(key, cur)
  }
  const topDemandedProfiles: PopularProfileItem[] = (memberProfiles.map((p: any): PopularProfileItem => {
      const byCode = demandMap.get(String(p.profileCode)) || { interests: 0, shortlists: 0 }
      const byId = demandMap.get(String(p._id)) || { interests: 0, shortlists: 0 }
      const byUid = demandMap.get(String(p.userId)) || { interests: 0, shortlists: 0 }
      const interestsReceived = byCode.interests + byId.interests + byUid.interests
      const shortlistsReceived = byCode.shortlists + byId.shortlists + byUid.shortlists
      return {
        profileCode: p.profileCode,
        name: p.displayName,
        city: p.currentCity || 'Not set',
        gotra: p.gotra || 'Not set',
        verified: Boolean(p.verified),
        interestsReceived,
        shortlistsReceived,
        demandScore: interestsReceived * 3 + shortlistsReceived * 2,
      }
    }) as PopularProfileItem[])
    .sort((a, b) => b.demandScore - a.demandScore || a.name.localeCompare(b.name))
    .slice(0, 6)

  // VIP Concierge pipeline
  const vipNew = vipConsultations.filter((v: any) => (v.status || 'NEW') === 'NEW').length
  const vipContacted = vipConsultations.filter((v: any) => v.status === 'CONTACTED').length
  const vipConverted = vipConsultations.filter((v: any) => v.status === 'CONVERTED').length
  const vipByTier = buildDistribution(
    vipConsultations.map((v: any) => (v.tier ? String(v.tier).toUpperCase() : 'PRIVE')),
    'PRIVE',
    6
  )

  // Grievances
  const openGrievances = grievances.filter((g: any) => g.status === 'OPEN' || g.status === 'UNDER_INVESTIGATION').length

  // Demographics: Age
  const ages = memberProfiles
    .map((p: any) => Number(p.age))
    .filter((a: number) => Number.isFinite(a) && a >= 18 && a <= 90)
    .sort((a: number, b: number) => a - b)

  const avgAge = ages.length > 0 ? Math.round((ages.reduce((s: number, v: number) => s + v, 0) / ages.length) * 10) / 10 : 0
  const medianAge =
    ages.length > 0
      ? ages.length % 2 === 1
        ? ages[Math.floor(ages.length / 2)]
        : Math.round(((ages[ages.length / 2 - 1] + ages[ages.length / 2]) / 2) * 10) / 10
      : 0

  const ageBucketLabels = ['18–23', '24–27', '28–31', '32–35', '36+']
  const ageBucketMap = new Map<string, number>(ageBucketLabels.map((l) => [l, 0]))
  for (const age of ages) {
    if (age <= 23) ageBucketMap.set('18–23', (ageBucketMap.get('18–23') || 0) + 1)
    else if (age <= 27) ageBucketMap.set('24–27', (ageBucketMap.get('24–27') || 0) + 1)
    else if (age <= 31) ageBucketMap.set('28–31', (ageBucketMap.get('28–31') || 0) + 1)
    else if (age <= 35) ageBucketMap.set('32–35', (ageBucketMap.get('32–35') || 0) + 1)
    else ageBucketMap.set('36+', (ageBucketMap.get('36+') || 0) + 1)
  }
  const ageBuckets: DistributionItem[] = ageBucketLabels.map((label) => ({
    label,
    count: ageBucketMap.get(label) || 0,
    percentage: pct(ageBucketMap.get(label) || 0, ages.length),
  }))

  // Privacy & Verification flags
  const emailVerifiedCount = memberProfiles.filter((p: any) => Boolean(p.emailVerified)).length
  const phoneVerifiedCount = memberProfiles.filter((p: any) => Boolean(p.phoneVerified)).length
  const identityVerifiedCount = memberProfiles.filter((p: any) => Boolean(p.identityVerified || p.verified)).length

  // Timeline series + cumulative member curve
  let daysCount = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 30
  if (range === 'all') {
    const allDates = [
      ...memberProfiles.map((p: any) => p.createdAt),
      ...interests.map((i: any) => i.createdAt),
      ...shortlists.map((s: any) => s.createdAt),
      ...vipConsultations.map((v: any) => v.createdAt),
    ]
      .filter(Boolean)
      .map((d) => new Date(d).getTime())
      .filter((t) => Number.isFinite(t))

    if (allDates.length > 0) {
      const earliest = Math.min(...allDates)
      const diffDays = Math.ceil((nowMs - earliest) / msDay) + 1
      daysCount = Math.min(Math.max(diffDays, 7), 180)
    }
  }

  const bucketKeys: string[] = []
  const timelineMap = new Map<string, TimelinePoint>()
  const windowStartDate = new Date(nowMs - (daysCount - 1) * msDay)
  const windowStartIso = toIsoDate(windowStartDate)

  for (let i = daysCount - 1; i >= 0; i -= 1) {
    const dt = new Date(nowMs - i * msDay)
    const key = toIsoDate(dt)
    bucketKeys.push(key)
    timelineMap.set(key, {
      date: key,
      label: formatShortDate(key),
      signups: 0,
      interests: 0,
      shortlists: 0,
      vipLeads: 0,
      cumulativeMembers: 0,
    })
  }

  let membersBeforeWindow = 0
  for (const p of memberProfiles) {
    if (!p?.createdAt) continue
    const dt = new Date(p.createdAt)
    if (!Number.isFinite(dt.getTime())) continue
    const key = toIsoDate(dt)
    if (key < windowStartIso) membersBeforeWindow += 1
    else {
      const entry = timelineMap.get(key)
      if (entry) entry.signups += 1
    }
  }

  const bumpTimeline = (records: any[], field: 'interests' | 'shortlists' | 'vipLeads') => {
    for (const r of records) {
      if (!r?.createdAt) continue
      const dt = new Date(r.createdAt)
      if (!Number.isFinite(dt.getTime())) continue
      const key = toIsoDate(dt)
      const entry = timelineMap.get(key)
      if (entry) entry[field] += 1
    }
  }

  bumpTimeline(interests, 'interests')
  bumpTimeline(shortlists, 'shortlists')
  bumpTimeline(vipConsultations, 'vipLeads')

  let runningTotal = membersBeforeWindow
  const timeline = bucketKeys.map((k) => {
    const pt = timelineMap.get(k)!
    runningTotal += pt.signups
    return { ...pt, cumulativeMembers: runningTotal }
  })

  // Period-over-period comparisons
  const comparisonWindow = range === '7d' ? 7 : range === '90d' ? 90 : 30
  const periodComparison = {
    windowDays: comparisonWindow,
    signups: computePeriodDelta(memberProfiles, nowMs, comparisonWindow),
    interests: computePeriodDelta(interests, nowMs, comparisonWindow),
    shortlists: computePeriodDelta(shortlists, nowMs, comparisonWindow),
    vipLeads: computePeriodDelta(vipConsultations, nowMs, comparisonWindow),
  }

  // Gender & Liquidity Metrics
  const genderDist = buildDistribution(memberProfiles.map((p: any) => p.gender), 'Undisclosed', 6)
  const womenCount = genderDist.find((g) => g.label === 'Woman')?.count || 0
  const menCount = genderDist.find((g) => g.label === 'Man')?.count || 0
  let genderRatioLabel = 'N/A'
  if (womenCount > 0 && menCount > 0) {
    genderRatioLabel =
      womenCount >= menCount
        ? `${Math.round((womenCount / menCount) * 10) / 10} : 1 (W:M)`
        : `1 : ${Math.round((menCount / womenCount) * 10) / 10} (W:M)`
  } else if (womenCount > 0) {
    genderRatioLabel = `${womenCount} : 0 (W:M)`
  } else if (menCount > 0) {
    genderRatioLabel = `0 : ${menCount} (W:M)`
  }

  const verificationRate = pct(verifiedProfiles, totalMembers)
  const liquidity = {
    genderRatioLabel,
    interestsPerMember: totalMembers > 0 ? Math.round((interests.length / totalMembers) * 100) / 100 : 0,
    shortlistsPerMember: totalMembers > 0 ? Math.round((shortlists.length / totalMembers) * 100) / 100 : 0,
    matchToChatRate: interestsAccepted > 0 ? pct(Math.min(activeConversations, interestsAccepted), interestsAccepted) : 0,
    verifiedShare: verificationRate,
  }

  // Platform Health Score (0-100)
  const trustPillar = Math.round(
    totalMembers > 0 ? verificationRate * 0.75 + pct(emailVerifiedCount, totalMembers) * 0.25 : 0
  )
  const qualityPillar = Math.round(
    totalMembers > 0 ? avgProfileCompletion * 0.7 + pct(profilesWithPhotos, totalMembers) * 0.3 : 0
  )
  const balancePillar = Math.round(
    womenCount + menCount > 0
      ? Math.max(0, Math.min(100, 100 - Math.abs(pct(womenCount, womenCount + menCount) - pct(menCount, womenCount + menCount))))
      : 0
  )
  const velocityPillar = Math.round(
    Math.min(
      100,
      (interests.length > 0 ? Math.min(50, Math.round((interests.length / Math.max(totalMembers, 1)) * 50)) : 0) +
        Math.round(interestAcceptanceRate * 0.35) +
        (activeConversations > 0 ? 15 : 0)
    )
  )
  const overallHealth =
    totalMembers > 0
      ? Math.round(trustPillar * 0.35 + qualityPillar * 0.3 + balancePillar * 0.2 + velocityPillar * 0.15)
      : 0
  const { grade, status: healthStatus } = gradeFromScore(overallHealth)

  // Recent Live Activity Feed
  const rawFeed: ActivityFeedItem[] = [
    ...memberProfiles.slice(0, 12).map((p: any) => ({
      id: `signup-${p._id}`,
      type: 'SIGNUP' as const,
      title: `${p.displayName} joined Mithila Milan`,
      subtitle: `${p.profileCode} · ${p.currentCity || 'India'} · Roots: ${p.nativeDistrict || 'Mithila'}`,
      timestamp: p.createdAt ? new Date(p.createdAt).toISOString() : now.toISOString(),
      badge: p.verified ? 'Verified' : 'New Member',
    })),
    ...interests.slice(0, 12).map((i: any) => ({
      id: `interest-${i._id}`,
      type: 'INTEREST' as const,
      title: `${resolveProfileName(i.senderId)} sent interest to ${resolveProfileName(i.receiverId)}`,
      subtitle: `Status: ${i.status || 'PENDING'}${i.personalNote ? ' · Includes personal note' : ''}`,
      timestamp: i.createdAt ? new Date(i.createdAt).toISOString() : now.toISOString(),
      badge: i.status || 'PENDING',
    })),
    ...shortlists.slice(0, 8).map((s: any) => ({
      id: `shortlist-${s._id}`,
      type: 'SHORTLIST' as const,
      title: `Profile ${resolveProfileName(s.profileId)} shortlisted`,
      subtitle: `Saved by ${resolveProfileName(s.userId)}`,
      timestamp: s.createdAt ? new Date(s.createdAt).toISOString() : now.toISOString(),
      badge: 'Shortlisted',
    })),
    ...vipConsultations.slice(0, 8).map((v: any) => ({
      id: `vip-${v._id}`,
      type: 'VIP_LEAD' as const,
      title: `Milan Select inquiry for ${v.candidateName}`,
      subtitle: `${v.guardianName ? `Guardian: ${v.guardianName}` : 'Direct inquiry'} · Tier: ${(v.tier || 'PRIVE').toUpperCase()}`,
      timestamp: v.createdAt ? new Date(v.createdAt).toISOString() : now.toISOString(),
      badge: v.status || 'NEW',
    })),
  ]

  const recentActivity = rawFeed
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  // Actionable Executive Insights
  const insights: AdminInsight[] = []

  if (unverifiedProfiles > 0) {
    insights.push({
      level: 'action',
      title: `${unverifiedProfiles} profile${unverifiedProfiles > 1 ? 's' : ''} awaiting admin verification`,
      detail: `Verification coverage is ${verificationRate}%. Fast verification boosts member trust and mutual interest conversion.`,
      metric: `${verificationRate}% verified`,
    })
  } else if (totalMembers > 0) {
    insights.push({
      level: 'success',
      title: '100% of active member profiles are verified',
      detail: 'Every member profile in MongoDB Atlas carries an approved verification badge.',
      metric: '100% Trust',
    })
  }

  if (vipNew > 0) {
    insights.push({
      level: 'warning',
      title: `${vipNew} uncontacted Milan Select (VIP) lead${vipNew > 1 ? 's' : ''}`,
      detail: 'High-intent families have requested private concierge callbacks. Assign a relationship manager promptly.',
      metric: `${vipNew} Pending`,
    })
  }

  if (totalMembers >= 2 && (womenCount === 0 || menCount === 0 || Math.abs(womenCount - menCount) / totalMembers > 0.35)) {
    insights.push({
      level: 'info',
      title: `Marketplace gender skew (${pct(womenCount, totalMembers)}% Women · ${pct(menCount, totalMembers)}% Men)`,
      detail: 'Balanced onboarding across women and men significantly improves mutual match velocity.',
      metric: genderRatioLabel,
    })
  }

  const weakestSection = [...completionBreakdown].sort((a, b) => a.percentage - b.percentage)[0]
  if (totalMembers > 0 && weakestSection && weakestSection.percentage < 80) {
    insights.push({
      level: 'info',
      title: `Lowest completion area: ${weakestSection.label}`,
      detail: `${totalMembers - weakestSection.completed} of ${totalMembers} members have not completed this section yet.`,
      metric: `${weakestSection.percentage}%`,
    })
  }

  if (openGrievances > 0) {
    insights.push({
      level: 'warning',
      title: `${openGrievances} open safety or moderation report${openGrievances > 1 ? 's' : ''}`,
      detail: 'Review open grievances to maintain platform safety and DPDP Act 2023 compliance.',
      metric: `${openGrievances} Open`,
    })
  }

  if (shortlists.length === 0 && totalMembers > 0) {
    insights.push({
      level: 'info',
      title: 'Shortlist adoption is currently at 0%',
      detail: 'Families have not yet saved profiles to their shortlist. Consider highlighting the shortlist action on Discover cards.',
      metric: '0 Saved',
    })
  }

  return {
    generatedAt: now.toISOString(),
    range,
    healthScore: {
      overall: overallHealth,
      grade,
      status: healthStatus,
      pillars: {
        trust: trustPillar,
        quality: qualityPillar,
        balance: balancePillar,
        velocity: velocityPillar,
      },
    },
    periodComparison,
    liquidity,
    overview: {
      totalMembers,
      verifiedProfiles,
      unverifiedProfiles,
      verificationRate,
      avgProfileCompletion,
      highCompletionProfiles,
      highCompletionRate: pct(highCompletionProfiles, totalMembers),
      activeUsers24h,
      activeUsers7d,
      activeUsers30d,
      activeSessions: activeSessionsCount,
      totalConversations: conversations.length,
      totalMessages,
      avgMessagesPerConversation,
      chaiInvitesSent,
      openGrievances,
      totalGrievances: grievances.length,
    },
    funnel: {
      totalMembers,
      verifiedMembers: verifiedProfiles,
      profilesWithPhotos,
      shortlistsRecorded: shortlists.length,
      interestsSent: interests.length,
      interestsPending,
      interestsAccepted,
      interestsDeclined,
      interestsWithdrawn,
      interestAcceptanceRate,
      activeConversations,
    },
    vipPipeline: {
      total: vipConsultations.length,
      newLeads: vipNew,
      contacted: vipContacted,
      converted: vipConverted,
      conversionRate: pct(vipConverted, vipConsultations.length),
      byTier: vipByTier,
    },
    demographics: {
      gender: genderDist,
      ageBuckets,
      avgAge,
      medianAge,
      maritalStatus: buildDistribution(memberProfiles.map((p: any) => p.maritalStatus), 'Never married', 6),
      familyType: buildDistribution(memberProfiles.map((p: any) => p.familyType), 'Not specified', 6),
      accountRoles: buildDistribution(users.map((u: any) => u.role), 'SEEKER', 6),
      accountStatus: buildDistribution(users.map((u: any) => u.accountStatus), 'ACTIVE', 6),
      authProviders: buildDistribution(users.map((u: any) => u.authProvider), 'CREDENTIALS', 4),
    },
    geography: {
      topNativeDistricts: buildDistribution(memberProfiles.map((p: any) => p.nativeDistrict), 'Not specified', 8),
      topCurrentCities: buildDistribution(memberProfiles.map((p: any) => p.currentCity), 'Not specified', 8),
      topCountries: buildDistribution(memberProfiles.map((p: any) => p.country), 'India', 6),
    },
    cultural: {
      communities: buildDistribution(memberProfiles.map((p: any) => p.community), 'Maithil community', 6),
      topGotras: buildDistribution(memberProfiles.map((p: any) => p.gotra), 'Not specified', 8),
      topMools: buildDistribution(memberProfiles.map((p: any) => p.mool), 'Not specified', 8),
      panjiAvailability: buildDistribution(memberProfiles.map((p: any) => p.panjiAvailability), 'not-known', 6),
    },
    career: {
      workingSectors: buildDistribution(memberProfiles.map((p: any) => p.workingSector), 'Not specified', 6),
      topProfessions: buildDistribution(memberProfiles.map((p: any) => p.profession), 'Not specified', 8),
      topQualifications: buildDistribution(memberProfiles.map((p: any) => p.highestQualification), 'Not specified', 8),
    },
    completionBreakdown,
    privacyTrust: {
      profileVisibility: buildDistribution(memberProfiles.map((p: any) => p.visibility), 'COMMUNITY', 5),
      photoVisibility: buildDistribution(memberProfiles.map((p: any) => p.photoVisibility), 'MEMBERS', 5),
      culturalVisibility: buildDistribution(memberProfiles.map((p: any) => p.culturalVisibility), 'MEMBERS', 5),
      emailVerifiedCount,
      phoneVerifiedCount,
      identityVerifiedCount,
      consentLogsRecorded,
    },
    timeline,
    recentActivity,
    pendingVerifications: pendingVerifications.slice(0, 6),
    topDemandedProfiles,
    insights,
  }
}

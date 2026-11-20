export type DashboardNavItem = { label: string; href: string; icon: string; badge?: string }

export const dashboardUser = {
  name: 'Verified Member',
  initials: 'MM',
  membership: 'Active Member',
  location: 'Patna · Mithila roots',
  completion: 85,
  verification: 'Verified Member',
  image: '/images/placeholder-user.jpg',
}

export const dashboardNav: DashboardNavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: 'grid' },
  { label: 'Discover', href: '/discover', icon: 'compass' },
  { label: 'Interests', href: '/interests', icon: 'heart', badge: '3' },
  { label: 'Messages', href: '/messages', icon: 'message', badge: '2' },
  { label: 'Shortlist', href: '/discover?tab=shortlisted', icon: 'bookmark' },
]

export const secondaryNav: DashboardNavItem[] = [
  { label: 'My profile', href: '/profile', icon: 'user' },
  { label: 'Biodata Maker', href: '/biodata', icon: 'fileText' },
  { label: 'Kundali Milan', href: '/kundali-matching', icon: 'sparkles' },
  { label: 'Milan Select (VIP)', href: '/milan-select', icon: 'crown' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
]

export const recommendedProfiles = [
  { id: 'MM-240184', initials: 'AN', name: 'Aarav N.', age: 29, role: 'Product designer', location: 'Bengaluru', match: '92%', tone: 'sage', tag: 'Shared values', detail: 'Curiosity · Family · Kindness', image: '/images/discover-aarav.png', nativeDistrict: 'Darbhanga', gotra: 'Kashyapa' },
  { id: 'MM-240176', initials: 'RS', name: 'Riya S.', age: 30, role: 'Strategy lead', location: 'Mumbai', match: '88%', tone: 'ochre', tag: 'Similar pace', detail: 'Ambition · Humor · Respect', image: '/images/discover-riya.png', nativeDistrict: 'Madhubani', gotra: 'Bharadwaja' },
  { id: 'MM-240211', initials: 'DV', name: 'Dev V.', age: 31, role: 'Architect', location: 'Pune', match: '84%', tone: 'forest', tag: 'Mithila connection', detail: 'Madhubani family · Maithili', image: '/images/discover-dev.png', nativeDistrict: 'Madhubani', gotra: 'Vashishtha' },
]

export const recentProfiles = [
  { id: 'MM-240225', initials: 'MK', name: 'Madhav K.', role: 'Research fellow', location: 'New Delhi', viewed: 'Viewed yesterday', tone: 'terracotta', image: '/images/discover-aarav.png' },
  { id: 'MM-240198', initials: 'AP', name: 'Anjali P.', role: 'UX researcher', location: 'Bengaluru', viewed: 'Viewed 2 days ago', tone: 'sage', image: '/images/discover-anjali.png' },
  { id: 'MM-240230', initials: 'SJ', name: 'Saurav J.', role: 'Entrepreneur', location: 'Kolkata', viewed: 'Viewed 4 days ago', tone: 'ochre', image: '/images/discover-dev.png' },
]

export const receivedInterests = [
  { id: 'interest-1', profileId: 'MM-240225', initials: 'MK', name: 'Madhav K.', detail: 'Research fellow · New Delhi', time: '2h ago', tone: 'terracotta', image: '/images/discover-aarav.png' },
  { id: 'interest-2', profileId: 'MM-240198', initials: 'AP', name: 'Anjali P.', detail: 'UX researcher · Bengaluru', time: 'Yesterday', tone: 'sage', image: '/images/discover-anjali.png' },
  { id: 'interest-3', profileId: 'MM-240211', initials: 'DV', name: 'Dev V.', detail: 'Architect · Pune', time: '3 days ago', tone: 'forest', image: '/images/discover-dev.png' },
]

export const dashboardStats = [
  { label: 'Profile visitors', value: '24', change: '+8 this week', icon: 'eye' },
  { label: 'Shortlisted', value: '12', change: '+3 this month', icon: 'bookmark' },
  { label: 'Interests sent', value: '08', change: '2 awaiting reply', icon: 'send' },
]

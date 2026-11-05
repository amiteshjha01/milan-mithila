export type DashboardNavItem = { label: string; href: string; icon: string; badge?: string }

export const dashboardUser = {
  name: 'Mitali Sharma',
  initials: 'MS',
  membership: 'Founding member',
  location: 'New Delhi · Mithila roots',
  completion: 78,
  verification: 'Identity verification pending',
}

export const dashboardNav: DashboardNavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: 'grid' },
  { label: 'Discover', href: '/dashboard/discover', icon: 'compass' },
  { label: 'Interests', href: '/dashboard/interests', icon: 'heart', badge: '3' },
  { label: 'Messages', href: '/dashboard/messages', icon: 'message', badge: '2' },
  { label: 'Shortlist', href: '/dashboard/shortlist', icon: 'bookmark' },
]

export const secondaryNav: DashboardNavItem[] = [
  { label: 'My profile', href: '/dashboard/profile', icon: 'user' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
]

export const recommendedProfiles = [
  { id: 'aarav', initials: 'AN', name: 'Aarav N.', age: 29, role: 'Product designer', location: 'Bengaluru', match: '92%', tone: 'sage', tag: 'Shared values', detail: 'Curiosity · Family · Kindness' },
  { id: 'riya', initials: 'RS', name: 'Riya S.', age: 30, role: 'Strategy lead', location: 'Mumbai', match: '88%', tone: 'ochre', tag: 'Similar pace', detail: 'Ambition · Humor · Respect' },
  { id: 'dev', initials: 'DV', name: 'Dev V.', age: 31, role: 'Architect', location: 'Pune', match: '84%', tone: 'forest', tag: 'Mithila connection', detail: 'Madhubani family · Maithili' },
]

export const recentProfiles = [
  { id: 'madhav', initials: 'MK', name: 'Madhav K.', role: 'Research fellow', location: 'New Delhi', viewed: 'Viewed yesterday', tone: 'terracotta' },
  { id: 'anjali', initials: 'AP', name: 'Anjali P.', role: 'UX researcher', location: 'Bengaluru', viewed: 'Viewed 2 days ago', tone: 'sage' },
  { id: 'saurav', initials: 'SJ', name: 'Saurav J.', role: 'Entrepreneur', location: 'Kolkata', viewed: 'Viewed 4 days ago', tone: 'ochre' },
]

export const receivedInterests = [
  { id: 'interest-1', initials: 'MK', name: 'Madhav K.', detail: 'Research fellow · New Delhi', time: '2h ago', tone: 'terracotta' },
  { id: 'interest-2', initials: 'AP', name: 'Anjali P.', detail: 'UX researcher · Bengaluru', time: 'Yesterday', tone: 'sage' },
]

export const dashboardStats = [
  { label: 'Profile visitors', value: '24', change: '+8 this week', icon: 'eye' },
  { label: 'Shortlisted', value: '12', change: '+3 this month', icon: 'bookmark' },
  { label: 'Interests sent', value: '08', change: '2 awaiting reply', icon: 'send' },
]

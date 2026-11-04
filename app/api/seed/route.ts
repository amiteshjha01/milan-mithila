import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const seedSchema = z.object({
  secret: z.string().min(1),
})

const seedProfiles = [
  { email: 'aarav@example.com', displayName: 'Aarav N.', age: 29, city: 'Bengaluru', state: 'Karnataka', profession: 'Product designer', education: 'MS, Computer Science', familySummary: 'Mithila roots with family in Darbhanga.', about: 'Curious, grounded, and looking for a relationship built on kindness and shared direction.', gotra: 'Kashyapa', mool: 'Sakri', familyOrigin: 'Darbhanga', languages: ['Maithili', 'Hindi', 'English'], values: ['Curiosity', 'Family', 'Kindness'] },
  { email: 'mitali@example.com', displayName: 'Mitali S.', age: 27, city: 'New Delhi', state: 'Delhi', profession: 'Physician', education: 'MBBS', familySummary: 'A close-knit family with roots near Madhubani.', about: 'A physician who makes time for books, long walks, and community.', gotra: 'Vashishtha', mool: 'Bisfi', familyOrigin: 'Madhubani', languages: ['Maithili', 'Hindi', 'English'], values: ['Service', 'Learning', 'Community'] },
  { email: 'riya@example.com', displayName: 'Riya S.', age: 30, city: 'Mumbai', state: 'Maharashtra', profession: 'Strategy lead', education: 'MBA, Finance', familySummary: 'Contemporary city life with a strong Madhubani family connection.', about: 'Warm, ambitious, and drawn to people who make space for both tradition and change.', gotra: 'Bharadwaja', mool: 'Jhanjharpur', familyOrigin: 'Madhubani', languages: ['Maithili', 'Hindi', 'English'], values: ['Ambition', 'Humor', 'Respect'] },
]

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'Disabled in production' }, { status: 403 })
  const parsed = seedSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success || parsed.data.secret !== process.env.SEED_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profiles = []
  for (const profile of seedProfiles) {
    const user = await prisma.user.upsert({ where: { email: profile.email }, update: {}, create: { email: profile.email, name: profile.displayName } })
    const { email, ...profileData } = profile
    profiles.push(await prisma.profile.upsert({ where: { userId: user.id }, update: profileData, create: { ...profileData, userId: user.id } }))
  }
  return NextResponse.json({ ok: true, count: profiles.length })
}

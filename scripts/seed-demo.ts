import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const profiles = [
  { email: 'aarav@example.com', displayName: 'Aarav N.', age: 29, city: 'Bengaluru', state: 'Karnataka', profession: 'Product designer', education: 'MS, Computer Science', familySummary: 'Mithila roots with family in Darbhanga.', about: 'Curious, grounded, and looking for a relationship built on kindness and shared direction.', gotra: 'Kashyapa', mool: 'Sakri', familyOrigin: 'Darbhanga', languages: ['Maithili', 'Hindi', 'English'], values: ['Curiosity', 'Family', 'Kindness'] },
  { email: 'mitali@example.com', displayName: 'Mitali S.', age: 27, city: 'New Delhi', state: 'Delhi', profession: 'Physician', education: 'MBBS', familySummary: 'A close-knit family with roots near Madhubani.', about: 'A physician who makes time for books, long walks, and community.', gotra: 'Vashishtha', mool: 'Bisfi', familyOrigin: 'Madhubani', languages: ['Maithili', 'Hindi', 'English'], values: ['Service', 'Learning', 'Community'] },
  { email: 'riya@example.com', displayName: 'Riya S.', age: 30, city: 'Mumbai', state: 'Maharashtra', profession: 'Strategy lead', education: 'MBA, Finance', familySummary: 'Contemporary city life with a strong Madhubani family connection.', about: 'Warm, ambitious, and drawn to people who make space for both tradition and change.', gotra: 'Bharadwaja', mool: 'Jhanjharpur', familyOrigin: 'Madhubani', languages: ['Maithili', 'Hindi', 'English'], values: ['Ambition', 'Humor', 'Respect'] },
]

async function main() {
  for (const profile of profiles) {
    const user = await prisma.user.upsert({ where: { email: profile.email }, update: {}, create: { email: profile.email, name: profile.displayName } })
    const { email, ...profileData } = profile
    await prisma.profile.upsert({ where: { userId: user.id }, update: profileData, create: { ...profileData, userId: user.id } })
  }
  console.log(`Seeded ${profiles.length} demo profiles.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
}).finally(async () => {
  await prisma.$disconnect()
})

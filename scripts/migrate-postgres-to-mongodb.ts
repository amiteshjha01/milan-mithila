import { PrismaClient } from '@prisma/client'
import { connectMongo } from '../lib/mongodb'
import { MongoInterest, MongoMatch, MongoProfile, MongoUser } from '../lib/mongodb-models'

const prisma = new PrismaClient()

async function main() {
  await connectMongo()
  const users = await prisma.user.findMany({ include: { profile: true, interests: true, sentMatches: true, receivedMatches: true } })

  for (const user of users) {
    await MongoUser.updateOne({ legacyId: user.id }, { $set: { legacyId: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt, migratedAt: new Date() } }, { upsert: true })
    if (user.profile) {
      const profile = user.profile
      await MongoProfile.updateOne({ legacyId: profile.id }, { $set: { legacyId: profile.id, userId: profile.userId, displayName: profile.displayName, age: profile.age, city: profile.city, state: profile.state, profession: profile.profession, education: profile.education, familySummary: profile.familySummary, about: profile.about, photoUrl: profile.photoUrl, gotra: profile.gotra, mool: profile.mool, familyOrigin: profile.familyOrigin, languages: profile.languages, values: profile.values, verified: profile.verified, visibility: profile.visibility, createdAt: profile.createdAt, updatedAt: profile.updatedAt, migratedAt: new Date() } }, { upsert: true })
    }
    for (const interest of user.interests) {
      await MongoInterest.updateOne({ legacyId: interest.id }, { $set: { legacyId: interest.id, userId: interest.userId, label: interest.label, category: interest.category, createdAt: interest.createdAt, migratedAt: new Date() } }, { upsert: true })
    }
    for (const match of [...user.sentMatches, ...user.receivedMatches]) {
      await MongoMatch.updateOne({ legacyId: match.id }, { $set: { legacyId: match.id, senderId: match.senderId, receiverId: match.receiverId, status: match.status, note: match.note, createdAt: match.createdAt, updatedAt: match.updatedAt, migratedAt: new Date() } }, { upsert: true })
    }
  }

  console.log(`Migrated ${users.length} users and their related profiles, interests, and matches.`)
}

main().catch((error) => { console.error(error); process.exitCode = 1 }).finally(async () => { await prisma.$disconnect() })

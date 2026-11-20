import mongoose from 'mongoose'
import { connectMongo } from '../lib/mongodb'
import { MongoUser, MongoProfile, MongoShortlist, MongoInterest, MongoConversation } from '../lib/mongodb-models'
import { discoverProfiles } from '../lib/mock-discover'

async function seed() {
  console.log('Connecting to MongoDB Atlas...')
  const conn = await connectMongo()
  if (!conn) {
    throw new Error('Failed to connect to MongoDB Atlas')
  }

  console.log('Clearing existing records for fresh demo seed...')
  await MongoUser.deleteMany({})
  await MongoProfile.deleteMany({})
  await MongoShortlist.deleteMany({})
  await MongoInterest.deleteMany({})
  await MongoConversation.deleteMany({})

  console.log(`Seeding ${discoverProfiles.length} verified profiles into MongoDB Atlas...`)

  const seededProfiles: any[] = []

  for (const p of discoverProfiles) {
    // 1. Create User
    const email = `${p.name.toLowerCase().replace(/[^a-z]/g, '') || 'seeker'}@mithilamilan.com`
    const user = await MongoUser.create({
      email,
      name: p.name,
      role: 'SEEKER',
      isVerified: p.verified,
      accountStatus: 'ACTIVE',
      consentLogs: [
        {
          consentType: 'TERMS_AND_PRIVACY_V1',
          grantedAt: new Date(),
          ipAddress: '127.0.0.1',
          version: '2026.1',
        },
      ],
    })

    // 2. Create Profile
    const profile = await MongoProfile.create({
      userId: user._id,
      profileCode: p.id,
      displayName: p.name,
      gender: p.gender || 'Woman',
      age: p.age,
      height: p.height || '5 ft 5 in',
      maritalStatus: p.maritalStatus || 'Never married',
      motherTongue: p.motherTongue || 'Maithili',
      languages: ['Maithili', 'Hindi', 'English'],
      introduction: p.introduction || 'Warm, grounded, and connected to Maithil heritage while navigating a modern career.',
      currentCity: p.city || 'Patna',
      currentState: 'Bihar',
      country: p.country || 'India',
      nativeDistrict: p.nativeDistrict || 'Madhubani',
      nativeVillage: p.ancestralVillage || p.nativeDistrict || 'Madhubani',
      highestQualification: p.education || 'Graduate',
      profession: p.profession || 'Professional',
      workingSector: p.sector || 'Private sector',
      annualIncome: p.income || 'Confidential',
      community: p.community || 'Maithil community',
      subCommunity: p.subCommunity,
      gotra: p.gotra || 'Kashyapa',
      mool: p.mool || 'Sakri',
      ancestralVillage: p.ancestralVillage || 'Sakri',
      kul: p.kul || 'Kashyap Kul',
      pravara: p.pravara || 'Traya Pravara',
      photos: [
        {
          url: p.image || '/images/placeholder-user.jpg',
          alt: p.name,
          isPrimary: true,
          visibility: 'PUBLIC',
        },
      ],
      partnerPreferences: {
        ageRange: `${p.age - 3}–${p.age + 4} years`,
        heightRange: '5 ft 2 in – 6 ft 1 in',
        education: 'Graduate / Post Graduate',
        profession: 'Open to discussion',
        location: 'Any metro / Bihar-Jharkhand',
        gotraPreference: 'Traditional Sagotra exclusion',
        moolPreference: 'Panji guided',
        diet: p.diet || 'Open to conversation',
        lifestyle: p.lifestyle || 'Balanced',
      },
      verified: p.verified,
      verificationLabel: p.verificationLabel || 'Email verified',
      emailVerified: true,
      visibility: 'COMMUNITY',
      profileCompletion: p.profileCompletion || 88,
    })

    seededProfiles.push(profile)
  }

  // 3. Seed an initial Shortlist
  const demoUserId = 'DEMO_CURRENT_USER'
  await MongoShortlist.create({
    userId: demoUserId,
    profileId: 'MM-240176', // Riya S.
    note: 'Impressive profile, roots in Madhubani and finance background.',
  })
  await MongoShortlist.create({
    userId: demoUserId,
    profileId: 'MM-240184', // Aarav N.
    note: 'Product designer in Bengaluru, shared cultural values.',
  })

  // 4. Seed an initial Mutual Interest
  await MongoInterest.create({
    senderId: demoUserId,
    receiverId: 'MM-240176',
    status: 'ACCEPTED',
    personalNote: 'Namaskar! Resonated with your commitment to balancing tradition and modern ambition.',
    respondedAt: new Date(),
  })

  // 5. Seed a Sample Conversation
  await MongoConversation.create({
    participants: [demoUserId, 'MM-240176'],
    lastMessageText: 'Namaskar! Thank you for connecting. How was your weekend?',
    lastMessageAt: new Date(),
    status: 'ACTIVE',
    messages: [
      {
        senderId: demoUserId,
        text: 'Pranam! I saw your profile and loved your perspective on Maithil culture and finance career in Mumbai.',
        sentAt: new Date(Date.now() - 3600000 * 2),
        isRead: true,
      },
      {
        senderId: 'MM-240176',
        text: 'Namaskar! Thank you for connecting. Happy to speak further. How was your weekend?',
        sentAt: new Date(Date.now() - 1800000),
        isRead: false,
      },
    ],
  })

  console.log('✓ Successfully seeded MongoDB Atlas with profiles, shortlists, interests, and conversations!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seeding error:', err)
  process.exit(1)
})

import { Schema, model, models, type Model } from 'mongoose'

/**
 * MongoDB Mongoose Schema Architecture for Mithila Milan Matrimonial
 * Designed for High-Trust, DPDP Act 2023 Compliance & Cultural Context
 */

// 1. User Account Schema
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    // Argon2id PHC string. Never plaintext; excluded from queries unless explicitly selected.
    passwordHash: { type: String, select: false },
    authProvider: { type: String, enum: ['GOOGLE', 'CREDENTIALS'], default: 'CREDENTIALS' },
    // SHA-256 hash of the single-use reset token (the raw token is only ever emailed, never stored)
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    mustResetPassword: { type: Boolean, default: false },
    passwordChangedAt: { type: Date },
    failedLoginCount: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    googleSub: { type: String, sparse: true, unique: true, index: true },
    phone: { type: String, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['SEEKER', 'PARENT', 'GUARDIAN', 'MODERATOR', 'ADMIN'], default: 'SEEKER', index: true },
    isVerified: { type: Boolean, default: false, index: true },
    consentLogs: [
      {
        consentType: { type: String, required: true },
        grantedAt: { type: Date, default: Date.now },
        ipAddress: String,
        version: String,
      },
    ],
    accountStatus: { type: String, enum: ['ACTIVE', 'PAUSED', 'PENDING_REVIEW', 'BLOCKED'], default: 'ACTIVE' },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { collection: 'users', timestamps: true }
)

// 2. Comprehensive Profile Schema
const profileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'MithilaUser', required: true, unique: true, index: true },
    profileCode: { type: String, required: true, unique: true, index: true }, // e.g. "MM-240184"
    displayName: { type: String, required: true, trim: true, index: true },
    gender: { type: String, enum: ['Woman', 'Man', 'Non-binary', 'Prefer not to disclose'], required: true },
    dateOfBirth: { type: Date },
    age: { type: Number, required: true, index: true },
    height: { type: String, required: true },
    maritalStatus: { type: String, enum: ['Never married', 'Divorced', 'Widowed', 'Prefer not to disclose'], default: 'Never married' },
    motherTongue: { type: String, default: 'Maithili', index: true },
    languages: { type: [String], default: ['Maithili', 'Hindi', 'English'] },
    introduction: { type: String, required: true, maxlength: 2000 },

    // Location Details
    currentCity: { type: String, required: true, index: true },
    currentState: { type: String, required: true },
    country: { type: String, default: 'India', index: true },
    nativeDistrict: { type: String, required: true, index: true }, // Darbhanga, Madhubani, Saharsa, Samastipur, etc.
    nativeVillage: { type: String },
    relocationPreference: { type: String, default: 'Open to discussion' },

    // Education & Professional Details
    highestQualification: { type: String, required: true },
    degree: { type: String },
    college: { type: String },
    profession: { type: String, required: true, index: true },
    workingSector: { type: String, enum: ['Private sector', 'Public sector', 'Non-profit', 'Self-employed', 'Student', 'Prefer not to disclose'], default: 'Private sector' },
    employer: { type: String },
    annualIncome: { type: String, default: 'Prefer not to disclose' },
    workLocation: { type: String },

    // Family Background
    familyType: { type: String, enum: ['Nuclear', 'Joint', 'Extended', 'Prefer not to disclose'], default: 'Nuclear' },
    fatherOccupation: { type: String },
    motherOccupation: { type: String },
    siblings: { type: String, default: 'None specified' },
    familyValues: { type: String, default: 'Progressive with strong roots' },
    familyLocation: { type: String },
    familySummary: { type: String },

    // Maithil Cultural & Lineage Details (Voluntary & Self-Reported)
    community: { type: String, enum: ['Maithil Brahmin', 'Maithil Kayastha', 'Maithil community', 'Prefer to self-describe', 'Prefer not to disclose'], default: 'Maithil community', index: true },
    subCommunity: { type: String },
    gotra: { type: String, trim: true, index: true }, // Kashyap, Shandilya, Bharadwaj, Vashishtha, etc.
    mool: { type: String, trim: true, index: true }, // Sakri, Koilakh, Bisfi, Ujan, etc.
    ancestralVillage: { type: String, trim: true },
    kul: { type: String, default: 'Not known' },
    pravara: { type: String, default: 'Not applicable' },
    kuldevi: { type: String, default: 'Prefer not to disclose' },
    panjiAvailability: { type: String, enum: ['known', 'not-known', 'not-applicable', 'private'], default: 'not-known' },
    lineageNotes: { type: String },

    // Photos & Media
    photos: [
      {
        url: { type: String, required: true },
        alt: String,
        isPrimary: { type: Boolean, default: false },
        visibility: { type: String, enum: ['PUBLIC', 'MEMBERS_ONLY', 'MUTUAL_CONSENT'], default: 'MEMBERS_ONLY' },
      },
    ],

    // Partner Expectations & Preferences
    partnerPreferences: {
      ageRange: { type: String, default: '25–32 years' },
      heightRange: { type: String, default: '5 ft 2 in – 6 ft 0 in' },
      education: { type: String, default: 'Graduate or above' },
      profession: { type: String, default: 'Stable meaningful work' },
      location: { type: String, default: 'Open to discussion' },
      communityPreference: { type: String, default: 'Open to conversation' },
      gotraPreference: { type: String, default: 'Family tradition guided' },
      moolPreference: { type: String, default: 'No automated restriction' },
      diet: { type: String, default: 'Open to conversation' },
      lifestyle: { type: String, default: 'Balanced' },
    },

    // Verification Badges & Trust
    verified: { type: Boolean, default: false, index: true },
    verificationLabel: { type: String, default: 'Profile details shared' },
    identityVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: true },
    phoneVerified: { type: Boolean, default: false },

    // Granular Privacy Controls (DPDP Act 2023)
    visibility: { type: String, enum: ['COMMUNITY', 'CONNECTIONS_ONLY', 'PAUSED'], default: 'COMMUNITY', index: true },
    culturalVisibility: { type: String, enum: ['MEMBERS', 'CONNECTIONS', 'PRIVATE'], default: 'MEMBERS' },
    photoVisibility: { type: String, enum: ['MEMBERS', 'CONNECTIONS'], default: 'MEMBERS' },
    familyVisibility: { type: String, enum: ['MEMBERS', 'CONNECTIONS', 'PRIVATE'], default: 'MEMBERS' },

    profileCompletion: { type: Number, default: 80, min: 0, max: 100 },
  },
  { collection: 'profiles', timestamps: true }
)

// Compound Indexes for fast matrimonial search queries
profileSchema.index({ visibility: 1, age: 1, nativeDistrict: 1 })
profileSchema.index({ currentCity: 1, profession: 1 })
profileSchema.index({ gotra: 1, mool: 1 })

// 3. Mutual Interest / Connection Request Schema
const interestSchema = new Schema(
  {
    senderId: { type: String, required: true, index: true },
    receiverId: { type: String, required: true, index: true },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'WITHDRAWN'], default: 'PENDING', index: true },
    personalNote: { type: String, maxlength: 500 },
    respondedAt: { type: Date },
  },
  { collection: 'interests', timestamps: true }
)
interestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true })
interestSchema.index({ receiverId: 1, status: 1 })

// 4. Conversation & Messaging Schema
const conversationSchema = new Schema(
  {
    participants: [{ type: String, required: true, index: true }], // Profile codes, e.g. ['MM-240184', 'MM-240176']
    lastMessageText: String,
    lastMessageAt: { type: Date, default: Date.now, index: true },
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED', 'BLOCKED'], default: 'ACTIVE' },
    messages: [
      {
        senderId: { type: String, required: true },
        text: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false },
        attachment: { type: Schema.Types.Mixed },
        isChaiInvite: { type: Boolean },
        chaiDetails: { type: Schema.Types.Mixed },
      },
    ],
  },
  { collection: 'conversations', timestamps: true }
)

// 5. Shortlist Schema
const shortlistSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    profileId: { type: String, required: true, index: true },
    note: String,
  },
  { collection: 'shortlists', timestamps: true }
)
shortlistSchema.index({ userId: 1, profileId: 1 }, { unique: true })

// 5b. Server-side sessions (opaque random token; only its SHA-256 hash is stored)
const sessionSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    kind: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    createdAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    revokedReason: { type: String },
    ip: { type: String },
    userAgent: { type: String },
  },
  { collection: 'sessions' }
)
// MongoDB removes expired sessions automatically
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// 5c. VIP consultation leads (previously defined inside the public API route)
const consultationSchema = new Schema(
  {
    candidateName: { type: String, required: true },
    guardianName: String,
    relationship: String,
    phone: { type: String, required: true },
    email: String,
    profession: String,
    tier: { type: String, default: 'prive' },
    preferredDistrict: String,
    preferredTime: String,
    notes: String,
    status: { type: String, enum: ['NEW', 'CONTACTED', 'CONVERTED'], default: 'NEW' },
  },
  { collection: 'vip_consultations', timestamps: true }
)

// 6. Grievance & Moderation Schema
const grievanceSchema = new Schema(
  {
    reporterId: { type: String, required: true },
    reportedProfileId: { type: String, required: true, index: true },
    reason: { type: String, required: true },
    details: String,
    status: { type: String, enum: ['OPEN', 'UNDER_INVESTIGATION', 'RESOLVED', 'DISMISSED'], default: 'OPEN' },
    resolutionNotes: String,
    resolvedAt: Date,
  },
  { collection: 'grievances', timestamps: true }
)

export const MongoUser: Model<any> = models.MithilaUser || model('MithilaUser', userSchema)
export const MongoProfile: Model<any> = models.MithilaProfile || model('MithilaProfile', profileSchema)
export const MongoInterest: Model<any> = models.MithilaInterest || model('MithilaInterest', interestSchema)
export const MongoMatch: Model<any> = models.MithilaMatch || model('MithilaMatch', interestSchema)
export const MongoConversation: Model<any> = models.MithilaConversation || model('MithilaConversation', conversationSchema)
export const MongoShortlist: Model<any> = models.MithilaShortlist || model('MithilaShortlist', shortlistSchema)
export const MongoSession: Model<any> = models.MithilaSession || model('MithilaSession', sessionSchema)
export const VipConsultation: Model<any> = models.VipConsultation || model('VipConsultation', consultationSchema)
export const MongoGrievance: Model<any> = models.MithilaGrievance || model('MithilaGrievance', grievanceSchema)

// Aliases for convenience
export const MithilaProfile = MongoProfile
export const MithilaUser = MongoUser
export const MithilaInterest = MongoInterest
export const MithilaConversation = MongoConversation

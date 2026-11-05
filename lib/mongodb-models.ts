import { Schema, model, models, type Model } from 'mongoose'

const migrationSchema = { legacyId: { type: String, required: true, unique: true, index: true }, migratedAt: { type: Date, required: true, default: Date.now } }

const userSchema = new Schema({
  ...migrationSchema,
  email: { type: String, required: true, unique: true, index: true },
  name: String,
  role: { type: String, default: 'USER', index: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
}, { collection: 'users', timestamps: false })

const profileSchema = new Schema({
  ...migrationSchema,
  userId: { type: String, required: true, unique: true, index: true },
  displayName: { type: String, required: true, index: true },
  age: { type: Number, required: true, index: true },
  city: { type: String, required: true, index: true },
  state: { type: String, required: true, index: true },
  profession: { type: String, required: true, index: true },
  education: { type: String, required: true },
  familySummary: { type: String, required: true },
  about: { type: String, required: true },
  photoUrl: String,
  gotra: String,
  mool: String,
  familyOrigin: String,
  languages: { type: [String], default: [] },
  values: { type: [String], default: [] },
  verified: { type: Boolean, default: false, index: true },
  visibility: { type: String, default: 'COMMUNITY', index: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
}, { collection: 'profiles', timestamps: false })
profileSchema.index({ visibility: 1, age: 1, city: 1 })
profileSchema.index({ languages: 1 })
profileSchema.index({ values: 1 })

const interestSchema = new Schema({
  ...migrationSchema,
  userId: { type: String, required: true, index: true },
  label: { type: String, required: true },
  category: { type: String, required: true, index: true },
  createdAt: { type: Date, required: true },
}, { collection: 'interests', timestamps: false })

const matchSchema = new Schema({
  ...migrationSchema,
  senderId: { type: String, required: true, index: true },
  receiverId: { type: String, required: true, index: true },
  status: { type: String, default: 'PENDING', index: true },
  note: String,
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
}, { collection: 'matches', timestamps: false })
matchSchema.index({ senderId: 1, receiverId: 1 }, { unique: true })
matchSchema.index({ receiverId: 1, status: 1 })

export const MongoUser: Model<any> = models.MithilaUser || model('MithilaUser', userSchema)
export const MongoProfile: Model<any> = models.MithilaProfile || model('MithilaProfile', profileSchema)
export const MongoInterest: Model<any> = models.MithilaInterest || model('MithilaInterest', interestSchema)
export const MongoMatch: Model<any> = models.MithilaMatch || model('MithilaMatch', matchSchema)

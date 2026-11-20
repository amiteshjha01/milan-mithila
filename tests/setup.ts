import { afterAll, beforeAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

/**
 * Tests run against a throw-away in-memory MongoDB. They NEVER touch the real database in .env.local:
 * MONGODB_URI is overwritten before any application module is imported.
 */
let mongod: MongoMemoryServer

;(process.env as any).NODE_ENV = 'test'
process.env.GOOGLE_CLIENT_ID = 'test-client-id.apps.googleusercontent.com'
process.env.APP_URL = 'http://localhost:3000'

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongod.getUri()
  process.env.MONGODB_DB = 'mm_security_tests'
})

beforeEach(async () => {
  const { connectMongo } = await import('@/lib/mongodb')
  const { resetRateLimits } = await import('@/lib/security/rate-limit')
  resetRateLimits()
  await connectMongo()
  const collections = await mongoose.connection.db!.collections()
  await Promise.all(collections.map((c) => c.deleteMany({})))
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod?.stop()
})

import { NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

/** Public liveness probe: reports connectivity only, never configuration details or error text. */
export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ ok: false, status: 'not_configured' }, { status: 503 })
  }
  try {
    const mongo = await connectMongo()
    if (mongo && mongo.connection.readyState === 1) {
      await mongo.connection.db?.admin().ping()
      return NextResponse.json({ ok: true, status: 'connected' })
    }
  } catch {
    // fall through
  }
  return NextResponse.json({ ok: false, status: 'unavailable' }, { status: 503 })
}

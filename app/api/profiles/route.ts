import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const querySchema = z.object({ city: z.string().optional(), profession: z.string().optional(), q: z.string().optional() })

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = querySchema.parse(Object.fromEntries(url.searchParams))
  const profiles = await prisma.profile.findMany({
    where: {
      visibility: 'COMMUNITY',
      ...(query.city ? { city: { equals: query.city, mode: 'insensitive' } } : {}),
      ...(query.profession ? { profession: { contains: query.profession, mode: 'insensitive' } } : {}),
      ...(query.q ? { OR: [{ displayName: { contains: query.q, mode: 'insensitive' } }, { about: { contains: query.q, mode: 'insensitive' } }, { familyOrigin: { contains: query.q, mode: 'insensitive' } }] } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, displayName: true, age: true, city: true, state: true, profession: true, education: true, familySummary: true, about: true, photoUrl: true, languages: true, values: true, verified: true },
  })
  return NextResponse.json({ profiles })
}

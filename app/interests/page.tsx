import type { Metadata } from 'next'
import InterestsApp from '@/components/interests/interests-app'
import { createNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = createNoIndexMetadata(
  'Interests & Connections',
  'Manage sent and received matrimonial interests with consent and care.'
)

export default function InterestsPage() {
  return <InterestsApp />
}

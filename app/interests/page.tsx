import type { Metadata } from 'next'
import InterestsApp from '@/components/interests/interests-app'

export const metadata: Metadata = {
  title: 'Interests & Connections | Mithila Milan',
  description: 'Manage sent and received matrimonial interests with consent and care.',
}

export default function InterestsPage() {
  return <InterestsApp />
}

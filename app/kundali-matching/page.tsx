import type { Metadata } from 'next'
import { KundaliMatchingApp } from '@/components/kundali/kundali-matching-app'

export const metadata: Metadata = {
  title: 'Kundali & Ashtakoot Guna Milan | Mithila Milan',
  description: 'Vedic Kundali Matching and 36 Guna Ashtakoot Milan calculator with Gotra verification, Manglik balance analysis, and authentic Maithil astrological guidance.',
}

export default function KundaliMatchingPage() {
  return <KundaliMatchingApp />
}

import type { Metadata } from 'next'
import { Suspense } from 'react'
import DiscoverApp from '@/components/discover/discover-app'
import { createNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = createNoIndexMetadata(
  'Discover Matches',
  'Private member discovery feed on Mithila Milan.'
)

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#FAF8F5' }}>Loading Discover...</div>}>
      <DiscoverApp />
    </Suspense>
  )
}

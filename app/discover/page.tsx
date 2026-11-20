import { Suspense } from 'react'
import DiscoverApp from '@/components/discover/discover-app'

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#FAF8F5' }}>Loading Discover...</div>}>
      <DiscoverApp />
    </Suspense>
  )
}

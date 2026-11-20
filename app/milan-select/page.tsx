import type { Metadata } from 'next'
import { MilanSelectApp } from '@/components/concierge/milan-select-app'
import { JsonLd } from '@/components/seo/json-ld'
import { buildBreadcrumbJsonLd, createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({
  title: 'Milan Select — Assisted Concierge Matchmaking',
  description:
    'Confidential, assisted matrimonial matchmaking for Maithil professionals, doctors, civil servants, and global NRI families with dedicated relationship guidance.',
  path: '/milan-select',
})

export default function MilanSelectPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Milan Select', path: '/milan-select' },
        ])}
      />
      <MilanSelectApp />
    </>
  )
}

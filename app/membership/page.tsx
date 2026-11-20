import type { Metadata } from 'next'
import { MembershipPage } from '@/components/public-pages'
import { JsonLd } from '@/components/seo/json-ld'
import { buildBreadcrumbJsonLd, createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({
  title: 'Membership Plans',
  description:
    'Compare free and premium Mithila Milan membership plans designed for respectful, privacy-first Maithil matchmaking.',
  path: '/membership',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Membership', path: '/membership' },
        ])}
      />
      <MembershipPage />
    </>
  )
}

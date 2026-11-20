import type { Metadata } from 'next'
import { KundaliMatchingApp } from '@/components/kundali/kundali-matching-app'
import { JsonLd } from '@/components/seo/json-ld'
import { buildBreadcrumbJsonLd, buildWebApplicationJsonLd, createPublicMetadata } from '@/lib/seo'

const DESCRIPTION =
  'Interactive Vedic Kundali Matching and 36-Guna Ashtakoot Milan calculator with Gotra awareness, Manglik balance analysis, and Maithil cultural guidance.'

export const metadata: Metadata = createPublicMetadata({
  title: 'Kundali & Ashtakoot Guna Milan Calculator',
  description: DESCRIPTION,
  path: '/kundali-matching',
  keywords: ['Ashtakoot Guna Milan', 'Vedic Kundali matching', '36 Guna calculator', 'Maithil Kundali matching', 'Manglik balance'],
})

export default function KundaliMatchingPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Kundali Matching', path: '/kundali-matching' },
          ]),
          buildWebApplicationJsonLd({
            name: 'Mithila Milan Kundali & Ashtakoot Guna Milan Calculator',
            description: DESCRIPTION,
            path: '/kundali-matching',
          }),
        ]}
      />
      <KundaliMatchingApp />
    </>
  )
}

import type { Metadata } from 'next'
import { AboutPage } from '@/components/public-pages'
import { JsonLd } from '@/components/seo/json-ld'
import { buildBreadcrumbJsonLd, createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({
  title: 'About Mithila Milan',
  description:
    'The vision, cultural ethos, and consent-first community focus behind Mithila Milan — built for Maithil families across Bihar, Nepal, India, and the global diaspora.',
  path: '/about',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      <AboutPage />
    </>
  )
}

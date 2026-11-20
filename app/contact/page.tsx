import type { Metadata } from 'next'
import { ContactPage } from '@/components/public-pages'
import { JsonLd } from '@/components/seo/json-ld'
import { buildBreadcrumbJsonLd, createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({
  title: 'Contact & Support',
  description:
    'Get in touch with the Mithila Milan team for member support, privacy requests, or community feedback.',
  path: '/contact',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <ContactPage />
    </>
  )
}

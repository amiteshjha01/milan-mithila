import type { Metadata } from 'next'
import { SafetyPage } from '@/components/public-pages'
import { JsonLd } from '@/components/seo/json-ld'
import { buildBreadcrumbJsonLd, createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({
  title: 'Trust & Safety',
  description:
    'Safety practices, granular privacy controls, strict anti-dowry enforcement, and transparent verification guidance on Mithila Milan.',
  path: '/safety',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Trust & Safety', path: '/safety' },
        ])}
      />
      <SafetyPage />
    </>
  )
}

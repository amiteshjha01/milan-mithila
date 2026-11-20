import type { Metadata } from 'next'
import { HowItWorksPage } from '@/components/public-pages'
import { JsonLd } from '@/components/seo/json-ld'
import { buildBreadcrumbJsonLd, buildFaqJsonLd, createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({
  title: 'How Mithila Milan Works',
  description:
    'A calm, five-step consent-first journey from creating your profile and optional Maithil cultural context to mutual interest and respectful family introductions.',
  path: '/how-it-works',
})

const HOW_IT_WORKS_FAQS = [
  {
    question: 'Can someone message me without my approval?',
    answer: 'No. On Mithila Milan, private messaging opens only when both individuals mutually accept an interest.',
  },
  {
    question: 'Can parents or elders participate in the process?',
    answer:
      'Yes, families can be involved when the seeker chooses, while the adult individual retains control over consent, boundaries, and contact sharing.',
  },
]

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'How It Works', path: '/how-it-works' },
          ]),
          buildFaqJsonLd(HOW_IT_WORKS_FAQS),
        ]}
      />
      <HowItWorksPage />
    </>
  )
}

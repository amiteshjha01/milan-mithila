import type { Metadata } from 'next'
import CultureApp from '@/components/culture/culture-app'
import { JsonLd } from '@/components/seo/json-ld'
import { buildBreadcrumbJsonLd, buildFaqJsonLd, createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({
  title: 'Maithil Cultural Heritage & Matrimonial Traditions',
  description:
    'An educational guide to Maithil matrimonial heritage: Gotra, Mool, Panji Prabandha, Sapinda traditions, Kohbar Ghar art, Aripan, Samdaun, and Saurath Sabha.',
  path: '/culture',
  type: 'article',
  keywords: ['Maithil matrimony traditions', 'Gotra and Mool', 'Panji system Mithila', 'Kohbar Ghar', 'Saurath Sabha', 'Samdaun'],
})

const CULTURE_FAQS = [
  {
    question: 'What are Gotra and Mool in Maithil matrimony?',
    answer:
      'Gotra denotes traditional patrilineal Vedic lineage (such as Shandilya, Kashyap, Vatsa, or Bharadwaj), while Mool identifies the ancestral village or territorial origin within Mithila.',
  },
  {
    question: 'What is the Panji system and Saurath Sabha?',
    answer:
      'Panji Prabandha is Mithila’s centuries-old genealogical record tradition maintained by Panjikars. Saurath Sabha in Madhubani is the historic gathering where families traditionally negotiated alliances with Panjikar guidance.',
  },
  {
    question: 'What is the significance of Kohbar Ghar in a Maithil wedding?',
    answer:
      'Kohbar Ghar is the sacred nuptial chamber painted with traditional Mithila motifs—such as the Lotus (purity), Fish pair (abundance), Bamboo grove (resilience), and Sun & Moon—to bless the couple.',
  },
]

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Cultural Heritage', path: '/culture' },
          ]),
          buildFaqJsonLd(CULTURE_FAQS),
        ]}
      />
      <CultureApp />
    </>
  )
}

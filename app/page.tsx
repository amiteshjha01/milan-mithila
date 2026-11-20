import type { Metadata } from 'next'
import { HomeGate } from '@/components/home-gate'
import { JsonLd } from '@/components/seo/json-ld'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, buildFaqJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
}

const HOME_FAQS = [
  {
    question: 'Who is Mithila Milan built for?',
    answer:
      'Mithila Milan is built for adult Maithil individuals and families across Darbhanga, Madhubani, Samastipur, Saharsa, Sitamarhi, Janakpur Dham, Indian metros, and the global diaspora looking for respectful, consent-first matrimonial introductions.',
  },
  {
    question: 'Are Gotra and Mool mandatory to create a profile?',
    answer:
      'No. Cultural details such as Gotra, Mool, and native district are completely voluntary and come with granular privacy controls so you choose what to share and with whom.',
  },
  {
    question: 'How does Mithila Milan protect member privacy?',
    answer:
      'Mithila Milan follows DPDP Act 2023 principles: phone numbers and contact details are never displayed publicly, conversations open only on mutual interest, and member profiles are blocked from search engine indexing.',
  },
]

export default function Page() {
  return (
    <>
      <JsonLd data={buildFaqJsonLd(HOME_FAQS)} />
      <HomeGate />
    </>
  )
}

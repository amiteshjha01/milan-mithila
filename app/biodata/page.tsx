import type { Metadata } from 'next'
import { BiodataGeneratorApp } from '@/components/biodata/biodata-generator'
import { JsonLd } from '@/components/seo/json-ld'
import { buildBreadcrumbJsonLd, buildWebApplicationJsonLd, createPublicMetadata } from '@/lib/seo'

const DESCRIPTION =
  'Create elegant, print-ready Maithil matrimonial biodatas with Gotra, Mool, family details, astrological fields, and traditional Mithila motifs.'

export const metadata: Metadata = createPublicMetadata({
  title: 'Maithil Matrimonial Biodata Generator',
  description: DESCRIPTION,
  path: '/biodata',
  keywords: ['Maithil biodata generator', 'marriage biodata maker', 'Mithila biodata format', 'Gotra Mool biodata'],
})

export default function BiodataPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Biodata Generator', path: '/biodata' },
          ]),
          buildWebApplicationJsonLd({
            name: 'Mithila Milan Matrimonial Biodata Generator',
            description: DESCRIPTION,
            path: '/biodata',
          }),
        ]}
      />
      <BiodataGeneratorApp />
    </>
  )
}

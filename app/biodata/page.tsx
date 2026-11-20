import type { Metadata } from 'next'
import { BiodataGeneratorApp } from '@/components/biodata/biodata-generator'

export const metadata: Metadata = {
  title: 'Luxury Matrimonial Biodata Generator | Mithila Milan',
  description: 'Generate elegant, traditional Maithil matrimonial biodatas with Gotra, Mool, Ashtakoot astrological data, and print-ready royal motifs.',
}

export default function BiodataPage() {
  return <BiodataGeneratorApp />
}

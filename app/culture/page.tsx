import type { Metadata } from 'next'
import CultureApp from '@/components/culture/culture-app'

export const metadata: Metadata = {
  title: 'Cultural Heritage | Mithila Milan',
  description: 'An educational introduction to Maithil cultural and matrimonial traditions: Gotra, Mool, Kohbar, Samdaun, and Saurath Sabha.',
}

export default function Page() {
  return <CultureApp />
}

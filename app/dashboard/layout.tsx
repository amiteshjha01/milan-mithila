import type { Metadata } from 'next'
import { createNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = createNoIndexMetadata(
  'Member Dashboard',
  'Private member workspace on Mithila Milan.'
)

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}

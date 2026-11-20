import type { Metadata } from 'next'
import { createNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = createNoIndexMetadata('Admin Console', 'Restricted administration panel for Mithila Milan.')

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}

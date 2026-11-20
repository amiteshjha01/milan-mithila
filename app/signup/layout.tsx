import type { Metadata } from 'next'
import { createNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = createNoIndexMetadata('Create Account', 'Create your Mithila Milan matrimonial profile.')

export default function SignupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}

import type { Metadata } from 'next'
import { createNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = createNoIndexMetadata('Sign In', 'Sign in to your Mithila Milan account.')

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}

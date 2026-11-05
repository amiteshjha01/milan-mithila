import type { Metadata } from 'next'
import { CulturePage } from '@/components/public-pages'
export const metadata: Metadata = { title: 'Cultural Heritage | Mithila Milan', description: 'An educational introduction to Maithil cultural and matrimonial traditions.' }
export default function Page() { return <CulturePage /> }

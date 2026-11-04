import type { Metadata } from 'next'
import { AboutPage } from '@/components/public-pages'
export const metadata: Metadata = { title: 'About | Mithila Milan', description: 'The vision and community focus behind Mithila Milan.' }
export default function Page() { return <AboutPage /> }

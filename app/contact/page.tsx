import type { Metadata } from 'next'
import { ContactPage } from '@/components/public-pages'
export const metadata: Metadata = { title: 'Contact | Mithila Milan', description: 'Contact and support information for Mithila Milan.' }
export default function Page() { return <ContactPage /> }

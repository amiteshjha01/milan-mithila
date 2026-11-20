import type { Metadata } from 'next'
import { SafetyPage } from '@/components/public-pages'
export const metadata: Metadata = { title: 'Trust & Safety | Mithila Milan', description: 'Safety practices, privacy controls, and honest verification limitations.' }
export default function Page() { return <SafetyPage /> }

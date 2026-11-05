import type { Metadata } from 'next'
import { MembershipPage } from '@/components/public-pages'
export const metadata: Metadata = { title: 'Membership | Mithila Milan', description: 'Proposed free and premium membership plans for Mithila Milan.' }
export default function Page() { return <MembershipPage /> }

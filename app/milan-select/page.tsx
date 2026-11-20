import type { Metadata } from 'next'
import { MilanSelectApp } from '@/components/concierge/milan-select-app'

export const metadata: Metadata = {
  title: 'Milan Select | VIP Concierge Matrimonial Matchmaking',
  description: 'Exclusive assisted matchmaking for Maithil leaders, doctors, civil servants, and global NRIs. Dedicated Relationship Managers, 100% blind confidential profiles, and verified lineage.',
}

export default function MilanSelectPage() {
  return <MilanSelectApp />
}

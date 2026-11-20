import type { Metadata } from 'next'
import ProfileApp from '@/components/profile/profile-app'
import { createNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = createNoIndexMetadata(
  'My Profile',
  'Manage your private matrimonial profile and visibility controls on Mithila Milan.'
)

export default function ProfilePage() {
  return <ProfileApp />
}

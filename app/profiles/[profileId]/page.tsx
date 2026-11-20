import type { Metadata } from 'next'
import ProfileDetailApp from '@/components/profiles/profile-detail-app'
import { createNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = createNoIndexMetadata(
  'Member Profile',
  'Private member profile on Mithila Milan.'
)

type ProfilePageProps = {
  params: Promise<{ profileId: string }>
}

export default async function ProfileDetailsPage({ params }: ProfilePageProps) {
  const { profileId } = await params
  return <ProfileDetailApp profileId={profileId} />
}

import ProfileDetailApp from '@/components/profiles/profile-detail-app'

type ProfilePageProps = {
  params: Promise<{ profileId: string }>
}

export default async function ProfileDetailsPage({ params }: ProfilePageProps) {
  const { profileId } = await params
  return <ProfileDetailApp profileId={profileId} />
}

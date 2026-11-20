import { redirect } from 'next/navigation'

export default function ShortlistPage() {
  redirect('/discover?tab=shortlisted')
}

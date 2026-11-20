import type { Metadata } from 'next'
import SettingsApp from '@/components/settings/settings-app'

export const metadata: Metadata = {
  title: 'Settings & Privacy Controls | Mithila Milan',
  description: 'Manage account visibility, privacy boundaries, and DPDP Act data rights.',
}

export default function SettingsPage() {
  return <SettingsApp />
}

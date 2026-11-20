import type { Metadata } from 'next'
import SettingsApp from '@/components/settings/settings-app'
import { createNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = createNoIndexMetadata(
  'Settings & Privacy Controls',
  'Manage account visibility, privacy boundaries, and DPDP Act data rights.'
)

export default function SettingsPage() {
  return <SettingsApp />
}

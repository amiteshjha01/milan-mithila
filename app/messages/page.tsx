import type { Metadata } from 'next'
import { Suspense } from 'react'
import MessagesApp from '@/components/messages/messages-app'

export const metadata: Metadata = {
  title: 'Messages & Conversations | Mithila Milan',
  description: 'Private, consent-first conversations between verified matrimonial connections.',
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading conversations...</div>}>
      <MessagesApp />
    </Suspense>
  )
}

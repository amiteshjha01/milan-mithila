'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Homepage from '@/components/homepage'

export function HomeGate() {
  const router = useRouter()
  const { user, mounted } = useAuth()

  useEffect(() => {
    if (mounted && user) {
      router.replace('/dashboard')
    }
  }, [mounted, user, router])

  if (mounted && user) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0B241D', color: '#FAF9F6' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              border: '2px solid rgba(212,175,55,0.3)',
              borderTopColor: '#D4AF37',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '0 0 6px', color: '#FAF9F6' }}>
            Mithila <em>Milan</em>
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            Redirecting to your member dashboard...
          </p>
        </div>
      </div>
    )
  }

  return <Homepage />
}

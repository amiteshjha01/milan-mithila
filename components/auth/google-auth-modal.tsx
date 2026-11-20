'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface GoogleAuthModalProps {
  isOpen: boolean
  onClose: () => void
  /** Called with a Google-signed ID token. The server verifies it; the client never supplies identity. */
  onCredential: (idToken: string) => void
  loading?: boolean
}

declare global {
  interface Window {
    google?: any
  }
}

const GIS_SRC = 'https://accounts.google.com/gsi/client'

export function GoogleAuthModal({ isOpen, onClose, onCredential, loading = false }: GoogleAuthModalProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(onCredential)
  callbackRef.current = onCredential
  const [error, setError] = useState('')
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!isOpen) return
    setError('')
    if (!clientId) {
      setError('Google sign-in is not available right now. Please use email and password.')
      return
    }
    const render = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          if (response.credential) callbackRef.current(response.credential)
        },
      })
      window.google.accounts.id.renderButton(buttonRef.current, { theme: 'outline', size: 'large', width: 320 })
    }
    if (window.google?.accounts?.id) {
      render()
      return
    }
    let script = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = GIS_SRC
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', render)
    script.addEventListener('error', () => setError('Could not load Google sign-in.'))
    return () => script?.removeEventListener('load', render)
  }, [isOpen, clientId])

  if (!isOpen) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(11,36,29,0.72)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', padding: '20px' }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '430px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          overflow: 'hidden', fontFamily: 'var(--font-inter), Roboto, Arial, sans-serif', color: '#3c4043', border: '1px solid rgba(0,0,0,0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '24px 28px 18px', textAlign: 'center', position: 'relative' }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#5f6368', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
          <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 600, color: '#202124' }}>Sign in with Google</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#5f6368' }}>
            to continue to <strong style={{ color: '#1B4D3E' }}>Mithila Milan</strong>
          </p>
        </div>
        <div style={{ padding: '8px 28px 28px', display: 'grid', placeItems: 'center', minHeight: '64px' }}>
          {error ? <p style={{ margin: 0, fontSize: '13px', color: '#b3261e', textAlign: 'center' }}>{error}</p> : <div ref={buttonRef} aria-busy={loading} />}
        </div>
      </div>
    </div>
  )
}

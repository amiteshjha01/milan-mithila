'use client'

import React, { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetForm() {
  const token = useSearchParams().get('token') || ''
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (data.ok) setDone(true)
      else setError(data.error || 'This reset link is invalid or has expired.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#FAF8F5', padding: 20 }}>
      <div style={{ background: '#fff', maxWidth: 420, width: '100%', padding: 28, borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: 22, margin: '0 0 8px', color: '#163B30' }}>Set a new password</h1>
        {done ? (
          <p>
            Your password has been updated. <Link href="/login">Sign in</Link>
          </p>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label htmlFor="new-password">New password (at least 10 characters)</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={128}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
            />
            {error && <p role="alert" style={{ color: '#b3261e', margin: 0 }}>{error}</p>}
            <button type="submit" disabled={loading || !token} style={{ padding: 12, borderRadius: 10, background: '#8C2D19', color: '#fff', border: 0, cursor: 'pointer' }}>
              {loading ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  )
}

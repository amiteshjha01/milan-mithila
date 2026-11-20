'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, ShieldCheck, Check, LogOut, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { useAuth, type AuthUser } from '@/lib/auth-context'
import { GoogleAuthModal } from './google-auth-modal'

export function AuthModal() {
  const router = useRouter()
  const { user, login, logout, isAuthModalOpen, closeAuthModal } = useAuth()

  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>('login')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('SEEKER')
  const [gender, setGender] = useState('Woman')

  if (!isAuthModalOpen) return null

  const handleGoogleSignIn = () => {
    setShowGoogleModal(true)
  }

  const handleGoogleCredential = async (idToken: string) => {
    setGoogleLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'GOOGLE', idToken }),
      })
      const data = await res.json()
      setShowGoogleModal(false)
      if (data.ok && data.user) {
        login(data.user)
        closeAuthModal()
        router.push('/dashboard')
      } else {
        setErrorMsg(data.error || 'Google sign-in failed.')
      }
    } catch {
      setShowGoogleModal(false)
      setErrorMsg('Failed to complete Google authentication.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, provider: 'CREDENTIALS' }),
      })
      const data = await res.json()
      if (data.ok && data.user) {
        login(data.user)
        closeAuthModal()
        router.push('/dashboard')
      } else {
        setErrorMsg(data.error || 'Invalid email or password.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
          gender,
          nativeDistrict: 'Madhubani',
          currentCity: 'Patna',
        }),
      })
      const data = await res.json()
      if (data.ok && data.user) {
        login(data.user)
        closeAuthModal()
        router.push('/dashboard')
      } else {
        setErrorMsg(data.error || 'Signup failed. Please try again.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setSuccessMsg(data.message || 'Password reset link sent to email.')
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(27,45,38,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={closeAuthModal}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '430px',
          width: '100%',
          padding: '28px 24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          border: '1px solid rgba(0,0,0,0.08)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#20322C',
          }}
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#163B30',
              color: '#D4AF37',
              fontWeight: 800,
              fontSize: '18px',
              border: '2px solid #D4AF37',
              marginBottom: '8px',
            }}
          >
            M
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', color: '#20322C', margin: '0 0 4px' }}>
            {user ? 'Account Management' : tab === 'login' ? 'Sign In to Mithila Milan' : tab === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(32,50,44,0.7)' }}>
            The consent-first matrimonial sanctuary for global Maithil families.
          </p>
        </div>

        {/* If logged in: Show User card & Logout */}
        {user ? (
          <div style={{ background: '#FAF8F5', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ position: 'relative', width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <Image src={user.avatar} alt={user.name} fill style={{ objectFit: 'cover' }} sizes="44px" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ fontSize: '14px', color: '#20322C' }}>{user.name}</strong>
                  {user.isVerified && <ShieldCheck size={15} color="#166534" />}
                </div>
                <small style={{ fontSize: '11px', color: 'rgba(32,50,44,0.6)', display: 'block' }}>
                  {user.email}
                </small>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                logout()
                closeAuthModal()
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #FCA5A5',
                background: '#FEF2F2',
                color: '#991B1B',
                fontSize: '13px',
                fontWeight: 650,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <LogOut size={15} />
              <span>Log Out of Mithila Milan</span>
            </button>
          </div>
        ) : (
          <>
            {/* Mode Tabs: [Sign In] [Create Account] */}
            <div style={{ display: 'flex', background: '#F1EFEA', padding: '4px', borderRadius: '10px', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg('') }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 650,
                  cursor: 'pointer',
                  background: tab === 'login' ? '#ffffff' : 'transparent',
                  color: tab === 'login' ? '#8C2D19' : 'rgba(32,50,44,0.7)',
                  boxShadow: tab === 'login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('signup'); setErrorMsg(''); setSuccessMsg('') }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 650,
                  cursor: 'pointer',
                  background: tab === 'signup' ? '#ffffff' : 'transparent',
                  color: tab === 'signup' ? '#8C2D19' : 'rgba(32,50,44,0.7)',
                  boxShadow: tab === 'signup' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div style={{ padding: '8px 12px', borderRadius: '6px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: '12px', marginBottom: '14px' }}>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ padding: '8px 12px', borderRadius: '6px', background: '#F0FDF4', border: '1px solid #86EFAC', color: '#166534', fontSize: '12px', marginBottom: '14px' }}>
                {successMsg}
              </div>
            )}

            {/* 1. Google Auth Button */}
            {tab !== 'forgot' && (
              <div style={{ marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #DADCE0',
                    background: '#ffffff',
                    color: '#3C4043',
                    fontSize: '13px',
                    fontWeight: 650,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span>{googleLoading ? 'Connecting...' : tab === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0 12px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                  <span style={{ fontSize: '11px', color: 'rgba(32,50,44,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Or use Email & Password
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                </div>
              </div>
            )}

            {/* LOGIN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 650, color: '#20322C', marginBottom: '4px' }}>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 650, color: '#20322C' }}>Password</label>
                    <button
                      type="button"
                      onClick={() => setTab('forgot')}
                      style={{ background: 'transparent', border: 'none', color: '#8C2D19', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Forgot?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', padding: '9px 34px 9px 12px', borderRadius: '7px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: '9px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(32,50,44,0.5)' }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '11px',
                    borderRadius: '8px',
                    background: '#8C2D19',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '4px',
                  }}
                >
                  {loading ? 'Verifying...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* SIGNUP FORM */}
            {tab === 'signup' && (
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 650, color: '#20322C', marginBottom: '3px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Mishra"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 650, color: '#20322C', marginBottom: '3px' }}>Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 650, color: '#20322C', marginBottom: '3px' }}>Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 650, color: '#20322C', marginBottom: '3px' }}>Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '7px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '12px', background: '#fff', boxSizing: 'border-box' }}
                    >
                      <option value="SEEKER">Self</option>
                      <option value="PARENT">Parent</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 650, color: '#20322C', marginBottom: '3px' }}>Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '7px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '12px', background: '#fff', boxSizing: 'border-box' }}
                    >
                      <option value="Woman">Woman</option>
                      <option value="Man">Man</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '11px',
                    borderRadius: '8px',
                    background: '#8C2D19',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '4px',
                  }}
                >
                  {loading ? 'Creating...' : 'Sign Up'}
                </button>
              </form>
            )}

            {/* FORGOT FORM */}
            {tab === 'forgot' && (
              <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 650, color: '#20322C', marginBottom: '4px' }}>Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '11px',
                    borderRadius: '8px',
                    background: '#8C2D19',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  style={{ background: 'transparent', border: 'none', color: '#8C2D19', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}
                >
                  ← Back to Sign In
                </button>
              </form>
            )}
          </>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Link
            href="/login"
            onClick={closeAuthModal}
            style={{ fontSize: '12px', color: '#8C2D19', fontWeight: 650, textDecoration: 'none' }}
          >
            Open Dedicated Login & Signup Page ↗
          </Link>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onCredential={handleGoogleCredential}
        loading={googleLoading}
      />
    </div>
  )
}

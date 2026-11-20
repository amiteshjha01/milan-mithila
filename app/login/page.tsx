'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiteHeader, SiteFooter } from '@/components/site-shell'
import {
  Eye, EyeOff, ShieldCheck, Check, LogIn, ArrowRight, Sparkles, Mail,
  Lock, User, MapPin, Award, Heart, CheckCircle2, Star, Compass, FileCheck
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { GoogleAuthModal } from '@/components/auth/google-auth-modal'

export default function LoginPage() {
  const router = useRouter()
  const { user, login, mounted } = useAuth()

  React.useEffect(() => {
    if (mounted && user) {
      router.replace('/dashboard')
    }
  }, [mounted, user, router])

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Signup form
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'SEEKER',
    gender: 'Woman',
    currentCity: 'Patna',
    nativeDistrict: 'Madhubani',
    gotra: 'Kashyapa (कश्यप)',
    profession: 'Software Engineer',
  })

  // Forgot Password
  const [forgotEmail, setForgotEmail] = useState('')
  const [showGoogleModal, setShowGoogleModal] = useState(false)

  const handleGoogleAuth = () => {
    setShowGoogleModal(true)
  }

  const handleGoogleCredential = async (idToken: string) => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'GOOGLE', idToken }),
      })
      const data = await res.json()
      if (data.ok && data.user) {
        login(data.user)
        setShowGoogleModal(false)
        router.push('/dashboard')
      } else {
        setShowGoogleModal(false)
        setErrorMsg(data.error || 'Google sign-in failed.')
      }
    } catch {
      setShowGoogleModal(false)
      setErrorMsg('Failed to complete Google authentication.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          provider: 'CREDENTIALS',
        }),
      })
      const data = await res.json()
      if (data.ok && data.user) {
        login(data.user)
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
    setSuccessMsg('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      })
      const data = await res.json()
      if (data.ok && data.user) {
        login(data.user)
        setSuccessMsg('Account created successfully! Redirecting to dashboard...')
        setTimeout(() => router.push('/dashboard'), 700)
      } else {
        setErrorMsg(data.error || 'Failed to create account. Please check details.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()
      if (data.ok) {
        setSuccessMsg(data.message || 'Password reset instructions have been generated.')
      } else {
        setErrorMsg(data.error || 'Please enter a valid email.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: ' clamp(24px, 4vw, 56px) 20px' }}>
        <div
          style={{
            maxWidth: '1180px',
            width: '100%',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
          }}
        >
          {/* LEFT: Cultural Heritage & Trust Showcase */}
          <div
            style={{
              background: '#112E25',
              borderRadius: '24px',
              padding: 'clamp(28px, 4.5vw, 48px)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 50px rgba(17,46,37,0.25)',
              border: '1.5px solid rgba(212,175,55,0.3)',
              color: '#FAF8F5',
              minHeight: '560px',
            }}
          >
            {/* Background Texture / Mural */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.16, pointerEvents: 'none' }}>
              <Image
                src="/images/mithila-kohbar.png"
                alt="Mithila Heritage Kohbar Art"
                fill
                style={{ objectFit: 'cover' }}
                sizes="600px"
              />
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(17,46,37,0.88) 0%, rgba(11,36,29,0.96) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Inner Content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  background: 'rgba(212,175,55,0.15)',
                  border: '1px solid rgba(212,175,55,0.4)',
                  color: '#F4D068',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '22px',
                }}
              >
                <Sparkles size={13} />
                <span>Sanctuary for Maithil Families</span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 'clamp(20px, 2.5vw, 24px)',
                  color: '#D4AF37',
                  marginBottom: '10px',
                  letterSpacing: '0.02em',
                }}
              >
                ॥ सखा सप्तपदा भव · सख्यं ते गमेयं ॥
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 'clamp(28px, 3.2vw, 38px)',
                  lineHeight: 1.15,
                  margin: '0 0 14px',
                  color: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                Rooted in Gotra,<br />
                <em style={{ color: '#F4D068', fontStyle: 'italic' }}>dignified by consent.</em>
              </h2>

              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(250,248,245,0.8)',
                  lineHeight: 1.65,
                  maxWidth: '460px',
                  margin: '0 0 32px',
                }}
              >
                Mithila Milan is built specifically for global Maithil candidates and parents seeking life companions who share their ancestral culture, intellectual values, and lifelong aspirations.
              </p>

              {/* 4 Trust Badges */}
              <div style={{ display: 'grid', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212,175,55,0.2)', border: '1px solid #D4AF37', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <ShieldCheck size={16} color="#F4D068" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#FFFFFF', display: 'block' }}>100% Verified Community</strong>
                    <span style={{ fontSize: '12px', color: 'rgba(250,248,245,0.7)' }}>Zero bots or duplicate entries. Every profile verified with OTP and family roots.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212,175,55,0.2)', border: '1px solid #D4AF37', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <FileCheck size={16} color="#F4D068" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#FFFFFF', display: 'block' }}>Gotra & Panji Framework</strong>
                    <span style={{ fontSize: '12px', color: 'rgba(250,248,245,0.7)' }}>Voluntary Gotra, Mool, and ancestral village documentation with full privacy control.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212,175,55,0.2)', border: '1px solid #D4AF37', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Heart size={16} color="#F4D068" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#FFFFFF', display: 'block' }}>Mutual Consent-First Privacy</strong>
                    <span style={{ fontSize: '12px', color: 'rgba(250,248,245,0.7)' }}>Photographs and private contacts are visible only after mutual connection acceptance.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Community Stat Card */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                marginTop: '36px',
                padding: '16px 20px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D4AF37', display: 'block', fontWeight: 700 }}>
                  Active Sanctuary Network
                </span>
                <strong style={{ fontSize: '18px', color: '#FFFFFF' }}>2,400+ Verified Maithil Profiles</strong>
              </div>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>
                Darbhanga · Madhubani · Patna · NCR
              </span>
            </div>
          </div>

          {/* RIGHT: Modern Refined Auth Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: 'clamp(28px, 4.5vw, 44px)',
              boxShadow: '0 20px 60px rgba(11,36,29,0.07)',
              border: '1px solid rgba(140,45,25,0.14)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Top Segmented Mode Switcher */}
            <div
              style={{
                display: 'flex',
                background: '#FAF8F5',
                borderRadius: '999px',
                padding: '4px',
                marginBottom: '26px',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg('') }}
                style={{
                  flex: 1,
                  padding: '9px 16px',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: mode === 'login' ? 700 : 600,
                  background: mode === 'login' ? '#163B30' : 'transparent',
                  color: mode === 'login' ? '#FAF8F5' : 'rgba(32,50,44,0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: mode === 'login' ? '0 2px 8px rgba(22,59,48,0.2)' : 'none',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg('') }}
                style={{
                  flex: 1,
                  padding: '9px 16px',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: mode === 'signup' ? 700 : 600,
                  background: mode === 'signup' ? '#163B30' : 'transparent',
                  color: mode === 'signup' ? '#FAF8F5' : 'rgba(32,50,44,0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: mode === 'signup' ? '0 2px 8px rgba(22,59,48,0.2)' : 'none',
                }}
              >
                Create Account
              </button>
            </div>

            {/* Header Titles */}
            <div style={{ marginBottom: '22px' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: '26px',
                  color: '#20322C',
                  margin: '0 0 6px',
                  fontWeight: 650,
                }}
              >
                {mode === 'login' && 'Sign In to Your Sanctuary'}
                {mode === 'signup' && 'Create Your Maithil Profile'}
                {mode === 'forgot' && 'Reset Your Password'}
              </h1>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(32,50,44,0.68)', lineHeight: 1.5 }}>
                {mode === 'login' && 'Enter your registered credentials or continue with Google to access your dashboard.'}
                {mode === 'signup' && 'Join the trusted matrimonial network for global Maithils. Takes only 1 minute.'}
                {mode === 'forgot' && 'Enter your registered email and we will help you regain secure access.'}
              </p>
            </div>

            {/* Error & Success Alerts */}
            {errorMsg && (
              <div style={{ padding: '11px 14px', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: '13px', marginBottom: '18px' }}>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ padding: '11px 14px', borderRadius: '10px', background: '#F0FDF4', border: '1px solid #86EFAC', color: '#166534', fontSize: '13px', marginBottom: '18px' }}>
                {successMsg}
              </div>
            )}

            {/* 1. GOOGLE ONE-CLICK AUTH BUTTON */}
            {mode !== 'forgot' && (
              <div>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: '1.5px solid #E2E8F0',
                    background: '#ffffff',
                    color: '#1E293B',
                    fontSize: '14px',
                    fontWeight: 650,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)' }}
                >
                  <svg width="19" height="19" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span>{loading ? 'Connecting Google...' : mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '20px 0 16px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                  <span style={{ fontSize: '11px', color: 'rgba(32,50,44,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    Or use email & password
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                </div>
              </div>
            )}

            {/* 2. LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#20322C', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="e.g. amitesh@mithilamilan.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 38px',
                        borderRadius: '10px',
                        border: '1.5px solid rgba(0,0,0,0.15)',
                        background: '#FAF8F5',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#8C2D19'; e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(140,45,25,0.1)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; e.currentTarget.style.background = '#FAF8F5'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                    <Mail size={16} color="rgba(32,50,44,0.45)" style={{ position: 'absolute', left: '13px', top: '14px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 650, color: '#20322C' }}>Password</label>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg('') }}
                      style={{ background: 'transparent', border: 'none', color: '#8C2D19', fontSize: '12px', fontWeight: 650, cursor: 'pointer', padding: 0 }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 38px',
                        borderRadius: '10px',
                        border: '1.5px solid rgba(0,0,0,0.15)',
                        background: '#FAF8F5',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#8C2D19'; e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(140,45,25,0.1)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; e.currentTarget.style.background = '#FAF8F5'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                    <Lock size={16} color="rgba(32,50,44,0.45)" style={{ position: 'absolute', left: '13px', top: '14px' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(32,50,44,0.5)' }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #8C2D19 0%, #A8331E 100%)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '4px',
                    boxShadow: '0 4px 14px rgba(140,45,25,0.25)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(140,45,25,0.32)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(140,45,25,0.25)' }}
                >
                  {loading ? 'Verifying Credentials...' : 'Sign In with Email →'}
                </button>
              </form>
            )}

            {/* 3. SIGNUP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#20322C', marginBottom: '4px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshu Jha"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.16)', fontSize: '13px', background: '#FAF8F5', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#20322C', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.16)', fontSize: '13px', background: '#FAF8F5', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#20322C', marginBottom: '4px' }}>
                    Create Password (min 6 chars) *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.16)', fontSize: '13px', background: '#FAF8F5', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#20322C', marginBottom: '4px' }}>Profile For</label>
                    <select
                      value={signupData.role}
                      onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                      style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.16)', fontSize: '13px', background: '#FAF8F5', boxSizing: 'border-box' }}
                    >
                      <option value="SEEKER">Self (Candidate)</option>
                      <option value="PARENT">Parent (माता / पिता)</option>
                      <option value="GUARDIAN">Guardian / Elder</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#20322C', marginBottom: '4px' }}>Gender</label>
                    <select
                      value={signupData.gender}
                      onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
                      style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.16)', fontSize: '13px', background: '#FAF8F5', boxSizing: 'border-box' }}
                    >
                      <option value="Woman">Woman (कन्या)</option>
                      <option value="Man">Man (वर)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#20322C', marginBottom: '4px' }}>Native District</label>
                    <input
                      type="text"
                      value={signupData.nativeDistrict}
                      onChange={(e) => setSignupData({ ...signupData, nativeDistrict: e.target.value })}
                      placeholder="e.g. Madhubani"
                      style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.16)', fontSize: '13px', background: '#FAF8F5', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#20322C', marginBottom: '4px' }}>Gotra (गोत्र)</label>
                    <input
                      type="text"
                      value={signupData.gotra}
                      onChange={(e) => setSignupData({ ...signupData, gotra: e.target.value })}
                      placeholder="e.g. Kashyapa"
                      style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.16)', fontSize: '13px', background: '#FAF8F5', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '13px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #8C2D19 0%, #A8331E 100%)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '6px',
                    boxShadow: '0 4px 14px rgba(140,45,25,0.25)',
                  }}
                >
                  {loading ? 'Creating Profile...' : 'Complete Registration →'}
                </button>
              </form>
            )}

            {/* 4. FORGOT PASSWORD FORM */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#20322C', marginBottom: '6px' }}>
                    Registered Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="Enter your registered email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 38px',
                        borderRadius: '10px',
                        border: '1.5px solid rgba(0,0,0,0.15)',
                        background: '#FAF8F5',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <Mail size={16} color="rgba(32,50,44,0.45)" style={{ position: 'absolute', left: '13px', top: '14px' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '13px',
                    borderRadius: '10px',
                    background: '#8C2D19',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '4px',
                  }}
                >
                  {loading ? 'Processing...' : 'Send Password Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg('') }}
                  style={{ background: 'transparent', border: 'none', color: '#8C2D19', fontSize: '13px', fontWeight: 650, cursor: 'pointer', textAlign: 'center', marginTop: '6px' }}
                >
                  ← Back to Sign In
                </button>
              </form>
            )}

            {/* Security Footnote */}
            <div
              style={{
                marginTop: '22px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                textAlign: 'center',
                fontSize: '11px',
                color: 'rgba(32,50,44,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🔒 256-Bit SSL Encrypted</span>
              <span>•</span>
              <span>DPDP Act 2023 Compliant</span>
              <span>•</span>
              <span>Zero Spam Calls</span>
            </div>
          </div>
        </div>
      </main>

      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onCredential={handleGoogleCredential}
        loading={loading}
      />

      <SiteFooter />
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  Users, ShieldCheck, ShieldAlert, Award, PhoneCall, RefreshCw,
  Search, Check, X, Trash2, ArrowLeft, Database, Crown, Heart,
  Filter, Eye, EyeOff, ExternalLink, AlertTriangle, UserCheck, Lock, LogOut, KeyRound, Sparkles
} from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const { user, login, logout, mounted } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED' | 'ACTIVE' | 'BLOCKED'>('ALL')
  const [activeTab, setActiveTab] = useState<'members' | 'vip' | 'database'>('members')
  const [actionNotice, setActionNotice] = useState('')

  // Admin login states
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      })
      const result = await res.json()
      if (result.ok && result.user) {
        login(result.user)
        setActionNotice('Welcome back, Executive Administrator')
        setTimeout(() => setActionNotice(''), 3500)
        loadData()
      } else {
        setLoginError(result.error || 'Authentication failed. Please verify admin credentials.')
      }
    } catch (err: any) {
      setLoginError(err.message || 'Network error occurred while authenticating.')
    } finally {
      setLoginLoading(false)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (e) {
      console.error('Admin data load error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleVerify = async (profileId: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_VERIFY', profileId }),
      })
      const result = await res.json()
      if (result.ok) {
        setActionNotice(result.message)
        setTimeout(() => setActionNotice(''), 3000)
        loadData()
      }
    } catch (e) {
      console.error('Toggle verify error:', e)
    }
  }

  const handleChangeStatus = async (userId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CHANGE_STATUS', userId, status: newStatus }),
      })
      const result = await res.json()
      if (result.ok) {
        setActionNotice(result.message)
        setTimeout(() => setActionNotice(''), 3000)
        loadData()
      }
    } catch (e) {
      console.error('Change status error:', e)
    }
  }

  const handleDeleteMember = async (profileId: string, userId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${name} from MongoDB Atlas?`)) return
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE_MEMBER', profileId, userId }),
      })
      const result = await res.json()
      if (result.ok) {
        setActionNotice(`Member ${name} permanently deleted from database.`)
        setTimeout(() => setActionNotice(''), 3000)
        loadData()
      }
    } catch (e) {
      console.error('Delete member error:', e)
    }
  }

  const handleUpdateVipStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_VIP_STATUS', leadId, status: newStatus }),
      })
      const result = await res.json()
      if (result.ok) {
        setActionNotice(`VIP Lead status changed to ${newStatus}`)
        setTimeout(() => setActionNotice(''), 3000)
        loadData()
      }
    } catch (e) {
      console.error('VIP status error:', e)
    }
  }

  // Filter members
  const members = data?.members || []
  const filteredMembers = members.filter((m: any) => {
    const matchesQuery = !search || [m.name, m.email, m.profileCode, m.city, m.nativeDistrict, m.gotra, m.mool].some((v) =>
      String(v || '').toLowerCase().includes(search.toLowerCase())
    )
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'VERIFIED'
        ? m.verified
        : statusFilter === 'UNVERIFIED'
        ? !m.verified
        : statusFilter === 'ACTIVE'
        ? m.accountStatus === 'ACTIVE'
        : m.accountStatus === 'BLOCKED'
    return matchesQuery && matchesStatus
  })

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0B241D', color: '#FAF9F6' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={28} className="animate-spin" color="#D4AF37" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Initializing Executive Admin Desk...</p>
        </div>
      </div>
    )
  }

  // If not logged in as ADMIN, display the Executive Admin Login Portal Gate
  if (!user || user.role !== 'ADMIN') {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 20%, #163B30 0%, #0B241D 70%, #061510 100%)', color: '#FAF9F6', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-inter), sans-serif' }}>
        {/* Top Minimal Admin Header */}
        <header style={{ padding: '20px clamp(16px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          <Link href="/" style={{ color: '#FAF8F5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#163B30', color: '#D4AF37', display: 'grid', placeItems: 'center', fontWeight: 800, border: '1.5px solid #D4AF37' }}>
              M
            </span>
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', fontWeight: 700 }}>
              Mithila <em style={{ color: '#F4D068' }}>Milan</em>
            </span>
          </Link>
          <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Back to Sanctuary
          </Link>
        </header>

        {/* Security Gate Card */}
        <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '40px 20px 80px' }}>
          <div style={{ width: '100%', maxWidth: '460px', background: 'rgba(16, 45, 37, 0.85)', backdropFilter: 'blur(16px)', border: '1.5px solid #C59A3F', borderRadius: '18px', padding: 'clamp(28px, 5vw, 42px)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #C59A3F, #F4D068, #C59A3F)' }} />
            
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', border: '1.5px solid #D4AF37', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: '#F4D068' }}>
                <KeyRound size={28} />
              </div>
              <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', background: 'rgba(212,175,55,0.18)', color: '#F4D068', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Restricted Admin Gate
              </span>
              <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '26px', margin: '0 0 8px', fontWeight: 700, color: '#FAF8F5' }}>
                Executive Console
              </h1>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.68)', lineHeight: 1.5, margin: 0 }}>
                Sign in with authorized administrator credentials to manage member profiles, verify identities, and monitor consultations.
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', color: '#FCA5A5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>{loginError}</span>
              </div>
            )}

            {/* Admin Credentials Form */}
            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '6px', letterSpacing: '0.02em' }}>
                  Admin Official Identifier
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    placeholder="admin@mithilamilan.com"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', color: '#FAF8F5', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '6px', letterSpacing: '0.02em' }}>
                  Admin Security Key / Master Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="Enter security key"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px 42px 12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', color: '#FAF8F5', fontSize: '14px', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={loginLoading}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #AA8010 100%)',
                  border: 'none',
                  color: '#0B241D',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: loginLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.25)',
                  marginTop: '6px',
                }}
              >
                {loginLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Verifying Clearance...
                  </>
                ) : (
                  <>
                    <Lock size={16} /> Authorize & Access Console
                  </>
                )}
              </button>

            </form>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', color: '#0F172A', fontFamily: 'var(--font-inter), sans-serif' }}>
      {/* Admin Top Navigation */}
      <header style={{ background: '#0B241D', color: '#FAF8F5', borderBottom: '2px solid #C59A3F', padding: '16px clamp(16px, 4vw, 36px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/" style={{ color: '#FAF8F5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#163B30', color: '#D4AF37', display: 'grid', placeItems: 'center', fontWeight: 800, border: '1.5px solid #D4AF37' }}>
              M
            </span>
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', fontWeight: 700 }}>
              Mithila <em style={{ color: '#F4D068' }}>Milan</em>
            </span>
          </Link>
          <span style={{ padding: '3px 10px', borderRadius: '999px', background: 'rgba(212,175,55,0.2)', color: '#F4D068', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Admin Operations Portal
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(255,255,255,0.08)', padding: '5px 12px', borderRadius: '999px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }} />
            <span>MongoDB Atlas Connected</span>
          </div>

          <button
            type="button"
            onClick={loadData}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: '#C59A3F',
              color: '#0B241D',
              border: 'none',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          {/* Admin User Badge & Logout CTA */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '5px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)' }}>
            <span style={{ fontSize: '12px', color: '#F4D068', fontWeight: 600 }}>{user?.name || 'Administrator'}</span>
            <button
              type="button"
              onClick={() => logout()}
              title="Sign out of Administrator Desk"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#FCA5A5',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
              }}
            >
              <LogOut size={12} />
              <span>Log Out</span>
            </button>
          </div>

          <Link
            href="/"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FAF8F5',
              fontSize: '12px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            ← Public Sanctuary
          </Link>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div style={{ background: '#166534', color: '#ffffff', padding: '10px 20px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>
          ✓ {actionNotice}
        </div>
      )}

      <main style={{ maxWidth: '1380px', margin: '0 auto', padding: '32px 20px 80px' }}>
        {/* KPI Statistics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
              <span>Total Members</span>
              <Users size={18} color="#0B241D" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>
              {data?.stats?.totalProfiles ?? '...'}
            </div>
            <small style={{ color: '#16A34A', fontSize: '11px', fontWeight: 600 }}>
              Live in MongoDB Atlas
            </small>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
              <span>Verified Profiles</span>
              <ShieldCheck size={18} color="#15803D" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#15803D' }}>
              {data?.stats?.verifiedProfiles ?? '...'}
            </div>
            <small style={{ color: '#64748B', fontSize: '11px' }}>
              Badge approved by Admin
            </small>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
              <span>VIP Concierge Leads</span>
              <Crown size={18} color="#C59A3F" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#92400E' }}>
              {data?.stats?.totalVipConsultations ?? 0}
            </div>
            <small style={{ color: '#64748B', fontSize: '11px' }}>
              Milan Select high-intent
            </small>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
              <span>Interest Signals</span>
              <Heart size={18} color="#8C2D19" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#8C2D19' }}>
              {data?.stats?.totalInterests ?? 0}
            </div>
            <small style={{ color: '#64748B', fontSize: '11px' }}>
              Mutual expressions
            </small>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
              <span>Shortlists Recorded</span>
              <Award size={18} color="#2563EB" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D4ED8' }}>
              {data?.stats?.totalShortlists ?? 0}
            </div>
            <small style={{ color: '#64748B', fontSize: '11px' }}>
              Saved by families
            </small>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'members' ? '#0B241D' : '#64748B',
              borderBottom: activeTab === 'members' ? '3px solid #0B241D' : '3px solid transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Users size={16} />
            <span>Member Directory & Verification ({members.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vip')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'vip' ? '#0B241D' : '#64748B',
              borderBottom: activeTab === 'vip' ? '3px solid #0B241D' : '3px solid transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Crown size={16} />
            <span>VIP Concierge Leads ({data?.vipConsultations?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'database' ? '#0B241D' : '#64748B',
              borderBottom: activeTab === 'database' ? '3px solid #0B241D' : '3px solid transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Database size={16} />
            <span>Atlas DB Diagnostics</span>
          </button>
        </div>

        {/* TAB 1: MEMBERS DIRECTORY */}
        {activeTab === 'members' && (
          <div>
            {/* Search & Filters Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '280px', maxWidth: '480px' }}>
                <input
                  type="text"
                  placeholder="Search by name, email, Gotra, city, or profile code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(['ALL', 'VERIFIED', 'UNVERIFIED', 'ACTIVE', 'BLOCKED'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: statusFilter === s ? '1px solid #0B241D' : '1px solid #E2E8F0',
                      background: statusFilter === s ? '#0B241D' : '#ffffff',
                      color: statusFilter === s ? '#ffffff' : '#64748B',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', overflowX: 'auto', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '14px 16px' }}>Member Profile</th>
                    <th style={{ padding: '14px 16px' }}>Code</th>
                    <th style={{ padding: '14px 16px' }}>Gotra & Mool</th>
                    <th style={{ padding: '14px 16px' }}>Location</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px' }}>Verification Badge</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                        No members found in MongoDB Atlas matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m: any) => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', background: '#E2E8F0', flexShrink: 0 }}>
                              <Image src={m.avatar} alt={m.name} fill style={{ objectFit: 'cover' }} sizes="36px" />
                            </div>
                            <div>
                              <strong style={{ display: 'block', color: '#0F172A' }}>{m.name}</strong>
                              <small style={{ color: '#64748B', fontSize: '11px' }}>{m.email}</small>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                          <Link href={`/profiles/${m.profileCode}`} target="_blank" style={{ color: '#0B241D', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span>{m.profileCode}</span>
                            <ExternalLink size={12} color="#94A3B8" />
                          </Link>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <div>
                            <span style={{ color: '#8C2D19', fontWeight: 600 }}>{m.gotra || 'Not set'}</span>
                            <small style={{ color: '#64748B', display: 'block' }}>Mool: {m.mool || 'Not set'}</small>
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px', color: '#334155' }}>
                          <div>{m.city}</div>
                          <small style={{ color: '#64748B' }}>Roots: {m.nativeDistrict}</small>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <select
                            value={m.accountStatus}
                            onChange={(e) => handleChangeStatus(m.userId, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: m.accountStatus === 'ACTIVE' ? '#F0FDF4' : m.accountStatus === 'BLOCKED' ? '#FEF2F2' : '#FFFBEB',
                              color: m.accountStatus === 'ACTIVE' ? '#166534' : m.accountStatus === 'BLOCKED' ? '#991B1B' : '#B45309',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="PAUSED">PAUSED</option>
                            <option value="BLOCKED">BLOCKED</option>
                          </select>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleVerify(m.id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              border: m.verified ? '1px solid #86EFAC' : '1px solid #CBD5E1',
                              background: m.verified ? '#DCFCE7' : '#F1F5F9',
                              color: m.verified ? '#166534' : '#64748B',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            title="Click to toggle verification checkmark"
                          >
                            <ShieldCheck size={13} />
                            <span>{m.verified ? 'Verified ✓' : 'Unverified'}</span>
                          </button>
                        </td>

                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(m.id, m.userId, m.name)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid #FCA5A5',
                              background: '#FEF2F2',
                              color: '#991B1B',
                              fontSize: '11px',
                              fontWeight: 650,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            title="Delete permanently from MongoDB Atlas"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: VIP CONCIERGE LEADS */}
        {activeTab === 'vip' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', overflowX: 'auto', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#0F172A' }}>
                Milan Select (VIP) Matchmaking Inquiries
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                Submissions from high-intent families requesting private relationship manager assistance.
              </p>
            </div>

            {(!data?.vipConsultations || data.vipConsultations.length === 0) ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px' }}>
                No VIP consultations received yet. Test by submitting the consultation form at <Link href="/milan-select" style={{ color: '#8C2D19', fontWeight: 600 }}>/milan-select</Link>.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Candidate Name</th>
                    <th style={{ padding: '12px 14px' }}>Guardian / Contact</th>
                    <th style={{ padding: '12px 14px' }}>Phone / Email</th>
                    <th style={{ padding: '12px 14px' }}>Preferred Time</th>
                    <th style={{ padding: '12px 14px' }}>Notes / Preferences</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.vipConsultations.map((lead: any) => (
                    <tr key={lead._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                        {lead.candidateName}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div>{lead.guardianName || 'Self'}</div>
                        <small style={{ color: '#64748B' }}>{lead.relationship}</small>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div><strong>{lead.phone}</strong></div>
                        <small style={{ color: '#64748B' }}>{lead.email}</small>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>
                        {lead.preferredTime}
                      </td>
                      <td style={{ padding: '12px 14px', maxWidth: '280px', fontSize: '12px', color: '#64748B' }}>
                        {lead.notes || 'No specific notes'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <select
                          value={lead.status || 'NEW'}
                          onChange={(e) => handleUpdateVipStatus(lead._id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: lead.status === 'CONVERTED' ? '#DCFCE7' : lead.status === 'CONTACTED' ? '#FEF3C7' : '#F1F5F9',
                            color: lead.status === 'CONVERTED' ? '#166534' : lead.status === 'CONTACTED' ? '#92400E' : '#334155',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CONVERTED">CONVERTED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: ATLAS DATABASE DIAGNOSTICS */}
        {activeTab === 'database' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '28px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#0F172A' }}>
              Live MongoDB Atlas Diagnostic Health
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Target Cluster
                </strong>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>
                  Not exposed to the browser
                </span>
              </div>

              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Database
                </strong>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>
                  Not exposed to the browser
                </span>
              </div>

              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Connection Security
                </strong>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>
                  SSL / TLS Enforced · Connection Pooling Active
                </span>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', fontSize: '13px', lineHeight: 1.6 }}>
              <strong>Notice:</strong> All dummy fallback data has been removed from the platform. The application reads and writes directly to your live MongoDB Atlas collections (`users`, `profiles`, `shortlists`, `interests`, `vip_consultations`).
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

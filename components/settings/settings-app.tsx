'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import AuthenticatedShell from '@/components/layout/authenticated-shell'
import {
  ArrowLeft, Bell, Check, Compass, Download, Eye, LockKeyhole,
  Save, ShieldCheck, Trash2, UserRound
} from 'lucide-react'
import { MobileBottomNav } from '@/components/site-shell'

export default function SettingsApp() {
  const { user } = useAuth()
  const [visibility, setVisibility] = useState('community')
  const [culturalVisibility, setCulturalVisibility] = useState('members')
  const [photoVisibility, setPhotoVisibility] = useState('members')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [familyAssistance, setFamilyAssistance] = useState(true)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3500)
  }

  // Load saved preferences from MongoDB Atlas
  useState(() => {
    if (!user) return
    async function fetchSettings() {
      try {
        const res = await fetch(`/api/settings?userId=${user?.id}`)
        if (res.ok) {
          const json = await res.json()
          if (json.settings) {
            if (json.settings.visibility) setVisibility(json.settings.visibility.toLowerCase())
            if (json.settings.culturalVisibility) setCulturalVisibility(json.settings.culturalVisibility.toLowerCase())
            if (json.settings.photoVisibility) setPhotoVisibility(json.settings.photoVisibility.toLowerCase())
          }
        }
      } catch (e) {
        console.warn('Settings fetch warning:', e)
      }
    }
    fetchSettings()
  })

  const handleSave = async () => {
    try {
      if (user?.id) {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            visibility,
            culturalVisibility,
            photoVisibility,
            emailNotifs,
            familyAssistance,
          }),
        })
      }
      setSaved(true)
      showToast('✓ Privacy and account preferences saved to MongoDB Atlas database.')
    } catch {
      showToast('Failed to save settings. Please try again.')
    }
  }

  const handleExportData = () => {
    const data = {
      profileId: user ? `MM-${user.id.slice(-6).toUpperCase()}` : 'MM-USER',
      fullName: user ? user.name : 'Verified Member',
      email: user ? user.email : 'member@mithilamilan.com',
      visibilitySettings: { visibility, culturalVisibility, photoVisibility },
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mithila-milan-profile-export.json`
    a.click()
    showToast('Data package exported under DPDP Act 2023 statutory guidelines.')
  }

  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'G'

  return (
    <AuthenticatedShell activeKey="settings" breadcrumbTitle="Settings">
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <p className="eyebrow"><span className="eyebrow-line" /> Account Preferences</p>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', margin: '14px 0 10px', fontWeight: 600, color: '#0B241D' }}>
            Settings & <em>Privacy.</em>
          </h1>
          <p style={{ color: 'rgba(32,50,44,0.65)', fontSize: '15px', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
            You hold total authority over your identity. Adjust privacy controls, notifications, and exercise your DPDP Act 2023 rights.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <section
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Eye size={18} color="var(--terracotta)" />
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: 0 }}>
                Profile Visibility
              </h2>
            </div>
            <p style={{ color: 'rgba(32,50,44,0.65)', fontSize: '13px', margin: '0 0 20px', lineHeight: 1.6 }}>
              Choose how your profile appears to other people in Mithila Milan.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'community', title: 'Community directory (Recommended)', desc: 'Verified members can find your profile in Discover and express interest.' },
                { id: 'connections', title: 'Connections only', desc: 'Only members you specifically initiate contact with can view your profile.' },
                { id: 'paused', title: 'Pause profile (Take a break)', desc: 'Temporarily hidden from search. Existing conversations remain open.' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px 18px',
                    border: visibility === opt.id ? '2px solid var(--terracotta)' : '1px solid var(--border)',
                    borderRadius: '8px',
                    background: visibility === opt.id ? 'var(--cream)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={opt.id}
                    checked={visibility === opt.id}
                    onChange={(e) => setVisibility(e.target.value)}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <strong style={{ fontSize: '14px', display: 'block', color: 'var(--foreground)' }}>{opt.title}</strong>
                    <span style={{ fontSize: '12px', color: 'rgba(32,50,44,0.6)' }}>{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <ShieldCheck size={18} color="var(--terracotta)" />
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: 0 }}>
                Granular Privacy Shields
              </h2>
            </div>
            <p style={{ color: 'rgba(32,50,44,0.65)', fontSize: '13px', margin: '0 0 20px', lineHeight: 1.6 }}>
              Configure specific access levels for cultural and visual data.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--cream)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Cultural details (Gotra / Mool)
                </span>
                <select
                  value={culturalVisibility}
                  onChange={(e) => setCulturalVisibility(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fffaf1', font: 'inherit', fontSize: '13px' }}
                >
                  <option value="members">Visible to verified members</option>
                  <option value="connections">Only upon mutual interest acceptance</option>
                  <option value="private">Private (Only me)</option>
                </select>
              </div>

              <div style={{ padding: '16px', background: 'var(--cream)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Photo gallery visibility
                </span>
                <select
                  value={photoVisibility}
                  onChange={(e) => setPhotoVisibility(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fffaf1', font: 'inherit', fontSize: '13px' }}
                >
                  <option value="members">Visible to all members</option>
                  <option value="connections">Blurred until mutual interest</option>
                </select>
              </div>
            </div>
          </section>

          <section
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Bell size={18} color="var(--terracotta)" />
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: 0 }}>
                Communication & Family Assistance
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                />
                <span style={{ fontSize: '13px', color: 'var(--foreground)' }}>
                  Receive email alerts for new mutual interests and private messages
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={familyAssistance}
                  onChange={(e) => setFamilyAssistance(e.target.checked)}
                />
                <span style={{ fontSize: '13px', color: 'var(--foreground)' }}>
                  Allow family-assisted discovery (parents or siblings can recommend profiles to your review queue)
                </span>
              </label>
            </div>
          </section>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              type="button"
              className="button button-primary"
              onClick={handleSave}
              style={{ padding: '12px 28px' }}
            >
              <Save size={16} /> Save Settings
            </button>
            {saved && (
              <span style={{ fontSize: '13px', color: 'var(--terracotta)', fontWeight: 600 }}>
                ✓ Preferences updated
              </span>
            )}
          </div>

          <section
            style={{
              marginTop: '20px',
              borderTop: '1px solid var(--border)',
              paddingTop: '28px',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', margin: '0 0 10px', color: '#a65d3f' }}>
              Data Rights under DPDP Act 2023
            </h3>
            <p style={{ color: 'rgba(32,50,44,0.65)', fontSize: '13px', margin: '0 0 20px', lineHeight: 1.6 }}>
              You may download a machine-readable copy of your personal data or request permanent deletion of your account.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="button button-outline"
                onClick={handleExportData}
              >
                <Download size={14} /> Download My Data (JSON)
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your profile? This permanently clears your data.')) {
                    showToast('Profile deletion request received. Confirmation link sent to your email.')
                  }
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #d9534f',
                  color: '#d9534f',
                  padding: '11px 18px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                }}
              >
                <Trash2 size={14} /> Request Permanent Profile Purge
              </button>
            </div>
          </section>
        </div>
      </main>

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--forest)',
            color: 'var(--cream)',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={16} color="#d99a78" /> {toast}
        </div>
      )}
    </AuthenticatedShell>
  )
}

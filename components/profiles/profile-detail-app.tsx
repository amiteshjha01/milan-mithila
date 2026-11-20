'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import {
  ArrowLeft, Ban, Bookmark, Check, ChevronDown, ChevronLeft, ChevronRight,
  Copy, Eye, Flag, Heart, Info, LockKeyhole, MapPin, MessageCircle, MoreHorizontal,
  Send, Share2, ShieldCheck, UserRound, Users, Volume2, VolumeX, Play, Pause,
  Sparkles, Star, Award, Compass, X
} from 'lucide-react'
import { getProfileDetail, profileDetails, type DetailValue, type ProfileDetail } from '@/lib/mock-profile-details'
import { Loader2 } from 'lucide-react'
import { MobileBottomNav } from '@/components/site-shell'
import { useAuth } from '@/lib/auth-context'

function DetailPhoto({ src, alt, className = '', id = '' }: { src?: string; alt: string; className?: string; id?: string }) {
  return (
    <div className={`pd-photo ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {src ? (
        <>
          <Image src={src} alt={alt} fill sizes="(max-width: 800px) 100vw, 460px" style={{ objectFit: 'cover' }} />
          {/* Dynamic Photo Watermark Shield (DPDP Act & Anti-misuse) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '14px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.4) 100%)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                ✦ MITHILA MILAN SHIELD
              </span>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                {id}
              </span>
            </div>
            <div style={{ textAlign: 'center', opacity: 0.28, transform: 'rotate(-20deg)', fontSize: '11px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.18em', userSelect: 'none' }}>
              CONFIDENTIAL · DO NOT COPY
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', textAlign: 'right', letterSpacing: '0.04em' }}>
              DPDP Act 2023 Protected
            </div>
          </div>
        </>
      ) : (
        <div className="pd-photo-locked">
          <LockKeyhole />
          <span>Photo restricted</span>
          <small>The member shares photos after mutual consent.</small>
        </div>
      )}
    </div>
  )
}

function StatusPill({ children, tone = 'sage' }: { children: React.ReactNode; tone?: 'sage' | 'ochre' | 'terracotta' }) {
  return <span className={`pd-status-pill ${tone}`}>{children}</span>
}

function VoicePromptPlayer({ prompt }: { prompt?: { title: string; duration: string; quote: string } }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + 4
        })
      }, 500)
    }
    return () => clearInterval(timer)
  }, [isPlaying])

  if (!prompt) return null

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(166,93,63,0.06) 0%, rgba(214,173,101,0.12) 100%)',
        border: '1px solid rgba(166,93,63,0.25)',
        borderRadius: '12px',
        padding: '16px 20px',
        margin: '18px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isPlaying ? '#22c55e' : 'var(--terracotta)' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--terracotta)', textTransform: 'uppercase' }}>
            Voice Introduction · {prompt.duration}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'rgba(32,50,44,0.55)', fontStyle: 'italic' }}>
          Spoken by member
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause voice prompt' : 'Play voice prompt'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--terracotta)',
            color: '#fffaf1',
            border: 'none',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(166,93,63,0.25)',
            transition: 'transform 0.2s ease',
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ display: 'block', fontSize: '13px', color: 'var(--foreground)', marginBottom: '4px' }}>
            {prompt.title}
          </strong>

          {/* Audio Waveform Visualizer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '22px' }}>
            {[40, 65, 80, 50, 95, 75, 45, 90, 60, 85, 100, 70, 55, 80, 40, 65].map((h, i) => {
              const active = (i / 16) * 100 <= progress
              return (
                <span
                  key={i}
                  style={{
                    width: '3px',
                    height: `${isPlaying ? Math.max(20, Math.sin(Date.now() / 200 + i) * 100) : h}%`,
                    maxHeight: '20px',
                    background: active ? 'var(--terracotta)' : 'rgba(166,93,63,0.25)',
                    borderRadius: '2px',
                    transition: 'all 0.15s ease',
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      <p style={{ margin: '10px 0 0', fontSize: '12px', color: 'rgba(32,50,44,0.7)', fontStyle: 'italic', lineHeight: 1.5 }}>
        {prompt.quote}
      </p>
    </div>
  )
}

function InfoSection({ id, eyebrow, title, children, openSections, toggle }: { id: string; eyebrow: string; title: string; children: React.ReactNode; openSections: string[]; toggle: (id: string) => void }) {
  const open = openSections.includes(id)
  return (
    <section className={`pd-section ${open ? 'is-open' : ''}`} id={id}>
      <button className="pd-section-heading" onClick={() => toggle(id)} aria-expanded={open}>
        <span>
          <small>{eyebrow}</small>
          <strong>{title}</strong>
        </span>
        <ChevronDown />
      </button>
      {open && <div className="pd-section-content">{children}</div>}
    </section>
  )
}

function DetailGrid({ items }: { items: DetailValue[] }) {
  return (
    <div className="pd-detail-grid">
      {items.map((item) => (
        <div className="pd-detail-item" key={item.label}>
          <span>{item.label}</span>
          <strong className={item.status === 'not-disclosed' ? 'is-muted' : ''}>
            {item.value || (item.status === 'not-applicable' ? 'Not applicable' : 'Prefer not to disclose')}
          </strong>
        </div>
      ))}
    </div>
  )
}

function ActionModal({ type, profile, onClose, onConfirm }: { type: 'interest' | 'report' | 'block'; profile: ProfileDetail; onClose: () => void; onConfirm: (message: string) => void }) {
  const [reason, setReason] = useState('The profile feels incomplete')
  if (type === 'interest') {
    return (
      <div className="pd-modal-backdrop" onMouseDown={onClose}>
        <div className="pd-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
          <div className="pd-modal-icon"><Heart /></div>
          <span className="pd-kicker">A thoughtful hello</span>
          <h2>Send interest to {profile.name}?</h2>
          <p>Your interest will be sent directly to {profile.name}. Conversations only begin when both individuals agree.</p>
          <div className="pd-modal-actions">
            <button className="pd-modal-secondary" onClick={onClose}>Not yet</button>
            <button className="pd-modal-primary" onClick={() => onConfirm(`Interest sent to ${profile.name}! They will be notified.`)}><Send /> Send interest</button>
          </div>
        </div>
      </div>
    )
  }
  if (type === 'block') {
    return (
      <div className="pd-modal-backdrop" onMouseDown={onClose}>
        <div className="pd-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
          <div className="pd-modal-icon is-warning"><Ban /></div>
          <span className="pd-kicker">Your comfort comes first</span>
          <h2>Block {profile.name}?</h2>
          <p>This will hide this profile from your discovery and prevent any future messages.</p>
          <div className="pd-modal-actions">
            <button className="pd-modal-secondary" onClick={onClose}>Cancel</button>
            <button className="pd-modal-primary is-danger" onClick={() => onConfirm(`${profile.name} is now hidden from your space.`)}><Ban /> Block profile</button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="pd-modal-backdrop" onMouseDown={onClose}>
      <div className="pd-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button className="pd-modal-x" onClick={onClose} aria-label="Close report dialog"><X /></button>
        <div className="pd-modal-icon is-warning"><Flag /></div>
        <span className="pd-kicker">Help us keep this space thoughtful</span>
        <h2>Report this profile</h2>
        <p>Choose a reason for community review. Our grievance desk handles every report with discretion.</p>
        <div className="pd-report-options">
          {['The profile feels incomplete', 'Something seems inaccurate', 'Commercial or dowry solicitation', 'I feel uncomfortable', 'Other'].map((option) => (
            <label key={option}>
              <input type="radio" name="report-reason" checked={reason === option} onChange={() => setReason(option)} />
              {option}
            </label>
          ))}
        </div>
        <div className="pd-modal-actions">
          <button className="pd-modal-secondary" onClick={onClose}>Cancel</button>
          <button className="pd-modal-primary is-danger" onClick={() => onConfirm(`Report recorded for grievance review: ${reason}.`)}><Flag /> Submit report</button>
        </div>
      </div>
    </div>
  )
}

function GalleryViewer({ profile, index, setIndex, onClose }: { profile: ProfileDetail; index: number; setIndex: (index: number) => void; onClose: () => void }) {
  const current = profile.gallery[index]
  return (
    <div className="pd-gallery-viewer" role="dialog" aria-modal="true" aria-label="Full screen photo viewer">
      <button className="pd-gallery-close" onClick={onClose} aria-label="Close photo viewer"><X /></button>
      <button className="pd-gallery-arrow left" onClick={() => setIndex((index - 1 + profile.gallery.length) % profile.gallery.length)} aria-label="Previous photo"><ChevronLeft /></button>
      <div className="pd-gallery-large">
        <DetailPhoto src={current.src} alt={current.alt} className="is-viewer" id={profile.id} />
        <span>{index + 1} / {profile.gallery.length}</span>
      </div>
      <button className="pd-gallery-arrow right" onClick={() => setIndex((index + 1) % profile.gallery.length)} aria-label="Next photo"><ChevronRight /></button>
    </div>
  )
}

function ProfileGallery({ profile }: { profile: ProfileDetail }) {
  const [active, setActive] = useState(0)
  const [viewer, setViewer] = useState(false)
  const current = profile.gallery[active]
  return (
    <div className="pd-gallery">
      <button className="pd-main-gallery" onClick={() => current.src && setViewer(true)} aria-label={current.src ? 'Open photo fullscreen' : 'Photo unavailable'}>
        <DetailPhoto src={current.src} alt={current.alt} className="is-main" id={profile.id} />
        {current.src && <span className="pd-expand"><Eye /> View fullscreen</span>}
      </button>
      <div className="pd-thumbnails">
        {profile.gallery.map((photo, index) => (
          <button key={`${photo.alt}-${index}`} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)} aria-label={`View photo ${index + 1}`}>
            <DetailPhoto src={photo.src} alt={photo.alt} id={profile.id} />
            {!photo.src && <LockKeyhole />}
          </button>
        ))}
      </div>
      {viewer && <GalleryViewer profile={profile} index={active} setIndex={setActive} onClose={() => setViewer(false)} />}
    </div>
  )
}

function CulturalSection({ profile, openSections, toggle }: { profile: ProfileDetail; openSections: string[]; toggle: (id: string) => void }) {
  const cultural = [
    { label: 'Community', value: profile.community },
    { label: 'Sub-community', value: profile.subCommunity },
    { label: 'Gotra', value: profile.gotra },
    { label: 'Mool', value: profile.mool },
    { label: 'Ancestral village', value: profile.ancestralVillage },
    { label: 'Kul', value: profile.kul },
    { label: 'Pravara', value: profile.pravara },
    { label: 'Kuldevi / Kuldevta', value: profile.kuldevi },
    { label: 'Panji availability', value: profile.panjiAvailability }
  ]

  return (
    <InfoSection id="cultural" eyebrow="Your Mithila roots" title="Cultural information" openSections={openSections} toggle={toggle}>
      <div className="pd-cultural-intro">
        <ShieldCheck />
        <div>
          <strong>Held with scholarly care.</strong>
          <p>These cultural markers are shared voluntarily by members. They are designed to facilitate dignified family dialogue and are never used for exclusionary rejection.</p>
        </div>
      </div>
      <DetailGrid items={cultural.map((item) => ({ ...item, status: item.value?.toLowerCase().includes('prefer') || item.value?.toLowerCase().includes('not disclosed') ? 'not-disclosed' : undefined }))} />
      {profile.lineageInformation && (
        <div className="pd-quoted-note">
          <span>Family lineage information</span>
          <p>{profile.lineageInformation}</p>
        </div>
      )}
      <div className="pd-cultural-footnote">
        <Info /> Mithila Milan respects hereditary Panjikars and genealogists without claiming false automated authority.
      </div>
    </InfoSection>
  )
}

/* ==========================================================================
   FEATURE 2: ASHTAKOOT GUNA MILAN & LINEAGE HARMONY SECTION
   ========================================================================== */
function GunaMilanSection({ profile, openSections, toggle }: { profile: ProfileDetail; openSections: string[]; toggle: (id: string) => void }) {
  const guna = profile.gunaMilan
  if (!guna) return null

  return (
    <InfoSection id="guna-milan" eyebrow="Vedic Astrological Harmony" title="Kundali & Guna Milan (कुंडली गुण मिलन)" openSections={openSections} toggle={toggle}>
      <div
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--terracotta)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ✦ Total Compatibility Score
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '38px', fontWeight: 700, color: 'var(--foreground)' }}>
                {guna.score}
              </span>
              <span style={{ fontSize: '18px', color: 'rgba(32,50,44,0.5)', fontWeight: 500 }}>
                / {guna.maxScore} Gunas
              </span>
            </div>
            <div style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>
              {guna.verdict}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'inline-block', background: 'rgba(32,50,44,0.08)', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, color: 'var(--forest)' }}>
              Manglik Status: <strong>{guna.manglikStatus}</strong>
            </span>
            <small style={{ display: 'block', fontSize: '11px', color: 'rgba(32,50,44,0.5)', marginTop: '4px' }}>
              Sagotra Avoidance: Verified Non-Sagotra
            </small>
          </div>
        </div>

        {/* 8-Guna Breakdown Table */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px' }}>
            Detailed Ashtakoot Breakdown:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {guna.details.map((item) => (
              <div
                key={item.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 80px minmax(0, 1fr)',
                  gap: '12px',
                  alignItems: 'center',
                  fontSize: '12px',
                  padding: '8px 12px',
                  background: 'var(--paper)',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <strong>{item.name}</strong>
                  <small style={{ display: 'block', color: 'rgba(32,50,44,0.5)', fontSize: '10px' }}>{item.aspect}</small>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--terracotta)' }}>
                  {item.obtained} / {item.maximum} pts
                </div>
                <div style={{ color: 'rgba(32,50,44,0.7)', fontSize: '11px' }}>
                  {item.interpretation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pd-cultural-footnote">
        <Info /> Kundali details are calculated based on voluntary birth parameters. We believe mutual kindness, values, and character remain the ultimate foundation of marriage.
      </div>
    </InfoSection>
  )
}

/* ==========================================================================
   FEATURE 3: FAMILY COMPANION & ELDER VIEW MODE
   ========================================================================== */
function FamilyCompanionSection({ profile, openSections, toggle }: { profile: ProfileDetail; openSections: string[]; toggle: (id: string) => void }) {
  const family = profile.familyCompanion
  if (!family) return null

  return (
    <InfoSection id="family-companion" eyebrow="Parent & Elder Perspectives" title="Family Companion Overview (अभिभावक दृष्टि)" openSections={openSections} toggle={toggle}>
      <div
        style={{
          background: 'rgba(217,154,120,0.08)',
          border: '1px solid rgba(166,93,63,0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Users size={18} color="var(--terracotta)" />
          <h3 style={{ margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', fontWeight: 600 }}>
            Family Background & Lineage Notes
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '18px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'rgba(32,50,44,0.6)', fontWeight: 600, display: 'block' }}>Ancestral Origin:</span>
            <strong style={{ fontSize: '14px', color: 'var(--foreground)' }}>{family.ancestralMoolOrigin}</strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'rgba(32,50,44,0.6)', fontWeight: 600, display: 'block' }}>Village Settlement:</span>
            <strong style={{ fontSize: '14px', color: 'var(--foreground)' }}>{family.villageSettlement}</strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'rgba(32,50,44,0.6)', fontWeight: 600, display: 'block' }}>Parental Alignment:</span>
            <strong style={{ fontSize: '14px', color: 'var(--foreground)' }}>{family.parentalApprovalStatus}</strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'rgba(32,50,44,0.6)', fontWeight: 600, display: 'block' }}>Preferred Elder Contact:</span>
            <strong style={{ fontSize: '14px', color: 'var(--foreground)' }}>{family.preferredElderContactMode}</strong>
          </div>
        </div>

        <div style={{ padding: '14px 16px', background: 'var(--paper)', borderRadius: '8px', borderLeft: '3px solid var(--terracotta)', fontSize: '13px', lineHeight: 1.7, color: 'rgba(32,50,44,0.8)' }}>
          <strong>Elder Narrative:</strong> {family.elderSummary}
        </div>

        <p style={{ margin: '14px 0 0', fontSize: '12px', color: 'rgba(32,50,44,0.65)', fontStyle: 'italic' }}>
          “{family.familyValuesReflection}”
        </p>
      </div>
      <div className="pd-cultural-footnote">
        <ShieldCheck /> Family Companion Mode allows parents to review context while safeguarding seeker privacy. Personal chat history and mobile numbers are never displayed.
      </div>
    </InfoSection>
  )
}

function SimilarCard({ profile, onOpen }: { profile: any; onOpen: (id: string) => void }) {
  return (
    <button className="pd-similar-card" onClick={() => onOpen(profile.id)}>
      <div className="pd-similar-photo">
        <Image src={profile.image || profile.photos?.[0] || '/images/placeholder-user.jpg'} alt={`${profile.name} profile photograph`} fill sizes="180px" style={{ objectFit: 'cover' }} />
      </div>
      <div>
        <strong>{profile.name || profile.displayName}</strong>
        <span>{profile.age} years · {profile.city || profile.currentCity}</span>
        <small>{profile.nativeDistrict} · {profile.profession}</small>
      </div>
      <span className="pd-similar-arrow">↗</span>
    </button>
  )
}

export default function ProfileDetailApp({ profileId }: { profileId: string }) {
  const { user } = useAuth()
  const [dbProfile, setDbProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'seeker' | 'family'>('seeker')
  const [openSections, setOpenSections] = useState(['personal', 'career', 'family', 'cultural', 'family-companion', 'guna-milan', 'preferences'])
  const [interestSent, setInterestSent] = useState(false)
  const [shortlisted, setShortlisted] = useState(false)
  const [modal, setModal] = useState<'interest' | 'report' | 'block' | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [dbRelated, setDbRelated] = useState<any[]>([])

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        if (user?.id) queryParams.set('currentUserId', user.id)
        if (user?.name) queryParams.set('currentUserName', user.name)
        if (user?.gender) queryParams.set('currentUserGender', user.gender)
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''

        const [res, listRes] = await Promise.all([
          fetch(`/api/profiles/${profileId}`),
          fetch(`/api/profiles${queryString}`)
        ])

        if (res.ok) {
          const data = await res.json()
          if (data.ok && data.profile) {
            setDbProfile(data.profile)
            setShortlisted(Boolean(data.profile.shortlisted))
            setInterestSent(Boolean(data.profile.interested))
          }
        } else {
          // Check local fallback
          const fallback = getProfileDetail(profileId)
          if (fallback) {
            setDbProfile(fallback)
            setShortlisted(fallback.shortlisted || false)
          }
        }

        if (listRes.ok) {
          const listData = await listRes.json()
          setDbRelated((listData.profiles || []).filter((p: any) => (p.profileCode || p.id || p._id) !== profileId).slice(0, 4))
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
        const fallback = getProfileDetail(profileId)
        if (fallback) setDbProfile(fallback)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [profileId, user?.id, user?.name, user?.gender])

  const profile: ProfileDetail | null = useMemo(() => {
    if (!dbProfile) return null
    if (dbProfile.gallery) return dbProfile as ProfileDetail

    // Transform MongoDB profile model to ProfileDetail interface
    const avatarImg = dbProfile.photos?.[0] || dbProfile.avatar || '/images/placeholder-user.jpg'
    return ({
      id: dbProfile.id || dbProfile.profileCode,
      name: dbProfile.name || dbProfile.displayName,
      age: dbProfile.age,
      city: dbProfile.city || dbProfile.currentCity,
      state: 'Bihar',
      country: dbProfile.country || 'India',
      nativeDistrict: dbProfile.nativeDistrict,
      profession: dbProfile.profession,
      education: dbProfile.education || dbProfile.highestQualification,
      image: avatarImg,
      initials: dbProfile.initials || 'MM',
      availability: 'Available for introductions',
      tone: 'sage',
      verified: Boolean(dbProfile.verified),
      verificationLabel: dbProfile.verificationLabel || (dbProfile.verified ? 'Verified Member' : 'Member profile'),
      height: dbProfile.height || 'Not disclosed',
      community: dbProfile.community || 'Maithil community',
      subCommunity: dbProfile.subCommunity || 'Not disclosed',
      gotra: dbProfile.gotra || 'Not disclosed',
      mool: dbProfile.mool || 'Not disclosed',
      ancestralVillage: dbProfile.ancestralVillage || dbProfile.nativeDistrict || 'Not disclosed',
      familyValues: dbProfile.familyValues || 'Not disclosed',
      familySummary: dbProfile.familySummary || 'Family details shared upon connection.',
      introduction: dbProfile.introduction || '',
      dateOfBirth: dbProfile.dateOfBirth || 'Prefer not to disclose',
      maritalStatus: dbProfile.maritalStatus || 'Not disclosed',
      degree: dbProfile.degree || dbProfile.education || dbProfile.highestQualification || 'Not disclosed',
      employer: dbProfile.company || dbProfile.employer || '',
      sector: dbProfile.workingSector || dbProfile.sector || 'Not disclosed',
      kul: dbProfile.kul || 'Not disclosed',
      pravara: dbProfile.pravara || 'Not disclosed',
      languages: dbProfile.languages || ['Maithili'],
      gallery: (dbProfile.photos && dbProfile.photos.length > 0 ? dbProfile.photos : [avatarImg]).map((src: string) => ({
        src,
        alt: dbProfile.name,
        visibility: 'shared',
      })),
      motherTongue: dbProfile.motherTongue || 'Maithili',
      professionalIntroduction: dbProfile.introduction || '',
      siblings: dbProfile.siblings || 'Not disclosed',
      panjiAvailability: dbProfile.panjiAvailability || 'Not disclosed',
      partnerExpectations: [
        ...(dbProfile.partnerPreferences?.ageRange ? [{ label: 'Age Range', value: dbProfile.partnerPreferences.ageRange }] : []),
        ...(dbProfile.partnerPreferences?.education ? [{ label: 'Education', value: dbProfile.partnerPreferences.education }] : []),
        ...(dbProfile.partnerPreferences?.profession ? [{ label: 'Profession', value: dbProfile.partnerPreferences.profession }] : []),
        ...(dbProfile.partnerPreferences?.location ? [{ label: 'Location', value: dbProfile.partnerPreferences.location }] : []),
        { label: 'Diet', value: dbProfile.diet || 'Open to conversation' },
        { label: 'Relocation', value: dbProfile.relocation || 'Open to discussion' },
      ],
      familyCompanion: dbProfile.familyCompanion || undefined,
      gunaMilan: dbProfile.gunaMilan || undefined,
    } as unknown as ProfileDetail)
  }, [dbProfile])

  if (loading) {
    return (
      <div className="pd-missing" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 16px', color: 'var(--terracotta)' }} />
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', margin: '0 0 8px' }}>Loading Verified Profile...</h2>
          <p style={{ color: 'rgba(32,50,44,0.6)', fontSize: '13px' }}>Fetching authenticated member details from database.</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="pd-missing">
        <div>
          <span className="pd-kicker">MM / Profile unavailable</span>
          <h1>This profile has stepped out of view.</h1>
          <p>It may be private, paused, or no longer available in the database.</p>
          <Link href="/discover" className="pd-modal-primary">Return to Discover</Link>
        </div>
      </div>
    )
  }

  const related: any[] = dbRelated.length > 0
    ? dbRelated.map((p: any) => ({
        id: p.profileCode || p.id || p._id,
        name: p.name,
        age: p.age,
        city: p.city || p.currentCity || 'Mithila',
        nativeDistrict: p.nativeDistrict,
        profession: p.profession || p.role || 'Member',
        image: p.avatar || '/images/placeholder-user.jpg',
      }))
    : profileDetails.filter((item) => item.id !== profile.id).slice(0, 4)

  const toggleSection = (id: string) => setOpenSections((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 4200) }

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: `${profile.name} · Mithila Milan`, url }).catch(() => undefined)
      showToast('Share preview opened.')
    } else {
      await navigator.clipboard?.writeText(url)
      showToast('Profile link copied to clipboard.')
    }
  }

  const confirmModal = (message: string) => {
    if (modal === 'interest') setInterestSent(true)
    if (modal === 'block') setHidden(true)
    setModal(null)
    showToast(message)
  }

  if (hidden) {
    return (
      <div className="pd-missing">
        <div>
          <span className="pd-kicker">Profile hidden</span>
          <h1>You are in control of your space.</h1>
          <p>{profile.name}&apos;s profile is hidden for this session.</p>
          <Link href="/discover" className="pd-modal-primary">Return to Discover</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pd-page">
      <header className="pd-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/discover" className="pd-back"><ArrowLeft /> Back to Discover</Link>
          <Link href="/dashboard" className="pd-back" style={{ opacity: 0.75 }}>My space ↗</Link>
        </div>

        {/* PERSPECTIVE SWITCHER: SEEKER VIEW VS FAMILY COMPANION */}
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--cream)',
            border: '1px solid var(--border)',
            borderRadius: '999px',
            padding: '3px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setViewMode('seeker')
              showToast('Switched to Seeker Perspective.')
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              border: 'none',
              background: viewMode === 'seeker' ? 'var(--terracotta)' : 'transparent',
              color: viewMode === 'seeker' ? '#fffaf1' : 'var(--foreground)',
              fontSize: '11px',
              fontWeight: 650,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <UserRound size={13} /> Seeker View
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('family')
              showToast('Switched to Family Companion View (Elder Perspective).')
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              border: 'none',
              background: viewMode === 'family' ? 'var(--forest)' : 'transparent',
              color: viewMode === 'family' ? '#fffaf1' : 'var(--foreground)',
              fontSize: '11px',
              fontWeight: 650,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <Users size={13} /> Family Companion View
          </button>
        </div>

        <div className="pd-header-actions">
          <button onClick={share} aria-label="Share profile"><Share2 /></button>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="More profile actions"><MoreHorizontal /></button>
          {menuOpen && (
            <div className="pd-action-menu">
              <button onClick={() => { setMenuOpen(false); setModal('report') }}><Flag /> Report profile</button>
              <button onClick={() => { setMenuOpen(false); setModal('block') }}><Ban /> Block profile</button>
            </div>
          )}
        </div>
      </header>

      <main className="pd-main">
        {/* Family Companion Notice Banner when in Elder View */}
        {viewMode === 'family' && (
          <div
            style={{
              background: 'var(--forest)',
              color: 'var(--cream)',
              padding: '14px 24px',
              borderRadius: '10px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={18} color="#d99a78" />
              <div>
                <strong style={{ fontSize: '13px', color: '#fffaf1' }}>Family Companion Mode Active</strong>
                <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                  Viewing cultural lineage, ancestral village, and parental background for family discussion.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShortlisted(true)
                showToast(`Bookmarked ${profile.name} for family meeting review.`)
              }}
              style={{
                background: '#d99a78',
                color: 'var(--forest)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Recommend to Child ✦
            </button>
          </div>
        )}

        <section className="pd-intro">
          <ProfileGallery profile={profile} />

          <div className="pd-intro-copy">
            <div className="pd-profile-meta">
              <span>{profile.id}</span>
              <span><Clock3Icon /> {profile.availability}</span>
            </div>

            <div className="pd-title-row">
              <div>
                <h1>{profile.name}</h1>
                <p className="pd-lead-facts">
                  {profile.age} years <i /> {profile.height} <i /> {profile.city}
                </p>
              </div>
              {profile.verified && <StatusPill><ShieldCheck /> {profile.verificationLabel}</StatusPill>}
            </div>

            <div className="pd-location-line">
              <MapPin /> <span>Currently in <strong>{profile.city}</strong> · Native district <strong>{profile.nativeDistrict}</strong></span>
            </div>

            {/* Cultural lineage tag pill */}
            <div style={{ display: 'flex', gap: '8px', margin: '10px 0 16px', flexWrap: 'wrap' }}>
              {profile.gotra && (
                <span style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 650, color: 'var(--terracotta)' }}>
                  गोत्र: {profile.gotra}
                </span>
              )}
              {profile.mool && (
                <span style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 650, color: 'var(--forest)' }}>
                  मूल: {profile.mool}
                </span>
              )}
              {profile.gunaMilan && (
                <span style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 650, color: '#15803d' }}>
                  ✦ {profile.gunaMilan.score}/36 Gunas Compatible
                </span>
              )}
            </div>

            <div className="pd-quick-facts">
              <span><small>Education</small><strong>{profile.education}</strong></span>
              <span><small>Profession</small><strong>{profile.profession}</strong></span>
              <span><small>Mother tongue</small><strong>{profile.motherTongue}</strong></span>
            </div>

            {/* VOICE PROMPT AUDIO COMPONENT */}
            <VoicePromptPlayer prompt={profile.voicePrompt} />

            <blockquote>“{profile.introduction}”</blockquote>

            <div className="pd-intro-actions">
              <button
                className={`pd-primary-action ${interestSent ? 'is-sent' : ''}`}
                onClick={() => interestSent ? showToast('Interest was already sent.') : setModal('interest')}
              >
                {interestSent ? <><Check /> Interest sent</> : <><Heart /> Express interest</>}
              </button>
              <button
                className={`pd-secondary-action ${shortlisted ? 'is-saved' : ''}`}
                onClick={() => {
                  setShortlisted(!shortlisted)
                  showToast(shortlisted ? 'Removed from shortlist.' : 'Added to shortlist.')
                }}
              >
                <Bookmark /> {shortlisted ? 'Shortlisted' : 'Shortlist'}
              </button>
              <button className="pd-secondary-action" onClick={share}><Share2 /> Share</button>
            </div>

            <p className="pd-visibility-note">
              <LockKeyhole /> DPDP Act 2023 Shield: Direct phone numbers and email are never disclosed publicly without explicit mutual consent.
            </p>
          </div>
        </section>

        <div className="pd-body-layout">
          <aside className="pd-aside">
            <div className="pd-trust-card">
              <ShieldCheck />
              <span className="pd-kicker">A considered profile</span>
              <h2>Meet the person, not a checklist.</h2>
              <p>Everything here is shared by {profile.name} at their own pace. Respectful dialogue governs every connection.</p>
              
              <Link
                href={`/messages?user=${profile.id}`}
                className="button pd-conversation-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  background: '#fbf8f2',
                  color: '#20322c',
                  padding: '12px 20px',
                  borderRadius: '999px',
                  fontWeight: 650,
                  fontSize: '13px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                }}
              >
                <MessageCircle size={16} style={{ color: '#a65d3f' }} />
                <span style={{ color: '#20322c' }}>Start a conversation</span>
              </Link>
            </div>

            <div className="pd-aside-links">
              <a href="#personal">Personal information <span>↗</span></a>
              <a href="#cultural">Cultural information <span>↗</span></a>
              <a href="#guna-milan">Kundali & Guna Milan <span>↗</span></a>
              <a href="#family-companion">Family Companion notes <span>↗</span></a>
              <a href="#preferences">Partner expectations <span>↗</span></a>
            </div>
          </aside>

          <div className="pd-sections">
            <InfoSection id="personal" eyebrow="The essentials" title="Personal information" openSections={openSections} toggle={toggleSection}>
              <DetailGrid items={[
                { label: 'Date of birth', value: profile.dateOfBirth },
                { label: 'Age', value: `${profile.age} years` },
                { label: 'Height', value: profile.height },
                { label: 'Marital status', value: profile.maritalStatus },
                { label: 'Mother tongue', value: profile.motherTongue },
                { label: 'Current city', value: profile.city },
                { label: 'Native place', value: profile.nativeDistrict },
                { label: 'Country', value: profile.country },
                { label: 'Languages', value: profile.languages.join(' · ') }
              ]} />
            </InfoSection>

            <InfoSection id="career" eyebrow="The direction" title="Education & career" openSections={openSections} toggle={toggleSection}>
              <DetailGrid items={[
                { label: 'Highest qualification', value: profile.education },
                { label: 'Degree / focus', value: profile.education },
                { label: 'College / university', value: 'Shared privately', status: 'shared' },
                { label: 'Profession', value: profile.profession },
                { label: 'Employer', value: profile.employer, status: profile.employer ? 'shared' : 'not-disclosed' },
                { label: 'Working sector', value: profile.sector },
                { label: 'Work location', value: profile.workLocation || profile.city },
                { label: 'Income', value: profile.income, status: 'not-disclosed' }
              ]} />
              <div className="pd-text-block">
                <span>Professional introduction</span>
                <p>{profile.professionalIntroduction}</p>
              </div>
            </InfoSection>

            <InfoSection id="family" eyebrow="Where they come from" title="Family background" openSections={openSections} toggle={toggleSection}>
              <DetailGrid items={[
                { label: 'Family type', value: profile.familyType },
                { label: "Father's occupation", value: profile.fatherOccupation, status: profile.fatherOccupation ? 'shared' : 'not-disclosed' },
                { label: "Mother's occupation", value: profile.motherOccupation, status: profile.motherOccupation ? 'shared' : 'not-disclosed' },
                { label: 'Siblings', value: profile.siblings },
                { label: 'Family location', value: profile.familyLocation },
                { label: 'Family values', value: profile.familyValues }
              ]} />
              <div className="pd-text-block">
                <span>Family background</span>
                <p>{profile.familyBackground}</p>
              </div>
            </InfoSection>

            {/* CULTURAL LINEAGE SECTION */}
            <CulturalSection profile={profile} openSections={openSections} toggle={toggleSection} />

            {/* FEATURE 2: KUNDALI & ASHTAKOOT GUNA MILAN */}
            <GunaMilanSection profile={profile} openSections={openSections} toggle={toggleSection} />

            {/* FEATURE 3: FAMILY COMPANION & ELDER VIEW SECTION */}
            <FamilyCompanionSection profile={profile} openSections={openSections} toggle={toggleSection} />

            <InfoSection id="preferences" eyebrow="What matters to them" title="Partner expectations" openSections={openSections} toggle={toggleSection}>
              <div className="pd-preference-banner">
                <Heart />
                <span>These are personal preferences, not mandatory eligibility rules.</span>
              </div>
              <DetailGrid items={profile.partnerExpectations} />
            </InfoSection>
          </div>
        </div>

        <section className="pd-related">
          <div className="pd-related-heading">
            <div>
              <span className="pd-kicker">Keep exploring</span>
              <h2>Discover similar <em>profiles.</em></h2>
              <p>These are sample profiles from the same community space, not algorithmically compatible matches.</p>
            </div>
            <Link href="/discover">Back to Discover <span>↗</span></Link>
          </div>
          <div className="pd-similar-grid">
            {related.map((item) => (
              <SimilarCard key={item.id} profile={item} onOpen={(id) => { window.location.href = `/profiles/${id}` }} />
            ))}
          </div>
        </section>
      </main>

      <footer className="pd-footer">
        <span>© 2026 Mithila Milan</span>
        <span>Private by design · Community-led</span>
        <Link href="/discover">Discover more <span>↗</span></Link>
      </footer>

      {toast && <div className="pd-toast"><Check /> {toast}</div>}
      {modal && <ActionModal type={modal} profile={profile} onClose={() => setModal(null)} onConfirm={confirmModal} />}
      <MobileBottomNav />
    </div>
  )
}

function Clock3Icon() {
  return <span className="pd-clock-dot" />
}

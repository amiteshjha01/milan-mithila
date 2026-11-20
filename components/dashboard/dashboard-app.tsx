'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Bookmark, Check, Compass, Eye, Heart, MapPin, FileText, Crown, Sparkles, Loader2
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import AuthenticatedShell from '@/components/layout/authenticated-shell'

function WelcomeCard({ user }: { user: any }) {
  const firstName = user?.name ? user.name.split(' ')[0] : 'there'
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <section className="mm-welcome-card" style={{ overflow: 'hidden' }}>
      <div className="mm-welcome-copy">
        <div className="mm-kicker"><span className="mm-kicker-line" /> {today}</div>
        <h1>Good morning, <em>{firstName}.</em></h1>
        <p>A sacred sanctuary for Maithil matrimonial harmony, rooted in tradition and verified trust.</p>
        <div className="mm-welcome-actions">
          <Link href="/discover" className="mm-primary-button">Discover matches <Compass size={16} /></Link>
          <Link href="/profile" className="mm-text-button">Complete your profile <span>↗</span></Link>
        </div>
      </div>
      <div className="mm-welcome-art" aria-hidden="true" style={{ position: 'relative', overflow: 'hidden' }}>
        <Image
          src="/images/mithila-kohbar.png"
          alt="Mithila Kohbar Heritage Mural"
          fill
          style={{ objectFit: 'cover' }}
          sizes="285px"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(32,50,44,0.65) 0%, rgba(166,93,63,0.45) 100%)',
          }}
        />
        <span
          className="mm-art-script"
          style={{
            position: 'absolute',
            right: '20px',
            bottom: '16px',
            zIndex: 2,
            color: '#fffaf1',
            textShadow: '0 2px 6px rgba(0,0,0,0.6)',
            fontFamily: 'serif',
            fontSize: '26px',
          }}
        >
          मिथिला
        </span>
      </div>
    </section>
  )
}

function CompletionCard({ user }: { user: any }) {
  const pct = user ? 85 : 30
  return (
    <section className="mm-completion-card">
      <div className="mm-card-eyebrow">
        <span>Profile strength</span>
        <span className="mm-status-pill"><span /> {user ? 'Verified Profile' : 'Guest Mode'}</span>
      </div>
      <div className="mm-completion-main">
        <div className="mm-progress-ring" style={{ '--progress': `${pct * 3.6}deg` } as React.CSSProperties}>
          <div><strong>{pct}%</strong><small>complete</small></div>
        </div>
        <div>
          <h2>Let your whole story show.</h2>
          <p>Profiles with complete family lineage and ancestral details receive 4x more genuine responses.</p>
          <Link href="/profile" className="mm-inline-link">Update your lineage <span>↗</span></Link>
        </div>
      </div>
      <div className="mm-completion-bar"><span style={{ width: `${pct}%` }} /></div>
    </section>
  )
}

function ProfileCard({ profile, onShortlist, isShortlisted }: { profile: any; onShortlist: (id: string, name: string) => void; isShortlisted: boolean }) {
  const initials = profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'MM'
  const profileId = profile.profileCode || profile.id || profile._id
  const cardPhoto = profile.avatar || profile.image || profile.photos?.[0]?.url || profile.photos?.[0]
  const isPhotoValid = cardPhoto && !cardPhoto.includes('placeholder') && !cardPhoto.includes('mitali-profile')

  return (
    <article className="mm-match-card">
      <Link href={`/profiles/${profileId}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div className="mm-match-image mm-tone-sage" style={{ position: 'relative', minHeight: '210px', overflow: 'hidden' }}>
          {isPhotoValid ? (
            <>
              <Image src={cardPhoto} alt={profile.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 760px) 100vw, 300px" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(32,50,44,0.7) 0%, transparent 55%)' }} />
            </>
          ) : (
            <div style={{ height: '100%', minHeight: '210px', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #1B4D3E 0%, #0B241D 100%)', color: '#FAF8F5', fontWeight: 700, fontSize: '36px' }}>
              {initials}
            </div>
          )}
          <span className="mm-match-star" style={{ zIndex: 2 }}>✦</span>
          <span className="mm-match-match" style={{ zIndex: 2 }}><Heart size={13} /> {profile.gunaMilan?.score || 32}/36 Gunas</span>
          {profile.gotra && (
            <span
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 2,
                background: 'rgba(255,255,255,0.92)',
                color: 'var(--terracotta)',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              {profile.gotra}
            </span>
          )}
        </div>
      </Link>
      <div className="mm-match-content">
        <div className="mm-match-heading">
          <Link href={`/profiles/${profileId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>{profile.name}, {profile.age}</h3>
            <p>{profile.profession || profile.role || 'Professional'}</p>
          </Link>
          <button
            className="mm-round-button"
            aria-label={`Shortlist ${profile.name}`}
            onClick={(e) => {
              e.preventDefault()
              onShortlist(profileId, profile.name)
            }}
          >
            <Bookmark size={16} style={{ fill: isShortlisted ? 'var(--terracotta)' : 'none', color: isShortlisted ? 'var(--terracotta)' : 'currentColor' }} />
          </button>
        </div>
        <div className="mm-match-location"><MapPin size={14} /> {profile.city || profile.location || 'Mithila Region'}</div>
        <div className="mm-match-tag">
          <span /> {profile.mool ? `मूल: ${profile.mool}` : 'Verified Profile'}
          <small>{profile.nativeDistrict || ''}</small>
        </div>
      </div>
    </article>
  )
}

export default function DashboardApp() {
  const router = useRouter()
  const { user } = useAuth()
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [interests, setInterests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3500)
  }

  // Load live profiles and interests from MongoDB
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const profileParams = new URLSearchParams()
        if (user?.id) profileParams.set('currentUserId', user.id)
        if (user?.name) profileParams.set('currentUserName', user.name)
        if (user?.gender) profileParams.set('currentUserGender', user.gender)
        const profileQuery = profileParams.toString() ? `?${profileParams.toString()}` : ''

        const [profRes, intRes, shortRes] = await Promise.all([
          fetch(`/api/profiles${profileQuery}`),
          fetch(`/api/interests?userId=${user?.id || 'guest'}`),
          fetch(`/api/shortlist?userId=${user?.id || 'guest'}`)
        ])

        if (profRes.ok) {
          const data = await profRes.json()
          setProfiles(data.profiles || [])
        }
        if (intRes.ok) {
          const data = await intRes.json()
          setInterests(data.interests || [])
        }
        if (shortRes.ok) {
          const data = await shortRes.json()
          setShortlistedIds(data.shortlists?.map((s: any) => s.targetProfileId) || [])
        }
      } catch (err) {
        console.error('Failed to load dashboard data from MongoDB:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  const handleShortlist = async (id: string, name: string) => {
    const isCurrentlySaved = shortlistedIds.includes(id)
    const nextList = isCurrentlySaved ? shortlistedIds.filter(x => x !== id) : [...shortlistedIds, id]
    setShortlistedIds(nextList)
    showToast(isCurrentlySaved ? `Removed ${name} from your shortlist.` : `Saved ${name} to your shortlist.`)

    try {
      await fetch('/api/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'guest', targetProfileId: id }),
      })
    } catch {
      // ignore
    }
  }

  const handleAcceptInterest = async (id: string, name: string) => {
    setInterests(prev => prev.map(i => i._id === id ? { ...i, status: 'accepted' } : i))
    showToast(`Accepted interest from ${name}. You can now start a conversation!`)
  }

  // Filter out self and administrative profiles from dashboard candidate feeds
  const eligibleProfiles = profiles.filter((p: any) => {
    const pId = p.profileCode || p.id || p._id
    const pName = p.name || p.displayName
    if (pId === 'MM-ADMIN-01' || (pId && String(pId).startsWith('MM-ADMIN')) || (pName && pName.toLowerCase().includes('administration'))) return false
    if (user?.id && (pId === user.id || p.userId === user.id)) return false
    if (user?.name && pName && pName.toLowerCase() === user.name.toLowerCase()) return false
    return true
  })
  const recommended = eligibleProfiles.slice(0, 3)
  const recent = eligibleProfiles.slice(3, 6)

  return (
    <AuthenticatedShell activeKey="overview" breadcrumbTitle="Overview">
      <main className="mm-dashboard">
        <WelcomeCard user={user} />
        <div className="mm-dashboard-grid">
          <div className="mm-dashboard-primary">
            <div className="mm-section-heading">
              <div>
                <p className="mm-section-kicker">Curated for you</p>
                <h2>Live profiles from <em>MongoDB Atlas.</em></h2>
              </div>
              <Link href="/discover" className="mm-view-all">View all in Discover <span>↗</span></Link>
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#1B4D3E', background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <Loader2 className="animate-spin" style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontSize: '13px' }}>Fetching live verified profiles from database...</p>
              </div>
            ) : recommended.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', background: '#FAF8F5', borderRadius: '12px', border: '1px dashed #d99a78' }}>
                <p style={{ margin: '0 0 12px', color: '#8C2D19', fontWeight: 600 }}>No profiles found in database.</p>
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'rgba(32,50,44,0.7)' }}>Be the first to create your authentic Maithil matrimonial profile!</p>
                <Link href="/profile" className="mm-primary-button">Create Profile Now</Link>
              </div>
            ) : (
              <div className="mm-match-grid">
                {recommended.map((profile) => (
                  <ProfileCard
                    key={profile.profileCode || profile.id || profile._id}
                    profile={profile}
                    onShortlist={handleShortlist}
                    isShortlisted={shortlistedIds.includes(profile.profileCode || profile.id || profile._id)}
                  />
                ))}
              </div>
            )}

            {recent.length > 0 && (
              <>
                <div className="mm-section-heading mm-recent-heading">
                  <div>
                    <p className="mm-section-kicker">More Verified Members</p>
                    <h2>Recently <em>joined.</em></h2>
                  </div>
                  <Link href="/discover" className="mm-view-all">Browse directory <span>↗</span></Link>
                </div>
                <div className="mm-recent-grid">
                  {recent.map((profile) => {
                    const profileId = profile.profileCode || profile.id || profile._id
                    const initials = profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'MM'
                    return (
                      <Link href={`/profiles/${profileId}`} className="mm-recent-card" key={profileId}>
                        {profile.image && !profile.image.includes('placeholder') ? (
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                            <Image src={profile.image} alt={profile.name} fill style={{ objectFit: 'cover' }} sizes="40px" />
                          </div>
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1B4D3E, #0B241D)', color: '#FAF8F5', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                            {initials}
                          </div>
                        )}
                        <span>
                          <strong>{profile.name}</strong>
                          <small>{profile.profession || profile.role || 'Member'} · {profile.city || profile.nativeDistrict}</small>
                          <em>Verified Member</em>
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </>
            )}

            {/* Heritage Sanctuary Suite */}
            <div style={{ marginTop: '36px', background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid rgba(197,143,39,0.25)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--terracotta)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Authentic Heritage Tools
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', margin: '4px 0 0', color: '#20322C' }}>
                    Matrimonial <em>Sanctuary Suite</em>
                  </h2>
                </div>
                <span style={{ fontSize: '12px', color: 'rgba(32,50,44,0.6)' }}>Cultural Precision</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <Link href="/biodata" style={{ textDecoration: 'none', background: '#FAF8F5', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(140,45,25,0.1)', color: 'var(--terracotta)', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                      <FileText size={18} />
                    </div>
                    <strong style={{ fontSize: '14px', color: '#20322C', display: 'block', marginBottom: '4px' }}>Luxury Biodata Maker</strong>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(32,50,44,0.7)', lineHeight: 1.4 }}>Create print-ready Maithil matrimonial biodatas with Gotra, Mool & Aripan themes.</p>
                  </div>
                  <span style={{ marginTop: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--terracotta)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Generate PDF ↗</span>
                </Link>

                <Link href="/kundali-matching" style={{ textDecoration: 'none', background: '#FAF8F5', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(197,143,39,0.15)', color: '#B8860B', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                      <Sparkles size={18} />
                    </div>
                    <strong style={{ fontSize: '14px', color: '#20322C', display: 'block', marginBottom: '4px' }}>Kundali & Siddhanta</strong>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(32,50,44,0.7)', lineHeight: 1.4 }}>36-point Guna breakdown, Panji Siddhanta check, and 2026-2027 Vivah Muhurat.</p>
                  </div>
                  <span style={{ marginTop: '12px', fontSize: '12px', fontWeight: 600, color: '#B8860B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Check Milan ↗</span>
                </Link>

                <Link href="/milan-select" style={{ textDecoration: 'none', background: '#FAF8F5', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(27,77,62,0.12)', color: '#1B4D3E', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                      <Crown size={18} />
                    </div>
                    <strong style={{ fontSize: '14px', color: '#20322C', display: 'block', marginBottom: '4px' }}>Milan Select (VIP Concierge)</strong>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(32,50,44,0.7)', lineHeight: 1.4 }}>Discreet personal relationship managers for civil servants, doctors, and global NRIs.</p>
                  </div>
                  <span style={{ marginTop: '12px', fontSize: '12px', fontWeight: 600, color: '#1B4D3E', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Explore VIP ↗</span>
                </Link>
              </div>
            </div>
          </div>

          <aside className="mm-dashboard-aside">
            <CompletionCard user={user} />
            <section className="mm-side-card">
              <div className="mm-side-heading">
                <div>
                  <p className="mm-section-kicker">Awaiting your reply</p>
                  <h2>Received <em>interests.</em></h2>
                </div>
                <Link href="/interests" aria-label="View all interests">↗</Link>
              </div>
              <div className="mm-interest-list">
                {interests.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'rgba(32,50,44,0.6)', fontSize: '13px' }}>
                    <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#20322C' }}>No pending interests</p>
                    <p style={{ margin: 0, fontSize: '12px' }}>Expressions of interest sent to your profile will appear here.</p>
                  </div>
                ) : (
                  interests.map((int: any) => (
                    <div className="mm-interest-row" key={int._id}>
                      <div className="mm-interest-copy" style={{ minWidth: 0 }}>
                        <strong>{int.targetProfileId || 'Interested Member'}</strong>
                        <span>Status: {int.status}</span>
                      </div>
                      <div className="mm-interest-actions">
                        {int.status === 'accepted' ? (
                          <span style={{ color: 'var(--terracotta)', fontSize: '11px', fontWeight: 600 }}>Accepted</span>
                        ) : (
                          <button className="mm-small-button mm-small-button-primary" onClick={() => handleAcceptInterest(int._id, int.targetProfileId)}>
                            <Check size={12} /> Accept
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--forest)', color: '#fffaf1', padding: '12px 20px', borderRadius: '8px', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: '13px', fontWeight: 600 }}>
          {toast}
        </div>
      )}
    </AuthenticatedShell>
  )
}

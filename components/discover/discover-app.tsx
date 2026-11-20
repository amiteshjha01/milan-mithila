'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Bookmark, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Compass, Eye, Filter, Heart, MapPin, MessageCircle, Search, Send, ShieldCheck, SlidersHorizontal, Sparkles, UserRound, X, Volume2, Play, Pause } from 'lucide-react'
import { filterGroups, type DiscoverProfile, type DiscoverTab, type FilterValues, type SortOption } from '@/lib/mock-discover'
import { useAuth } from '@/lib/auth-context'
import { MobileBottomNav } from '@/components/site-shell'

const tabs: { id: DiscoverTab; label: string }[] = [
  { id: 'recommended', label: 'Recommended for you' }, { id: 'recently-joined', label: 'Recently joined' }, { id: 'active', label: 'Recently active' }, { id: 'shortlisted', label: 'Shortlisted' }, { id: 'new-matches', label: 'New matches' },
]

function ProfilePhoto({ profile, large = false }: { profile: DiscoverProfile; large?: boolean }) {
  return (
    <div className={`dm-photo ${large ? 'dm-photo-large' : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
      <Image src={profile.image} alt={`${profile.name} profile photograph`} fill sizes={large ? '(max-width: 700px) 100vw, 420px' : '(max-width: 900px) 50vw, 300px'} style={{ objectFit: 'cover' }} />
      <span className="dm-photo-gradient" />
      <span
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          fontSize: '9px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.75)',
          background: 'rgba(32,50,44,0.4)',
          backdropFilter: 'blur(4px)',
          padding: '2px 6px',
          borderRadius: '4px',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
        }}
      >
        ✦ MITHILA SHIELD
      </span>
    </div>
  )
}

function FilterPanel({ filters, setFilters, onApply, onReset, mobile = false }: { filters: FilterValues; setFilters: (value: FilterValues) => void; onApply?: () => void; onReset: () => void; mobile?: boolean }) {
  const [openGroups, setOpenGroups] = useState<string[]>(['age', 'city', 'community'])
  const [searches, setSearches] = useState<Record<string, string>>({})
  const [showAllFilters, setShowAllFilters] = useState(false)
  const visibleGroups = mobile || showAllFilters ? filterGroups : filterGroups.slice(0, 11)
  const toggleGroup = (key: string) => setOpenGroups(openGroups.includes(key) ? openGroups.filter((item) => item !== key) : [...openGroups, key])
  const toggleOption = (key: string, option: string) => { const current = filters[key] || []; setFilters({ ...filters, [key]: current.includes(option) ? current.filter((value) => value !== option) : [...current, option] }) }
  return <div className={`dm-filter-panel ${mobile ? 'dm-filter-mobile-panel' : ''}`}><div className="dm-filter-panel-head"><div><span className="dm-kicker">Refine your search</span><h2>Find someone <em>meaningful.</em></h2></div>{mobile && <button className="dm-close-button" aria-label="Close filters" onClick={onApply}><X /></button>}</div><div className="dm-filter-note"><CircleHelp /><span>Cultural details are optional preferences only. We do not infer compatibility or eligibility.</span></div><div className="dm-filter-list">{visibleGroups.map((group) => { const isOpen = openGroups.includes(group.key); const query = searches[group.key] || ''; const options = group.options.filter((option) => option.toLowerCase().includes(query.toLowerCase())); return <section className="dm-filter-group" key={group.key}><button className="dm-filter-group-heading" onClick={() => toggleGroup(group.key)}><span>{group.label}{filters[group.key]?.length ? <b>{filters[group.key].length}</b> : null}</span><ChevronDown className={isOpen ? 'is-open' : ''} /></button>{isOpen && <div className="dm-filter-options">{['city', 'profession', 'nativeDistrict', 'community', 'subCommunity', 'gotra', 'mool', 'ancestralVillage', 'kul', 'pravara'].includes(group.key) && <label className="dm-filter-search"><Search /><input placeholder="Search or enter your own" value={query} onChange={(event) => setSearches({ ...searches, [group.key]: event.target.value })} /></label>}<div className="dm-option-list">{options.map((option) => <button type="button" key={option} className={filters[group.key]?.includes(option) ? 'is-selected' : ''} onClick={() => toggleOption(group.key, option)}><span className="dm-check">{filters[group.key]?.includes(option) && <Check />}</span>{option}</button>)}{query && options.length === 0 && <button type="button" className="dm-user-option" onClick={() => { toggleOption(group.key, query); setSearches({ ...searches, [group.key]: '' }) }}>Use “{query}” as entered value</button>}</div></div>}</section> })}</div>{!mobile && <button className="dm-show-more-filters" type="button" onClick={() => setShowAllFilters(!showAllFilters)}>{showAllFilters ? 'Fewer filters' : 'More filters'} <span>{showAllFilters ? '−' : `+${filterGroups.length - 11}`}</span></button>}<div className="dm-filter-actions"><button type="button" className="dm-reset-button" onClick={onReset}>Reset all</button>{mobile && <button type="button" className="dm-apply-button" onClick={onApply}>Apply filters</button>}</div></div>
}

function ProfileCard({ profile, onQuickView, onInterest, onShortlist }: { profile: DiscoverProfile; onQuickView: (profile: DiscoverProfile) => void; onInterest: (id: string) => void; onShortlist: (id: string) => void }) {
  return (
    <article className="dm-profile-card">
      <div className="dm-card-photo-wrap">
        <ProfilePhoto profile={profile} />
        <span className="dm-card-id">{profile.id}</span>
        <span className={`dm-card-availability ${profile.active ? 'is-active' : ''}`}><i /> {profile.availability}</span>
        <button className="dm-shortlist-float" onClick={() => onShortlist(profile.id)} aria-label={profile.shortlisted ? `Remove ${profile.name} from shortlist` : `Shortlist ${profile.name}`}>
          <Bookmark className={profile.shortlisted ? 'is-filled' : ''} />
        </button>
      </div>
      <div className="dm-card-body">
        <div className="dm-card-title">
          <div>
            <h3>{profile.name}</h3>
            <p>{profile.age} years · {profile.height}</p>
          </div>
          {profile.verified && (
            <span className="dm-verified-badge" title={profile.verificationLabel}>
              <ShieldCheck /> <span>{profile.verificationLabel}</span>
            </span>
          )}
        </div>

        {profile.voicePrompt && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(166,93,63,0.08)',
              border: '1px solid rgba(166,93,63,0.2)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 650,
              color: 'var(--terracotta)',
              margin: '6px 0',
            }}
          >
            <Volume2 size={13} />
            <span>Voice prompt · {profile.voicePrompt.duration}</span>
          </div>
        )}

        <div className="dm-card-facts">
          <span>{profile.education}</span>
          <span>{profile.profession}</span>
          <span><MapPin /> {profile.city}</span>
        </div>

        <div className="dm-card-origin">
          <span>Native district</span>
          <strong>{profile.nativeDistrict}</strong>
          {profile.gotra && (
            <>
              <span>Gotra & Mool</span>
              <strong style={{ color: 'var(--terracotta)' }}>{profile.gotra} · {profile.mool}</strong>
            </>
          )}
        </div>

        <p className="dm-card-intro">{profile.introduction}</p>

        <div className="dm-card-footer">
          <span className="dm-completion">
            <span style={{ width: `${profile.profileCompletion}%` }} />
            <small>{profile.profileCompletion}% profile</small>
          </span>
          <Link className="dm-view-button" href={`/profiles/${profile.id}`} onClick={() => onQuickView(profile)}>
            View profile <span>↗</span>
          </Link>
          <button className={`dm-interest-button ${profile.interested ? 'is-sent' : ''}`} onClick={() => onInterest(profile.id)}>
            {profile.interested ? <><Check /> Sent</> : <><Send /> Interest</>}
          </button>
        </div>
      </div>
    </article>
  )
}

function QuickView({ profile, onClose, onInterest, onShortlist }: { profile: DiscoverProfile; onClose: () => void; onInterest: (id: string) => void; onShortlist: (id: string) => void }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="dm-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="dm-quick-view" role="dialog" aria-modal="true" aria-label={`Quick view for ${profile.name}`} onMouseDown={(event) => event.stopPropagation()}>
        <button className="dm-modal-close" onClick={onClose} aria-label="Close profile preview"><X /></button>
        <div className="dm-quick-photo">
          <ProfilePhoto profile={profile} large />
          <span><Eye /> Quick profile view</span>
        </div>
        <div className="dm-quick-copy">
          <div className="dm-quick-heading">
            <div>
              <span className="dm-kicker">{profile.id} · {profile.active ? 'Recently active' : 'Recently joined'}</span>
              <h2>{profile.name}</h2>
              <p>{profile.age} years · {profile.height} · {profile.city}</p>
            </div>
            {profile.verified && <span className="dm-quick-verified"><ShieldCheck /> {profile.verificationLabel}</span>}
          </div>

          {profile.voicePrompt && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(166,93,63,0.08) 0%, rgba(214,173,101,0.12) 100%)',
                border: '1px solid rgba(166,93,63,0.25)',
                borderRadius: '8px',
                padding: '12px 14px',
                margin: '12px 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--terracotta)',
                    color: '#fff',
                    border: 'none',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '1px' }} />}
                </button>
                <div>
                  <strong style={{ fontSize: '12px', display: 'block', color: 'var(--foreground)' }}>
                    {profile.voicePrompt.title}
                  </strong>
                  <small style={{ fontSize: '11px', color: 'rgba(32,50,44,0.6)' }}>
                    Voice note ({profile.voicePrompt.duration})
                  </small>
                </div>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '11px', color: 'rgba(32,50,44,0.7)', fontStyle: 'italic' }}>
                {profile.voicePrompt.quote}
              </p>
            </div>
          )}

          <p className="dm-quick-intro">{profile.introduction}</p>

          <div className="dm-quick-details">
            <div><span>Education</span><strong>{profile.education}</strong></div>
            <div><span>Profession</span><strong>{profile.profession}</strong></div>
            <div><span>Native district</span><strong>{profile.nativeDistrict}</strong></div>
            <div><span>Mother tongue</span><strong>{profile.motherTongue}</strong></div>
          </div>

          <div className="dm-quick-story">
            <span className="dm-kicker">Family background</span>
            <p>{profile.familyBackground}</p>
          </div>

          {profile.gotra && (
            <div className="dm-quick-cultural">
              <span className="dm-kicker">Ancestral roots & Gotra</span>
              <p>{profile.community} · Gotra: {profile.gotra} · Mool: {profile.mool}</p>
              <small>Voluntarily shared by member under Mithila Milan community charter.</small>
            </div>
          )}

          <div className="dm-quick-actions">
            <button className="dm-interest-button" onClick={() => onInterest(profile.id)}>
              {profile.interested ? <><Check /> Interest sent</> : <><Send /> Send interest</>}
            </button>
            <Link className="dm-outline-button" href={`/profiles/${profile.id}`}>
              <UserRound /> Full profile
            </Link>
            <button className="dm-outline-button" onClick={() => onShortlist(profile.id)}>
              <Bookmark /> {profile.shortlisted ? 'Remove shortlist' : 'Shortlist'}
            </button>
            <Link className="dm-icon-action" href={`/messages?user=${profile.id}`} aria-label="Open conversation">
              <MessageCircle />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingCard() { return <div className="dm-loading-card"><div className="dm-skeleton dm-skeleton-photo" /><div className="dm-skeleton-body"><span className="dm-skeleton dm-skeleton-line wide" /><span className="dm-skeleton dm-skeleton-line" /><span className="dm-skeleton dm-skeleton-line short" /><span className="dm-skeleton dm-skeleton-line footer" /></div></div> }

const isMan = (g?: string) => {
  const s = (g || '').toLowerCase()
  return s.includes('man') || s.includes('male') || s === 'groom'
}

const isWoman = (g?: string) => {
  const s = (g || '').toLowerCase()
  return s.includes('woman') || s.includes('female') || s === 'bride'
}

export default function DiscoverApp() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const initialQ = searchParams?.get('q') || searchParams?.get('search') || ''
  const initialTab = (searchParams?.get('tab') as DiscoverTab) || 'recommended'

  const [tab, setTab] = useState<DiscoverTab>(initialTab)
  const [sort, setSort] = useState<SortOption>('relevance')
  const [search, setSearch] = useState(initialQ)
  const [filters, setFilters] = useState<FilterValues>({})
  const [mobileFilters, setMobileFilters] = useState(false)
  const [savedSearch, setSavedSearch] = useState(false)
  const [quickView, setQuickView] = useState<DiscoverProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<DiscoverProfile[]>([])
  const [dbSource, setDbSource] = useState<'mongodb' | 'fallback'>('mongodb')
  const initialSeekingParam = searchParams?.get('seeking')
  const defaultGuestSeeking: 'Woman' | 'Man' = initialSeekingParam === 'groom' ? 'Man' : 'Woman'
  const [userGender, setUserGender] = useState<string>(user?.gender || '')
  const [guestSeeking, setGuestSeeking] = useState<'Woman' | 'Man'>(defaultGuestSeeking)

  // Retrieve user gender from account or database profile
  useEffect(() => {
    if (user?.gender) {
      setUserGender(user.gender)
    } else if (user?.id || user?.email) {
      fetch(`/api/profile/me?userId=${user.id || ''}&email=${encodeURIComponent(user.email || '')}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok && data.profile?.gender) {
            setUserGender(data.profile.gender)
          }
        })
        .catch(() => {})
    }
  }, [user?.gender, user?.id, user?.email])

  // Strict matrimonial opposite-gender target:
  // Male user -> ONLY Prospective Brides (Women)
  // Female user -> ONLY Prospective Grooms (Men)
  // Guest -> Controlled toggle, never shows both simultaneously
  const activeTargetGender: 'Woman' | 'Man' = useMemo(() => {
    if (userGender) {
      if (isMan(userGender)) return 'Woman'
      if (isWoman(userGender)) return 'Man'
    }
    return guestSeeking
  }, [userGender, guestSeeking])

  useEffect(() => {
    const q = searchParams?.get('q') || searchParams?.get('search')
    if (q !== null && q !== undefined) {
      setSearch(q)
    }
    const t = searchParams?.get('tab') as DiscoverTab
    if (t) {
      setTab(t)
    }
    const s = searchParams?.get('seeking')
    if (s === 'groom') setGuestSeeking('Man')
    else if (s === 'bride') setGuestSeeking('Woman')
  }, [searchParams])

  useEffect(() => {
    let isMounted = true
    async function loadLiveProfiles() {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        if (user?.id) queryParams.set('currentUserId', user.id)
        if (user?.name) queryParams.set('currentUserName', user.name)
        if (userGender) queryParams.set('currentUserGender', userGender)
        queryParams.set('targetGender', activeTargetGender)

        const queryString = `?${queryParams.toString()}`
        const res = await fetch(`/api/profiles${queryString}`)
        if (res.ok) {
          const data = await res.json()
          if (isMounted) {
            setProfiles(data.profiles || [])
            setDbSource('mongodb')
          }
        }
      } catch (err) {
        console.warn('Live API fetch notice:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadLiveProfiles()
    return () => { isMounted = false }
  }, [user?.id, user?.name, userGender, activeTargetGender])

  const updateProfile = async (id: string, key: 'interested' | 'shortlisted') => {
    // Optimistic UI update
    setProfiles((items) => items.map((profile) => profile.id === id ? { ...profile, [key]: !profile[key] } : profile))
    
    // Live MongoDB Atlas persistence
    try {
      if (key === 'shortlisted') {
        await fetch('/api/shortlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: id }),
        })
      } else if (key === 'interested') {
        await fetch('/api/interests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiverId: id }),
        })
      }
    } catch (e) {
      console.warn('Network sync notice:', e)
    }
  }

  const resetFilters = () => setFilters({})
  const allActiveFilters = Object.entries(filters).flatMap(([key, values]) => values.map((value) => ({ key, value })))
  const filteredProfiles = useMemo(() => {
    const query = search.toLowerCase().trim()
    let result = profiles.filter((profile) => {
      // Exclude administration / moderation desk profiles
      if (
        profile.id === 'MM-ADMIN-01' ||
        profile.id.startsWith('MM-ADMIN') ||
        profile.name.toLowerCase().includes('administration') ||
        profile.profession.toLowerCase().includes('platform administrator')
      ) {
        return false
      }
      // Exclude current logged-in user's own profile
      if (user?.name && profile.name.toLowerCase() === user.name.toLowerCase()) {
        return false
      }
      if (user?.id && profile.id === user.id) {
        return false
      }

      // Matrimonial Gender Separation Rule:
      // Male accounts discover ONLY prospective brides (Women).
      // Female accounts discover ONLY prospective grooms (Men).
      // Never show male and female simultaneously.
      if (activeTargetGender === 'Woman') {
        if (!isWoman(profile.gender)) return false
      } else if (activeTargetGender === 'Man') {
        if (!isMan(profile.gender)) return false
      }

      const matchesQuery = !query || [profile.id, profile.name, profile.city, profile.nativeDistrict].some((value) => value.toLowerCase().includes(query))
      const tabMatch = tab === 'recommended' ? profile.recommended : tab === 'recently-joined' ? profile.joinedDaysAgo <= 14 : tab === 'active' ? profile.active : tab === 'shortlisted' ? profile.shortlisted : profile.recommended && profile.joinedDaysAgo <= 7
      const matchesFilters = Object.entries(filters).every(([key, values]) => {
        if (!values.length) return true
        const map: Record<string, string> = {
          age: profile.age >= 28 && profile.age <= 31 ? '28–31 years' : profile.age < 28 ? '24–27 years' : '32–36 years',
          height: profile.height.includes('5 ft 10') || profile.height.includes('6 ft') ? '5 ft 10 in – 6 ft 2 in' : '5 ft 5 in – 5 ft 9 in',
          education: profile.education.includes('MS') || profile.education.includes('MBA') || profile.education.includes('MA') ? 'Postgraduate' : 'Undergraduate',
          profession: profile.profession.toLowerCase().includes('design') ? 'Technology & design' : profile.profession.toLowerCase().includes('strategy') ? 'Finance & strategy' : profile.profession.toLowerCase().includes('architect') ? 'Architecture' : 'Research & education'
        }
        const raw = String(profile[key as keyof DiscoverProfile] ?? '')
        return values.some((value) => value === map[key] || raw === value || raw.toLowerCase().includes(value.toLowerCase()) || (key === 'familyLocation' && raw.includes(value)) || (key === 'locationPreference' && raw.includes(value)))
      })
      return matchesQuery && tabMatch && matchesFilters
    })
    return [...result].sort((a, b) => sort === 'newest' ? a.joinedDaysAgo - b.joinedDaysAgo : sort === 'age' ? a.age - b.age : Number(b.recommended) - Number(a.recommended))
  }, [filters, profiles, search, sort, tab, user?.id, user?.name, activeTargetGender])
  const removeChip = (key: string, value: string) => setFilters({ ...filters, [key]: (filters[key] || []).filter((item) => item !== value) })
  return (
    <div className="dm-page">
      <header className="dm-header">
        <Link href="/dashboard" className="dm-header-back">← My space</Link>
        <div className="dm-header-title">
          <span>Discover</span>
          <strong>People with a story to share.</strong>
        </div>
        <div className="dm-header-actions">
          <button className="dm-header-help" aria-label="Discover help"><CircleHelp /></button>
          <Link href="/profile" className="dm-header-profile">
            {user ? user.name : 'Guest'} <span>{user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'G'}</span>
          </Link>
        </div>
      </header>

      <main className="dm-main">
        <section className="dm-hero">
          <div>
            <span className="dm-kicker"><Compass /> Your discovery space</span>
            <h1>Begin with <em>curiosity.</em></h1>
            <p>Thoughtful introductions, shared values, and room for a real conversation.</p>

            {/* Matrimonial Gender Separation Badge & Selector */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '14px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(166, 93, 63, 0.25)',
                padding: '8px 16px',
                borderRadius: '999px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--terracotta)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Matrimonial Matching:
                </span>
                <strong style={{ fontSize: '13px', color: '#1B4D3E' }}>
                  {activeTargetGender === 'Woman' ? 'Prospective Brides (कन्या / वधू)' : 'Prospective Grooms (वर)'}
                </strong>
              </div>

              {user ? (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'rgba(32,50,44,0.7)',
                    borderLeft: '1px solid rgba(0,0,0,0.12)',
                    paddingLeft: '10px',
                  }}
                >
                  Matched for {user.name} ({isMan(userGender) ? 'Groom seeking Bride' : 'Bride seeking Groom'})
                </span>
              ) : (
                <div style={{ display: 'inline-flex', gap: '6px', borderLeft: '1px solid rgba(0,0,0,0.12)', paddingLeft: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setGuestSeeking('Woman')}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      border: 'none',
                      cursor: 'pointer',
                      background: activeTargetGender === 'Woman' ? 'var(--terracotta)' : 'rgba(0,0,0,0.06)',
                      color: activeTargetGender === 'Woman' ? '#fff' : 'inherit',
                      fontWeight: activeTargetGender === 'Woman' ? 700 : 500,
                    }}
                  >
                    Brides (वधू)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuestSeeking('Man')}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      border: 'none',
                      cursor: 'pointer',
                      background: activeTargetGender === 'Man' ? 'var(--terracotta)' : 'rgba(0,0,0,0.06)',
                      color: activeTargetGender === 'Man' ? '#fff' : 'inherit',
                      fontWeight: activeTargetGender === 'Man' ? 700 : 500,
                    }}
                  >
                    Grooms (वर)
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="dm-hero-aside">
            <span className="dm-hero-count">
              {filteredProfiles.length}
              <small>{activeTargetGender === 'Woman' ? 'brides to explore' : 'grooms to explore'}</small>
            </span>
            <Sparkles />
          </div>
        </section>

        <section className="dm-tabs" aria-label="Discovery sections">
          {tabs.map((item) => (
            <button key={item.id} className={tab === item.id ? 'is-active' : ''} onClick={() => setTab(item.id)}>
              {item.label}
              {item.id === 'new-matches' && <i>New</i>}
            </button>
          ))}
        </section>

        <div className="dm-content-layout">
          <aside className="dm-desktop-filter">
            <FilterPanel filters={filters} setFilters={setFilters} onReset={resetFilters} />
          </aside>
          <section className="dm-results">
            <div className="dm-results-toolbar">
              <div>
                <span className="dm-kicker">
                  {tab === 'recommended' ? 'Curated for you' : tabs.find((item) => item.id === tab)?.label} · {activeTargetGender === 'Woman' ? 'Brides' : 'Grooms'}
                </span>
                <h2>
                  {filteredProfiles.length} <em>{filteredProfiles.length === 1 ? 'profile' : 'profiles'} to explore</em>
                </h2>
              </div>
              <div className="dm-toolbar-actions">
                <button className="dm-filter-trigger" onClick={() => setMobileFilters(true)}>
                  <SlidersHorizontal /> Filters{allActiveFilters.length > 0 && <b>{allActiveFilters.length}</b>}
                </button>
                <label className="dm-sort">
                  <span>Sort by</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest profiles</option>
                    <option value="age">Age</option>
                  </select>
                  <ChevronDown />
                </label>
                <button className={`dm-save-search ${savedSearch ? 'is-saved' : ''}`} onClick={() => setSavedSearch(!savedSearch)}>
                  {savedSearch ? <><Check /> Saved</> : <><Bookmark /> Save search</>}
                </button>
              </div>
            </div>

            <div className="dm-search-row">
              <label className="dm-main-search">
                <Search />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by profile ID, name, or location" />
                <kbd>⌘ K</kbd>
              </label>
              <span className="dm-result-note"><Clock3 /> Updated just now</span>
            </div>

            {allActiveFilters.length > 0 && (
              <div className="dm-active-chips">
                <span>Active filters</span>
                {allActiveFilters.map((chip) => (
                  <button key={`${chip.key}-${chip.value}`} onClick={() => removeChip(chip.key, chip.value)}>
                    {chip.value} <X />
                  </button>
                ))}
                <button className="dm-clear-all" onClick={resetFilters}>Clear all</button>
              </div>
            )}

            {loading ? (
              <div className="dm-profile-grid">
                {[1, 2, 3].map((item) => <LoadingCard key={item} />)}
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="dm-empty-state">
                <div className="dm-empty-icon"><Search /></div>
                <h2>No {activeTargetGender === 'Woman' ? 'bride' : 'groom'} profiles in this view yet.</h2>
                <p>Try removing a filter or searching for another place to begin.</p>
                <button className="dm-outline-button" onClick={() => { resetFilters(); setSearch('') }}>Clear search</button>
              </div>
            ) : (
              <div className="dm-profile-grid">
                {filteredProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onQuickView={setQuickView}
                    onInterest={(id) => updateProfile(id, 'interested')}
                    onShortlist={(id) => updateProfile(id, 'shortlisted')}
                  />
                ))}
              </div>
            )}

            <div className="dm-results-footer">
              <span>Showing {filteredProfiles.length} verified {activeTargetGender === 'Woman' ? 'bride' : 'groom'} profiles</span>
              <div>
                <button aria-label="Previous page"><ChevronLeft /></button>
                <b>1</b>
                <button aria-label="Next page"><ChevronRight /></button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="dm-footer">
        <span>© 2026 Mithila Milan</span>
        <span>Community-led · Private by design</span>
        <Link href="/safety">Trust & safety <span>↗</span></Link>
      </footer>

      {mobileFilters && (
        <div className="dm-mobile-drawer-backdrop" onClick={() => setMobileFilters(false)}>
          <aside className="dm-mobile-drawer" onClick={(event) => event.stopPropagation()}>
            <FilterPanel filters={filters} setFilters={setFilters} onReset={resetFilters} onApply={() => setMobileFilters(false)} mobile />
          </aside>
        </div>
      )}

      {quickView && (
        <QuickView
          profile={quickView}
          onClose={() => setQuickView(null)}
          onInterest={(id) => { updateProfile(id, 'interested'); setQuickView({ ...quickView, interested: !quickView.interested }) }}
          onShortlist={(id) => { updateProfile(id, 'shortlisted'); setQuickView({ ...quickView, shortlisted: !quickView.shortlisted }) }}
        />
      )}
      <MobileBottomNav />
    </div>
  )
}

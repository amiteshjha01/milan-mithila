'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  Bell, Bookmark, ChevronDown, Compass, Grid2X2, Heart, Menu, MessageCircle,
  MoreHorizontal, Search, Settings, Sparkles, UserRound, X, FileText, Crown, LogOut
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { MobileBottomNav } from '@/components/site-shell'

export type ActiveNavKey =
  | 'overview'
  | 'discover'
  | 'interests'
  | 'messages'
  | 'shortlist'
  | 'profile'
  | 'biodata'
  | 'kundali'
  | 'concierge'
  | 'settings'

const primaryNavItems = [
  { key: 'overview', label: 'Overview', href: '/dashboard', icon: Grid2X2 },
  { key: 'discover', label: 'Discover', href: '/discover', icon: Compass },
  { key: 'interests', label: 'Interests', href: '/interests', icon: Heart },
  { key: 'messages', label: 'Messages', href: '/messages', icon: MessageCircle },
  { key: 'shortlist', label: 'Shortlist', href: '/discover?tab=shortlisted', icon: Bookmark },
]

const secondaryNavItems = [
  { key: 'profile', label: 'My profile', href: '/profile', icon: UserRound },
  { key: 'biodata', label: 'Biodata Maker', href: '/biodata', icon: FileText },
  { key: 'kundali', label: 'Kundali Milan', href: '/kundali-matching', icon: Sparkles },
  { key: 'concierge', label: 'Milan Select (VIP)', href: '/milan-select', icon: Crown },
  { key: 'settings', label: 'Settings', href: '/settings', icon: Settings },
]

function Logo() {
  return (
    <Link href="/dashboard" className="mm-logo" aria-label="Mithila Milan dashboard">
      <span className="mm-logo-mark">M</span>
      <span>Mithila <em>Milan</em></span>
    </Link>
  )
}

function UserMonogram({ name = 'Member', size = 'default', image }: { name?: string; size?: 'default' | 'large'; image?: string }) {
  const initials = name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'MM'
  const isImageValid = image && !image.includes('mitali-profile') && !image.includes('placeholder')
  const dimension = size === 'large' ? '48px' : '36px'
  const fontSize = size === 'large' ? '15px' : '12px'

  if (isImageValid) {
    return (
      <span className={`mm-avatar mm-avatar-terracotta mm-avatar-${size}`} style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
        <Image src={image} alt={initials} fill style={{ objectFit: 'cover' }} sizes={size === 'large' ? '48px' : '36px'} />
      </span>
    )
  }

  return (
    <span
      className={`mm-avatar mm-avatar-terracotta mm-avatar-${size}`}
      style={{
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, #1B4D3E 0%, #0B241D 100%)',
        color: '#FAF8F5',
        fontWeight: 700,
        fontSize,
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        border: '2px solid #D4AF37',
        letterSpacing: '0.05em',
        flexShrink: 0,
      }}
    >
      {initials}
    </span>
  )
}

interface AuthenticatedShellProps {
  children: React.ReactNode
  activeKey: ActiveNavKey
  breadcrumbSection?: string
  breadcrumbTitle: string
}

export default function AuthenticatedShell({
  children,
  activeKey,
  breadcrumbSection = 'My space',
  breadcrumbTitle,
}: AuthenticatedShellProps) {
  const { user, login, logout, mounted } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileMenu, setProfileMenu] = useState(false)
  const [notifMenu, setNotifMenu] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Search input & live dropdown state
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showResultsDropdown, setShowResultsDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        setIsSearchFocused(true)
      } else if (e.key === 'Escape') {
        setShowResultsDropdown(false)
        searchInputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowResultsDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Live debounced search
  useEffect(() => {
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profiles?q=${encodeURIComponent(trimmed)}`)
        if (res.ok) {
          const json = await res.json()
          setSearchResults(json.profiles ? json.profiles.slice(0, 5) : [])
        }
      } catch (err) {
        console.error('Search fetch error:', err)
      } finally {
        setIsSearching(false)
      }
    }, 200)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setShowResultsDropdown(false)
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/discover')
    }
  }

  // ROUTE PROTECTION: Redirect unauthenticated guests to /login
  useEffect(() => {
    if (isClient && !user) {
      const timer = setTimeout(() => {
        router.replace(`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`)
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [isClient, user, pathname, router])

  if (!isClient || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0B241D', color: '#FAF9F6', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '380px', width: '100%' }}>
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
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', margin: '0 0 6px', color: '#FAF9F6' }}>
            Mithila <em>Milan</em>
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: '0 0 20px', lineHeight: 1.5 }}>
            {!isClient ? 'Loading your member space...' : 'Please sign in to access your dashboard.'}
          </p>

          {isClient && !user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '11px 22px',
                  borderRadius: '999px',
                  background: '#D4AF37',
                  color: '#0B241D',
                  fontWeight: 700,
                  fontSize: '13px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
                }}
              >
                Sign In to Mithila Milan →
              </Link>
              <button
                type="button"
                onClick={() => {
                  login({
                    id: 'member_demo',
                    name: 'Amitesh Jha',
                    email: 'amitesh@mithilamilan.com',
                    role: 'Candidate (Seeker)',
                    avatar: '/images/placeholder-user.jpg',
                    isVerified: true,
                  })
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.85)',
                  padding: '9px 18px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Continue with Demo Session
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mm-app">
      {/* SIDEBAR */}
      <aside className={`mm-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="mm-sidebar-top">
          <Logo />
          <button className="mm-icon-button mm-mobile-close" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>

        <div className="mm-sidebar-label">Your space</div>
        <nav className="mm-nav" aria-label="Application navigation">
          {primaryNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeKey === item.key
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mm-nav-item ${isActive ? 'is-active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mm-sidebar-label mm-sidebar-label-secondary">Manage</div>
        <nav className="mm-nav" aria-label="Account navigation">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeKey === item.key
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mm-nav-item ${isActive ? 'is-active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mm-sidebar-bottom">
          <div className="mm-heritage-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <Image src="/images/mithila-aripan.png" alt="Aripan motif" fill style={{ objectFit: 'cover', opacity: 0.25 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(32,50,44,0.7)' }} />
            <Sparkles style={{ position: 'relative', zIndex: 2 }} />
            <span style={{ position: 'relative', zIndex: 2 }}>Keep your story<br /><strong>close to the heart.</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
            <Link href="/profile" className="mm-sidebar-user" style={{ textDecoration: 'none', padding: 0 }}>
              <UserMonogram name={user.name} image={user.avatar} />
              <span><strong>{user.name}</strong><small>{user.role || 'Member'}</small></span>
            </Link>
            <button
              onClick={logout}
              title="Log out from account"
              style={{ background: 'none', border: 'none', color: '#8C2D19', cursor: 'pointer', padding: '6px' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <button className="mm-sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

      {/* MAIN CONTAINER */}
      <div className="mm-main">
        {/* TOPBAR */}
        <header className="mm-topbar">
          <button className="mm-icon-button mm-menu-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
          <div className="mm-breadcrumb">
            <span>{breadcrumbSection}</span>
            <span className="mm-breadcrumb-slash">/</span>
            <strong>{breadcrumbTitle}</strong>
          </div>

          <div className="mm-topbar-actions">
            {/* Interactive Clickable & Writable Search Input */}
            <div style={{ position: 'relative' }} ref={searchContainerRef}>
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: isSearchFocused ? '1.5px solid #8C2D19' : '1px solid rgba(197, 154, 63, 0.45)',
                  borderRadius: '999px',
                  background: isSearchFocused ? '#FFFFFF' : '#FAF9F6',
                  padding: '6px 14px',
                  boxShadow: isSearchFocused ? '0 0 0 3px rgba(140, 45, 25, 0.1)' : '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                  width: 'clamp(200px, 22vw, 320px)',
                }}
              >
                <Search
                  size={14}
                  style={{
                    color: isSearchFocused ? '#8C2D19' : '#64748B',
                    flexShrink: 0,
                  }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowResultsDropdown(true)
                  }}
                  onFocus={() => {
                    setIsSearchFocused(true)
                    if (searchQuery.trim().length > 0) setShowResultsDropdown(true)
                  }}
                  onBlur={() => {
                    setIsSearchFocused(false)
                  }}
                  placeholder="Search profiles, Gotra, city..."
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '12px',
                    color: '#0F172A',
                    outline: 'none',
                    width: '100%',
                    padding: 0,
                    fontFamily: 'inherit',
                  }}
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setShowResultsDropdown(false)
                      searchInputRef.current?.focus()
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                    title="Clear search"
                  >
                    <X size={13} />
                  </button>
                ) : (
                  <kbd
                    style={{
                      border: '1px solid rgba(15, 23, 42, 0.12)',
                      borderRadius: '4px',
                      padding: '1px 5px',
                      color: '#94A3B8',
                      fontSize: '10px',
                      background: '#FFFFFF',
                      flexShrink: 0,
                      userSelect: 'none',
                      fontFamily: 'inherit',
                    }}
                  >
                    ⌘K
                  </kbd>
                )}
              </form>

              {/* Live Search Results Dropdown */}
              {showResultsDropdown && searchQuery.trim().length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    minWidth: '320px',
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 16px 36px rgba(11,36,29,0.16)',
                    padding: '8px',
                    zIndex: 1000,
                    maxHeight: '380px',
                    overflowY: 'auto',
                  }}
                >
                  <div style={{ padding: '6px 10px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {isSearching ? 'Searching profiles...' : `Matching Profiles (${searchResults.length})`}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>Press Enter to view all</span>
                  </div>

                  {searchResults.length === 0 && !isSearching ? (
                    <div style={{ padding: '16px 12px', textAlign: 'center', color: '#64748B', fontSize: '12px' }}>
                      <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#0F172A' }}>No matching profiles found</p>
                      <button
                        type="button"
                        onClick={() => handleSearchSubmit()}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8C2D19',
                          fontWeight: 650,
                          fontSize: '12px',
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        Search directory in Discover ↗
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                      {searchResults.map((item: any) => {
                        const profileId = item.id || item.profileCode || item._id
                        const initials = item.name ? item.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'MM'
                        return (
                          <Link
                            key={profileId}
                            href={`/profiles/${profileId}`}
                            onClick={() => setShowResultsDropdown(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              textDecoration: 'none',
                              color: 'inherit',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#FAF8F5' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                          >
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1B4D3E, #0B241D)',
                                color: '#FAF8F5',
                                display: 'grid',
                                placeItems: 'center',
                                fontWeight: 700,
                                fontSize: '12px',
                                flexShrink: 0,
                                border: '1.5px solid #D4AF37',
                              }}
                            >
                              {initials}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <strong style={{ fontSize: '13px', color: '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                  {item.name}
                                </strong>
                                {item.age && <span style={{ fontSize: '11px', color: '#64748B' }}>({item.age} yrs)</span>}
                              </div>
                              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {item.profession || 'Professional'} · {item.city || item.nativeDistrict || 'Mithila'}
                              </span>
                            </div>
                            {item.gotra && (
                              <span style={{ fontSize: '10px', background: 'rgba(212,175,55,0.15)', color: '#8C2D19', padding: '2px 6px', borderRadius: '4px', fontWeight: 650, flexShrink: 0 }}>
                                {item.gotra}
                              </span>
                            )}
                          </Link>
                        )
                      })}

                      <button
                        type="button"
                        onClick={() => handleSearchSubmit()}
                        style={{
                          marginTop: '4px',
                          padding: '8px 10px',
                          border: 'none',
                          borderTop: '1px solid rgba(0,0,0,0.06)',
                          background: '#FAF8F5',
                          borderRadius: '6px',
                          color: '#8C2D19',
                          fontWeight: 700,
                          fontSize: '12px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>View all matching results in Discover</span>
                        <span>↗</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button className="mm-icon-button mm-notification-button" aria-label="Notifications" onClick={() => setNotifMenu(!notifMenu)}>
                <Bell /><i />
              </button>
              {notifMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '280px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(15,23,42,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 12px 32px rgba(11,36,29,0.12)',
                    zIndex: 100,
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A8331E', marginBottom: '8px' }}>
                    Activity & Updates
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>Your profile is active and visible to verified members.</div>
                    <Link href="/interests" onClick={() => setNotifMenu(false)} style={{ color: '#A8331E', fontWeight: 650, fontSize: '12px' }}>
                      View expressions of interest ↗
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button className="mm-top-profile" onClick={() => setProfileMenu(!profileMenu)}>
                <UserMonogram name={user.name} image={user.avatar} />
                <span>{user.name}</span>
                <ChevronDown />
              </button>

              {profileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '220px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(15,23,42,0.1)',
                    borderRadius: '12px',
                    padding: '8px 0',
                    boxShadow: '0 12px 32px rgba(11,36,29,0.12)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ padding: '8px 16px 10px', borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#0F172A' }}>{user.name}</strong>
                    <small style={{ fontSize: '11px', color: '#64748B' }}>{user.email}</small>
                  </div>

                  <Link href="/profile" onClick={() => setProfileMenu(false)} style={{ padding: '8px 16px', fontSize: '13px', color: '#0F172A', textDecoration: 'none' }}>
                    Edit profile
                  </Link>
                  <Link href="/settings" onClick={() => setProfileMenu(false)} style={{ padding: '8px 16px', fontSize: '13px', color: '#0F172A', textDecoration: 'none' }}>
                    Account settings
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setProfileMenu(false)} style={{ padding: '8px 16px', fontSize: '13px', color: '#1B4D3E', fontWeight: 650, textDecoration: 'none' }}>
                      Admin Operations Portal ✦
                    </Link>
                  )}
                  <Link href="/" onClick={() => setProfileMenu(false)} style={{ padding: '8px 16px', fontSize: '13px', color: '#64748B', textDecoration: 'none' }}>
                    Return to home
                  </Link>

                  <div style={{ height: '1px', background: 'rgba(15,23,42,0.06)', margin: '4px 0' }} />
                  <button
                    onClick={() => { setProfileMenu(false); logout() }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: '8px 16px',
                      fontSize: '13px',
                      color: '#A8331E',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 600,
                    }}
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        {children}
      </div>

      <MobileBottomNav />
    </div>
  )
}

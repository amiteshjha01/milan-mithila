'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Home, Compass, Heart, MessageCircle, UserRound, Sparkles, LogIn, LogOut, ShieldCheck, User, Grid2X2 } from 'lucide-react'
import { AuthModal } from '@/components/auth/auth-modal'
import { useAuth } from '@/lib/auth-context'

const nav = [
  ['About', '/about'],
  ['How it works', '/how-it-works'],
  ['Kundali Milan', '/kundali-matching'],
  ['Milan Select (VIP)', '/milan-select'],
  ['Biodata Maker', '/biodata'],
  ['Cultural heritage', '/culture'],
]

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><span>M</span></span>
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { user, logout, openAuthModal } = useAuth()
  const pathname = usePathname()

  return (
    <>
      <header
        className="site-header"
        style={{
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--border)',
          padding: '0 clamp(16px, 3.5vw, 48px)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            minHeight: '68px',
          }}
        >
          <Link className="brand" href={user ? '/dashboard' : '/'} style={{ flexShrink: 0 }}>
            <Mark />
            <span>Mithila <em>Milan</em></span>
          </Link>

          <nav
            className="desktop-nav"
            aria-label="Primary navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(14px, 1.8vw, 28px)',
              marginLeft: 'auto',
              marginRight: '12px',
            }}
          >
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                style={{
                  color: pathname === href ? '#8C2D19' : '#334155',
                  fontWeight: pathname === href ? 700 : 500,
                  fontSize: '13px',
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Action: ONLY Login or User Account / Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', flexShrink: 0 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                href="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  background: '#163B30',
                  color: '#FAF8F5',
                  fontSize: '12px',
                  fontWeight: 650,
                  textDecoration: 'none',
                  border: '1px solid #D4AF37',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
              >
                <Grid2X2 size={13} color="#D4AF37" />
                <span>Dashboard</span>
              </Link>

              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px 6px 6px',
                    borderRadius: '999px',
                    background: '#ffffff',
                    border: '1.5px solid rgba(140,45,25,0.25)',
                    cursor: 'pointer',
                    font: 'inherit',
                    fontSize: '13px',
                    fontWeight: 650,
                    color: '#20322C',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                  title="Click for profile and account options"
                >
                  <div style={{ position: 'relative', width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden' }}>
                    <Image src={user.avatar} alt={user.name} fill style={{ objectFit: 'cover' }} sizes="28px" />
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                  <ShieldCheck size={14} color="#166534" />
                </button>

                {profileDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '210px',
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                      padding: '8px',
                      zIndex: 1000,
                    }}
                  >
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '12px', display: 'block', color: '#20322C' }}>{user.name}</strong>
                      <small style={{ fontSize: '11px', color: 'rgba(32,50,44,0.6)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {user.email}
                      </small>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#0B241D',
                        textDecoration: 'none',
                        fontWeight: 700,
                        background: '#FAF8F5',
                        marginBottom: '4px',
                      }}
                    >
                      <Grid2X2 size={14} color="#163B30" />
                      <span>My Dashboard</span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#20322C',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      <User size={14} color="#8C2D19" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false)
                        openAuthModal()
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#20322C',
                        background: 'transparent',
                        border: 'none',
                        width: '100%',
                        cursor: 'pointer',
                        fontWeight: 600,
                        textAlign: 'left',
                      }}
                    >
                      <Sparkles size={14} color="#8C2D19" />
                      <span>Switch Account</span>
                    </button>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#0B241D',
                          textDecoration: 'none',
                          fontWeight: 600,
                          background: '#FAF8F5',
                        }}
                      >
                        <ShieldCheck size={14} color="#0B241D" />
                        <span>Admin Operations</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false)
                        logout()
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#991B1B',
                        background: '#FEF2F2',
                        border: 'none',
                        width: '100%',
                        cursor: 'pointer',
                        fontWeight: 650,
                        marginTop: '4px',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => logout()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'transparent',
                  border: '1px solid rgba(153,27,27,0.25)',
                  color: '#991B1B',
                  fontSize: '12px',
                  fontWeight: 650,
                  cursor: 'pointer',
                }}
                title="Log out of account"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : pathname === '/login' ? (
            <Link
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 20px',
                borderRadius: '999px',
                background: '#163B30',
                color: '#FAF8F5',
                border: '1px solid #D4AF37',
                fontSize: '13px',
                fontWeight: 650,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(22,59,48,0.15)',
              }}
            >
              <span>Create Account</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 20px',
                borderRadius: '999px',
                background: '#8C2D19',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 650,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(140,45,25,0.2)',
                letterSpacing: '0.02em',
              }}
            >
              <LogIn size={15} />
              <span>Login</span>
            </button>
          )}

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: '1px solid rgba(32,50,44,0.3)',
              borderRadius: '999px',
              padding: '8px 14px',
              cursor: 'pointer',
              font: 'inherit',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--foreground)',
            }}
          >
            {mobileMenuOpen ? '✕ Close' : '☰ Menu'}
          </button>
        </div>
      </div>
    </header>

      <AuthModal />

      {mobileMenuOpen && (
        <div
          className="mobile-nav-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(27,45,38,0.97)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '70px 24px 40px',
            backdropFilter: 'blur(12px)',
            overflowY: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(245,241,233,0.3)',
              color: '#fffaf1',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            aria-label="Close menu"
          >
            ✕
          </button>
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              textAlign: 'center',
              width: '100%',
              maxWidth: '320px',
            }}
          >
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#fffaf1',
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 'clamp(17px, 4.5vw, 21px)',
                  textDecoration: 'none',
                  padding: '6px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {label}
              </Link>
            ))}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                className="button button-primary"
                href="/discover"
                onClick={() => setMobileMenuOpen(false)}
                style={{ justifyContent: 'center', padding: '12px 20px', fontSize: '13px' }}
              >
                Explore Matches ↗
              </Link>
              <Link
                className="button button-light"
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ justifyContent: 'center', padding: '12px 20px', fontSize: '13px' }}
              >
                Go to Dashboard ↗
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

export function SiteFooter() {
  return (
    <footer style={{ background: '#0B241D', color: '#FAF8F5', padding: '60px clamp(20px, 5vw, 80px) 36px', borderTop: '2px solid rgba(197, 154, 63, 0.3)' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Col 1: Brand & Sanskrit Blessing */}
        <div>
          <Link className="brand" href="/" style={{ color: '#FAF8F5' }}>
            <span style={{ display: 'grid', width: '38px', height: '38px', placeItems: 'center', border: '1.5px solid #D4AF37', borderRadius: '50%', background: '#163B30', color: '#D4AF37', fontWeight: 800 }}>M</span>
            <span>Mithila <em style={{ color: '#F4D068' }}>Milan</em></span>
          </Link>
          <p style={{ margin: '14px 0 0', fontSize: '13px', color: 'rgba(250,248,245,0.7)', lineHeight: 1.6, maxWidth: '300px' }}>
            The premier consent-first matrimonial sanctuary for the global Maithil community. Rooted in sacred Gotra heritage, dignity, and intellectual companionship.
          </p>
          <div style={{ marginTop: '16px', fontFamily: 'serif', color: '#D4AF37', fontSize: '13px', letterSpacing: '0.04em' }}>
            ॥ सखा सप्तपदा भव · सख्यं ते गमेयं ॥
          </div>
        </div>

        {/* Col 2: Heritage Tools */}
        <div>
          <strong style={{ display: 'block', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '14px' }}>
            Sanctuary Tools
          </strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
            <Link href="/kundali-matching" style={{ color: 'rgba(250,248,245,0.85)', textDecoration: 'none' }}>Vedic Kundali Matching (अष्टकूट)</Link>
            <Link href="/biodata" style={{ color: 'rgba(250,248,245,0.85)', textDecoration: 'none' }}>Luxury Matrimonial Biodata</Link>
            <Link href="/milan-select" style={{ color: 'rgba(250,248,245,0.85)', textDecoration: 'none' }}>Milan Select (VIP Concierge)</Link>
            <Link href="/discover" style={{ color: 'rgba(250,248,245,0.85)', textDecoration: 'none' }}>Search Verified Profiles</Link>
            <Link href="/culture" style={{ color: 'rgba(250,248,245,0.85)', textDecoration: 'none' }}>Panji & Cultural Framework</Link>
          </div>
        </div>

        {/* Col 3: Community & Trust */}
        <div>
          <strong style={{ display: 'block', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '14px' }}>
            Trust & Sanctuary
          </strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
            <Link href="/about" style={{ color: 'rgba(250,248,245,0.85)', textDecoration: 'none' }}>About Our Covenant</Link>
            <Link href="/how-it-works" style={{ color: 'rgba(250,248,245,0.85)', textDecoration: 'none' }}>How Introductions Work</Link>
            <Link href="/safety" style={{ color: 'rgba(250,248,245,0.85)', textDecoration: 'none' }}>Trust, Safety & DPDP Act</Link>
            <Link href="/membership" style={{ color: 'rgba(250,248,245,0.85)', textDecoration: 'none' }}>Membership Privileges</Link>
            <Link href="/contact" style={{ color: 'rgba(250,248,245,0.85)', textDecoration: 'none' }}>Discreet Elder Inquiries</Link>
          </div>
        </div>

        {/* Col 4: Member Access & Guarantee */}
        <div>
          <strong style={{ display: 'block', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '14px' }}>
            Seeker Sanctuary
          </strong>
          <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'rgba(250,248,245,0.65)', lineHeight: 1.5 }}>
            100% verified profiles. Zero unsolicited marketing calls. Strict moral pledge against dowry solicitation.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FAF8F5',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Enter Member Space ↗
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1440px', margin: '24px auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '11px', color: 'rgba(250,248,245,0.5)' }}>
        <span>© 2026 Mithila Milan · All rights reserved · Anti-Dowry Covenant Enforced</span>
        <div style={{ display: 'flex', gap: '18px' }}>
          <Link href="/privacy" style={{ color: 'inherit' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'inherit' }}>Terms of Service</Link>
          <Link href="/safety" style={{ color: 'inherit' }}>DPDP Compliance</Link>
        </div>
      </div>
    </footer>
  )
}

export function MobileBottomNav() {
  const pathname = usePathname()

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Discover', href: '/discover', icon: Compass },
    { label: 'Kundali', href: '/kundali-matching', icon: Sparkles },
    { label: 'Messages', href: '/messages', icon: MessageCircle },
    { label: 'Space', href: '/dashboard', icon: UserRound },
  ]

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={isActive ? 'is-active' : ''}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="public-page">
      <div className="public-shell">
        <SiteHeader />
        {children}
      </div>
      <SiteFooter />
      <MobileBottomNav />
    </main>
  )
}

export function PageIntro({ kicker, title, description, label }: { kicker: string; title: React.ReactNode; description: string; label: string }) {
  return <section className="page-intro"><div className="page-intro-copy"><p className="eyebrow"><span className="eyebrow-line" />{kicker}</p><h1>{title}</h1><p className="page-lead">{description}</p></div><div className="page-intro-index" aria-hidden="true"><span>{label}</span><i /></div></section>
}

export function SectionTitle({ kicker, title, copy }: { kicker: string; title: React.ReactNode; copy?: string }) {
  return <div className="public-section-title"><div><p className="eyebrow">{kicker}</p><h2>{title}</h2></div>{copy && <p>{copy}</p>}</div>
}

export function EditorialNote({ children }: { children: React.ReactNode }) { return <aside className="editorial-note"><span>Field note</span><p>{children}</p></aside> }

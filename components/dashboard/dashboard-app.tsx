'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Bell, Bookmark, Check, ChevronDown, Compass, Eye, Grid2X2, Heart, Menu, MessageCircle,
  MoreHorizontal, Search, Send, Settings, ShieldCheck, Sparkles, UserRound, X, MapPin,
} from 'lucide-react'
import {
  dashboardNav, dashboardUser, dashboardStats, recommendedProfiles, recentProfiles, receivedInterests, secondaryNav,
} from '@/lib/mock-dashboard'

const iconMap = { grid: Grid2X2, compass: Compass, heart: Heart, message: MessageCircle, bookmark: Bookmark, user: UserRound, settings: Settings }

function Logo() {
  return <Link href="/dashboard" className="mm-logo" aria-label="Mithila Milan dashboard"><span className="mm-logo-mark">M</span><span>Mithila <em>Milan</em></span></Link>
}

function ProfileAvatar({ initials, tone = 'sage', size = 'default' }: { initials: string; tone?: string; size?: 'default' | 'large' }) {
  return <span className={`mm-avatar mm-avatar-${tone} mm-avatar-${size}`} aria-hidden="true">{initials}</span>
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <aside className={`mm-sidebar ${open ? 'is-open' : ''}`}>
    <div className="mm-sidebar-top"><Logo /><button className="mm-icon-button mm-mobile-close" aria-label="Close navigation" onClick={onClose}><X /></button></div>
    <div className="mm-sidebar-label">Your space</div>
    <nav className="mm-nav" aria-label="Application navigation">
      {dashboardNav.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap]
        return <Link key={item.href} href={item.href} className={`mm-nav-item ${item.label === 'Overview' ? 'is-active' : ''}`} onClick={onClose}><Icon /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</Link>
      })}
    </nav>
    <div className="mm-sidebar-label mm-sidebar-label-secondary">Manage</div>
    <nav className="mm-nav" aria-label="Account navigation">
      {secondaryNav.map((item) => { const Icon = iconMap[item.icon as keyof typeof iconMap]; return <Link key={item.href} href={item.href} className="mm-nav-item" onClick={onClose}><Icon /><span>{item.label}</span></Link> })}
    </nav>
    <div className="mm-sidebar-bottom">
      <div className="mm-heritage-card"><div className="mm-heritage-pattern" /><Sparkles /><span>Keep your story<br /><strong>close to the heart.</strong></span></div>
      <div className="mm-sidebar-user"><ProfileAvatar initials={dashboardUser.initials} tone="terracotta" /><span><strong>{dashboardUser.name}</strong><small>{dashboardUser.membership}</small></span><MoreHorizontal /></div>
    </div>
  </aside>
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  return <header className="mm-topbar"><button className="mm-icon-button mm-menu-button" aria-label="Open navigation" onClick={onMenu}><Menu /></button><div className="mm-breadcrumb"><span>My space</span><span className="mm-breadcrumb-slash">/</span><strong>Overview</strong></div><div className="mm-topbar-actions"><button className="mm-search-trigger" aria-label="Open search"><Search /><span>Search profiles</span><kbd>⌘ K</kbd></button><button className="mm-icon-button mm-notification-button" aria-label="Notifications"><Bell /><i /></button><button className="mm-top-profile"><ProfileAvatar initials={dashboardUser.initials} tone="terracotta" /><span>{dashboardUser.name}</span><ChevronDown /></button></div></header>
}

function WelcomeCard() {
  return <section className="mm-welcome-card"><div className="mm-welcome-copy"><div className="mm-kicker"><span className="mm-kicker-line" /> Tuesday, 14 October 2026</div><h1>Good morning, <em>Mitali.</em></h1><p>A little room for discovery, a little time for the things that matter.</p><div className="mm-welcome-actions"><Link href="/dashboard/discover" className="mm-primary-button">Discover matches <Compass /></Link><Link href="/dashboard/profile" className="mm-text-button">Complete your profile <span>↗</span></Link></div></div><div className="mm-welcome-art" aria-hidden="true"><div className="mm-art-sun" /><div className="mm-art-arch"><div /></div><div className="mm-art-stem mm-art-stem-one" /><div className="mm-art-stem mm-art-stem-two" /><i className="mm-art-leaf mm-art-leaf-one" /><i className="mm-art-leaf mm-art-leaf-two" /><span className="mm-art-script">मिथिला</span></div></section>
}

function CompletionCard() {
  return <section className="mm-completion-card"><div className="mm-card-eyebrow"><span>Profile strength</span><span className="mm-status-pill"><span /> Good start</span></div><div className="mm-completion-main"><div className="mm-progress-ring" style={{ '--progress': `${dashboardUser.completion * 3.6}deg` } as React.CSSProperties}><div><strong>{dashboardUser.completion}%</strong><small>complete</small></div></div><div><h2>Let your whole story show.</h2><p>Profiles with a little more context receive more thoughtful introductions.</p><Link href="/dashboard/profile" className="mm-inline-link">Add your family story <span>↗</span></Link></div></div><div className="mm-completion-bar"><span style={{ width: `${dashboardUser.completion}%` }} /></div></section>
}

function ProfileCard({ profile }: { profile: typeof recommendedProfiles[number] }) {
  return <article className="mm-match-card"><div className={`mm-match-image mm-tone-${profile.tone}`}><span className="mm-match-star">✦</span><ProfileAvatar initials={profile.initials} tone={profile.tone} size="large" /><span className="mm-match-match"><Heart /> {profile.match} match</span></div><div className="mm-match-content"><div className="mm-match-heading"><div><h3>{profile.name}, {profile.age}</h3><p>{profile.role}</p></div><button className="mm-round-button" aria-label={`Shortlist ${profile.name}`}><Bookmark /></button></div><div className="mm-match-location"><MapPin /> {profile.location}</div><div className="mm-match-tag"><span /> {profile.tag} <small>{profile.detail}</small></div></div></article>
}

function InterestRow({ interest }: { interest: typeof receivedInterests[number] }) {
  return <div className="mm-interest-row"><ProfileAvatar initials={interest.initials} tone={interest.tone} /><div className="mm-interest-copy"><strong>{interest.name}</strong><span>{interest.detail}</span></div><time>{interest.time}</time><div className="mm-interest-actions"><button className="mm-small-button mm-small-button-primary"><Check /> Accept</button><button className="mm-small-button" aria-label={`More actions for ${interest.name}`}><MoreHorizontal /></button></div></div>
}

export default function DashboardApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return <div className="mm-app"><Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />{sidebarOpen && <button className="mm-sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} /> }<div className="mm-main"><Topbar onMenu={() => setSidebarOpen(true)} /><main className="mm-dashboard"><WelcomeCard /><div className="mm-dashboard-grid"><div className="mm-dashboard-primary"><div className="mm-section-heading"><div><p className="mm-section-kicker">Curated for you</p><h2>A few people to <em>begin with.</em></h2></div><Link href="/dashboard/discover" className="mm-view-all">View all <span>↗</span></Link></div><div className="mm-match-grid">{recommendedProfiles.map((profile) => <ProfileCard key={profile.id} profile={profile} />)}</div><div className="mm-section-heading mm-recent-heading"><div><p className="mm-section-kicker">Your journey so far</p><h2>Recently <em>visited.</em></h2></div><Link href="/dashboard/discover" className="mm-view-all">See history <span>↗</span></Link></div><div className="mm-recent-grid">{recentProfiles.map((profile) => <Link href={`/dashboard/profile/${profile.id}`} className="mm-recent-card" key={profile.id}><ProfileAvatar initials={profile.initials} tone={profile.tone} /><span><strong>{profile.name}</strong><small>{profile.role} · {profile.location}</small><em>{profile.viewed}</em></span><ChevronDown /></Link>)}</div></div><aside className="mm-dashboard-aside"><CompletionCard /><section className="mm-side-card"><div className="mm-side-heading"><div><p className="mm-section-kicker">Awaiting your reply</p><h2>Received <em>interests.</em></h2></div><Link href="/dashboard/interests" aria-label="View all interests">↗</Link></div><div className="mm-interest-list">{receivedInterests.map((interest) => <InterestRow key={interest.id} interest={interest} />)}</div><Link href="/dashboard/interests" className="mm-side-footer-link">See all interests <span>↗</span></Link></section><section className="mm-stats-card"><div className="mm-side-heading"><div><p className="mm-section-kicker">A quick look</p><h2>Your <em>activity.</em></h2></div><button aria-label="Activity options"><MoreHorizontal /></button></div><div className="mm-stats-list">{dashboardStats.map((stat) => <div className="mm-stat-row" key={stat.label}><span className="mm-stat-icon">{stat.icon === 'eye' ? <Eye /> : stat.icon === 'bookmark' ? <Bookmark /> : <Send />}</span><span><strong>{stat.value}</strong><small>{stat.label}</small></span><em>{stat.change}</em></div>)}</div></section><div className="mm-verified-card"><div className="mm-verified-icon"><ShieldCheck /></div><div><strong>Build trust early</strong><p>Verify your identity when you&apos;re ready to make your profile more visible.</p><Link href="/dashboard/profile">Learn more <span>↗</span></Link></div></div></aside></div></main><footer className="mm-footer"><span>© 2026 Mithila Milan</span><span>Community-led · Private by design</span><Link href="/safety">Trust & safety <span>↗</span></Link></footer></div></div>
}

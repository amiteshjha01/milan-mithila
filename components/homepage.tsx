'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Check, ChevronRight, Compass, Heart, LockKeyhole, MapPin,
  MessageCircle, Search, ShieldCheck, Sparkles, Star, UserRound, Users, X, Award, Eye,
  BookOpen, Crown, Coffee, FileText,
} from 'lucide-react'
import { SiteHeader, SiteFooter, MobileBottomNav } from './site-shell'

const heroArtworks = [
  {
    id: 'kohbar',
    title: 'कोहबर / Kohbar Ghar',
    subtitle: 'Sacred Nuptial Chamber Mural',
    image: '/images/mithila-kohbar.png',
    tag: 'Masterpiece · 2026',
    description: 'The defining visual signature of a Maithil union: the holy Lotus (Kamal) for purity, the Fish pair (Macha) for eternal abundance, the Bamboo grove (Bans) for resilience, and the Sun & Moon as eternal witnesses.',
  },
  {
    id: 'vivah',
    title: 'सिंदूर दान / Vivah Rites',
    subtitle: 'The Vow of Companion Equality',
    image: '/images/mithila-vivah.png',
    tag: 'Sacred Rites · Vedic Vivah',
    description: 'Surrounded by elders and chanting of Vedic mantras, the solemn oath of lifelong fidelity and companionship (सखा सप्तपदा भव) is sealed with sacred sindoor.',
  },
  {
    id: 'aripan',
    title: 'अरिपन / Aripan Mandala',
    subtitle: 'Sacred Geometric Floor Blessing',
    image: '/images/mithila-aripan.png',
    tag: 'Spiritual Geometry · Samdaun',
    description: 'Hand-drawn with rice paste (Pithar) and vermilion on auspicious mornings, channeling cosmic harmony and invoking divine blessings for the bride and groom.',
  },
]

const steps = [
  ['01', 'Create your profile', 'Share your personal, academic, and professional story at your own pace.'],
  ['02', 'Add cultural context', 'Voluntarily include Gotra, Mool, or native village details with granular privacy controls.'],
  ['03', 'Discover thoughtfully', 'Browse verified Maithil profiles with shared values, lifestyle, and life vision.'],
  ['04', 'Express mutual interest', 'Send a considered signal. Conversations only begin when both individuals agree.'],
  ['05', 'Involve your families', 'Introduce parents and trusted elders when you choose, in an atmosphere of mutual warmth.'],
]

const nativeDistricts = [
  { key: 'darbhanga', name: 'Darbhanga (दरभंगा)' },
  { key: 'madhubani', name: 'Madhubani (मधुबनी)' },
  { key: 'samastipur', name: 'Samastipur (समस्तीपुर)' },
  { key: 'saharsa', name: 'Saharsa (सहरसा)' },
  { key: 'sitamarhi', name: 'Sitamarhi (सीतामढ़ी)' },
  { key: 'janakpur', name: 'Janakpur Dham (जनकपुर धाम)' },
  { key: 'muzaffarpur', name: 'Muzaffarpur (मुजफ्फरपुर)' },
  { key: 'supaul', name: 'Supaul (सुपौल)' },
  { key: 'begusarai', name: 'Begusarai (बेगूसराय)' },
  { key: 'delhi', name: 'Delhi NCR & Bengaluru' },
  { key: 'diaspora', name: 'Global Diaspora (USA/UK)' },
]

const testimonials = [
  {
    quote: 'Mithila Milan made room for our families to talk with complete respect. My father valued the clarity around our Mool and Sakri roots, while I appreciated that no one received my phone number without my consent.',
    author: 'Shruti & Aarav',
    location: 'Bengaluru & Darbhanga',
    year: 'Married Feb 2026',
    initials: 'SA',
    verified: 'Verified Marriage',
  },
  {
    quote: 'Every other matrimonial app felt like an endless commercial feed with unsolicited calls. Here, we found genuine conversations, educated professionals, and shared Maithil memories from our childhood.',
    author: 'Namrata & Priyaranjan',
    location: 'New Delhi & Madhubani',
    year: 'Engaged Oct 2026',
    initials: 'NP',
    verified: 'Community Union',
  },
  {
    quote: 'Being in the Bay Area, finding a life partner who understands both high-tech Silicon Valley life and Mithila rituals felt impossible. Mithila Milan bridged that distance effortlessly.',
    author: 'Sneha & Vikram',
    location: 'California & Janakpur roots',
    year: 'Married Dec 2025',
    initials: 'SV',
    verified: 'Diaspora Union',
  },
]

export default function Homepage() {
  const [activeArtIndex, setActiveArtIndex] = useState(0)
  const [seeking, setSeeking] = useState<'bride' | 'groom'>('bride')
  const [ageRange, setAgeRange] = useState('22-29')
  const [gotra, setGotra] = useState('all')
  const [location, setLocation] = useState('all')
  const [spotlightProfiles, setSpotlightProfiles] = useState<any[]>([])
  const [districtCounts, setDistrictCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/api/stats/public')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.districts && typeof data.districts === 'object') {
          setDistrictCounts(data.districts)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const target = seeking === 'bride' ? 'Woman' : 'Man'
    fetch(`/api/profiles?targetGender=${target}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profiles && Array.isArray(data.profiles)) {
          setSpotlightProfiles(data.profiles.slice(0, 4))
        }
      })
      .catch((err) => console.warn('Spotlight profiles fetch notice:', err))
  }, [seeking])

  const currentArt = heroArtworks[activeArtIndex]

  return (
    <main style={{ background: '#FAF9F6' }}>
      {/* 1. HERO SECTION WITH LUXURY MITHILA AESTHETICS */}
      <section className="hero-shell" id="top">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        
        <SiteHeader />

        <div className="hero-grid">
          <div className="hero-copy">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                background: 'rgba(184,58,36,0.08)',
                border: '1px solid rgba(197,154,63,0.35)',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--terracotta)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              <Sparkles size={13} color="#C59A3F" />
              <span>मिथिला मिलन</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>The Royal Matrimonial Sanctuary</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>100% Consent First</span>
            </div>

            <h1 style={{ letterSpacing: '-0.04em', lineHeight: 1.02, color: '#0F172A' }}>
              Where Sacred Lineage Meets <em>Modern Hearts.</em>
            </h1>

            <p className="hero-intro">
              An exclusive, consent-first matrimonial sanctuary for the global Maithil community. Designed for thoughtful individuals and cultured families who believe a sacred union begins with mutual dignity, authentic Gotra roots, and emotional equality.
            </p>

            {/* INTERACTIVE 'FIND YOUR SACRED MATCH' BAR (INDUSTRY LEADING) */}
            <div
              style={{
                marginTop: '28px',
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '18px 20px',
                border: '1.5px solid rgba(197, 154, 63, 0.4)',
                boxShadow: '0 16px 36px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(197, 154, 63, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#B83A24' }} />
                <strong style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0F172A' }}>
                  Quick Match Discovery · त्वरित वर-वधू शोध
                </strong>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#059669', fontWeight: 600 }}>● 1,420+ Verified Members</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>Seeking</label>
                  <select
                    value={seeking}
                    onChange={(e) => setSeeking(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}
                  >
                    <option value="bride">Bride (कन्या / वधू)</option>
                    <option value="groom">Groom (वर)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>Age Range</label>
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}
                  >
                    <option value="21-26">21 to 26 Yrs</option>
                    <option value="24-29">24 to 29 Yrs</option>
                    <option value="27-32">27 to 32 Yrs</option>
                    <option value="30-36">30 to 36 Yrs</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>Gotra (गोत्र)</label>
                  <select
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}
                  >
                    <option value="all">Any Gotra (सभी)</option>
                    <option value="Kashyapa">Kashyapa (कश्यप)</option>
                    <option value="Bharadwaja">Bharadwaja (भारद्वाज)</option>
                    <option value="Shandilya">Shandilya (शांडिल्य)</option>
                    <option value="Vashishtha">Vashishtha (वशिष्ठ)</option>
                    <option value="Parashara">Parashara (पराशर)</option>
                    <option value="Garga">Garga (गर्ग)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>Region / City</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}
                  >
                    <option value="all">All Regions (Mithila & Global)</option>
                    <option value="Darbhanga">Darbhanga (दरभंगा)</option>
                    <option value="Madhubani">Madhubani (मधुबनी)</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai / Pune</option>
                    <option value="NRI">Global NRIs (USA/UK)</option>
                  </select>
                </div>

                <div style={{ alignSelf: 'flex-end' }}>
                  <Link
                    href={`/discover?seeking=${seeking}&gotra=${gotra}&location=${location}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #B83A24 0%, #8C2210 100%)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(184, 58, 36, 0.3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Search size={14} />
                    <span>Search Matches</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="hero-actions" style={{ marginTop: '24px' }}>
              <Link className="button button-primary" href="/discover" style={{ fontSize: '13px', padding: '13px 24px' }}>
                <Compass size={16} /> Explore All Profiles <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button button-outline" href="/dashboard" style={{ background: '#FFFFFF', color: '#0F172A', fontSize: '13px', padding: '13px 22px' }}>
                Open Member Space <span aria-hidden="true">→</span>
              </Link>
              <Link className="text-link" href="/kundali-matching" style={{ fontSize: '13px' }}>
                Kundali Milan Calculator <span aria-hidden="true">↗</span>
              </Link>
            </div>

            {/* Premium Trust Badges Bar */}
            <div
              style={{
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '14px',
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '20px', fontFamily: 'var(--font-playfair), Georgia, serif', color: '#B83A24' }}>100%</strong>
                <small style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Verified Maithil Seekers</small>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '20px', fontFamily: 'var(--font-playfair), Georgia, serif', color: '#B83A24' }}>DPDP Act</strong>
                <small style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Zero Data Brokerage</small>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '20px', fontFamily: 'var(--font-playfair), Georgia, serif', color: '#B83A24' }}>Zero Dowry</strong>
                <small style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Strict Moral Covenant</small>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '20px', fontFamily: 'var(--font-playfair), Georgia, serif', color: '#B83A24' }}>1,420+</strong>
                <small style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Active Members Worldwide</small>
              </div>
            </div>
          </div>

          {/* LUXURY ARTWORK & LIVE MATCH PREVIEW SHOWCASE */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: '24px 24px 18px 18px',
                overflow: 'hidden',
                background: '#FFFFFF',
                border: '2px solid rgba(197, 154, 63, 0.45)',
                boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.14), 0 0 25px rgba(197, 154, 63, 0.12)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Artwork Tabs */}
              <div
                style={{
                  display: 'flex',
                  background: '#0B241D',
                  padding: '8px 12px',
                  gap: '6px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  overflowX: 'auto',
                }}
              >
                {heroArtworks.map((art, idx) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => setActiveArtIndex(idx)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: activeArtIndex === idx ? 'linear-gradient(135deg, #D4AF37 0%, #AA820A 100%)' : 'transparent',
                      color: activeArtIndex === idx ? '#111827' : '#FAF8F5',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      boxShadow: activeArtIndex === idx ? '0 2px 8px rgba(212, 175, 55, 0.3)' : 'none',
                    }}
                  >
                    {art.title.split('/')[0]}
                  </button>
                ))}
              </div>

              {/* Main Artwork Image Frame */}
              <div style={{ position: 'relative', height: '420px', width: '100%', overflow: 'hidden' }}>
                <Image
                  src={currentArt.image}
                  alt={currentArt.title}
                  fill
                  priority
                  style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                  sizes="(max-width: 900px) 100vw, 550px"
                />
                
                {/* Subtle Gradient Overlays for Readability */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(27,45,38,0.9) 0%, rgba(27,45,38,0.2) 50%, transparent 100%)',
                  }}
                />

                {/* Top Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(8px)',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--terracotta)',
                    letterSpacing: '0.04em',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  ✦ {currentArt.tag}
                </div>

                {/* Bottom Artwork Description */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '18px',
                    left: '20px',
                    right: '20px',
                    color: '#fffaf1',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#d99a78', textTransform: 'uppercase' }}>
                    {currentArt.subtitle}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', margin: '4px 0 6px', fontWeight: 500 }}>
                    {currentArt.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,250,241,0.85)', lineHeight: 1.5, maxHeight: '40px', overflow: 'hidden' }}>
                    {currentArt.description}
                  </p>
                </div>
              </div>

              {/* FLOATING GLASSMORPHIC LIVE MATCH BADGE */}
              <div
                style={{
                  padding: '16px 20px',
                  background: '#FFFFFF',
                  borderTop: '1px solid rgba(15,23,42,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '-8px' }}>
                  <div style={{ display: 'flex', position: 'relative' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #FFFFFF', position: 'relative', zIndex: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                      <Image src="/images/discover-aarav.png" alt="Aarav" fill style={{ objectFit: 'cover' }} sizes="38px" />
                    </div>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #FFFFFF', position: 'relative', marginLeft: '-10px', zIndex: 3, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                      <Image src="/images/discover-riya.png" alt="Riya" fill style={{ objectFit: 'cover' }} sizes="38px" />
                    </div>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #FFFFFF', position: 'relative', marginLeft: '-10px', zIndex: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                      <Image src="/images/discover-anjali.png" alt="Member" fill style={{ objectFit: 'cover' }} sizes="38px" />
                    </div>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #FFFFFF', position: 'relative', marginLeft: '-10px', zIndex: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                      <Image src="/images/discover-dev.png" alt="Dev" fill style={{ objectFit: 'cover' }} sizes="38px" />
                    </div>
                  </div>
                  <div style={{ marginLeft: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                      1,420+ Active Maithil Seekers
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
                      Darbhanga, Madhubani & Worldwide
                    </div>
                  </div>
                </div>

                <Link
                  href="/discover"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#8C2D19',
                    textDecoration: 'none',
                    padding: '7px 14px',
                    borderRadius: '999px',
                    background: '#FAF6ED',
                    border: '1px solid rgba(197, 154, 63, 0.4)',
                  }}
                >
                  View All ↗
                </Link>
              </div>
            </div>

            {/* Subtle Sanskrit Aura Script */}
            <div
              style={{
                textAlign: 'center',
                marginTop: '14px',
                fontSize: '12px',
                color: 'rgba(32,50,44,0.5)',
                fontFamily: 'serif',
                letterSpacing: '0.08em',
              }}
            >
              ॥ सखा सप्तपदा भव · सख्यं ते गमेयं ॥
            </div>
          </div>
        </div>

        <div className="hero-ribbon">
          <span>01 / A Sanctuary of Belonging</span>
          <span>Preserving Lineage · Honoring Agency</span>
          <span>Scroll to explore ↓</span>
        </div>
      </section>

      {/* 2. THE CORE VALUE PROPOSITION: WHY JOIN MITHILA MILAN */}
      <section className="section section-cream" id="why-join">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> Why Choose Mithila Milan</p>
            <h2>The considered alternative to <em>commercial swipe culture.</em></h2>
          </div>
          <p>
            Traditional matchmaking often felt inaccessible, while generic matrimonial portals spam your inbox and treat personal lineage like a disposable filter. Mithila Milan was founded by members of the community to restore dignity and care to finding your life partner.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '32px',
          }}
        >
          <article
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '32px 28px',
              position: 'relative',
              boxShadow: '0 4px 15px rgba(32,50,44,0.03)',
            }}
          >
            <span style={{ color: 'var(--terracotta)', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>01 / HERITAGE</span>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', margin: '20px 0 12px', fontWeight: 600 }}>
              Gotra & Mool with Care
            </h3>
            <p style={{ color: 'rgba(32,50,44,0.68)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
              Gotra, Mool, ancestral village, and Panji-related context are held with scholarly reverence—never turned into automated, binary rejection algorithms. You share what feels meaningful, in your family&apos;s own words.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link className="text-link" href="/culture">Read cultural framework ↗</Link>
            </div>
          </article>

          <article
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '32px 28px',
              position: 'relative',
              boxShadow: '0 4px 15px rgba(32,50,44,0.03)',
            }}
          >
            <span style={{ color: 'var(--terracotta)', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>02 / PRIVACY</span>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', margin: '20px 0 12px', fontWeight: 600 }}>
              The Contact Shield
            </h3>
            <p style={{ color: 'rgba(32,50,44,0.68)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
              Designed in strict compliance with India&apos;s DPDP Act 2023. Your phone number, email, and home address are never displayed on profile cards or sold to third-party telemarketers. Photo privacy protects you until mutual trust is formed.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link className="text-link" href="/privacy">View our privacy charter ↗</Link>
            </div>
          </article>

          <article
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '32px 28px',
              position: 'relative',
              boxShadow: '0 4px 15px rgba(32,50,44,0.03)',
            }}
          >
            <span style={{ color: 'var(--terracotta)', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>03 / DIGNITY</span>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', margin: '20px 0 12px', fontWeight: 600 }}>
              Zero Tolerance for Dowry
            </h3>
            <p style={{ color: 'rgba(32,50,44,0.68)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
              Every member commits to our community charter against dowry solicitation in any form. We champion unions built on mutual respect, intellectual companionship, shared character, and emotional equality.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link className="text-link" href="/terms">Our community covenant ↗</Link>
            </div>
          </article>

          <article
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '32px 28px',
              position: 'relative',
              boxShadow: '0 4px 15px rgba(32,50,44,0.03)',
            }}
          >
            <span style={{ color: 'var(--terracotta)', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>04 / HARMONY</span>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', margin: '20px 0 12px', fontWeight: 600 }}>
              Seeker Sovereignty & Family
            </h3>
            <p style={{ color: 'rgba(32,50,44,0.68)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
              Whether you are an independent professional searching for yourself or collaborating with your parents and elders, our system gives the seeker ultimate consent over who can message or connect.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link className="text-link" href="/how-it-works">See how families connect ↗</Link>
            </div>
          </article>
        </div>
      </section>

      {/* 3. INTERACTIVE DISTRICT ROOTS EXPLORER */}
      <section className="section" style={{ background: 'var(--paper)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> Geographical Roots</p>
            <h2>Connecting families across <em>Mithila & the diaspora.</em></h2>
          </div>
          <p>
            From the historic towns of Madhubani and Darbhanga to Janakpur, Delhi, Bengaluru, and the global diaspora—discover members with shared ancestral origins.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '28px' }}>
          {nativeDistricts.map((d) => {
            const liveCount = districtCounts[d.key] || 0
            return (
              <Link
                key={d.name}
                href={`/discover?nativeDistrict=${encodeURIComponent(d.name.split(' ')[0])}`}
                className="district-pill"
              >
                <MapPin size={13} color="var(--terracotta)" />
                <span>{d.name}</span>
                {liveCount > 0 && (
                  <small style={{ opacity: 0.65, fontWeight: 500 }}>
                    ({liveCount} {liveCount === 1 ? 'profile' : 'profiles'})
                  </small>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* 4. COMPARISON MATRIX: WHY MITHILA MILAN STANDS APART */}
      <section className="section section-cream">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> Industry Comparison</p>
            <h2>A standard of trust <em>unmatched anywhere else.</em></h2>
          </div>
          <p>
            See how Mithila Milan elevates the experience compared to commercial portals and informal social channels.
          </p>
        </div>

        <div className="comparison-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Trust & Matchmaking Criteria</th>
                <th className="highlight-col" style={{ color: 'var(--terracotta)' }}>✦ Mithila Milan</th>
                <th>Generic Matrimony Portals</th>
                <th>Informal WhatsApp / Groups</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Cultural Lineage (Gotra / Mool)</strong></td>
                <td className="highlight-col"><strong>Deep context with human review</strong></td>
                <td>Superficial or non-existent filters</td>
                <td>Scattered biodatas without context</td>
              </tr>
              <tr>
                <td><strong>Privacy & Contact Details</strong></td>
                <td className="highlight-col"><strong>Phone numbers never exposed publicly</strong></td>
                <td>Frequently exposed or sold to brokers</td>
                <td>Zero privacy; shared to hundreds</td>
              </tr>
              <tr>
                <td><strong>DPDP Act 2023 Compliance</strong></td>
                <td className="highlight-col"><strong>Full compliance & statutory rights</strong></td>
                <td>Monetized for targeted advertising</td>
                <td>Unregulated and unencrypted</td>
              </tr>
              <tr>
                <td><strong>Zero-Dowry Policy</strong></td>
                <td className="highlight-col"><strong>Strict moral charter & active moderation</strong></td>
                <td>Passive disclaimers without action</td>
                <td>Frequently encouraged or demanded</td>
              </tr>
              <tr>
                <td><strong>Individual Seeker Consent</strong></td>
                <td className="highlight-col"><strong>Individual maintains final approval</strong></td>
                <td>Often controlled without seeker consent</td>
                <td>Parents manage without child review</td>
              </tr>
              <tr>
                <td><strong>Atmosphere & Experience</strong></td>
                <td className="highlight-col"><strong>Calm, dignified, editorial, slow</strong></td>
                <td>High-pressure sales & endless spam calls</td>
                <td>Chaotic, unvetted, spam-heavy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4.5 HERITAGE SANCTUARY SUITE: INDUSTRY-LEADING MATRIMONIAL TOOLS */}
      <section className="section section-cream" id="sanctuary-suite">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> Flagship Capabilities</p>
            <h2>The Mithila Milan <em>Sanctuary Suite.</em></h2>
          </div>
          <p>
            Experience our bespoke tools designed for cultural precision, astrology, royal biodatas, and assisted VIP matchmaking.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginTop: '36px',
          }}
        >
          {/* Card 1: Kundali Milan */}
          <Link href="/kundali-matching" style={{ textDecoration: 'none', color: 'inherit' }}>
            <article
              className="luxury-card"
              style={{
                height: '100%',
                background: 'var(--paper)',
                border: '1px solid rgba(197,143,39,0.3)',
                borderRadius: '16px',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(197,143,39,0.15)', color: '#B8860B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Sparkles size={24} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#B8860B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  अष्टकूट गुण मिलन · 36 Gunas
                </span>
                <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '8px 0 10px', fontWeight: 600, color: 'var(--foreground)' }}>
                  Kundali & Guna Milan
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(32,50,44,0.7)', lineHeight: 1.6, margin: 0 }}>
                  Vedic Ashtakoot calculator with real-time 8-Koota points, Sagotra safeguards, and Kuja / Manglik cancellation checks.
                </p>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#B8860B' }}>Calculate Score</span>
                <ChevronRight size={16} color="#B8860B" />
              </div>
            </article>
          </Link>

          {/* Card 2: Luxury Biodata Maker */}
          <Link href="/biodata" style={{ textDecoration: 'none', color: 'inherit' }}>
            <article
              className="luxury-card"
              style={{
                height: '100%',
                background: 'var(--paper)',
                border: '1px solid rgba(166,93,63,0.3)',
                borderRadius: '16px',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(166,93,63,0.12)', color: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <FileText size={24} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--terracotta)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  परिचय पत्र · Print-Ready PDF
                </span>
                <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '8px 0 10px', fontWeight: 600, color: 'var(--foreground)' }}>
                  Luxury Biodata Maker
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(32,50,44,0.7)', lineHeight: 1.6, margin: 0 }}>
                  Create elegant, traditional Maithil matrimonial biodatas with Gotra, Mool, and Aripan themes. One-click PDF download & WhatsApp sharing.
                </p>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--terracotta)' }}>Create Biodata</span>
                <ChevronRight size={16} color="var(--terracotta)" />
              </div>
            </article>
          </Link>

          {/* Card 3: Milan Select VIP */}
          <Link href="/milan-select" style={{ textDecoration: 'none', color: 'inherit' }}>
            <article
              className="luxury-card"
              style={{
                height: '100%',
                background: 'var(--paper)',
                border: '1px solid rgba(27,77,62,0.3)',
                borderRadius: '16px',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(27,77,62,0.12)', color: '#1B4D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Crown size={24} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1B4D3E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  विशिष्ट सेवा · VIP Assisted Concierge
                </span>
                <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '8px 0 10px', fontWeight: 600, color: 'var(--foreground)' }}>
                  Milan Select
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(32,50,44,0.7)', lineHeight: 1.6, margin: 0 }}>
                  High-touch matchmaking for Civil Servants (IAS/IPS), Doctors, Executives, and global NRIs. 100% blind profiles with dedicated relationship advisors.
                </p>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1B4D3E' }}>Inquire for Concierge</span>
                <ChevronRight size={16} color="#1B4D3E" />
              </div>
            </article>
          </Link>
        </div>
      </section>

      {/* 5. SPOTLIGHT VERIFIED MATCHES WITH REAL HIGH-RES PORTRAITS */}
      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> Curated Community</p>
            <h2>Meet people with <em>a real story to tell.</em></h2>
          </div>
          <Link className="button button-primary" href="/discover">
            View All in Discover <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {spotlightProfiles.map((profile) => (
            <article
              key={profile.id}
              style={{
                height: '100%',
                background: '#FFFFFF',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px -10px rgba(15, 23, 42, 0.08)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
              className="hover:-translate-y-1 hover:shadow-xl hover:border-[#D4AF37]"
            >
              {/* Full-Bleed Portrait Photo */}
              <Link href={`/profiles/${profile.id}`} style={{ display: 'block', textDecoration: 'none', position: 'relative', height: '320px', width: '100%', overflow: 'hidden' }}>
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(11,36,29,0.85) 0%, transparent 50%)',
                  }}
                />

                {/* Verification Chip Top Right */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(6px)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#8C2D19',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }}
                >
                  <ShieldCheck size={13} color="#8C2D19" />
                  {profile.verified}
                </div>

                {/* Status Indicator Top Left */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(11,36,29,0.75)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
                  {profile.availability}
                </div>

                {/* Cultural Lineage Tag on Bottom of Photo */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '14px',
                    right: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(251, 246, 233, 0.95)',
                      color: '#8C2D19',
                      border: '1px solid rgba(197, 154, 63, 0.5)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {profile.gotra} · {profile.mool}
                  </span>
                  <span style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: 600 }}>
                    ID: {profile.id}
                  </span>
                </div>
              </Link>

              {/* Profile Details Body */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Link href={`/profiles/${profile.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '23px', fontWeight: 600, color: '#0F172A' }}>
                        {profile.name}
                      </h3>
                    </Link>
                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                      {profile.age} yrs · {profile.height}
                    </span>
                  </div>

                  <p style={{ margin: '6px 0 2px', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>
                    {profile.profession}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                    {profile.education}
                  </p>
                </div>

                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(15,23,42,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--terracotta)', fontWeight: 600 }}>
                      <MapPin size={12} />
                      {profile.location}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>
                      92% Match
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`/profiles/${profile.id}`}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #B83A24 0%, #8C2210 100%)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(184, 58, 36, 0.25)',
                      }}
                    >
                      Connect Privately ↗
                    </Link>
                    <Link
                      href={`/profiles/${profile.id}`}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        background: '#F8FAFC',
                        color: '#0F172A',
                        fontSize: '12px',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. DEDICATED SACRED MITHILA NUPTIAL HERITAGE GALLERY */}
      <section className="culture-section" id="culture" style={{ background: 'var(--forest)', color: 'var(--cream)', padding: '90px clamp(24px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div className="section-heading split-heading" style={{ borderColor: 'rgba(255,255,255,0.15)', marginBottom: '48px' }}>
            <div>
              <p className="eyebrow eyebrow-light">Living Art & Nuptial Rites</p>
              <h2 style={{ color: '#fffaf1' }}>The sacred visual tradition of <em>Mithila Vivah.</em></h2>
            </div>
            <p style={{ color: 'rgba(245,241,233,0.75)' }}>
              From the bridal Kohbar sanctuary to sacred Aripan floor mandalas, every line and pigment holds centuries of devotion, fertility, and marital blessing.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
            }}
          >
            {/* Gallery Card 1: Kohbar */}
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                <Image
                  src="/images/mithila-kohbar.png"
                  alt="Traditional Mithila Kohbar Nuptial Painting"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 900px) 100vw, 400px"
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(32,50,44,0.85)',
                    color: '#d99a78',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  कोहबर घर
                </span>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '0 0 10px', color: '#fffaf1', fontWeight: 600 }}>
                    The Kohbar Sanctum
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(245,241,233,0.75)', lineHeight: 1.7, margin: 0 }}>
                    Hand-painted in the bridal chamber with natural minerals. Features the holy Lotus (Kamal) for purity, the Fish pair (Macha) for abundance, and the Bamboo grove (Bans) for resilience.
                  </p>
                </div>
                <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
                  <Link href="/culture" style={{ color: '#d99a78', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Explore Kohbar symbolism ↗
                  </Link>
                </div>
              </div>
            </div>

            {/* Gallery Card 2: Vivah Rites */}
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                <Image
                  src="/images/mithila-vivah.png"
                  alt="Sacred Mithila Vivah Sindoor Daan Rites"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 900px) 100vw, 400px"
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(32,50,44,0.85)',
                    color: '#d99a78',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  सिंदूर दान आ सप्तपदी
                </span>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '0 0 10px', color: '#fffaf1', fontWeight: 600 }}>
                    Vedic Union & Equality
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(245,241,233,0.75)', lineHeight: 1.7, margin: 0 }}>
                    In classical Maithil vivah, the couple walks the seven sacred steps not as master and follower, but as equal companions (सखा सप्तपदा भव), bound by mutual respect and lifelong affection.
                  </p>
                </div>
                <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
                  <Link href="/culture" style={{ color: '#d99a78', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Read Vivah rites guide ↗
                  </Link>
                </div>
              </div>
            </div>

            {/* Gallery Card 3: Aripan */}
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                <Image
                  src="/images/mithila-aripan.png"
                  alt="Sacred Mithila Aripan Mandala"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 900px) 100vw, 400px"
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(32,50,44,0.85)',
                    color: '#d99a78',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  अरिपन आ समदाउन
                </span>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '0 0 10px', color: '#fffaf1', fontWeight: 600 }}>
                    Sacred Geometric Aripan
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(245,241,233,0.75)', lineHeight: 1.7, margin: 0 }}>
                    Drawn using freshly ground rice paste (Pithar) to sanctify the home before marital ceremonies, accompanied by soulful Samdaun geet celebrating daughterhood.
                  </p>
                </div>
                <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
                  <Link href="/culture" style={{ color: '#d99a78', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    View Aripan traditions ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REAL COMMUNITY TESTIMONIALS */}
      <section className="values-section" style={{ background: '#1c2c26' }}>
        <div className="values-intro">
          <p className="eyebrow eyebrow-light">Maithil Testimonials</p>
          <h2 style={{ color: '#fffaf1' }}>Stories of quiet, <em>lasting unions.</em></h2>
          <p>
            Listen to families and seekers from across Mithila, India, and the diaspora who discovered their partner through our considered community.
          </p>
          <Link className="button button-light" href="/about">
            Our founding story <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {testimonials.map((t) => (
            <div key={t.author} className="testimonial-card" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(217,154,120,0.2)', color: '#d99a78', padding: '3px 8px', borderRadius: '4px' }}>
                  ✦ {t.verified}
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>{t.year}</span>
              </div>
              <p className="testimonial-quote" style={{ color: 'var(--cream)', fontSize: '15px' }}>
                “{t.quote}”
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '16px' }}>
                <div>
                  <strong style={{ fontSize: '15px', color: '#d99a78' }}>{t.author}</strong>
                  <span style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>{t.location}</span>
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(217,154,120,0.3)', color: '#d99a78', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700 }}>
                  {t.initials}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. THE 5-STEP JOURNEY */}
      <section className="section section-cream" id="how-it-works">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> The Milan Journey</p>
            <h2>Paced for thought, <em>not hasty swipes.</em></h2>
          </div>
          <p>
            A calm, deliberate pathway from thoughtful profile creation to sacred marital union.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map(([number, title, copy]) => (
            <article className="step-card" key={number}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="step-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      {/* 9. SOLEMN CALL TO ACTION */}
      <section className="join-section" id="join" style={{ background: 'linear-gradient(135deg, #dfc49a 0%, #edd6c2 100%)' }}>
        <div className="join-flower" aria-hidden="true">✦</div>
        <p className="eyebrow" style={{ color: 'var(--terracotta)' }}>A Considered Beginning</p>
        <h2 style={{ color: 'var(--forest)' }}>Make room for <em>something real.</em></h2>
        <p style={{ color: 'rgba(32,50,44,0.75)' }}>
          Step away from commercial chaos. Join hundreds of verified Maithil individuals and families finding lifelong companionship rooted in shared heritage and mutual dignity.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="button button-primary" href="/discover" style={{ padding: '16px 32px', fontSize: '15px' }}>
            <Compass size={16} /> Explore Verified Matches <span aria-hidden="true">↗</span>
          </Link>
          <Link className="button button-outline" href="/profile" style={{ background: '#fffaf1', color: '#20322c', padding: '16px 28px', fontSize: '15px' }}>
            Set Up Your Profile <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <SiteFooter />
      <MobileBottomNav />
    </main>
  )
}

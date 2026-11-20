'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  BookOpen, Check, ChevronRight, Compass, Heart, Info, MapPin,
  Search, ShieldCheck, Sparkles, Star, Users
} from 'lucide-react'
import { PublicShell, SectionTitle, EditorialNote } from '@/components/site-shell'

type GotraInfo = {
  name: string
  devanagari: string
  sage: string
  tradition: string
  notableVillages: string[]
  count: string
}

type MoolInfo = {
  name: string
  devanagari: string
  region: string
  historicNote: string
  significance: string
  count: string
}

const gotras: GotraInfo[] = [
  {
    name: 'Kashyapa',
    devanagari: 'कश्यप',
    sage: 'Maharishi Kashyapa',
    tradition: 'One of the most widespread Gotras across Mithila, associated with universal kinship and cosmic origin.',
    notableVillages: ['Sakri', 'Jhanjharpur', 'Darbhanga', 'Rajnagar'],
    count: '160+ profiles',
  },
  {
    name: 'Shandilya',
    devanagari: 'शांडिल्य',
    sage: 'Maharishi Shandilya',
    tradition: 'Famed in Upanishadic thought (Shandilya Vidya) and revered for devotion (Bhakti Sutras).',
    notableVillages: ['Koilakh', 'Madhubani', 'Bisfi'],
    count: '135+ profiles',
  },
  {
    name: 'Bharadwaja',
    devanagari: 'भारद्वाज',
    sage: 'Maharishi Bharadwaja',
    tradition: 'Ancient lineage of Vedic scholarship, intellect, and educational institutions in ancient Mithila.',
    notableVillages: ['Sarisab-Pahi', 'Samastipur', 'Lakhnor'],
    count: '142+ profiles',
  },
  {
    name: 'Vashishtha',
    devanagari: 'वशिष्ठ',
    sage: 'Maharishi Vashishtha',
    tradition: 'Lineage of steadfast spiritual wisdom, peace, and adherence to moral duty (Dharma).',
    notableVillages: ['Bisfi', 'Purnea', 'Sitamarhi'],
    count: '98+ profiles',
  },
  {
    name: 'Parashara',
    devanagari: 'पाराशर',
    sage: 'Maharishi Parashara',
    tradition: 'Known historically for contributions to astronomy, Jyotisha, and regional agriculture manuals (Krishi-Parashara).',
    notableVillages: ['Ujan', 'Saharsa', 'Begusarai'],
    count: '84+ profiles',
  },
  {
    name: 'Gautama',
    devanagari: 'गौतम',
    sage: 'Maharishi Gautama',
    tradition: 'Directly rooted in Mithila soil through the founding of Nyaya (logic) philosophy at Gautama Ashram.',
    notableVillages: ['Brahmapura', 'Darbhanga', 'Kamtaul'],
    count: '76+ profiles',
  },
]

const mools: MoolInfo[] = [
  {
    name: 'Sakri',
    devanagari: 'सकरी',
    region: 'Darbhanga / Madhubani Basin',
    historicNote: 'Historic settlement near the Sakri waterway, celebrated for trading junctions and agrarian prosperity.',
    significance: 'Associated with enduring family ties and hospitality.',
    count: '62 profiles',
  },
  {
    name: 'Koilakh',
    devanagari: 'कोईलख',
    region: 'Madhubani District',
    historicNote: 'Renowned center of Sanskrit scholarship, temple councils, and genealogical custodians.',
    significance: 'Noted for educational prestige across generations.',
    count: '54 profiles',
  },
  {
    name: 'Bisfi',
    devanagari: 'बिसफी',
    region: 'Madhubani District',
    historicNote: 'The immortal ancestral seat gifted to Mahakavi Vidyapati by the Oiniwar Kings of Mithila.',
    significance: 'Synonymous with literary genius and devotion.',
    count: '48 profiles',
  },
  {
    name: 'Ujan',
    devanagari: 'उजान',
    region: 'North Bihar Belt',
    historicNote: 'Famous gathering village known for community conferences, trade, and legal scholarship.',
    significance: 'Progressive yet deeply rooted in cultural rites.',
    count: '41 profiles',
  },
  {
    name: 'Jhanjharpur',
    devanagari: 'झंझारपुर',
    region: 'Near Kamla River',
    historicNote: 'Historic hub bridging traditional village life with modern educational and civil service careers.',
    significance: 'Respected for balanced modern and traditional outlook.',
    count: '59 profiles',
  },
  {
    name: 'Sarisab-Pahi',
    devanagari: 'सऋषब-पाही',
    region: 'Darbhanga Intellectual Belt',
    historicNote: 'Celebrated across India for producing eminent philosophers, judges, scholars, and civil servants.',
    significance: 'High emphasis on academic and intellectual values.',
    count: '68 profiles',
  },
]

const weddingRituals = [
  {
    id: 'kohbar',
    title: 'कोहबर / Kohbar Ghar',
    subtitle: 'The Sacred Nuptial Mural',
    image: '/images/mithila-kohbar.png',
    desc: 'The defining visual signature of a Maithil wedding. The Kohbar chamber is painted by women of the household using natural earth pigments. Central symbols include the sacred Lotus (Kamal) for purity, the Bamboo grove (Bans) for lineage resilience, the Fish pair (Macha) for abundance, and the Sun and Moon as eternal witnesses.',
  },
  {
    id: 'sindoor-daan',
    title: 'सिंदूर दान / Sindoor Daan',
    subtitle: 'The Sacred Vow of Equality',
    image: '/images/mithila-vivah.png',
    desc: 'The holy culmination of the Vedic vivah rites. Surrounded by family elders and chanting of auspicious Vedic mantras, the groom applies sacred sindoor while both partners undertake solemn vows of lifelong fidelity, mutual respect, and shared dharma.',
  },
  {
    id: 'samdaun',
    title: 'समदाउन / Samdaun Geet',
    subtitle: 'The Song of Emotional Farewell',
    image: '/images/mithila-aripan.png',
    desc: 'As the bride prepares to embark on her new marital journey, the women of Mithila sing Samdaun—deeply moving verses composed in classical Maithili expressing parental tenderness, daughterly affection, and blessings for everlasting prosperity.',
  },
]

export default function CultureApp() {
  const [activeTab, setActiveTab] = useState<'gotra' | 'mool'>('gotra')
  const [selectedGotra, setSelectedGotra] = useState<GotraInfo>(gotras[0])
  const [selectedMool, setSelectedMool] = useState<MoolInfo>(mools[0])
  const [ritualTab, setRitualTab] = useState(0)

  return (
    <PublicShell>
      {/* 1. HERO SECTION WITH MADHUBANI ART SHOWCASE */}
      <section className="page-intro" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '70px' }}>
        <div className="page-intro-copy">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(166,93,63,0.08)',
              border: '1px solid rgba(166,93,63,0.25)',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--terracotta)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            <span>मिथिला धरोहर</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>Ancestral Roots</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>Cultural Living Room</span>
          </div>

          <h1 style={{ letterSpacing: '-0.05em', lineHeight: 0.9 }}>
            A living culture, held with <em>reverence and care.</em>
          </h1>

          <p className="page-lead">
            Mithila Milan celebrates the rich tapestry of the Maithil community—from ancestral Gotra and Mool genealogies to the world-renowned artistry of Kohbar and the emotional verses of Samdaun. We hold heritage as an anchor of identity, not a barrier to human connection.
          </p>

          <div style={{ marginTop: '32px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link className="button button-primary" href="/discover">
              <Compass size={15} /> Find Matches by Cultural Heritage <span aria-hidden="true">↗</span>
            </Link>
            <a className="button button-outline" href="#explorer">
              Explore Gotra & Mool Directory <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        {/* Hero Artwork Card */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '460px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid rgba(166,93,63,0.3)',
            boxShadow: '0 20px 50px rgba(32,50,44,0.12)',
            background: 'var(--paper)',
          }}
        >
          <div style={{ position: 'relative', height: '320px', width: '100%' }}>
            <Image
              src="/images/mithila-kohbar.png"
              alt="Traditional Madhubani Kohbar Painting with Sacred Lotus and Fish"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 900px) 100vw, 460px"
              priority
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(27,45,38,0.85) 0%, transparent 60%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '20px',
                right: '20px',
                color: '#fffaf1',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#d99a78', textTransform: 'uppercase' }}>
                पारंपरिक कोहबर चित्रकला
              </span>
              <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', margin: '4px 0 0', fontWeight: 500 }}>
                The Sacred Nuptial Mural of Mithila
              </h3>
            </div>
          </div>
          <div style={{ padding: '16px 20px', background: 'var(--cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'rgba(32,50,44,0.7)', fontStyle: 'italic' }}>
              Lotus · Pair of Fish · Bamboo · Sun & Moon
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--terracotta)' }}>
              शुभ विवाह
            </span>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE GOTRA & MOOL EXPLORER */}
      <section className="public-band paper-band" id="explorer">
        <SectionTitle
          kicker="Interactive Heritage Directory"
          title={<>Lineage is an anchor, <em>not an obstacle.</em></>}
          copy="Explore historical Gotra and Mool lineages across Mithila. Learn their sage origins, historic settlements, and find verified community members."
        />

        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('gotra')}
            style={{
              padding: '12px 24px',
              borderRadius: '999px',
              font: 'inherit',
              fontSize: '14px',
              fontWeight: 650,
              cursor: 'pointer',
              border: activeTab === 'gotra' ? '2px solid var(--terracotta)' : '1px solid var(--border)',
              background: activeTab === 'gotra' ? 'var(--terracotta)' : 'var(--cream)',
              color: activeTab === 'gotra' ? '#fffaf1' : 'var(--foreground)',
              transition: 'all 0.2s ease',
            }}
          >
            गोत्र / Gotra Sage Lineages ({gotras.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mool')}
            style={{
              padding: '12px 24px',
              borderRadius: '999px',
              font: 'inherit',
              fontSize: '14px',
              fontWeight: 650,
              cursor: 'pointer',
              border: activeTab === 'mool' ? '2px solid var(--terracotta)' : '1px solid var(--border)',
              background: activeTab === 'mool' ? 'var(--terracotta)' : 'var(--cream)',
              color: activeTab === 'mool' ? '#fffaf1' : 'var(--foreground)',
              transition: 'all 0.2s ease',
            }}
          >
            मूल / Mool Ancestral Settlements ({mools.length})
          </button>
        </div>

        {activeTab === 'gotra' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {gotras.map((g) => {
                const isSelected = selectedGotra.name === g.name
                return (
                  <button
                    key={g.name}
                    type="button"
                    onClick={() => setSelectedGotra(g)}
                    style={{
                      textAlign: 'left',
                      padding: '16px 20px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid var(--terracotta)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--cream)' : 'var(--paper)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', color: isSelected ? 'var(--terracotta)' : 'var(--foreground)' }}>
                        {g.name} ({g.devanagari})
                      </strong>
                      <span style={{ display: 'block', fontSize: '12px', color: 'rgba(32,50,44,0.6)', marginTop: '2px' }}>
                        {g.sage}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--terracotta)' }}>
                      {g.count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div
              style={{
                background: 'var(--cream)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--terracotta)', textTransform: 'uppercase' }}>
                  Gotra Lineage Profile
                </span>
                <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', margin: '8px 0 4px', fontWeight: 600 }}>
                  {selectedGotra.name} ({selectedGotra.devanagari})
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(32,50,44,0.6)', margin: '0 0 16px' }}>
                  Sage Lineage: <strong>{selectedGotra.sage}</strong>
                </p>

                <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(32,50,44,0.8)', marginBottom: '20px' }}>
                  {selectedGotra.tradition}
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--terracotta)', display: 'block', marginBottom: '8px' }}>
                    Historic Settlements in Mithila:
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedGotra.notableVillages.map((v) => (
                      <span key={v} style={{ fontSize: '12px', background: 'var(--paper)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '999px' }}>
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', background: 'var(--paper)', borderRadius: '8px', borderLeft: '3px solid var(--terracotta)', fontSize: '12px', color: 'rgba(32,50,44,0.7)', lineHeight: 1.6 }}>
                  <ShieldCheck size={14} color="var(--terracotta)" style={{ display: 'inline', marginRight: '6px' }} />
                  <strong>Mithila Milan Policy:</strong> Gotra is voluntarily shared by members. It is never used for automated cold rejection. Respectful family dialogue always governs compatibility.
                </div>
              </div>

              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <Link
                  className="button button-primary"
                  href={`/discover?q=${encodeURIComponent(selectedGotra.name)}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Browse {selectedGotra.name} Profiles ({selectedGotra.count}) ↗
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {mools.map((m) => {
                const isSelected = selectedMool.name === m.name
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setSelectedMool(m)}
                    style={{
                      textAlign: 'left',
                      padding: '16px 20px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid var(--terracotta)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--cream)' : 'var(--paper)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', color: isSelected ? 'var(--terracotta)' : 'var(--foreground)' }}>
                        {m.name} ({m.devanagari})
                      </strong>
                      <span style={{ display: 'block', fontSize: '12px', color: 'rgba(32,50,44,0.6)', marginTop: '2px' }}>
                        {m.region}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--terracotta)' }}>
                      {m.count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div
              style={{
                background: 'var(--cream)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--terracotta)', textTransform: 'uppercase' }}>
                  Mool Ancestral Origin
                </span>
                <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', margin: '8px 0 4px', fontWeight: 600 }}>
                  {selectedMool.name} ({selectedMool.devanagari})
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(32,50,44,0.6)', margin: '0 0 16px' }}>
                  District Region: <strong>{selectedMool.region}</strong>
                </p>

                <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(32,50,44,0.8)', marginBottom: '16px' }}>
                  {selectedMool.historicNote}
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--terracotta)', display: 'block', marginBottom: '6px' }}>
                    Cultural Significance:
                  </span>
                  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(32,50,44,0.7)' }}>
                    {selectedMool.significance}
                  </p>
                </div>

                <div style={{ padding: '12px 16px', background: 'var(--paper)', borderRadius: '8px', borderLeft: '3px solid var(--terracotta)', fontSize: '12px', color: 'rgba(32,50,44,0.7)', lineHeight: 1.6 }}>
                  <Info size={14} color="var(--terracotta)" style={{ display: 'inline', marginRight: '6px' }} />
                  <strong>Spellings & Variations:</strong> Mool names often vary across families and local dialects. Mithila Milan allows flexible text matching so no family is excluded over spelling differences.
                </div>
              </div>

              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <Link
                  className="button button-primary"
                  href={`/discover?q=${encodeURIComponent(selectedMool.name)}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Browse {selectedMool.name} Profiles ({selectedMool.count}) ↗
                </Link>
              </div>
            </div>
          </div>
        )}

        <EditorialNote>
          Gotra, Mool, Kul, and Pravara definitions are shared for cultural enrichment. Mithila Milan does not claim official authority over traditional Panji scrolls or substitute the counsel of hereditary Panjikars.
        </EditorialNote>
      </section>

      {/* 3. SACRED NUPTIAL RITUALS WITH REAL ARTWORK */}
      <section className="public-band forest-band" style={{ color: 'var(--cream)', background: 'var(--forest)' }}>
        <SectionTitle
          kicker="Nuptial Rites of Mithila"
          title={<>The beauty of a <em>Maithil Vivah.</em></>}
          copy="Step into the sacred customs that make a Maithil wedding an exquisite union of poetry, visual art, geometry, and eternal vows."
        />

        <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {weddingRituals.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRitualTab(i)}
              style={{
                padding: '10px 20px',
                borderRadius: '999px',
                font: 'inherit',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: ritualTab === i ? '2px solid #d99a78' : '1px solid rgba(255,255,255,0.2)',
                background: ritualTab === i ? '#d99a78' : 'transparent',
                color: ritualTab === i ? 'var(--forest)' : 'var(--cream)',
                transition: 'all 0.2s ease',
              }}
            >
              {r.title}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 460px)',
            gap: '40px',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '36px',
          }}
        >
          <div>
            <span style={{ color: '#d99a78', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {weddingRituals[ritualTab].subtitle}
            </span>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px, 4vw, 42px)', margin: '10px 0 18px', fontWeight: 500, color: '#fffaf1' }}>
              {weddingRituals[ritualTab].title}
            </h2>
            <p style={{ color: 'rgba(245,241,233,0.85)', fontSize: '15px', lineHeight: 1.8, marginBottom: '24px' }}>
              {weddingRituals[ritualTab].desc}
            </p>

            {ritualTab === 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '18px' }}>
                <div>
                  <strong style={{ color: '#d99a78', display: 'block', fontSize: '13px' }}>कमल / Lotus</strong>
                  <span style={{ fontSize: '12px', color: 'rgba(245,241,233,0.7)' }}>Purity, beauty, spiritual blessing</span>
                </div>
                <div>
                  <strong style={{ color: '#d99a78', display: 'block', fontSize: '13px' }}>माछ / Pair of Fish</strong>
                  <span style={{ fontSize: '12px', color: 'rgba(245,241,233,0.7)' }}>Fertility, prosperity, lifelong joy</span>
                </div>
                <div>
                  <strong style={{ color: '#d99a78', display: 'block', fontSize: '13px' }}>बांस / Bamboo Grove</strong>
                  <span style={{ fontSize: '12px', color: 'rgba(245,241,233,0.7)' }}>Lineage endurance, flexibility</span>
                </div>
                <div>
                  <strong style={{ color: '#d99a78', display: 'block', fontSize: '13px' }}>सूर्य-चन्द्र / Sun & Moon</strong>
                  <span style={{ fontSize: '12px', color: 'rgba(245,241,233,0.7)' }}>Cosmic witness to marital vows</span>
                </div>
              </div>
            )}

            {ritualTab === 1 && (
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', borderLeft: '3px solid #d99a78' }}>
                <span style={{ fontSize: '12px', color: '#d99a78', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  The Vow of Companion Equality (सखा सप्तपदा भव)
                </span>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(245,241,233,0.8)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  “With these seven steps, become my companion. May we walk together in dharma, prosperity, love, and spiritual purpose.”
                </p>
              </div>
            )}

            {ritualTab === 2 && (
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', borderLeft: '3px solid #d99a78' }}>
                <span style={{ fontSize: '12px', color: '#d99a78', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  महाकवि विद्यापति रचित समदाउन
                </span>
                <p style={{ margin: 0, fontSize: '14px', color: '#fffaf1', fontStyle: 'italic', lineHeight: 1.7, fontFamily: 'serif' }}>
                  “बाबा जे लिखलनि सेहो भेल, सखिया संगे खेललनि दिन गेलनि...<br />
                  अहां के विदा करि कए हम सब केना रहब हे धिया...”
                </p>
              </div>
            )}
          </div>

          <div
            style={{
              position: 'relative',
              height: '380px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(217,154,120,0.4)',
              boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
            }}
          >
            <Image
              src={weddingRituals[ritualTab].image}
              alt={weddingRituals[ritualTab].title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="460px"
            />
          </div>
        </div>
      </section>

      {/* 4. HISTORICAL PANJI & SAURATH SABHA RETROSPECTIVE */}
      <section className="public-band paper-band">
        <SectionTitle
          kicker="Seven Centuries of Genealogy"
          title={<>The story of <em>Panji & Saurath Sabha.</em></>}
          copy="A retrospective on how Mithila maintained one of the world's most meticulous community genealogical traditions."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '28px', background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--terracotta)', fontWeight: 700, fontSize: '13px', fontFamily: 'monospace' }}>1324 CE · ORIGINS</span>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '14px 0 10px', fontWeight: 600 }}>
              King Harisimhadeva&apos;s Decree
            </h3>
            <p style={{ color: 'rgba(32,50,44,0.7)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
              To safeguard ancestral memory following regional conflicts, King Harisimhadeva of the Karnata dynasty commissioned the systematic recording of genealogies across Mithila, giving rise to designated Panjikars.
            </p>
          </div>

          <div style={{ padding: '28px', background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--terracotta)', fontWeight: 700, fontSize: '13px', fontFamily: 'monospace' }}>1700s–1900s · THE GATHERING</span>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '14px 0 10px', fontWeight: 600 }}>
              Saurath Sabha Assemblies
            </h3>
            <p style={{ color: 'rgba(32,50,44,0.7)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
              Under the shaded mango groves of Saurath in Madhubani, families convened annually with genealogical scrolls to arrange alliances through open conversation, transparent lineage inquiry, and formal consent.
            </p>
          </div>

          <div style={{ padding: '28px', background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--terracotta)', fontWeight: 700, fontSize: '13px', fontFamily: 'monospace' }}>TODAY · MODERN DIGNITY</span>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '14px 0 10px', fontWeight: 600 }}>
              The Mithila Milan Renaissance
            </h3>
            <p style={{ color: 'rgba(32,50,44,0.7)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
              We bring this 700-year legacy into the modern digital age: giving individual seekers absolute consent, safeguarding personal data under DPDP Act 2023, and bridging the distance for Maithil families across India and the globe.
            </p>
          </div>
        </div>
      </section>

      {/* 5. LINGUISTIC HERITAGE: MAITHILI */}
      <section className="public-band terracotta-band">
        <div className="split-callout">
          <div>
            <p className="eyebrow eyebrow-light">Linguistic Heritage</p>
            <h2 style={{ fontSize: 'clamp(38px, 5vw, 62px)', lineHeight: 1, color: '#fffaf1' }}>
              मैथिली: भाषा, भाव आ <em style={{ color: '#fed7aa', fontStyle: 'italic', fontWeight: 600 }}>अस्मिता।</em>
            </h2>
          </div>
          <div>
            <blockquote
              style={{
                margin: '0 0 16px',
                fontFamily: 'serif',
                fontSize: '18px',
                fontStyle: 'italic',
                color: '#fffaf1',
                lineHeight: 1.6,
              }}
            >
              “देसिल बअना सब जन मिट्ठा, तें तैसन जम्पओ अवहट्ठा।”<br />
              <small style={{ fontSize: '12px', opacity: 0.8, fontStyle: 'normal' }}>— महाकवि विद्यापति (कीर्तिलता)</small>
            </blockquote>
            <p style={{ color: 'rgba(255,250,241,0.85)', fontSize: '14px', lineHeight: 1.75, margin: 0 }}>
              Maithili is not just a language of everyday speech; it is a profound repository of devotional hymns, wedding folksongs, and scholarly discourse. Recognized in the Eighth Schedule of the Indian Constitution, it connects generation to generation across North Bihar, Nepal&apos;s Terai, and global metropolitan cities.
            </p>
            <div style={{ marginTop: '24px' }}>
              <Link className="button button-light" href="/discover">
                Discover Members Rooted in Mithila ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}

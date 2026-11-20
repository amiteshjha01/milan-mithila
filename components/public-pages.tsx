'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Compass, Heart, Lock, UserCheck, CheckCircle2, MapPin } from 'lucide-react'
import { EditorialNote, PageIntro, PublicShell, SectionTitle } from './site-shell'

const Arrow = () => <span aria-hidden="true">↗</span>

export function AboutPage() {
  return (
    <PublicShell>
      <PageIntro
        kicker="Our beginning"
        label="01 / 06"
        title={<>A more thoughtful way to find <em>your Milan.</em></>}
        description="Mithila Milan is a community-focused matrimonial space for Maithil people and families who want more context, more care, and more room for a real conversation."
      />

      {/* Hero Visual Spotlight */}
      <section className="public-band paper-band" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center',
            background: 'var(--cream)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          <div style={{ position: 'relative', height: '320px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(166,93,63,0.3)', boxShadow: '0 12px 30px rgba(32,50,44,0.08)' }}>
            <Image
              src="/images/mithila-vivah.png"
              alt="Sacred Mithila Vivah"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 900px) 100vw, 500px"
              priority
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,45,38,0.85) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', color: '#fffaf1' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#d99a78', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                परंपरा आ स्वाभिमान
              </span>
              <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', margin: '4px 0 0' }}>
                Centuries of Lineage, Honoring Modern Agency
              </h3>
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--terracotta)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              ✦ A Considered Sanctuary
            </span>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px, 4vw, 38px)', margin: '12px 0 16px', fontWeight: 500, lineHeight: 1.15 }}>
              A match is not a transaction. It is <em>the meeting of two worlds.</em>
            </h2>
            <p style={{ color: 'rgba(32,50,44,0.72)', fontSize: '15px', lineHeight: 1.75, margin: 0 }}>
              Mithila has given the world unparalleled traditions of art, philosophy, logic (Nyaya), and poetic reverence. In modern times, matrimonial platforms reduced this profound heritage to shallow commercial swipe filters. Mithila Milan was born to restore grace, transparency, and dignity to the search for a life partner.
            </p>
            <div style={{ marginTop: '24px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link className="button button-primary" href="/discover">
                Explore Verified Community <Arrow />
              </Link>
              <Link className="button button-outline" href="/culture">
                Our Cultural Approach <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="public-band paper-band">
        <SectionTitle
          kicker="Why this exists"
          title={<>The story behind <em>Mithila Milan.</em></>}
          copy="Traditional values can be carried forward without making people feel reduced to a checklist."
        />
        <div className="editorial-grid">
          <div className="big-quote">
            “A match is not just between two profiles. It is a meeting of stories, hopes, families, and futures.”
          </div>
          <div className="body-copy">
            <p>
              Many matrimonial experiences ask people to flatten themselves into a few preferences. We are creating a gentler alternative: a place where identity can be shared with intention, family context can be included with consent, and connection can develop at a human pace.
            </p>
            <p>
              Mithila Milan is being shaped with the community, not merely for it. Our cultural language, verification concepts, and future compatibility tools are reviewed with Maithil scholars, elders, and legal experts before they become product rules.
            </p>
            <Link className="text-link" href="/culture">Explore our cultural approach <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="public-band forest-band">
        <div className="three-up">
          <article>
            <span>01</span>
            <h3>Rooted</h3>
            <p>Inspired by Maithil identity, language, memory, and the many ways families belong today.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Open</h3>
            <p>Designed for individual agency and family-assisted discovery to coexist respectfully.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Human</h3>
            <p>Built around context, mutual consent, and conversations that are more than a swipe.</p>
          </article>
        </div>
      </section>
    </PublicShell>
  )
}

const process = [
  ['01', 'Create your profile', 'Share the details that feel meaningful to you, at your own pace.'],
  ['02', 'Add your context', 'Include personal, family, and cultural information where applicable.'],
  ['03', 'Discover thoughtfully', 'Browse profiles with shared values, goals, and life direction in view.'],
  ['04', 'Express interest', 'Send a considered signal before a conversation begins.'],
  ['05', 'Connect with families', 'Bring trusted family members into the process when you choose.'],
]

export function HowItWorksPage() {
  return (
    <PublicShell>
      <PageIntro
        kicker="A considered process"
        label="02 / 06"
        title={<>Begin with context. Continue with <em>conversation.</em></>}
        description="A simple path from profile to possibility, with clear consent and room for the people who matter to you."
      />

      <section className="public-band paper-band">
        <SectionTitle
          kicker="The journey"
          title={<>Five steps, no <em>shortcuts.</em></>}
          copy="The product is designed to slow down the moments that deserve care."
        />
        <div className="process-list">
          {process.map(([num, title, copy]) => (
            <article key={num}>
              <span>{num}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              <Arrow />
            </article>
          ))}
        </div>
      </section>

      {/* Visual Sanctuary Callout */}
      <section className="public-band soft-band">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          <div>
            <p className="eyebrow">Families welcome</p>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '14px 0 16px', fontWeight: 500 }}>
              Agency and family context can <em>coexist.</em>
            </h2>
            <p style={{ color: 'rgba(32,50,44,0.7)', fontSize: '15px', lineHeight: 1.75, margin: 0 }}>
              Some people search independently. Others invite parents, siblings, or trusted relatives into the process. Mithila Milan supports both paths with mutual dignity, never forcing parental control over individual consent or vice versa.
            </p>
            <div style={{ marginTop: '24px' }}>
              <Link className="button button-primary" href="/discover">
                Discover Verified Members <Arrow />
              </Link>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              height: '300px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 10px 30px rgba(32,50,44,0.06)',
            }}
          >
            <Image
              src="/images/mithila-kohbar.png"
              alt="Mithila Nuptial Mural"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 900px) 100vw, 450px"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(32,50,44,0.8) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', color: '#fffaf1' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#d99a78' }}>॥ मंगलम् भगवान विष्णुः ॥</span>
              <h4 style={{ margin: '4px 0 0', fontFamily: 'serif', fontSize: '18px' }}>Rooted in Mithila Traditions</h4>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}

export function SafetyPage() {
  return (
    <PublicShell>
      <PageIntro
        kicker="Trust & boundaries"
        label="03 / 06"
        title={<>A safer start for <em>real people.</em></>}
        description="Trust is a product practice, not a badge. We will build tools that help people make informed choices while being honest about their limits."
      />

      <section className="public-band paper-band">
        <SectionTitle
          kicker="What we are building toward"
          title={<>Safety should feel <em>visible.</em></>}
        />
        <div className="safety-grid">
          <article>
            <span>01</span>
            <h3>Profile signals</h3>
            <p>Clear profile completeness and review signals can help people understand what information is self-declared, community-referred, or still unverified.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Privacy controls</h3>
            <p>Choose what is visible, control who can contact you, and remove your profile when you want to step away.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Report & block</h3>
            <p>Simple tools for unwanted contact, impersonation, harassment, or suspicious behavior, with a clear path to human review.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Safe communication</h3>
            <p>Keep early conversations on-platform, avoid sending money, and meet only in public places with someone you trust informed.</p>
          </article>
        </div>
        <EditorialNote>Verification can reduce risk but cannot guarantee a person&apos;s identity, intentions, or future behavior. Never share financial details or sensitive documents with a match.</EditorialNote>
      </section>
    </PublicShell>
  )
}

export function MembershipPage() {
  return (
    <PublicShell>
      <PageIntro
        kicker="Membership"
        label="04 / 06"
        title={<>Choose the pace that feels <em>right.</em></>}
        description="Start free. Upgrade only when the added tools genuinely help you move a connection forward."
      />
      <section className="public-band paper-band">
        <SectionTitle
          kicker="Proposed plans"
          title={<>Clear value, no <em>pressure.</em></>}
          copy="Placeholder pricing for product exploration. Payment processing is not connected."
        />
        <div className="plans-grid">
          <article className="plan-card">
            <p className="plan-label">For getting started</p>
            <h3>Free</h3>
            <div className="plan-price">₹0 <small>forever</small></div>
            <ul>
              <li>Create a profile</li>
              <li>Browse community profiles</li>
              <li>Express limited interest</li>
              <li>Privacy and safety controls</li>
            </ul>
            <Link className="button button-outline" href="/#join">Join waitlist <Arrow /></Link>
          </article>
          <article className="plan-card plan-featured">
            <p className="plan-label">For a little more room</p>
            <h3>Premium</h3>
            <div className="plan-price">₹499 <small>/ month</small></div>
            <ul>
              <li>Everything in Free</li>
              <li>Expanded discovery filters</li>
              <li>More interest requests</li>
              <li>Conversation prompts</li>
              <li>Priority support</li>
            </ul>
            <Link className="button button-primary" href="/#join">Register interest <Arrow /></Link>
          </article>
        </div>
        <EditorialNote>These are proposed placeholder prices, not an active offer. Final pricing, billing, refunds, and eligibility require product and legal review.</EditorialNote>
      </section>
    </PublicShell>
  )
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setSubmitted(true)
  }

  return (
    <PublicShell>
      <PageIntro
        kicker="We are listening"
        label="05 / 06"
        title={<>Have a thought? <em>Write to us.</em></>}
        description="Tell us what would make a Maithil matrimonial experience feel more useful, respectful, and true to life."
      />
      <section className="public-band paper-band contact-layout">
        <div>
          <SectionTitle
            kicker="Contact & support"
            title={<>A real person is <em>the point.</em></>}
            copy="Reach out to our community coordinators and grievance redressal team."
          />
          <div className="contact-details">
            <div>
              <span>Email</span>
              <strong>hello@mithilamilan.example</strong>
            </div>
            <div>
              <span>Community Desk</span>
              <strong>New Delhi & Darbhanga Regional Liaison</strong>
            </div>
            <div>
              <span>Grievance Officer</span>
              <strong>grievance@mithilamilan.example</strong>
            </div>
          </div>
        </div>

        {submitted ? (
          <div
            style={{
              padding: '40px',
              border: '1px solid var(--terracotta)',
              background: 'var(--cream)',
              borderRadius: '4px',
            }}
          >
            <span style={{ color: 'var(--terracotta)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Message Received
            </span>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', margin: '16px 0 10px', fontWeight: 500 }}>
              Pranam, {name}.
            </h3>
            <p style={{ color: 'rgba(32,50,44,0.7)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
              Thank you for sharing your thoughts with us. We have received your note and will review it with our community desk. Sincere feedback helps shape a more respectful matrimonial space.
            </p>
            <button
              type="button"
              className="button button-outline"
              style={{ marginTop: '24px' }}
              onClick={() => {
                setSubmitted(false)
                setName('')
                setEmail('')
                setMessage('')
              }}
            >
              Send another note <Arrow />
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="How should we address you?"
            />

            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />

            <label htmlFor="message">Your message</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={10}
              placeholder="Share a question, idea, or concern."
              rows={5}
            />

            <button className="button button-primary" type="submit">
              Send message <Arrow />
            </button>
            <p className="form-note">Your correspondence is held in privacy under our community charter.</p>
          </form>
        )}
      </section>
    </PublicShell>
  )
}

export function CulturePage() {
  return (
    <PublicShell>
      <PageIntro
        kicker="Cultural heritage"
        label="06 / 06"
        title={<>A living culture, held with <em>reverence and care.</em></>}
        description="Mithila Milan celebrates the profound heritage of the Maithil community—from ancestral Gotra and Mool lineages to the sacred artistry of Kohbar and the timeless melodies of Samdaun."
      />

      <section className="public-band paper-band">
        <SectionTitle
          kicker="Core Genealogical Concepts"
          title={<>Lineage is an anchor, <em>not an obstacle.</em></>}
          copy="How Maithil families understand ancestral descent, origins, and family memory."
        />

        <div className="heritage-grid">
          <article>
            <span>गोत्र / GOTRA</span>
            <h3>Ancestral Sage Descent</h3>
            <p>
              Gotra identifies patrilineal descent traceable to revered Vedic rishis (Kashyapa, Shandilya, Bharadwaja, Vashishtha, Parashara, Gautama). Within Mithila Milan, Gotra is shared as voluntary cultural context—never used for rigid algorithmic rejections.
            </p>
          </article>
          <article>
            <span>मूल / MOOL</span>
            <h3>Ancestral Village Root</h3>
            <p>
              Mool connects a family back to their historical ancestral settlement in Mithila (e.g., Sakri, Koilakh, Bisfi, Ujan, Jhanjharpur). It carries regional identity and clan memories across centuries and migrations.
            </p>
          </article>
          <article>
            <span>पंजी-प्रबंध / PANJI-PRABANDH</span>
            <h3>Genealogical Record Tradition</h3>
            <p>
              Initiated in the 14th century during King Harisimhadeva&apos;s reign, Panji-prabandh is the historical practice of maintaining vast genealogical scrolls by hereditary Panjikars. Mithila Milan honors this tradition while acknowledging that authoritative review rests with living scholars.
            </p>
          </article>
          <article>
            <span>सौराठ सभा / SAURATH SABHA</span>
            <h3>The Historical Gathering</h3>
            <p>
              Saurath Sabha in Madhubani district is widely remembered as an open-air annual congregation under mango groves where families and Panjikars historically gathered to discuss matrimonial alliances in open dignity.
            </p>
          </article>
        </div>

        <EditorialNote>
          Mithila Milan does not issue official Panji certificates or replace traditional Panjikars. All cultural entries are user-declared and designed to assist respectful family dialogue.
        </EditorialNote>
      </section>

      {/* Visual Nuptial Gallery with Real Images */}
      <section className="public-band forest-band" style={{ color: 'var(--cream)', background: 'var(--forest)' }}>
        <SectionTitle
          kicker="Sacred Nuptial Rituals"
          title={<>The beauty of a <em>Maithil Vivah.</em></>}
          copy="A Maithil wedding is an art form of music, geometry, philosophy, and spiritual devotion."
        />

        <div className="three-up">
          <article style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden', padding: 0 }}>
            <div style={{ position: 'relative', height: '180px', width: '100%' }}>
              <Image src="/images/mithila-kohbar.png" alt="Kohbar Painting" fill style={{ objectFit: 'cover' }} sizes="360px" />
            </div>
            <div style={{ padding: '20px' }}>
              <span style={{ color: '#d99a78' }}>कोहबर / KOHBAR</span>
              <h3>The Painted Sanctum</h3>
              <p>Hand-painted nuptial murals featuring lotus leaves, fish (Purain), bamboo groves (Bans), the sun, and the moon, symbolizing fertility, eternal prosperity, and spiritual blessings.</p>
            </div>
          </article>

          <article style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden', padding: 0 }}>
            <div style={{ position: 'relative', height: '180px', width: '100%' }}>
              <Image src="/images/mithila-vivah.png" alt="Sindoor Daan" fill style={{ objectFit: 'cover' }} sizes="360px" />
            </div>
            <div style={{ padding: '20px' }}>
              <span style={{ color: '#d99a78' }}>सिंदूर दान / SINDOOR DAAN</span>
              <h3>The Sacred Union</h3>
              <p>The defining vow of mutual protection, respect, and companion equality (सखा सप्तपदा भव) performed under Vedic mantras and the auspicious blessings of community elders.</p>
            </div>
          </article>

          <article style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden', padding: 0 }}>
            <div style={{ position: 'relative', height: '180px', width: '100%' }}>
              <Image src="/images/mithila-aripan.png" alt="Aripan Mandala" fill style={{ objectFit: 'cover' }} sizes="360px" />
            </div>
            <div style={{ padding: '20px' }}>
              <span style={{ color: '#d99a78' }}>समदाउन / SAMDAUN</span>
              <h3>The Song of Farewell</h3>
              <p>Traditional Maithili poetic verses sung with deep emotional beauty as the bride departs her maternal home, capturing the enduring sanctity of daughterhood and family bonds.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="public-band terracotta-band">
        <div className="split-callout">
          <div>
            <p className="eyebrow eyebrow-light">Linguistic Heritage</p>
            <h2>मैथिली: भाषा, भाव आ <em style={{ color: '#fed7aa', fontStyle: 'italic', fontWeight: 600 }}>अस्मिता।</em></h2>
          </div>
          <div>
            <p>
              Maithili is an ancient Indo-Aryan language with a rich literary canon dating from Vidyapati to modern masters. Recognized in the Eighth Schedule of the Indian Constitution, it is written in both Devanagari and the historic Tirhuta (Mithilakshar) script.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link className="button button-light" href="/discover">
                Explore Community Profiles ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}

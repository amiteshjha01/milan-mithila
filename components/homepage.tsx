const steps = [
  ['01', 'Create your profile', 'Share the details that feel meaningful to you, at your own pace.'],
  ['02', 'Add your context', 'Include personal, family, and cultural information where applicable.'],
  ['03', 'Discover thoughtfully', 'Browse profiles with shared values, goals, and life direction in view.'],
  ['04', 'Begin a conversation', 'Connect with people and families through clear, mutual consent.'],
]

const profiles = [
  { initials: 'AN', name: 'Aarav N.', age: '29', education: 'MS, Computer Science', profession: 'Product designer', location: 'Bengaluru · Mithila roots', tone: 'sage' },
  { initials: 'MS', name: 'Mitali S.', age: '27', education: 'MBBS', profession: 'Physician', location: 'New Delhi · Darbhanga family', tone: 'terracotta' },
  { initials: 'RS', name: 'Riya S.', age: '30', education: 'MBA, Finance', profession: 'Strategy lead', location: 'Mumbai · Madhubani family', tone: 'ochre' },
]

const values = [
  ['A community lens', 'A space shaped around Maithil people and the many ways our families live today.'],
  ['Culture with care', 'Gotra, Mool, and lineage can hold meaning where applicable — always with context and expert review.'],
  ['Modern by design', 'Clear profiles, thoughtful discovery, and a pace that leaves room for real conversation.'],
  ['Families welcome', 'Support for family-assisted discovery without taking agency away from the individual.'],
]

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><span>M</span></span>
}

export default function Homepage() {
  return (
    <main>
      <section className="hero-shell" id="top">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <header className="site-header">
          <a className="brand" href="#top" aria-label="Mithila Milan home"><Mark /><span>Mithila <em>Milan</em></span></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#culture">Our approach</a>
            <a href="#safety">Trust & safety</a>
          </nav>
          <a className="header-cta" href="#join">Join the waitlist <span aria-hidden="true">↗</span></a>
        </header>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> For the Maithil community</p>
            <h1>Find a match with <em>meaning.</em></h1>
            <p className="hero-intro">A considered matrimonial space rooted in Maithil values, open conversation, and the belief that a good match begins with being understood.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#join">Create your profile <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="#how-it-works">Explore how it works <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-proof"><span className="proof-dot" /> Community-led · Private by design</div>
          </div>
          <div className="hero-art" aria-label="Mithila-inspired abstract floral composition" role="img">
            <div className="sun-disc" />
            <div className="arch-frame"><div className="arch-inner" /></div>
            <div className="floral-stem stem-one" /><div className="floral-stem stem-two" />
            <div className="leaf leaf-one" /><div className="leaf leaf-two" /><div className="leaf leaf-three" /><div className="leaf leaf-four" />
            <div className="hero-art-label"><span>मिथिला</span><small>Rooted in belonging</small></div>
          </div>
        </div>
        <div className="hero-ribbon"><span>01 / A new way to begin</span><span>Made for meaningful connections</span><span>Scroll to explore ↓</span></div>
      </section>

      <section className="section section-cream" id="how-it-works">
        <div className="section-heading split-heading"><div><p className="eyebrow">A gentler process</p><h2>Made for the <em>whole story.</em></h2></div><p>Profiles are more than a list of preferences. They are an invitation to understand a person, their hopes, and the people who matter to them.</p></div>
        <div className="steps-grid">{steps.map(([number, title, copy]) => <article className="step-card" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{copy}</p><span className="step-arrow" aria-hidden="true">↗</span></article>)}</div>
      </section>

      <section className="culture-section" id="culture">
        <div className="culture-pattern" aria-hidden="true" />
        <div className="culture-content"><p className="eyebrow eyebrow-light">Culture, with context</p><h2>What makes a connection <em>feel like home?</em></h2><p className="culture-lead">For many Maithil families, identity is held in layers — in language, place, lineage, and the rituals that connect one generation to the next.</p><div className="culture-notes"><div><strong>Gotra · Mool · Family lineage</strong><span>Included where relevant and chosen by you.</span></div><div><strong>Panji-prabandh</strong><span>Any future verification experience will be developed with Maithil experts.</span></div></div><p className="validation-note">Compatibility rules and verification workflows are intentionally not final. We are listening first.</p></div>
        <div className="culture-seal" aria-hidden="true"><span>मि</span><small>Carefully<br />considered</small></div>
      </section>

      <section className="section matches-section" id="matches">
        <div className="section-heading split-heading"><div><p className="eyebrow">A glimpse of discovery</p><h2>Meet people, <em>not data points.</em></h2></div><a className="text-link" href="#join">Join the early community <span aria-hidden="true">↗</span></a></div>
        <div className="profile-grid">{profiles.map((profile) => <article className={`profile-card profile-${profile.tone}`} key={profile.name}><div className="profile-portrait"><span>{profile.initials}</span><i aria-hidden="true">✦</i></div><div className="profile-info"><div className="profile-name"><h3>{profile.name}</h3><span>{profile.age}</span></div><p>{profile.education}</p><p>{profile.profession}</p><div className="profile-location"><span aria-hidden="true">⌖</span>{profile.location}</div></div></article>)}</div><p className="fictional-note">Fictional examples shown for design demonstration only.</p>
      </section>

      <section className="values-section" id="safety"><div className="values-intro"><p className="eyebrow eyebrow-light">The Milan promise</p><h2>Modern matchmaking, <em>humanly held.</em></h2><p>Every decision starts with dignity: the dignity to choose what you share, who you speak with, and how quickly a connection unfolds.</p><a className="button button-light" href="#join">Learn about our approach <span aria-hidden="true">↗</span></a></div><div className="values-list">{values.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section>

      <section className="join-section" id="join"><div className="join-flower" aria-hidden="true">✦</div><p className="eyebrow">A meaningful beginning</p><h2>Make room for <em>something real.</em></h2><p>Join the early community and help shape a more thoughtful way for Maithil people and families to meet.</p><a className="button button-primary" href="mailto:hello@mithilamilan.example?subject=Join the Mithila Milan waitlist">Create your profile <span aria-hidden="true">↗</span></a></section>

      <footer className="site-footer"><div className="footer-top"><a className="brand" href="#top" aria-label="Mithila Milan home"><Mark /><span>Mithila <em>Milan</em></span></a><p>A thoughtful way to find your Milan.</p></div><div className="footer-bottom"><div className="footer-links"><a href="#culture">About</a><a href="mailto:hello@mithilamilan.example">Contact</a><a href="#safety">Safety</a><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div><span>© 2026 Mithila Milan · Built with care</span><div className="social-links"><a href="#instagram" aria-label="Instagram">ig</a><a href="#linkedin" aria-label="LinkedIn">in</a></div></div></footer>
    </main>
  )
}

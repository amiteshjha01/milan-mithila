import Link from 'next/link'

const nav = [
  ['About', '/about'],
  ['How it works', '/how-it-works'],
  ['Trust & safety', '/safety'],
  ['Membership', '/membership'],
  ['Cultural heritage', '/culture'],
]

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><span>M</span></span>
}

export function SiteHeader() {
  return <header className="site-header public-header">
    <Link className="brand" href="/"><Mark /><span>Mithila <em>Milan</em></span></Link>
    <nav className="desktop-nav" aria-label="Primary navigation">{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
    <Link className="header-cta" href="/#join">Join the waitlist <span aria-hidden="true">↗</span></Link>
  </header>
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-top"><Link className="brand" href="/"><Mark /><span>Mithila <em>Milan</em></span></Link><p>A thoughtful way to find your Milan.</p></div><div className="footer-bottom"><div className="footer-links">{nav.slice(0, 4).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link></div><span>© 2026 Mithila Milan · Built with care</span><div className="social-links"><a href="#instagram" aria-label="Instagram">ig</a><a href="#linkedin" aria-label="LinkedIn">in</a></div></div></footer>
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return <main className="public-page"><div className="public-shell"><SiteHeader />{children}</div><SiteFooter /></main>
}

export function PageIntro({ kicker, title, description, label }: { kicker: string; title: React.ReactNode; description: string; label: string }) {
  return <section className="page-intro"><div className="page-intro-copy"><p className="eyebrow"><span className="eyebrow-line" />{kicker}</p><h1>{title}</h1><p className="page-lead">{description}</p></div><div className="page-intro-index" aria-hidden="true"><span>{label}</span><i /></div></section>
}

export function SectionTitle({ kicker, title, copy }: { kicker: string; title: React.ReactNode; copy?: string }) {
  return <div className="public-section-title"><div><p className="eyebrow">{kicker}</p><h2>{title}</h2></div>{copy && <p>{copy}</p>}</div>
}

export function EditorialNote({ children }: { children: React.ReactNode }) { return <aside className="editorial-note"><span>Field note</span><p>{children}</p></aside> }

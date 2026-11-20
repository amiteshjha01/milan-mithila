import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicShell } from '@/components/site-shell'
import { createNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = createNoIndexMetadata(
  'Page Not Found',
  'The page you are looking for could not be found on Mithila Milan.'
)

export default function NotFound() {
  return (
    <PublicShell>
      <section
        className="public-band paper-band"
        style={{
          minHeight: '62vh',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '620px' }}>
          <p className="eyebrow">404 · Page Not Found</p>
          <h1
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(32px, 5vw, 48px)',
              lineHeight: 1.15,
              margin: '12px 0 16px',
            }}
          >
            This path could not be <em>found.</em>
          </h1>
          <p style={{ fontSize: '16px', lineHeight: 1.65, opacity: 0.82, marginBottom: '28px' }}>
            The link may have moved or expired. Explore our public heritage guides, Vedic compatibility tools, or return to the homepage.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <Link className="btn-primary" href="/">
              Return Home
            </Link>
            <Link className="btn-secondary" href="/culture">
              Maithil Heritage
            </Link>
            <Link className="btn-secondary" href="/kundali-matching">
              Kundali Matching
            </Link>
            <Link className="btn-secondary" href="/biodata">
              Biodata Builder
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}

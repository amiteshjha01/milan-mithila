import type { Metadata } from 'next'
import Link from 'next/link'
import { EditorialNote, PageIntro, PublicShell, SectionTitle } from '@/components/site-shell'
import { createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({
  title: 'Terms of Service',
  description: 'Community standards, eligibility, anti-dowry enforcement, and terms of service for Mithila Milan members.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <PublicShell>
      <PageIntro
        kicker="Community Covenant"
        label="Terms"
        title={<>A community held by <em>mutual respect.</em></>}
        description="Mithila Milan exists for sincere matrimonial connections. By joining, every member and participating family member agrees to our charter of honesty, safety, and cultural dignity."
      />

      <section className="public-band paper-band">
        <SectionTitle
          kicker="Standards of Conduct"
          title={<>The rules that keep this space <em>safe and honorable.</em></>}
          copy="Clear principles for everyone who enters Mithila Milan."
        />

        <div className="safety-grid">
          <article>
            <span>01 / Eligibility</span>
            <h3>Adults only (18+ / 21+)</h3>
            <p>You must be of legal marriageable age under the laws of India or your local jurisdiction (women 18+, men 21+). Profiles for minors or proxy registrations without seeker authorization are strictly forbidden.</p>
          </article>
          <article>
            <span>02 / Anti-Dowry</span>
            <h3>Strict zero tolerance for dowry</h3>
            <p>Under the Dowry Prohibition Act, 1961, asking for, hinting at, demanding, or facilitating dowry in any guise (cash, gifts, property) is strictly illegal and causes immediate permanent termination and reporting.</p>
          </article>
          <article>
            <span>03 / Honesty</span>
            <h3>Authentic representations</h3>
            <p>All shared information—including marital status, education, employment, and family background—must be truthful. Deliberate misrepresentation or impersonation leads to account revocation.</p>
          </article>
          <article>
            <span>04 / Safety & Boundaries</span>
            <h3>Respectful communication</h3>
            <p>Harassment, abusive language, unwanted pressure, unauthorized sharing of photos, or persistence after a polite decline is grounds for permanent blocking and moderation review.</p>
          </article>
        </div>

        <EditorialNote>
          Mithila Milan is an intermediary discovery platform, not an investigation agency or legal solemnizer. Members must exercise standard personal precautions, family diligence, and background validation before entering marriage agreements.
        </EditorialNote>
      </section>

      <section className="public-band terracotta-band">
        <div className="split-callout">
          <div>
            <p className="eyebrow eyebrow-light">Cultural Notice</p>
            <h2>Lineage data is <em>exploratory.</em></h2>
          </div>
          <div>
            <p>
              Gotra, Mool, and Panji-related entries are community descriptors submitted by users. Mithila Milan does not issue official Panji certificates or adjudicate Siddhanta compatibility. Any authoritative genealogical vetting should be conducted with independent, qualified Panjikars and community elders.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link className="text-link" href="/culture" style={{ color: '#fffaf1', borderColor: 'rgba(255,255,255,0.4)' }}>
                Learn about our cultural principles ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}

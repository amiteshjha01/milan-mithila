import type { Metadata } from 'next'
import Link from 'next/link'
import { EditorialNote, PageIntro, PublicShell, SectionTitle } from '@/components/site-shell'
import { createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({
  title: 'Privacy Policy',
  description: 'Consent-first, DPDP Act 2023 aligned privacy commitments for the Mithila Milan community.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <PublicShell>
      <PageIntro
        kicker="Consent & Sovereignty"
        label="Privacy"
        title={<>Your identity, held with <em>dignity and care.</em></>}
        description="Mithila Milan is designed under the Digital Personal Data Protection Act (DPDP Act, 2023) and global privacy standards. We treat matrimonial discovery as personal trust, not a data brokerage."
      />

      <section className="public-band paper-band">
        <SectionTitle
          kicker="Our Core Commitments"
          title={<>Privacy is our product architecture, <em>not fine print.</em></>}
          copy="You decide who sees your photographs, your contact details, and your cultural background."
        />

        <div className="safety-grid">
          <article>
            <span>01 / Agency</span>
            <h3>Individual consent first</h3>
            <p>Every profile requires direct consent from the adult seeker. Family members who assist cannot overwrite the individual's boundaries, contact sharing, or communication approvals.</p>
          </article>
          <article>
            <span>02 / Granular Controls</span>
            <h3>Section-by-section visibility</h3>
            <p>Choose independent privacy levels for photos, family details, professional income, and cultural heritage (Members only, Connections only, or Private).</p>
          </article>
          <article>
            <span>03 / Contact Shield</span>
            <h3>No public contact details</h3>
            <p>Phone numbers, email addresses, exact home addresses, and government IDs are never visible on public or member profile cards without mutual consent.</p>
          </article>
          <article>
            <span>04 / Data Rights</span>
            <h3>DPDP Act 2023 compliance</h3>
            <p>Exercise your statutory rights at any time: request a full copy of your data, correct inaccuracies, revoke consent, or permanently purge your profile.</p>
          </article>
        </div>

        <EditorialNote>
          We never sell, rent, or monetize personal data for third-party advertising or commercial profiling. Matrimonial trust requires strict purpose limitation.
        </EditorialNote>
      </section>

      <section className="public-band soft-band">
        <div className="split-callout">
          <div>
            <p className="eyebrow">Cultural Data Governance</p>
            <h2>Gotra, Mool, & Heritage <em>protection.</em></h2>
          </div>
          <div>
            <p>
              Cultural markers such as Gotra, Mool, Kul, and Pravara are entirely self-declared and voluntary. They are not mined for automated verdicts or shared with external genealogists without explicit per-instance consent.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link className="text-link" href="/culture">Read about our cultural methodology ↗</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="public-band paper-band">
        <SectionTitle
          kicker="Grievance & Redressal"
          title={<>A human officer for <em>your concerns.</em></>}
          copy="As required under Indian Information Technology and Data Protection rules, our grievance officer is responsive and accountable."
        />

        <div className="contact-details" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div>
            <span>Data Protection & Grievance Officer</span>
            <strong>Grievance Redressal Desk, Mithila Milan</strong>
          </div>
          <div>
            <span>Direct Email</span>
            <strong>privacy@mithilamilan.example</strong>
          </div>
          <div>
            <span>Statutory Response Window</span>
            <strong>Acknowledged within 24 hours · Resolved within 15 working days</strong>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}

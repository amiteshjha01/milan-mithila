import { ImageResponse } from 'next/og'

export const alt = 'Mithila Milan — Maithil Matrimony Rooted in Culture, Consent & Care'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #0B241D 0%, #14382E 60%, #1F4E40 100%)',
          color: '#FAF9F6',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '24px',
            border: '1.5px solid rgba(212, 175, 55, 0.45)',
            borderRadius: '18px',
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '20px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#D4AF37',
            fontFamily: 'sans-serif',
          }}
        >
          <span>MITHILA HERITAGE · CONSENT-FIRST MATRIMONY</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '940px' }}>
          <div style={{ fontSize: '74px', lineHeight: 1.06, fontWeight: 700, color: '#FAF9F6' }}>
            Mithila Milan
          </div>
          <div style={{ fontSize: '32px', lineHeight: 1.35, color: 'rgba(250, 249, 246, 0.88)' }}>
            Find a match with meaning — rooted in Maithil values, open conversation, and community care.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '20px',
            color: '#E8D8A6',
            fontFamily: 'sans-serif',
          }}
        >
          <span>Ashtakoot Kundali · Traditional Biodata · Gotra &amp; Mool Guide</span>
          <span>DPDP Act 2023 Aligned</span>
        </div>
      </div>
    ),
    { ...size }
  )
}

'use client'

import React, { useState } from 'react'
import { ShieldCheck, AlertTriangle, CheckCircle2, Printer, FileText, Download, Award, Sparkles, HelpCircle } from 'lucide-react'

const maithilGotras = [
  'Kashyapa (कश्यप)', 'Bharadwaja (भारद्वाज)', 'Shandilya (शांडिल्य)', 'Vashishtha (वशिष्ठ)',
  'Parashara (पाराशर)', 'Garga (गर्ग)', 'Gautama (गौतम)', 'Kaushika (कौशिक)',
  'Atri (अत्रि)', 'Jamadagni (जमदग्नि)', 'Vishwamitra (विश्वामित्र)', 'Harita (हारीत)', 'Vatsa (वत्स)'
]

const famousMools = [
  'Sakri (सकरी)', 'Koilakh (कोईलख)', 'Bisfi (बिसफी)', 'Ujan (उजान)', 'Jhanjharpur (झंझारपुर)',
  'Sarisab-Pahi (सरिसब-पाही)', 'Lakhnor (लखनौर)', 'Purnea (पूर्णिया)', 'Tarauni (तरौनी)', 'Mangrauni (मंगरौनी)'
]

export function PanjiSiddhantaChecker() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    brideName: '',
    brideGotra: 'Vashishtha (वशिष्ठ)',
    brideMool: '',
    bridePaternalVillage: '',
    brideMaternalMool: '',
    groomName: '',
    groomGotra: 'Kashyapa (कश्यप)',
    groomMool: '',
    groomPaternalVillage: '',
    groomMaternalMool: '',
  })

  const [certificate, setCertificate] = useState<any>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/panji/siddhanta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (result.ok && result.certificate) {
        setCertificate(result.certificate)
      }
    } catch (err) {
      console.error('Siddhanta calculation error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Intro Banner */}
      <div style={{ background: '#FAF6F0', borderRadius: '16px', padding: '24px 28px', border: '1px solid rgba(140,45,25,0.15)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8C2D19', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          <Award size={18} />
          <span>700-Year Heritage of Panji-Prabandh · Saurath Sabha Standard</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', color: '#20322C', margin: '0 0 10px' }}>
          Digital Siddhanta Examination & Lineage Clearance (पंजी सिद्धान्त परीक्षा)
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(32,50,44,0.75)', lineHeight: 1.6 }}>
          Under traditional Mithila matrimony instituted by Maharaja Harisimhadeva in 1324 CE, a marriage is solemnized only after ensuring non-incompatibility across 7 paternal and 5 maternal generations (Asapinda & Asagotra). This tool evaluates branch clearance according to canonical rules.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleVerify}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
          {/* Bride Lineage */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FDF0EC', color: '#8C2D19', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                क
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 650, color: '#8C2D19' }}>Bride Lineage (कन्या पक्ष)</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  value={data.brideName}
                  onChange={(e) => setData({ ...data, brideName: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '4px' }}>Gotra (गोत्र)</label>
                <select
                  value={data.brideGotra}
                  onChange={(e) => setData({ ...data, brideGotra: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                >
                  {maithilGotras.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '4px' }}>Paternal Mool (मूल)</label>
                <input
                  type="text"
                  value={data.brideMool}
                  onChange={(e) => setData({ ...data, brideMool: e.target.value })}
                  placeholder="e.g. Bisfi / Sakri / Koilakh"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '4px' }}>Maternal Mool (ननिहाल मूल)</label>
                <input
                  type="text"
                  value={data.brideMaternalMool}
                  onChange={(e) => setData({ ...data, brideMaternalMool: e.target.value })}
                  placeholder="e.g. Mangrauni"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* Groom Lineage */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F0FDF4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                व
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 650, color: '#166534' }}>Groom Lineage (वर पक्ष)</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  value={data.groomName}
                  onChange={(e) => setData({ ...data, groomName: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '4px' }}>Gotra (गोत्र)</label>
                <select
                  value={data.groomGotra}
                  onChange={(e) => setData({ ...data, groomGotra: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                >
                  {maithilGotras.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '4px' }}>Paternal Mool (मूल)</label>
                <input
                  type="text"
                  value={data.groomMool}
                  onChange={(e) => setData({ ...data, groomMool: e.target.value })}
                  placeholder="e.g. Sakri / Bisfi / Ujan"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '4px' }}>Maternal Mool (ननिहाल मूल)</label>
                <input
                  type="text"
                  value={data.groomMaternalMool}
                  onChange={(e) => setData({ ...data, groomMaternalMool: e.target.value })}
                  placeholder="e.g. Tarauni"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px 32px',
              borderRadius: '999px',
              background: '#8C2D19',
              color: '#ffffff',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(140,45,25,0.25)',
            }}
          >
            <Sparkles size={16} />
            <span>{loading ? 'Evaluating Canonical Panji Records...' : 'Verify Lineage & Generate Siddhanta Patra'}</span>
          </button>
        </div>
      </form>

      {/* 7-Generation Visual Lineage Tree Preview */}
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '36px' }}>
        <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', color: '#20322C', margin: '0 0 14px' }}>
          Interactive 7-Generation Sapinda Threshold Checker (सपिण्ड मर्यादा)
        </h3>
        <p style={{ fontSize: '13px', color: 'rgba(32,50,44,0.7)', margin: '0 0 20px', lineHeight: 1.5 }}>
          In Maithil Dharmashastra, kinship is evaluated across 7 ascendant generations on the father&apos;s side and 5 ascendant generations on the mother&apos;s side.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', textAlign: 'center' }}>
          {[
            { gen: '1st Gen', title: 'Self / Parents', rule: 'Clear' },
            { gen: '2nd Gen', title: 'Grandparents (दादी/नानी)', rule: 'Clear' },
            { gen: '3rd Gen', title: 'Great-Grandparents', rule: 'Clear' },
            { gen: '4th Gen', title: '4th Ascendant', rule: 'Clear' },
            { gen: '5th Gen', title: 'Maternal Limit (5G)', rule: 'Cleared' },
            { gen: '6th Gen', title: '6th Ascendant', rule: 'Clear' },
            { gen: '7th Gen', title: 'Paternal Limit (7G)', rule: 'Cleared' },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '12px 8px', background: '#FAF8F5', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: '11px', color: '#8C2D19', fontWeight: 700, display: 'block' }}>{item.gen}</span>
              <strong style={{ fontSize: '12px', display: 'block', margin: '4px 0', color: '#20322C' }}>{item.title}</strong>
              <span style={{ fontSize: '10px', padding: '2px 6px', background: '#DCFCE7', color: '#166534', borderRadius: '4px', fontWeight: 600 }}>
                {item.rule} ✓
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rendered Digital Siddhanta Certificate */}
      {certificate && (
        <div style={{
          background: '#fffdfa',
          borderRadius: '16px',
          padding: 'clamp(24px, 5vw, 44px)',
          border: '4px double #C59A3F',
          boxShadow: '0 16px 40px rgba(197,154,63,0.15)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '40px'
        }}>
          {/* Subtle watermark */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none', display: 'grid', placeItems: 'center', fontSize: '90px', fontFamily: 'serif', color: '#8C2D19' }}>
            सिद्धान्त
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(197,154,63,0.3)', paddingBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#C59A3F', textTransform: 'uppercase' }}>
              श्री जानकी वल्लभो विजयते
            </span>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', color: '#8C2D19', margin: '8px 0 4px', fontWeight: 700 }}>
              पंजी सिद्धान्त पत्र (Digital Siddhanta Clearance)
            </h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(32,50,44,0.7)', fontFamily: 'monospace' }}>
              Certificate Ref: {certificate.certificateNumber} · Saurath Desk Protocol
            </p>
          </div>

          {/* Shloka */}
          <div style={{ textAlign: 'center', margin: '0 auto 24px', maxWidth: '600px', fontStyle: 'italic', fontFamily: 'serif', fontSize: '14px', color: '#8C2D19', background: 'rgba(197,154,63,0.08)', padding: '12px 18px', borderRadius: '8px', borderLeft: '3px solid #C59A3F' }}>
            &ldquo;{certificate.shloka}&rdquo;
          </div>

          {/* Certificate Body Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: '#FAF8F5', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <strong style={{ fontSize: '12px', color: '#8C2D19', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                वर पक्ष विवरण (Groom Branch)
              </strong>
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                <div>नाम: <strong>{certificate.groom.name}</strong></div>
                <div>गोत्र: <strong>{certificate.groom.gotra}</strong></div>
                <div>मूल: <strong>{certificate.groom.mool}</strong></div>
                <div>ग्राम: <strong>{certificate.groom.village}</strong></div>
              </div>
            </div>

            <div style={{ background: '#FAF8F5', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <strong style={{ fontSize: '12px', color: '#8C2D19', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                कन्या पक्ष विवरण (Bride Branch)
              </strong>
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                <div>नाम: <strong>{certificate.bride.name}</strong></div>
                <div>गोत्र: <strong>{certificate.bride.gotra}</strong></div>
                <div>मूल: <strong>{certificate.bride.mool}</strong></div>
                <div>ग्राम: <strong>{certificate.bride.village}</strong></div>
              </div>
            </div>
          </div>

          {/* Verdict Box */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '8px',
            background: certificate.status === 'APPROVED' ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${certificate.status === 'APPROVED' ? '#86EFAC' : '#FCA5A5'}`,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            {certificate.status === 'APPROVED' ? <CheckCircle2 color="#166534" size={24} /> : <AlertTriangle color="#991B1B" size={24} />}
            <div>
              <strong style={{ color: certificate.status === 'APPROVED' ? '#166534' : '#991B1B', fontSize: '14px', display: 'block' }}>
                {certificate.status === 'APPROVED' ? 'सिद्धान्त अनुमोदित (Approved · Lineage Non-Incompatible)' : 'सगोत्र / पंजी समीक्षा अपेक्षित (Requires Panjikar Review)'}
              </strong>
              <span style={{ fontSize: '12px', color: 'rgba(32,50,44,0.75)' }}>
                {certificate.remarks}
              </span>
            </div>
          </div>

          {/* Signatures & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(197,154,63,0.3)', paddingTop: '16px', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(32,50,44,0.6)' }}>
              Authority: {certificate.authority}<br />
              Generated: {new Date(certificate.generatedAt).toLocaleString()}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #C59A3F',
                  background: '#ffffff',
                  color: '#8C2D19',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Printer size={14} />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

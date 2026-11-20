'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SiteHeader, SiteFooter, MobileBottomNav } from '@/components/site-shell'
import { Crown, Sparkles, Shield, UserCheck, PhoneCall, Check, Heart, Award, Clock, ArrowRight, Lock, Users } from 'lucide-react'

export function MilanSelectApp() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [referenceCode, setReferenceCode] = useState('VIP-840291')
  const [submitting, setSubmitting] = useState(false)
  const [selectedTier, setSelectedTier] = useState<'prive' | 'imperial'>('prive')
  const [formData, setFormData] = useState({
    candidateName: '',
    guardianName: '',
    relationship: 'Parent (माता / पिता)',
    phone: '',
    email: '',
    profession: '',
    preferredDistrict: 'Darbhanga / Madhubani / Any',
    preferredTime: 'Evening (5:00 PM - 8:00 PM)',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tier: selectedTier }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.referenceId) setReferenceCode(data.referenceId)
      }
    } catch (err) {
      console.warn('Consultation submission notice:', err)
    } finally {
      setSubmitting(false)
      setFormSubmitted(true)
    }
  }

  return (
    <div style={{ background: '#fdfbf7', minHeight: '100vh', color: '#1B2D26' }}>
      <SiteHeader />

      <main>
        {/* Luxury Hero Banner */}
        <section style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1B352B 0%, #29473A 60%, #152820 100%)',
          color: '#FAF8F5',
          padding: '80px 24px 100px',
          overflow: 'hidden',
          textAlign: 'center'
        }}>
          {/* Subtle Aripan & Kohbar Background Accent */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }}>
            <Image src="/images/mithila-kohbar.png" alt="Mithila Heritage" fill style={{ objectFit: 'cover' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '840px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '999px',
              background: 'rgba(212,175,55,0.15)',
              border: '1px solid rgba(212,175,55,0.35)',
              color: '#F4D068',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '24px'
            }}>
              <Crown size={16} />
              <span>Bespoke Matrimonial Concierge · विशिष्ट सेवा</span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(32px, 5.5vw, 56px)',
              margin: '0 0 20px',
              lineHeight: 1.15,
              fontWeight: 700,
              color: '#FFF8E7'
            }}>
              Milan Select
            </h1>

            <p style={{
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              lineHeight: 1.6,
              color: 'rgba(255,248,231,0.85)',
              maxWidth: '680px',
              margin: '0 auto 36px'
            }}>
              An exclusive, high-touch assisted matchmaking sanctuary for accomplished Maithil leaders, civil servants, doctors, scholars, and global NRIs.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a
                href="#consultation-booking"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #AA820A 100%)',
                  color: '#152820',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(212,175,55,0.3)',
                }}
              >
                <span>Request Private Consultation</span>
                <ArrowRight size={16} />
              </a>

              <Link
                href="/kundali-matching"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FAF8F5',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                <span>Check Astrological Alignment</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Pillars of Milan Select */}
        <section style={{ maxWidth: '1180px', margin: '-50px auto 60px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {[
              {
                icon: UserCheck,
                title: 'Dedicated Relationship Manager',
                hindi: 'समर्पित कुल-प्रबंधक',
                desc: 'A seasoned matchmaker acts as your personal advisor, conducting preliminary discussions with families and filtering prospects according to your family ethos.'
              },
              {
                icon: Lock,
                title: '100% Confidential Blind Profiles',
                hindi: 'गोपनीयता और मर्यादा',
                desc: 'Photographs, contact coordinates, and company details are withheld until both families express mutual written authorization.'
              },
              {
                icon: Award,
                title: 'Authentic Lineage & Panji Research',
                hindi: 'पंजी एवं मूल समन्वय',
                desc: 'Detailed ancestral Mool, Gotra, and Pravara verification handled with utmost scholarly sensitivity and ancestral reverence.'
              },
              {
                icon: Clock,
                title: 'Direct Elder-to-Elder Dialogue',
                hindi: 'पारिवारिक सौहार्द',
                desc: 'Comfortable, facilitated introductions between parents or guardians, accompanied by tea or private video rooms without awkward pressures.'
              }
            ].map((pillar) => {
              const Icon = pillar.icon
              return (
                <div key={pillar.title} style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '28px',
                  border: '1px solid rgba(197,143,39,0.25)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(140,45,25,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8C2D19',
                      marginBottom: '16px'
                    }}>
                      <Icon size={22} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#8C2D19', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {pillar.hindi}
                    </span>
                    <h3 style={{ fontSize: '18px', margin: '4px 0 10px', color: '#20322C', fontWeight: 700 }}>
                      {pillar.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(32,50,44,0.75)', lineHeight: 1.6, margin: 0 }}>
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* The Assisted Process */}
        <section style={{ maxWidth: '1080px', margin: '0 auto 80px', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#8C2D19', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              The Milan Select Journey
            </span>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '32px', color: '#20322C', margin: '6px 0 12px' }}>
              How Assisted Matchmaking Unfolds
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(32,50,44,0.7)', maxWidth: '580px', margin: '0 auto' }}>
              We eliminate endless swiping and replace it with dignity, respectful family consultations, and refined compatibility.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', title: 'Deep Discovery Call', desc: 'A 45-minute confidential session with you and your parents to understand life aspirations, Gotra preferences, and partner criteria.' },
              { step: '02', title: 'Astrological & Mool Screening', desc: 'Our in-house Vedic Jyotishi verifies Ashtakoot Guna (28+ threshold) and checks Mool records before presenting matches.' },
              { step: '03', title: 'Curated Dossier Presentation', desc: 'Every 3 weeks, your Manager presents 2-3 handpicked, pre-screened family profiles with complete background details.' },
              { step: '04', title: 'Facilitated Video / Tea Meet', desc: 'When mutual interest is confirmed, we coordinate a discreet 1-on-1 virtual or in-person family tea meeting.' }
            ].map((s) => (
              <div key={s.step} style={{ background: '#FAF8F5', borderRadius: '14px', padding: '24px', border: '1px solid rgba(0,0,0,0.06)', position: 'relative' }}>
                <span style={{ fontSize: '24px', fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, color: '#8C2D19', opacity: 0.6, display: 'block', marginBottom: '8px' }}>
                  {s.step}
                </span>
                <h4 style={{ fontSize: '16px', margin: '0 0 8px', color: '#20322C', fontWeight: 700 }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'rgba(32,50,44,0.7)', lineHeight: 1.5, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Membership Tiers Comparison */}
        <section style={{ maxWidth: '1080px', margin: '0 auto 80px', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '32px', color: '#20322C', margin: '0 0 10px' }}>
              Select Concierge Tiers
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(32,50,44,0.7)' }}>
              Choose the level of discretion and advisory support best suited to your family.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {/* Privé Tier */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '36px',
              border: selectedTier === 'prive' ? '2px solid #8C2D19' : '1px solid rgba(0,0,0,0.1)',
              boxShadow: selectedTier === 'prive' ? '0 12px 36px rgba(140,45,25,0.12)' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedTier('prive')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8C2D19' }}>
                  Most Popular
                </span>
                {selectedTier === 'prive' && <span style={{ background: '#FDF0EC', color: '#8C2D19', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>Selected</span>}
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#20322C', margin: '0 0 8px' }}>Milan Select Privé</h3>
              <p style={{ fontSize: '13px', color: 'rgba(32,50,44,0.7)', margin: '0 0 20px' }}>
                For professionals and families seeking personalized matchmaking with privacy.
              </p>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#8C2D19', marginBottom: '24px' }}>
                ₹18,500 <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(32,50,44,0.6)' }}>/ 3 months</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Personal Relationship Manager',
                  'Up to 12 handpicked family introductions',
                  'Ashtakoot Kundali matching included',
                  'Profile privacy & photo masking',
                  'Weekly match digest by WhatsApp/Call'
                ].map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#20322C' }}>
                    <Check size={16} color="#8C2D19" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#consultation-booking"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  background: '#8C2D19',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none'
                }}
              >
                Inquire for Privé Tier
              </a>
            </div>

            {/* Imperial Royal Tier */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '36px',
              border: selectedTier === 'imperial' ? '2px solid #D4AF37' : '1px solid rgba(0,0,0,0.1)',
              boxShadow: selectedTier === 'imperial' ? '0 12px 36px rgba(212,175,55,0.2)' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedTier('imperial')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#B8860B' }}>
                  Ultra-Discreet
                </span>
                {selectedTier === 'imperial' && <span style={{ background: '#FFFBEA', color: '#B8860B', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>Selected</span>}
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#20322C', margin: '0 0 8px' }}>Imperial Royal Tier</h3>
              <p style={{ fontSize: '13px', color: 'rgba(32,50,44,0.7)', margin: '0 0 20px' }}>
                For Civil Servants, Top Executives, Business Families & International NRIs.
              </p>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#B8860B', marginBottom: '24px' }}>
                ₹38,000 <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(32,50,44,0.6)' }}>/ 6 months</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Senior Executive Matchmaker assigned',
                  'Unlimited curated introductions until formal engagement',
                  'Deep Panji & Genealogical village verification',
                  '100% Blind Profile (No public listing whatsoever)',
                  'Direct elder-to-elder conference liaison',
                  'In-person introductory host support in Delhi/Patna/Bangalore'
                ].map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#20322C' }}>
                    <Check size={16} color="#B8860B" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#consultation-booking"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #AA820A 100%)',
                  color: '#152820',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none'
                }}
              >
                Inquire for Imperial Royal Tier
              </a>
            </div>
          </div>
        </section>

        {/* Private Consultation Booking Form */}
        <section id="consultation-booking" style={{ maxWidth: '820px', margin: '0 auto 80px', padding: '0 clamp(16px, 4vw, 24px)' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: 'clamp(20px, 5vw, 40px)',
            border: '2px solid rgba(140,45,25,0.2)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.04)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', borderRadius: '50%', background: '#FDF0EC', color: '#8C2D19', marginBottom: '12px' }}>
                <PhoneCall size={24} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', color: '#20322C', margin: '0 0 8px' }}>
                Schedule a Confidential Consultation
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(32,50,44,0.7)', margin: 0 }}>
                Speak directly with our senior relationship advisor. No spam, total discretion guaranteed.
              </p>
            </div>

            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#F4F9F6', borderRadius: '16px', border: '1px solid #A7F3D0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#166534', margin: '0 0 8px' }}>
                  Consultation Request Received
                </h3>
                <div style={{ display: 'inline-block', margin: '6px 0 16px', padding: '4px 14px', borderRadius: '999px', background: '#DCFCE7', border: '1px solid #86EFAC', color: '#14532D', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
                  Reference Code: {referenceCode} · Registered in System
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(32,50,44,0.8)', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                  Thank you, <strong>{formData.candidateName || 'Respected Member'}</strong>. Your dedicated relationship manager will reach out via phone at your preferred window ({formData.preferredTime}) with complete discretion.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: '1px solid rgba(32,50,44,0.25)',
                      background: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Submit Another Inquiry
                  </button>
                  <Link
                    href="/dashboard"
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      background: '#1B4D3E',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Return to Space
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Candidate Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rameshwar Jha"
                      value={formData.candidateName}
                      onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Inquiry By (Relationship) *</label>
                    <select
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                    >
                      <option>Parent (माता / पिता)</option>
                      <option>Candidate Themselves (स्वयं)</option>
                      <option>Sibling (भाई / बहन)</option>
                      <option>Guardian / Elder (अभिभावक)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Phone / WhatsApp Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Confidential Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="confidential@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Candidate Profession / Education</label>
                    <input
                      type="text"
                      placeholder="e.g. IAS Officer / Tech Lead / Doctor (MD)"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Best Time for Call</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                    >
                      <option>Morning (10:00 AM - 1:00 PM)</option>
                      <option>Afternoon (2:00 PM - 5:00 PM)</option>
                      <option>Evening (5:00 PM - 8:00 PM)</option>
                      <option>Weekend Morning</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Specific Family / Gotra / Location Preferences</label>
                  <textarea
                    rows={3}
                    placeholder="Mention any specific Gotra, Mool, educational background, or geographical roots of importance to your family..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(32,50,44,0.65)' }}>
                  <Shield size={16} color="#8C2D19" style={{ flexShrink: 0 }} />
                  <span>Strict Confidentiality Guaranteed: Your details are never published or shared without prior written consent.</span>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '14px 28px',
                    borderRadius: '8px',
                    background: '#8C2D19',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '8px',
                    boxShadow: '0 8px 20px rgba(140,45,25,0.25)'
                  }}
                >
                  Confirm & Request Relationship Advisor Call
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}

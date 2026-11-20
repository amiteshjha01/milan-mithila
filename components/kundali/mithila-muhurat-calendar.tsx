'use client'

import React, { useState } from 'react'
import { Calendar, Sparkles, MapPin, Clock, Check, Heart, Bookmark } from 'lucide-react'

interface MuhuratDate {
  date: string
  day: string
  hinduMonth: string
  tithi: string
  nakshatra: string
  shubhLagna: string
  quality: 'अति शुभ (Supreme)' | 'उत्तम (Auspicious)'
  notes: string
}

const muhuratList: MuhuratDate[] = [
  {
    date: '18 November 2026',
    day: 'Wednesday',
    hinduMonth: 'Margashirsha (अगहन)',
    tithi: 'Shukla Navami',
    nakshatra: 'Uttara Bhadrapada',
    shubhLagna: 'Godhuli & Nishita Lagna (07:15 PM - 11:45 PM)',
    quality: 'अति शुभ (Supreme)',
    notes: 'Exceptional alignment for Maithil vivah rites. Blessed by Guru-Chandra drishti.',
  },
  {
    date: '25 November 2026',
    day: 'Wednesday',
    hinduMonth: 'Margashirsha (अगहन)',
    tithi: 'Purnima / Pratipada',
    nakshatra: 'Rohini Nakshatra',
    shubhLagna: 'Pradosh Lagna (06:30 PM - 09:40 PM)',
    quality: 'अति शुभ (Supreme)',
    notes: 'Rohini Nakshatra is universally venerated in Mithila tradition for enduring marital longevity.',
  },
  {
    date: '02 December 2026',
    day: 'Wednesday',
    hinduMonth: 'Margashirsha (अगहन)',
    tithi: 'Krishna Ashtami',
    nakshatra: 'Uttara Phalguni',
    shubhLagna: 'Sandhya Lagna (05:45 PM - 08:30 PM)',
    quality: 'उत्तम (Auspicious)',
    notes: 'Favorable for companion weddings; free of Bhadra and Rahu Kalam during rites.',
  },
  {
    date: '15 January 2027',
    day: 'Friday',
    hinduMonth: 'Magha (माघ)',
    tithi: 'Shukla Saptami',
    nakshatra: 'Revati Nakshatra',
    shubhLagna: 'Vrishabha & Mithun Lagna (08:00 PM - 12:30 AM)',
    quality: 'अति शुभ (Supreme)',
    notes: 'Makar Sankranti Uttarayan opening. Highly auspicious post-Kharmas date across Darbhanga and Madhubani.',
  },
  {
    date: '22 January 2027',
    day: 'Friday',
    hinduMonth: 'Magha (माघ)',
    tithi: 'Shukla Purnima',
    nakshatra: 'Pushya Nakshatra',
    shubhLagna: 'Karka Lagna (07:10 PM - 10:45 PM)',
    quality: 'अति शुभ (Supreme)',
    notes: 'Guru Pushya Vivah yoga. Consecrated for eternal harmony and family prosperity.',
  },
  {
    date: '06 February 2027',
    day: 'Saturday',
    hinduMonth: 'Phalguna (फाल्गुन)',
    tithi: 'Shukla Pratipada',
    nakshatra: 'Hasta Nakshatra',
    shubhLagna: 'Godhuli Vela (06:00 PM - 09:15 PM)',
    quality: 'उत्तम (Auspicious)',
    notes: 'Pre-Holi auspicious vivah window. Mild weather and Vedic planetary stability.',
  },
  {
    date: '18 February 2027',
    day: 'Thursday',
    hinduMonth: 'Phalguna (फाल्गुन)',
    tithi: 'Shukla Trayodashi',
    nakshatra: 'Punarvasu Nakshatra',
    shubhLagna: 'Simha Lagna (09:20 PM - 01:10 AM)',
    quality: 'अति शुभ (Supreme)',
    notes: 'Highly recommended in Vishwavidyalaya Mithila Panchang.',
  },
  {
    date: '24 April 2027',
    day: 'Saturday',
    hinduMonth: 'Baisakh (वैशाख)',
    tithi: 'Shukla Tritiya (Akshaya Tritiya)',
    nakshatra: 'Rohini Nakshatra',
    shubhLagna: 'Sarva Muhurat (All-day Abhijeet & Godhuli)',
    quality: 'अति शुभ (Supreme)',
    notes: 'Akshaya Tritiya: The eternal, indestructible muhurat requiring no dosha remediation.',
  },
]

export function MithilaMuhuratCalendar() {
  const [filterMonth, setFilterMonth] = useState('ALL')
  const [savedDates, setSavedDates] = useState<string[]>([])

  const toggleSave = (date: string) => {
    setSavedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    )
  }

  const filtered = filterMonth === 'ALL'
    ? muhuratList
    : muhuratList.filter((m) => m.hinduMonth.toLowerCase().includes(filterMonth.toLowerCase()))

  return (
    <div>
      {/* Intro */}
      <div style={{ background: '#FAF6F0', borderRadius: '16px', padding: '24px 28px', border: '1px solid rgba(140,45,25,0.15)', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8C2D19', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          <Calendar size={16} />
          <span>Mithila Vishwavidyalaya Panchang 2026–2027 (मिथिला पंचांग)</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', color: '#20322C', margin: '0 0 8px' }}>
          Shubh Vivah Muhurat & Auspicious Dates (शुभ विवाह मुहूर्त)
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(32,50,44,0.75)', lineHeight: 1.6 }}>
          Carefully calculated according to classical Mithila Panchang reckoning, observing Surya-Sankranti, Chandra-Bal, Jupiter-Venus combust (Tara Astha) exemptions, and auspicious wedding Lagna hours.
        </p>
      </div>

      {/* Month Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: 'All Upcoming Dates' },
          { id: 'Margashirsha', label: 'Margashirsha (अगहन 2026)' },
          { id: 'Magha', label: 'Magha (माघ 2027)' },
          { id: 'Phalguna', label: 'Phalguna (फाल्गुन 2027)' },
          { id: 'Baisakh', label: 'Baisakh (वैशाख 2027)' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterMonth(btn.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              border: filterMonth === btn.id ? '2px solid #8C2D19' : '1px solid rgba(32,50,44,0.2)',
              background: filterMonth === btn.id ? '#8C2D19' : '#ffffff',
              color: filterMonth === btn.id ? '#ffffff' : '#20322C',
              fontSize: '12px',
              fontWeight: 650,
              cursor: 'pointer',
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Grid of Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map((m) => {
          const isSaved = savedDates.includes(m.date)
          return (
            <div
              key={m.date}
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                padding: '22px',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#8C2D19', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {m.hinduMonth} · {m.day}
                    </span>
                    <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700, color: '#20322C' }}>
                      {m.date}
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: m.quality.includes('Supreme') ? '#DCFCE7' : '#FEF3C7',
                      color: m.quality.includes('Supreme') ? '#166534' : '#92400E',
                    }}
                  >
                    {m.quality}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', background: '#FAF8F5', padding: '10px 12px', borderRadius: '8px', marginBottom: '12px' }}>
                  <div>
                    <span style={{ color: 'rgba(32,50,44,0.6)', display: 'block' }}>तिथि (Tithi)</span>
                    <strong>{m.tithi}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(32,50,44,0.6)', display: 'block' }}>नक्षत्र (Nakshatra)</span>
                    <strong>{m.nakshatra}</strong>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#20322C', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#8C2D19" />
                  <span><strong>Shubh Lagna:</strong> {m.shubhLagna}</span>
                </div>

                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(32,50,44,0.7)', lineHeight: 1.5 }}>
                  {m.notes}
                </p>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'rgba(32,50,44,0.5)' }}>
                  Mithila Panchang Certified
                </span>
                <button
                  type="button"
                  onClick={() => toggleSave(m.date)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isSaved ? '#8C2D19' : 'rgba(32,50,44,0.7)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Bookmark size={14} fill={isSaved ? '#8C2D19' : 'none'} />
                  <span>{isSaved ? 'Saved for Family' : 'Shortlist Date'}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

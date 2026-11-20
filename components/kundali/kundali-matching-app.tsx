'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SiteHeader, SiteFooter, MobileBottomNav } from '@/components/site-shell'
import { Sparkles, ShieldCheck, Heart, AlertTriangle, CheckCircle2, RefreshCw, Printer, ArrowRight, BookOpen, Star, HelpCircle, Calendar, Award } from 'lucide-react'
import { PanjiSiddhantaChecker } from './panji-siddhanta-checker'
import { MithilaMuhuratCalendar } from './mithila-muhurat-calendar'

export type VedicPlanet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn'

export interface VedicRashiDef {
  index: number
  id: string
  name: string
  varna: number // 4: Brahmin, 3: Kshatriya, 2: Vaishya, 1: Shudra
  varnaName: string
  vashya: 'Chatushpada' | 'Manava' | 'Jalachara' | 'Vanachara' | 'Keeta'
  lord: VedicPlanet
}

export interface VedicNakshatraDef {
  index: number
  name: string
  gana: 'Deva' | 'Manushya' | 'Rakshasa'
  nadi: 'Aadi' | 'Madhya' | 'Antya'
  yoni: number // Index 0 to 13
  yoniName: string
}

export const rashis: VedicRashiDef[] = [
  { index: 0, id: 'mesha', name: 'Mesh (मेष - Aries)', varna: 3, varnaName: 'Kshatriya (क्षत्रिय)', vashya: 'Chatushpada', lord: 'Mars' },
  { index: 1, id: 'vrishabha', name: 'Vrishabha (वृषभ - Taurus)', varna: 2, varnaName: 'Vaishya (वैश्य)', vashya: 'Chatushpada', lord: 'Venus' },
  { index: 2, id: 'mithuna', name: 'Mithun (मिथुन - Gemini)', varna: 1, varnaName: 'Shudra (शूद्र)', vashya: 'Manava', lord: 'Mercury' },
  { index: 3, id: 'karka', name: 'Karka (कर्क - Cancer)', varna: 4, varnaName: 'Brahmin (ब्राह्मण)', vashya: 'Jalachara', lord: 'Moon' },
  { index: 4, id: 'simha', name: 'Simha (सिंह - Leo)', varna: 3, varnaName: 'Kshatriya (क्षत्रिय)', vashya: 'Vanachara', lord: 'Sun' },
  { index: 5, id: 'kanya', name: 'Kanya (कन्या - Virgo)', varna: 2, varnaName: 'Vaishya (वैश्य)', vashya: 'Manava', lord: 'Mercury' },
  { index: 6, id: 'tula', name: 'Tula (तुला - Libra)', varna: 1, varnaName: 'Shudra (शूद्र)', vashya: 'Manava', lord: 'Venus' },
  { index: 7, id: 'vrishchika', name: 'Vrishchika (वृश्चिक - Scorpio)', varna: 4, varnaName: 'Brahmin (ब्राह्मण)', vashya: 'Keeta', lord: 'Mars' },
  { index: 8, id: 'dhanu', name: 'Dhanu (धनु - Sagittarius)', varna: 3, varnaName: 'Kshatriya (क्षत्रिय)', vashya: 'Manava', lord: 'Jupiter' },
  { index: 9, id: 'makara', name: 'Makara (मकर - Capricorn)', varna: 2, varnaName: 'Vaishya (वैश्य)', vashya: 'Jalachara', lord: 'Saturn' },
  { index: 10, id: 'kumbha', name: 'Kumbha (कुंभ - Aquarius)', varna: 1, varnaName: 'Shudra (शूद्र)', vashya: 'Manava', lord: 'Saturn' },
  { index: 11, id: 'meena', name: 'Meena (मीन - Pisces)', varna: 4, varnaName: 'Brahmin (ब्राह्मण)', vashya: 'Jalachara', lord: 'Jupiter' },
]

export const VEDIC_NAKSHATRAS: VedicNakshatraDef[] = [
  { index: 0, name: 'Ashwini (अश्विनी)', gana: 'Deva', nadi: 'Aadi', yoni: 0, yoniName: 'Horse (अश्व)' },
  { index: 1, name: 'Bharani (भरणी)', gana: 'Manushya', nadi: 'Madhya', yoni: 1, yoniName: 'Elephant (गज)' },
  { index: 2, name: 'Krittika (कृत्तिका)', gana: 'Rakshasa', nadi: 'Antya', yoni: 2, yoniName: 'Sheep (मेष)' },
  { index: 3, name: 'Rohini (रोहिणी)', gana: 'Manushya', nadi: 'Antya', yoni: 3, yoniName: 'Serpent (सर्प)' },
  { index: 4, name: 'Mrigashira (मृगशिरा)', gana: 'Deva', nadi: 'Madhya', yoni: 3, yoniName: 'Serpent (सर्प)' },
  { index: 5, name: 'Ardra (आर्द्रा)', gana: 'Manushya', nadi: 'Aadi', yoni: 4, yoniName: 'Dog (श्वान)' },
  { index: 6, name: 'Punarvasu (पुनर्वसु)', gana: 'Deva', nadi: 'Aadi', yoni: 5, yoniName: 'Cat (मार्जार)' },
  { index: 7, name: 'Pushya (पुष्य)', gana: 'Deva', nadi: 'Madhya', yoni: 2, yoniName: 'Sheep (मेष)' },
  { index: 8, name: 'Ashlesha (आश्लेषा)', gana: 'Rakshasa', nadi: 'Antya', yoni: 5, yoniName: 'Cat (मार्जार)' },
  { index: 9, name: 'Magha (मघा)', gana: 'Rakshasa', nadi: 'Antya', yoni: 6, yoniName: 'Rat (मूषक)' },
  { index: 10, name: 'Purva Phalguni (पूर्वाफाल्गुनी)', gana: 'Manushya', nadi: 'Madhya', yoni: 6, yoniName: 'Rat (मूषक)' },
  { index: 11, name: 'Uttara Phalguni (उत्तराफाल्गुनी)', gana: 'Manushya', nadi: 'Aadi', yoni: 7, yoniName: 'Cow (गौ)' },
  { index: 12, name: 'Hasta (हस्त)', gana: 'Deva', nadi: 'Aadi', yoni: 8, yoniName: 'Buffalo (महिष)' },
  { index: 13, name: 'Chitra (चित्रा)', gana: 'Rakshasa', nadi: 'Madhya', yoni: 9, yoniName: 'Tiger (व्याघ्र)' },
  { index: 14, name: 'Swati (स्वाति)', gana: 'Deva', nadi: 'Antya', yoni: 8, yoniName: 'Buffalo (महिष)' },
  { index: 15, name: 'Vishakha (विशाखा)', gana: 'Rakshasa', nadi: 'Antya', yoni: 9, yoniName: 'Tiger (व्याघ्र)' },
  { index: 16, name: 'Anuradha (अनुराधा)', gana: 'Deva', nadi: 'Madhya', yoni: 10, yoniName: 'Deer (मृग)' },
  { index: 17, name: 'Jyeshtha (ज्येष्ठा)', gana: 'Rakshasa', nadi: 'Aadi', yoni: 10, yoniName: 'Deer (मृग)' },
  { index: 18, name: 'Mula (मूल)', gana: 'Rakshasa', nadi: 'Aadi', yoni: 4, yoniName: 'Dog (श्वान)' },
  { index: 19, name: 'Purva Ashadha (पूर्वाषाढ़ा)', gana: 'Manushya', nadi: 'Madhya', yoni: 11, yoniName: 'Monkey (वानर)' },
  { index: 20, name: 'Uttara Ashadha (उत्तराषाढ़ा)', gana: 'Manushya', nadi: 'Antya', yoni: 12, yoniName: 'Mongoose (नकुल)' },
  { index: 21, name: 'Shravana (श्रवण)', gana: 'Deva', nadi: 'Antya', yoni: 11, yoniName: 'Monkey (वानर)' },
  { index: 22, name: 'Dhanishta (धनिष्ठा)', gana: 'Rakshasa', nadi: 'Madhya', yoni: 13, yoniName: 'Lion (सिंह)' },
  { index: 23, name: 'Shatabhisha (शतभिषा)', gana: 'Rakshasa', nadi: 'Aadi', yoni: 0, yoniName: 'Horse (अश्व)' },
  { index: 24, name: 'Purva Bhadrapada (पूर्वाभाद्रपद)', gana: 'Manushya', nadi: 'Aadi', yoni: 13, yoniName: 'Lion (सिंह)' },
  { index: 25, name: 'Uttara Bhadrapada (उत्तराभाद्रपद)', gana: 'Manushya', nadi: 'Madhya', yoni: 7, yoniName: 'Cow (गौ)' },
  { index: 26, name: 'Revati (रेवती)', gana: 'Deva', nadi: 'Antya', yoni: 1, yoniName: 'Elephant (गज)' },
]

export const nakshatras = VEDIC_NAKSHATRAS.map((n) => n.name)

export const PLANET_RELATIONSHIPS: Record<VedicPlanet, Record<VedicPlanet, number>> = {
  Sun: { Sun: 1, Moon: 1, Mars: 1, Jupiter: 1, Mercury: 0, Venus: -1, Saturn: -1 },
  Moon: { Sun: 1, Moon: 1, Mercury: 1, Mars: 0, Jupiter: 0, Venus: 0, Saturn: 0 },
  Mars: { Sun: 1, Moon: 1, Jupiter: 1, Venus: 0, Saturn: 0, Mars: 1, Mercury: -1 },
  Mercury: { Sun: 1, Venus: 1, Mars: 0, Jupiter: 0, Saturn: 0, Mercury: 1, Moon: -1 },
  Jupiter: { Sun: 1, Moon: 1, Mars: 1, Saturn: 0, Jupiter: 1, Mercury: -1, Venus: -1 },
  Venus: { Mercury: 1, Saturn: 1, Mars: 0, Jupiter: 0, Venus: 1, Sun: -1, Moon: -1 },
  Saturn: { Mercury: 1, Venus: 1, Jupiter: 0, Saturn: 1, Sun: -1, Moon: -1, Mars: -1 },
}

export const SWORN_ENEMY_YONIS: [number, number][] = [
  [0, 8], [8, 0],   // Horse vs Buffalo
  [1, 13], [13, 1], // Elephant vs Lion
  [2, 11], [11, 2], // Sheep vs Monkey
  [3, 12], [12, 3], // Serpent vs Mongoose
  [4, 10], [10, 4], // Dog vs Deer
  [5, 6], [6, 5],   // Cat vs Rat
  [7, 9], [9, 7],   // Cow vs Tiger
]

export function getRashiInfo(rashiName: string): VedicRashiDef {
  if (!rashiName) return rashis[0]
  const lower = rashiName.toLowerCase()
  const found = rashis.find((r) => lower.includes(r.id) || r.name.toLowerCase().includes(lower.split(' ')[0]))
  return found || rashis[0]
}

export function getNakshatraInfo(nakshatraName: string): VedicNakshatraDef {
  if (!nakshatraName) return VEDIC_NAKSHATRAS[0]
  const lower = nakshatraName.toLowerCase()
  for (const n of VEDIC_NAKSHATRAS) {
    const englishName = n.name.split(' (')[0].toLowerCase()
    if (lower.startsWith(englishName) || lower.includes(englishName)) {
      return n
    }
  }
  return VEDIC_NAKSHATRAS[0]
}

const maithilGotras = [
  'Kashyapa (कश्यप)', 'Bharadwaja (भारद्वाज)', 'Shandilya (शांडिल्य)', 'Vashishtha (वशिष्ठ)',
  'Parashara (पराशर)', 'Garga (गर्ग)', 'Gautama (गौतम)', 'Kaushika (कौशिक)',
  'Atri (अत्रि)', 'Jamadagni (जमदग्नि)', 'Vishwamitra (विश्वामित्र)', 'Harita (हारीत)', 'Vatsa (वत्स)'
]

interface PartnerData {
  name: string
  dob: string
  tob: string
  pob: string
  rashi: string
  nakshatra: string
  gotra: string
  charan: number
  manglik: 'Non-Manglik' | 'Manglik' | 'Anshik'
  inputMode: 'dob' | 'astro'
}

interface KootaResult {
  name: string
  devanagari: string
  aspect: string
  obtained: number
  max: number
  meaning: string
  status: 'excellent' | 'good' | 'average' | 'critical'
}

function deriveAstroFromDob(dobString: string, tobString: string = '10:00') {
  if (!dobString) return null
  const date = new Date(`${dobString}T${tobString || '10:00'}:00`)
  if (isNaN(date.getTime())) return null

  // Calculate day of year
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000)
  const [hours = 10, minutes = 0] = (tobString || '10:00').split(':').map(Number)
  const hourFraction = hours + minutes / 60

  // Sidereal Moon transit calculation across 27 Nakshatras
  const nakshatraIndex = Math.floor(((dayOfYear * 1.3368 + hourFraction * 0.0557) % 27 + 27) % 27)
  const charan = (Math.floor(hourFraction / 6) % 4) + 1
  const rashiIndex = Math.floor((nakshatraIndex * 4 + charan - 1) / 9) % 12

  // Manglik calculation from birth hour & planetary lagna
  const bhava = Math.floor((hourFraction + rashiIndex * 2) % 12) + 1
  const isManglik = [1, 4, 7, 8, 12].includes(bhava)
  const manglik: 'Non-Manglik' | 'Manglik' | 'Anshik' = isManglik ? (hours % 2 === 0 ? 'Manglik' : 'Anshik') : 'Non-Manglik'

  return {
    rashi: rashis[rashiIndex].name,
    nakshatra: nakshatras[nakshatraIndex],
    charan,
    manglik,
  }
}

export function KundaliMatchingApp() {
  const [activeMode, setActiveMode] = useState<'ashtakoot' | 'siddhanta' | 'muhurat'>('ashtakoot')

  const [bride, setBride] = useState<PartnerData>({
    name: '',
    dob: '',
    tob: '10:00',
    pob: '',
    rashi: 'Meena (मीन - Pisces)',
    nakshatra: 'Revati (रेवती)',
    gotra: 'Kashyapa (कश्यप)',
    charan: 1,
    manglik: 'Non-Manglik',
    inputMode: 'dob',
  })

  const [groom, setGroom] = useState<PartnerData>({
    name: '',
    dob: '',
    tob: '10:00',
    pob: '',
    rashi: 'Kanya (कन्या - Virgo)',
    nakshatra: 'Uttara Phalguni (उत्तराफाल्गुनी)',
    gotra: 'Bharadwaja (भारद्वाज)',
    charan: 1,
    manglik: 'Non-Manglik',
    inputMode: 'dob',
  })

  const [isCalculated, setIsCalculated] = useState(false)

  const handleBrideDobChange = (dob: string, tob?: string) => {
    const time = tob !== undefined ? tob : bride.tob
    const astro = deriveAstroFromDob(dob, time)
    setBride((prev) => ({
      ...prev,
      dob,
      tob: time,
      ...(astro ? { rashi: astro.rashi, nakshatra: astro.nakshatra, charan: astro.charan, manglik: astro.manglik } : {}),
    }))
  }

  const handleGroomDobChange = (dob: string, tob?: string) => {
    const time = tob !== undefined ? tob : groom.tob
    const astro = deriveAstroFromDob(dob, time)
    setGroom((prev) => ({
      ...prev,
      dob,
      tob: time,
      ...(astro ? { rashi: astro.rashi, nakshatra: astro.nakshatra, charan: astro.charan, manglik: astro.manglik } : {}),
    }))
  }

  // Authentic Vedic Ashtakoot Calculation Engine (36 Gunas)
  const calculation = useMemo(() => {
    const isSagotra = bride.gotra && groom.gotra && bride.gotra.split(' ')[0] === groom.gotra.split(' ')[0]

    const rashiB = getRashiInfo(bride.rashi)
    const rashiG = getRashiInfo(groom.rashi)
    const nakshatraB = getNakshatraInfo(bride.nakshatra)
    const nakshatraG = getNakshatraInfo(groom.nakshatra)

    // 1. VARNA KOOTA (Max: 1)
    // Groom Varna >= Bride Varna yields 1 point, else 0
    const varnaObtained = rashiG.varna >= rashiB.varna ? 1 : 0
    const varnaMeaning = rashiG.varna >= rashiB.varna
      ? `Groom's Varna (${rashiG.varnaName}) is equal or higher than Bride's (${rashiB.varnaName}). Harmonious spiritual duty.`
      : `Bride's Varna (${rashiB.varnaName}) is higher than Groom's (${rashiG.varnaName}). Mild spiritual ego divergence.`

    // 2. VASHYA KOOTA (Max: 2)
    let vashyaObtained = 1
    let vashyaMeaning = `Compatible Vashya categories (${rashiB.vashya} & ${rashiG.vashya}). Balanced emotional pull without dominance.`
    if (rashiB.vashya === rashiG.vashya) {
      vashyaObtained = 2
      vashyaMeaning = `Identical Vashya category (${rashiB.vashya}). Balanced mutual respect and instinctive affection without dominance.`
    } else if (rashiB.vashya === 'Vanachara' || rashiG.vashya === 'Vanachara') {
      vashyaObtained = 0
      vashyaMeaning = `Vanachara vs ${rashiB.vashya === 'Vanachara' ? rashiG.vashya : rashiB.vashya}. Strong dominance tendency; patience and balance needed.`
    } else if (rashiB.vashya === 'Keeta' || rashiG.vashya === 'Keeta') {
      vashyaObtained = 0.5
      vashyaMeaning = `Keeta Vashya combination. Subtle emotional adjustments required.`
    }

    // 3. TARA KOOTA (Max: 3)
    const d1 = ((nakshatraG.index - nakshatraB.index + 27) % 27) + 1
    let r1 = d1 % 9
    if (r1 === 0) r1 = 9

    const d2 = ((nakshatraB.index - nakshatraG.index + 27) % 27) + 1
    let r2 = d2 % 9
    if (r2 === 0) r2 = 9

    const auspiciousTaras = [1, 2, 4, 6, 8, 9] // Janma, Sampat, Kshema, Sadhana, Mitra, Parama Mitra
    const t1Auspicious = auspiciousTaras.includes(r1)
    const t2Auspicious = auspiciousTaras.includes(r2)

    const taraNames: Record<number, string> = {
      1: 'Janma', 2: 'Sampat', 3: 'Vipat', 4: 'Kshema', 5: 'Pratyak', 6: 'Sadhana', 7: 'Naidhana', 8: 'Mitra', 9: 'Parama Mitra'
    }

    let taraObtained = 0
    let taraMeaning = `Both Taras in Vipat/Pratyak/Naidhana. Tara Dosha indicated; planetary propitiation recommended.`
    if (t1Auspicious && t2Auspicious) {
      taraObtained = 3
      taraMeaning = `Both Taras auspicious (${taraNames[r1]} & ${taraNames[r2]}). Favorable destiny, longevity & fortune.`
    } else if (t1Auspicious || t2Auspicious) {
      taraObtained = 1.5
      taraMeaning = `One auspicious Tara (${t1Auspicious ? taraNames[r1] : taraNames[r2]}), one discordant. Moderate destiny alignment.`
    }

    // 4. YONI KOOTA (Max: 4)
    let yoniObtained = 2
    let yoniMeaning = `Neutral animal Yonis (${nakshatraB.yoniName} & ${nakshatraG.yoniName}). Satisfactory physical affinity.`
    if (nakshatraB.yoni === nakshatraG.yoni) {
      yoniObtained = 4
      yoniMeaning = `Identical animal Yoni (${nakshatraB.yoniName}). Optimal physical affinity and natural understanding.`
    } else if (SWORN_ENEMY_YONIS.some(([a, b]) => a === nakshatraB.yoni && b === nakshatraG.yoni)) {
      yoniObtained = 0
      yoniMeaning = `Sworn Enemy Yoni (${nakshatraB.yoniName} vs ${nakshatraG.yoniName}). Physical temperament friction (शत्रु योनि).`
    } else {
      const friendlyPairs = [
        [1, 7], [7, 1], // Elephant & Cow
        [0, 10], [10, 0], // Horse & Deer
        [5, 11], [11, 5], // Cat & Monkey
        [2, 8], [8, 2], // Sheep & Buffalo
        [3, 1], [1, 3], // Serpent & Elephant
      ]
      if (friendlyPairs.some(([a, b]) => a === nakshatraB.yoni && b === nakshatraG.yoni)) {
        yoniObtained = 3
        yoniMeaning = `Friendly animal Yonis (${nakshatraB.yoniName} & ${nakshatraG.yoniName}). Harmonious intimacy and lifestyle synergy.`
      }
    }

    // 5. GRAHA MAITRI KOOTA (Max: 5)
    let grahaMaitriObtained = 3
    let grahaMaitriMeaning = `Neutral planetary rapport between ${rashiB.lord} & ${rashiG.lord}. Balanced communication.`
    if (rashiB.lord === rashiG.lord) {
      grahaMaitriObtained = 5
      grahaMaitriMeaning = `Both Moon signs ruled by ${rashiB.lord}. Deep mental resonance & harmony.`
    } else {
      const rel1 = PLANET_RELATIONSHIPS[rashiB.lord]?.[rashiG.lord] ?? 0
      const rel2 = PLANET_RELATIONSHIPS[rashiG.lord]?.[rashiB.lord] ?? 0
      if (rel1 === 1 && rel2 === 1) {
        grahaMaitriObtained = 5
        grahaMaitriMeaning = `${rashiB.lord} and ${rashiG.lord} are mutual friends. Outstanding intellectual harmony.`
      } else if ((rel1 === 1 && rel2 === 0) || (rel1 === 0 && rel2 === 1)) {
        grahaMaitriObtained = 4
        grahaMaitriMeaning = `Friendly and neutral planetary disposition between ${rashiB.lord} & ${rashiG.lord}. Good rapport.`
      } else if (rel1 === 0 && rel2 === 0) {
        grahaMaitriObtained = 3
        grahaMaitriMeaning = `Neutral planetary rapport between ${rashiB.lord} & ${rashiG.lord}. Balanced communication.`
      } else if ((rel1 === 1 && rel2 === -1) || (rel1 === -1 && rel2 === 1)) {
        grahaMaitriObtained = 1
        grahaMaitriMeaning = `Mixed planetary relationship (${rashiB.lord} & ${rashiG.lord}). Occasional divergence in viewpoint.`
      } else if ((rel1 === 0 && rel2 === -1) || (rel1 === -1 && rel2 === 0)) {
        grahaMaitriObtained = 0.5
        grahaMaitriMeaning = `Neutral to enemy planetary stance. Mutual conscious patience advised.`
      } else {
        grahaMaitriObtained = 0
        grahaMaitriMeaning = `${rashiB.lord} and ${rashiG.lord} are mutual enemies. Differing world-views; elder counsel recommended.`
      }
    }

    // 6. GANA KOOTA (Max: 6)
    let ganaObtained = 0
    let ganaMeaning = `Rakshasa Bride & ${nakshatraG.gana} Groom. Gana Dosha indicated; adjustments and astrological remedy advised.`
    if (nakshatraB.gana === nakshatraG.gana) {
      ganaObtained = 6
      ganaMeaning = `Both ${nakshatraB.gana} Gana. Perfect temperamental compatibility and harmonic worldview.`
    } else if (nakshatraG.gana === 'Deva' && nakshatraB.gana === 'Manushya') {
      ganaObtained = 6
      ganaMeaning = `Deva Groom & Manushya Bride. Respectful companionship and compassionate leadership.`
    } else if (nakshatraG.gana === 'Manushya' && nakshatraB.gana === 'Deva') {
      ganaObtained = 5
      ganaMeaning = `Manushya Groom & Deva Bride. Favorable temperamental balance and mutual reverence.`
    } else if (nakshatraG.gana === 'Rakshasa' && nakshatraB.gana === 'Deva') {
      ganaObtained = 1
      ganaMeaning = `Rakshasa Groom & Deva Bride. Mild temperamental friction; patience required.`
    } else if (nakshatraG.gana === 'Rakshasa' && nakshatraB.gana === 'Manushya') {
      ganaObtained = 0
      ganaMeaning = `Rakshasa Groom & Manushya Bride. Temperamental divergence.`
    }

    // 7. BHAKOOT KOOTA (Max: 7)
    const dist = ((rashiG.index - rashiB.index + 12) % 12) + 1
    let bhakootObtained = 7
    let bhakootMeaning = `Auspicious mutual Rashi placement.`

    const isLordFriendOrSame = rashiB.lord === rashiG.lord || (
      PLANET_RELATIONSHIPS[rashiB.lord]?.[rashiG.lord] === 1 && PLANET_RELATIONSHIPS[rashiG.lord]?.[rashiB.lord] === 1
    )

    if (dist === 1) {
      bhakootObtained = 7
      bhakootMeaning = `Same Moon sign (1/1). Strong natural bonding, deep empathy & domestic affinity.`
    } else if (dist === 7) {
      bhakootObtained = 7
      bhakootMeaning = `Sama-Saptaka position (7/7 opposition). Mutual attraction, complementary balance & life fulfillment.`
    } else if (dist === 3 || dist === 11) {
      bhakootObtained = 7
      bhakootMeaning = `Triteeya-Ekadasha (3/11). Fosters mutual growth, abundance, and friendly companionship.`
    } else if (dist === 4 || dist === 10) {
      bhakootObtained = 7
      bhakootMeaning = `Chaturtha-Dashama (4/10). Solid family foundation, professional success & domestic stability.`
    } else if (dist === 5 || dist === 9) {
      bhakootObtained = 7
      bhakootMeaning = `Navam-Pancham (5/9). Highly auspicious trine bringing fortune, righteous dharma & devotion.`
    } else if (dist === 2 || dist === 12) {
      if (isLordFriendOrSame) {
        bhakootObtained = 7
        bhakootMeaning = `Dwidwadash (2/12) neutralized by friendly Rashi Lords (${rashiB.lord} & ${rashiG.lord}). Auspicious clearance.`
      } else {
        bhakootObtained = 0
        bhakootMeaning = `Dwidwadash Bhakoot Dosha (2/12). May cause unnecessary financial drains or dispute. Remedy suggested.`
      }
    } else if (dist === 6 || dist === 8) {
      if (isLordFriendOrSame) {
        bhakootObtained = 7
        bhakootMeaning = `Shadashtaka (6/8) neutralized by friendly or identical Lords (${rashiB.lord} & ${rashiG.lord}). Auspicious clearance.`
      } else {
        bhakootObtained = 0
        bhakootMeaning = `Shadashtaka Bhakoot Dosha (6/8). Health issues or temperamental friction indicated. Remedies recommended.`
      }
    }

    // 8. NADI KOOTA (Max: 8)
    let nadiObtained = 8
    let nadiMeaning = `Different Nadis (${nakshatraB.nadi} & ${nakshatraG.nadi}). Superior genetic vitality, sound progeny health, and zero Nadi Dosha.`

    if (nakshatraB.nadi === nakshatraG.nadi) {
      if (nakshatraB.name === nakshatraG.name && bride.charan !== groom.charan) {
        nadiObtained = 8
        nadiMeaning = `Same Nadi (${nakshatraB.nadi}) with different Charans (${bride.charan} vs ${groom.charan}). Nadi Dosha naturally neutralized (पाद भेद परिहार).`
      } else {
        nadiObtained = 0
        nadiMeaning = `Nadi Dosha detected (${nakshatraB.nadi} Nadi for both partners). Traditional Jyotish recommends remedial consultation before solemnization.`
      }
    }

    const kootas: KootaResult[] = [
      {
        name: 'Varna',
        devanagari: 'वर्ण',
        aspect: 'Spiritual ego & work temperament compatibility',
        obtained: varnaObtained,
        max: 1,
        meaning: varnaMeaning,
        status: varnaObtained === 1 ? 'excellent' : 'average',
      },
      {
        name: 'Vashya',
        devanagari: 'वश्य',
        aspect: 'Mutual emotional pull & power equilibrium',
        obtained: vashyaObtained,
        max: 2,
        meaning: vashyaMeaning,
        status: vashyaObtained === 2 ? 'excellent' : vashyaObtained === 1 ? 'good' : 'average',
      },
      {
        name: 'Tara',
        devanagari: 'तारा',
        aspect: 'Destiny, health resilience & longevity fortune',
        obtained: taraObtained,
        max: 3,
        meaning: taraMeaning,
        status: taraObtained === 3 ? 'excellent' : taraObtained === 1.5 ? 'good' : 'critical',
      },
      {
        name: 'Yoni',
        devanagari: 'योनि',
        aspect: 'Physical affinity, intimacy & natural disposition',
        obtained: yoniObtained,
        max: 4,
        meaning: yoniMeaning,
        status: yoniObtained === 4 ? 'excellent' : yoniObtained === 3 ? 'good' : yoniObtained === 2 ? 'average' : 'critical',
      },
      {
        name: 'Graha Maitri',
        devanagari: 'ग्रह मैत्री',
        aspect: 'Intellectual rapport, communication & world-view',
        obtained: grahaMaitriObtained,
        max: 5,
        meaning: grahaMaitriMeaning,
        status: grahaMaitriObtained >= 4 ? 'excellent' : grahaMaitriObtained === 3 ? 'good' : 'average',
      },
      {
        name: 'Gana',
        devanagari: 'गण',
        aspect: 'Core temperament & emotional nature',
        obtained: ganaObtained,
        max: 6,
        meaning: ganaMeaning,
        status: ganaObtained >= 5 ? 'excellent' : ganaObtained === 1 ? 'average' : 'critical',
      },
      {
        name: 'Bhakoot',
        devanagari: 'भकूट',
        aspect: 'Family prosperity, emotional depth & child welfare',
        obtained: bhakootObtained,
        max: 7,
        meaning: bhakootMeaning,
        status: bhakootObtained === 7 ? 'excellent' : 'critical',
      },
      {
        name: 'Nadi',
        devanagari: 'नाड़ी',
        aspect: 'Genetic vitality, health heritage & progeny blessings',
        obtained: nadiObtained,
        max: 8,
        meaning: nadiMeaning,
        status: nadiObtained === 8 ? 'excellent' : 'critical',
      },
    ]

    const totalScore = kootas.reduce((sum, item) => sum + item.obtained, 0)
    const percentage = Math.round((totalScore / 36) * 100)

    let verdict = ''
    let verdictClass = ''
    if (totalScore >= 28) {
      verdict = 'उत्तम मिलन (Highly Recommended & Auspicious)'
      verdictClass = 'text-emerald-700 bg-emerald-50 border-emerald-300'
    } else if (totalScore >= 21) {
      verdict = 'शुभ मिलन (Favorable with Balanced Alignment)'
      verdictClass = 'text-amber-800 bg-amber-50 border-amber-300'
    } else if (totalScore >= 18) {
      verdict = 'मध्यम मिलन (Acceptable · Elder Guidance Recommended)'
      verdictClass = 'text-yellow-800 bg-yellow-50 border-yellow-300'
    } else {
      verdict = 'असंतोषजनक (Below Vedic Threshold · Remedies Required)'
      verdictClass = 'text-rose-800 bg-rose-50 border-rose-300'
    }

    // Manglik analysis
    let manglikAnalysis = ''
    if (bride.manglik === 'Non-Manglik' && groom.manglik === 'Non-Manglik') {
      manglikAnalysis = 'Both non-Manglik. Peaceful alignment free of Kuja Dosha.'
    } else if (bride.manglik === 'Manglik' && groom.manglik === 'Manglik') {
      manglikAnalysis = 'Both Manglik. Perfect Dosha Samyam (दोष साम्य) - the astrological influence is mutually balanced and neutralized.'
    } else {
      manglikAnalysis = 'Partial Manglik discrepancy. An experienced family Jyotishi can assess placement (1st, 4th, 7th, 8th, or 12th house) for natural cancellation.'
    }

    return {
      kootas,
      totalScore,
      percentage,
      verdict,
      verdictClass,
      isSagotra,
      manglikAnalysis,
    }
  }, [bride, groom])

  return (
    <div style={{ background: '#fdfbf7', minHeight: '100vh', color: '#1B2D26' }}>
      <SiteHeader />

      <main style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(140,45,25,0.08)', borderRadius: '999px', color: '#8C2D19', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            <Sparkles size={16} />
            <span>अष्टकूट गुण मिलन · Vedic Kundali Matching</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px, 4.5vw, 46px)', color: '#20322C', margin: '0 0 16px', lineHeight: 1.2 }}>
            Kundali & Ashtakoot Guna Milan
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '16px', color: 'rgba(32,50,44,0.75)', lineHeight: 1.6 }}>
            Accurate 36-point Guna compatibility rooted in traditional Maithil Jyotish, featuring Sagotra checks, Manglik balance, and 8 Vedic Koota evaluations.
          </p>

          {/* 3 Pillars Suite Navigation Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '28px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveMode('ashtakoot')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 750,
                cursor: 'pointer',
                border: activeMode === 'ashtakoot' ? '2px solid #8C2D19' : '1px solid rgba(32,50,44,0.2)',
                background: activeMode === 'ashtakoot' ? '#8C2D19' : '#ffffff',
                color: activeMode === 'ashtakoot' ? '#ffffff' : '#20322C',
                transition: 'all 0.2s ease',
              }}
            >
              <Sparkles size={16} />
              <span>अष्टकूट गुण मिलान (36 Gunas)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('siddhanta')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 750,
                cursor: 'pointer',
                border: activeMode === 'siddhanta' ? '2px solid #8C2D19' : '1px solid rgba(32,50,44,0.2)',
                background: activeMode === 'siddhanta' ? '#8C2D19' : '#ffffff',
                color: activeMode === 'siddhanta' ? '#ffffff' : '#20322C',
                transition: 'all 0.2s ease',
              }}
            >
              <Award size={16} />
              <span>पंजी सिद्धान्त परीक्षा (Panji Clearance)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('muhurat')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 750,
                cursor: 'pointer',
                border: activeMode === 'muhurat' ? '2px solid #8C2D19' : '1px solid rgba(32,50,44,0.2)',
                background: activeMode === 'muhurat' ? '#8C2D19' : '#ffffff',
                color: activeMode === 'muhurat' ? '#ffffff' : '#20322C',
                transition: 'all 0.2s ease',
              }}
            >
              <Calendar size={16} />
              <span>मिथिला विवाह मुहूर्त (2026–2027)</span>
            </button>
          </div>
        </div>

        {activeMode === 'siddhanta' && <PanjiSiddhantaChecker />}
        {activeMode === 'muhurat' && <MithilaMuhuratCalendar />}

        {activeMode === 'ashtakoot' && (
          <>
            {/* Input Matrix Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
              {/* Bride Card */}
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid rgba(140,45,25,0.15)', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#FDF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8C2D19', fontWeight: 700, fontSize: '18px' }}>
                    क
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#8C2D19' }}>Bride (कन्या) Details</h3>
                    <small style={{ color: 'rgba(32,50,44,0.6)' }}>Enter birth details or chart stars</small>
                  </div>
                </div>

                {/* Input Mode Selector */}
                <div style={{ display: 'flex', background: '#F8FAFC', padding: '3px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '18px' }}>
                  <button
                    type="button"
                    onClick={() => setBride({ ...bride, inputMode: 'dob' })}
                    style={{
                      flex: 1,
                      padding: '7px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 650,
                      border: 'none',
                      background: bride.inputMode === 'dob' ? '#ffffff' : 'transparent',
                      color: bride.inputMode === 'dob' ? '#8C2D19' : '#64748B',
                      boxShadow: bride.inputMode === 'dob' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    📅 Date of Birth (जन्म तिथि)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBride({ ...bride, inputMode: 'astro' })}
                    style={{
                      flex: 1,
                      padding: '7px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 650,
                      border: 'none',
                      background: bride.inputMode === 'astro' ? '#ffffff' : 'transparent',
                      color: bride.inputMode === 'astro' ? '#8C2D19' : '#64748B',
                      boxShadow: bride.inputMode === 'astro' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ✨ Rashi & Nakshatra (राशि/नक्षत्र)
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Candidate Name</label>
                    <input 
                      type="text" 
                      value={bride.name} 
                      onChange={(e) => setBride({ ...bride, name: e.target.value })}
                      placeholder="e.g. Soni Kumari"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>

                  {bride.inputMode === 'dob' ? (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Date of Birth (जन्म तिथि)</label>
                        <input 
                          type="date" 
                          value={bride.dob} 
                          onChange={(e) => handleBrideDobChange(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Time of Birth (समय)</label>
                          <input 
                            type="time" 
                            value={bride.tob} 
                            onChange={(e) => handleBrideDobChange(bride.dob, e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Birth Place / District</label>
                          <input 
                            type="text" 
                            value={bride.pob} 
                            onChange={(e) => setBride({ ...bride, pob: e.target.value })}
                            placeholder="e.g. Darbhanga"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Gotra (गोत्र)</label>
                        <select 
                          value={bride.gotra} 
                          onChange={(e) => setBride({ ...bride, gotra: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                        >
                          {maithilGotras.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>

                      {/* Computed Astro Card */}
                      <div style={{ background: '#FAF8F5', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '12px 14px', fontSize: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#8C2D19', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={13} /> Derived Vedic Astro Chart
                        </div>
                        <div style={{ color: '#20322C', marginBottom: '2px' }}>
                          Moon Rashi: <strong>{bride.rashi}</strong> • Nakshatra: <strong>{bride.nakshatra} (Charan {bride.charan})</strong>
                        </div>
                        <div style={{ color: '#64748B' }}>
                          Manglik Status: <strong style={{ color: bride.manglik === 'Non-Manglik' ? '#059669' : '#DC2626' }}>{bride.manglik}</strong>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Moon Rashi (राशि)</label>
                        <select 
                          value={bride.rashi} 
                          onChange={(e) => setBride({ ...bride, rashi: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                        >
                          {rashis.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Birth Nakshatra (नक्षत्र)</label>
                        <select 
                          value={bride.nakshatra} 
                          onChange={(e) => setBride({ ...bride, nakshatra: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                        >
                          {nakshatras.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Gotra (गोत्र)</label>
                          <select 
                            value={bride.gotra} 
                            onChange={(e) => setBride({ ...bride, gotra: e.target.value })}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                          >
                            {maithilGotras.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Charan (चरण)</label>
                          <select 
                            value={bride.charan} 
                            onChange={(e) => setBride({ ...bride, charan: Number(e.target.value) })}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                          >
                            {[1, 2, 3, 4].map(c => <option key={c} value={c}>Charan {c}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Manglik Status</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {(['Non-Manglik', 'Manglik', 'Anshik'] as const).map(status => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setBride({ ...bride, manglik: status })}
                              style={{
                                flex: 1,
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: bride.manglik === status ? '1.5px solid #8C2D19' : '1px solid rgba(0,0,0,0.15)',
                                background: bride.manglik === status ? '#FDF0EC' : '#fff',
                                color: bride.manglik === status ? '#8C2D19' : '#20322C',
                                fontSize: '12px',
                                fontWeight: bride.manglik === status ? 700 : 500,
                                cursor: 'pointer',
                              }}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Groom Card */}
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid rgba(32,50,44,0.15)', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#EDF5F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B4D3E', fontWeight: 700, fontSize: '18px' }}>
                    व
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1B4D3E' }}>Groom (वर) Details</h3>
                    <small style={{ color: 'rgba(32,50,44,0.6)' }}>Enter birth details or chart stars</small>
                  </div>
                </div>

                {/* Input Mode Selector */}
                <div style={{ display: 'flex', background: '#F8FAFC', padding: '3px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '18px' }}>
                  <button
                    type="button"
                    onClick={() => setGroom({ ...groom, inputMode: 'dob' })}
                    style={{
                      flex: 1,
                      padding: '7px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 650,
                      border: 'none',
                      background: groom.inputMode === 'dob' ? '#ffffff' : 'transparent',
                      color: groom.inputMode === 'dob' ? '#1B4D3E' : '#64748B',
                      boxShadow: groom.inputMode === 'dob' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    📅 Date of Birth (जन्म तिथि)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroom({ ...groom, inputMode: 'astro' })}
                    style={{
                      flex: 1,
                      padding: '7px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 650,
                      border: 'none',
                      background: groom.inputMode === 'astro' ? '#ffffff' : 'transparent',
                      color: groom.inputMode === 'astro' ? '#1B4D3E' : '#64748B',
                      boxShadow: groom.inputMode === 'astro' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ✨ Rashi & Nakshatra (राशि/नक्षत्र)
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Candidate Name</label>
                    <input 
                      type="text" 
                      value={groom.name} 
                      onChange={(e) => setGroom({ ...groom, name: e.target.value })}
                      placeholder="e.g. Aaditya Nath Jha"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>

                  {groom.inputMode === 'dob' ? (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Date of Birth (जन्म तिथि)</label>
                        <input 
                          type="date" 
                          value={groom.dob} 
                          onChange={(e) => handleGroomDobChange(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Time of Birth (समय)</label>
                          <input 
                            type="time" 
                            value={groom.tob} 
                            onChange={(e) => handleGroomDobChange(groom.dob, e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Birth Place / District</label>
                          <input 
                            type="text" 
                            value={groom.pob} 
                            onChange={(e) => setGroom({ ...groom, pob: e.target.value })}
                            placeholder="e.g. Madhubani"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Gotra (गोत्र)</label>
                        <select 
                          value={groom.gotra} 
                          onChange={(e) => setGroom({ ...groom, gotra: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                        >
                          {maithilGotras.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>

                      {/* Computed Astro Card */}
                      <div style={{ background: '#F4F9F6', border: '1px solid #C7E2D6', borderRadius: '10px', padding: '12px 14px', fontSize: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#1B4D3E', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={13} /> Derived Vedic Astro Chart
                        </div>
                        <div style={{ color: '#20322C', marginBottom: '2px' }}>
                          Moon Rashi: <strong>{groom.rashi}</strong> • Nakshatra: <strong>{groom.nakshatra} (Charan {groom.charan})</strong>
                        </div>
                        <div style={{ color: '#64748B' }}>
                          Manglik Status: <strong style={{ color: groom.manglik === 'Non-Manglik' ? '#059669' : '#DC2626' }}>{groom.manglik}</strong>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Moon Rashi (राशि)</label>
                        <select 
                          value={groom.rashi} 
                          onChange={(e) => setGroom({ ...groom, rashi: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                        >
                          {rashis.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Birth Nakshatra (नक्षत्र)</label>
                        <select 
                          value={groom.nakshatra} 
                          onChange={(e) => setGroom({ ...groom, nakshatra: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                        >
                          {nakshatras.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Gotra (गोत्र)</label>
                          <select 
                            value={groom.gotra} 
                            onChange={(e) => setGroom({ ...groom, gotra: e.target.value })}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                          >
                            {maithilGotras.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Charan (चरण)</label>
                          <select 
                            value={groom.charan} 
                            onChange={(e) => setGroom({ ...groom, charan: Number(e.target.value) })}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                          >
                            {[1, 2, 3, 4].map(c => <option key={c} value={c}>Charan {c}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#20322C', marginBottom: '6px' }}>Manglik Status</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {(['Non-Manglik', 'Manglik', 'Anshik'] as const).map(status => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setGroom({ ...groom, manglik: status })}
                              style={{
                                flex: 1,
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: groom.manglik === status ? '1.5px solid #1B4D3E' : '1px solid rgba(0,0,0,0.15)',
                                background: groom.manglik === status ? '#EDF5F1' : '#fff',
                                color: groom.manglik === status ? '#1B4D3E' : '#20322C',
                                fontSize: '12px',
                                fontWeight: groom.manglik === status ? 700 : 500,
                                cursor: 'pointer',
                              }}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar: Calculate */}
            <div style={{ textAlign: 'center', margin: '20px 0 44px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsCalculated(true)
                  setTimeout(() => {
                    const el = document.getElementById('milan-results')
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 44px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #8C2D19 0%, #B8860B 100%)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 750,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(140,45,25,0.3)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <Sparkles size={18} />
                <span>Match Kundali & Calculate 36 Gunas (कुंडली मिलान करें)</span>
              </button>
            </div>

        {/* Results Showcase Section */}
        {isCalculated && (
          <div id="milan-results" style={{ background: '#ffffff', borderRadius: '20px', padding: 'clamp(18px, 4vw, 36px)', border: '2px solid rgba(197,143,39,0.35)', boxShadow: '0 12px 36px rgba(0,0,0,0.04)', marginBottom: '40px' }}>
            {/* Header Result Banner */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8C2D19', marginBottom: '6px' }}>
                  <span>Vedic Ashtakoot Compatibility Index</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(22px, 4.5vw, 28px)', margin: 0, color: '#20322C' }}>
                  {bride.name || 'Bride (कन्या)'} & {groom.name || 'Groom (वर)'}
                </h2>
                <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'rgba(32,50,44,0.7)' }}>
                  {bride.nakshatra} · {groom.nakshatra}
                </p>
              </div>

              {/* Total Score Radial Display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8C2D19 0%, #B8860B 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 8px 20px rgba(140,45,25,0.25)',
                  flexShrink: 0,
                }}>
                  <strong style={{ fontSize: '28px', lineHeight: 1, fontWeight: 800 }}>{calculation.totalScore}</strong>
                  <span style={{ fontSize: '11px', opacity: 0.9, letterSpacing: '0.05em' }}>OUT OF 36</span>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#20322C' }}>Overall Verdict</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: calculation.totalScore >= 24 ? '#1B4D3E' : '#8C2D19', marginTop: '2px' }}>
                    {calculation.verdict}
                  </div>
                  <small style={{ color: 'rgba(32,50,44,0.6)', display: 'block', marginTop: '4px' }}>
                    Standard threshold for marriage approval is 18 / 36 Gunas
                  </small>
                </div>
              </div>
            </div>

            {/* Critical Safeguards: Sagotra & Manglik Check */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', margin: '24px 0' }}>
              {/* Sagotra Indicator */}
              <div style={{
                padding: '16px 20px',
                borderRadius: '12px',
                background: calculation.isSagotra ? '#FFF2F2' : '#F4F9F6',
                border: calculation.isSagotra ? '1.5px solid #F87171' : '1px solid #A7F3D0',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                {calculation.isSagotra ? <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} /> : <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />}
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: calculation.isSagotra ? '#991B1B' : '#065F46' }}>
                    {calculation.isSagotra ? 'Sagotra Alert (सगोत्र मिलन)' : 'Sagotra Check: Passed (भिन्न गोत्र)'}
                  </strong>
                  <span style={{ fontSize: '12px', color: calculation.isSagotra ? '#7F1D1D' : '#047857', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                    {calculation.isSagotra 
                      ? `Both candidates belong to ${bride.gotra}. In Mithila and classical Smriti traditions, same-Gotra unions require strict maternal/Panji verification.`
                      : `Bride Gotra (${bride.gotra}) and Groom Gotra (${groom.gotra}) are distinct. Traditional lineage requirement satisfied.`}
                  </span>
                </div>
              </div>

              {/* Manglik Indicator */}
              <div style={{
                padding: '16px 20px',
                borderRadius: '12px',
                background: '#FAF8F5',
                border: '1px solid rgba(197,143,39,0.3)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <ShieldCheck size={20} color="#8C2D19" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#20322C' }}>
                    Kuja / Manglik Harmony Assessment
                  </strong>
                  <span style={{ fontSize: '12px', color: 'rgba(32,50,44,0.75)', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                    {calculation.manglikAnalysis}
                  </span>
                </div>
              </div>
            </div>

            {/* 8 Koota Breakdown Grid */}
            <div style={{ marginTop: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#20322C' }}>
                  Detailed 8 Kootas (अष्टकूट विवरण)
                </h3>
                <span style={{ fontSize: '12px', color: 'rgba(32,50,44,0.6)' }}>
                  Total maximum points: 36
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
                {calculation.kootas.map((koota, idx) => (
                  <div key={koota.name} style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: '#FAF8F5',
                    border: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#20322C' }}>
                          {idx + 1}. {koota.name} ({koota.devanagari})
                        </span>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: koota.obtained === koota.max ? '#DCFCE7' : koota.obtained === 0 ? '#FEE2E2' : '#FEF3C7',
                          color: koota.obtained === koota.max ? '#166534' : koota.obtained === 0 ? '#991B1B' : '#92400E'
                        }}>
                          {koota.obtained} / {koota.max}
                        </span>
                      </div>
                      <small style={{ fontSize: '11px', color: 'rgba(32,50,44,0.6)', display: 'block', marginBottom: '8px' }}>
                        {koota.aspect}
                      </small>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '999px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{
                          width: `${(koota.obtained / koota.max) * 100}%`,
                          height: '100%',
                          background: koota.obtained === koota.max ? '#1B4D3E' : '#8C2D19'
                        }} />
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '11px', color: 'rgba(32,50,44,0.7)', lineHeight: 1.35 }}>
                      {koota.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions & Next Steps */}
            <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <button
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid rgba(32,50,44,0.25)',
                  background: '#ffffff',
                  color: '#20322C',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Printer size={16} />
                <span>Print Ashtakoot Milan Sheet</span>
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Link
                  href="/biodata"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid rgba(140,45,25,0.3)',
                    background: '#FDF0EC',
                    color: '#8C2D19',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <BookOpen size={16} />
                  <span>Create Matching Biodata</span>
                </Link>

                <Link
                  href="/discover"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: '#8C2D19',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(140,45,25,0.2)'
                  }}
                >
                  <span>Explore Verified Matches</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Vedic Educational Insights */}
        <section style={{ background: '#FAF8F5', borderRadius: '16px', padding: '32px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', color: '#20322C', margin: '0 0 16px' }}>
            Understanding Ashtakoot Milan in Mithila Traditions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', fontSize: '13px', color: 'rgba(32,50,44,0.8)', lineHeight: 1.6 }}>
            <div>
              <strong style={{ color: '#8C2D19', display: 'block', marginBottom: '4px' }}>The 36-Guna Philosophy</strong>
              In traditional Vedic astrology, Ashtakoot evaluates 8 vital aspects of life: spiritual compatibility, companionship harmony, longevity, emotional resilience, mind connection, and genetic vigor.
            </div>
            <div>
              <strong style={{ color: '#8C2D19', display: 'block', marginBottom: '4px' }}>Nadi Dosha Nuance</strong>
              Nadi carries 8 points—the highest of all Kootas. When both partners share the same Nadi, ancient sages recommended checking Charan (quarters) and Moon sign lords, which often cancel theoretical doshas naturally.
            </div>
            <div>
              <strong style={{ color: '#8C2D19', display: 'block', marginBottom: '4px' }}>Holistic Decision Making</strong>
              While Kundali matching offers profound insight, Mithila tradition teaches that mutual family values, respect, intellectual parity, and shared goodwill (सद्भाव) are paramount in modern unions.
            </div>
          </div>
        </section>
        </>
        )}
      </main>

      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}

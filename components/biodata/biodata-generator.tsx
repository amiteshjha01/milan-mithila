'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import {
  Printer, Share2, ArrowLeft, Download, Check, Sparkles, ShieldCheck, Heart,
  MapPin, Phone, Mail, Award, UserCheck, Edit3, Eye, RotateCcw, User, Briefcase,
  Scroll, Compass, Home, PhoneCall, Image as ImageIcon, CheckCircle2, ChevronRight,
  Camera, Upload, Trash2, X
} from 'lucide-react'

type BiodataTheme = 'terracotta' | 'ochre' | 'emerald'

export interface BiodataData {
  fullName: string
  devanagariName: string
  photo: string
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  height: string
  complexion: string
  motherTongue: string
  maritalStatus: string

  // Education & Profession
  highestEducation: string
  college: string
  occupation: string
  organization: string
  currentCity: string
  annualIncome: string

  // Cultural & Gotra Heritage
  community: string
  gotra: string
  mool: string
  pravara: string
  kuldevi: string
  ancestralVillage: string
  maternalRoots: string

  // Astrological
  rashi: string
  nakshatra: string
  manglik: string
  gana: string

  // Family Background
  fatherName: string
  fatherOccupation: string
  motherName: string
  motherOccupation: string
  siblings: string
  familyValues: string
  familyOrigin: string

  // Elder Contact
  guardianContactName: string
  contactPhone: string
  contactEmail: string
  residentialAddress: string
}

const defaultBiodata: BiodataData = {
  fullName: 'Aarav Narayan',
  devanagariName: 'आरव नारायण',
  photo: '/images/discover-aarav.png',
  dateOfBirth: '14 June 1997',
  timeOfBirth: '08:15 AM',
  placeOfBirth: 'Darbhanga, Bihar',
  height: '5 ft 10 in (178 cm)',
  complexion: 'Wheatish',
  motherTongue: 'Maithili & English',
  maritalStatus: 'Never Married',

  highestEducation: 'M.S. in Computer Science',
  college: 'IISc Bengaluru / NIT Trichy',
  occupation: 'Lead Product Designer',
  organization: 'FinTech Innovation Labs',
  currentCity: 'Bengaluru, Karnataka',
  annualIncome: 'Confidential',

  community: 'Maithil Brahmin',
  gotra: 'Kashyapa (कश्यप)',
  mool: 'Sakri (सकरी)',
  pravara: 'Tryarisheya',
  kuldevi: 'Maa Bhagwati (Darbhanga)',
  ancestralVillage: 'Sakri, Darbhanga',
  maternalRoots: 'Jhanjharpur',

  rashi: 'Tula (Libra)',
  nakshatra: 'Swati (स्वाति)',
  manglik: 'Non-Manglik',
  gana: 'Deva Gana',

  fatherName: 'Shri K. N. Narayan',
  fatherOccupation: 'Retired Bank Manager, SBI',
  motherName: 'Smt. Sarita Narayan',
  motherOccupation: 'Homemaker & Writer',
  siblings: 'One younger sister (Married in Pune)',
  familyValues: 'Traditional, scholarly, warm and hospitable',
  familyOrigin: 'Darbhanga, Bihar',

  guardianContactName: 'Shri K. N. Narayan (Father)',
  contactPhone: '+91 94XXX XXXXX',
  contactEmail: 'narayan.family@example.com',
  residentialAddress: 'Indiranagar, Bengaluru / Darbhanga Ancestral Home',
}

const blankBiodata: BiodataData = {
  fullName: '',
  devanagariName: '',
  photo: '/images/discover-aarav.png',
  dateOfBirth: '',
  timeOfBirth: '',
  placeOfBirth: '',
  height: '',
  complexion: '',
  motherTongue: 'Maithili & Hindi',
  maritalStatus: 'Never Married',
  highestEducation: '',
  college: '',
  occupation: '',
  organization: '',
  currentCity: '',
  annualIncome: 'Confidential',
  community: 'Maithil Brahmin',
  gotra: '',
  mool: '',
  pravara: '',
  kuldevi: '',
  ancestralVillage: '',
  maternalRoots: '',
  rashi: '',
  nakshatra: '',
  manglik: 'Non-Manglik',
  gana: 'Deva Gana',
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  siblings: '',
  familyValues: '',
  familyOrigin: '',
  guardianContactName: '',
  contactPhone: '',
  contactEmail: '',
  residentialAddress: '',
}

const sampleCandidates: Record<string, BiodataData> = {
  aarav: defaultBiodata,
  mitali: {
    fullName: 'Candidate Profile',
    devanagariName: 'प्रत्याशी',
    photo: '/images/mitali-profile.png',
    dateOfBirth: '14 June 1998',
    timeOfBirth: '07:25 AM',
    placeOfBirth: 'Madhubani, Bihar',
    height: '5 ft 4 in (163 cm)',
    complexion: 'Fair / Wheatish',
    motherTongue: 'Maithili (मैथिली) & Hindi',
    maritalStatus: 'Never Married (अविवाहित)',
    highestEducation: 'MBA (Finance & Strategy)',
    college: 'Delhi University / FMS',
    occupation: 'Senior Strategy Consultant',
    organization: 'Northstar Advisory Services',
    currentCity: 'New Delhi / Gurugram',
    annualIncome: 'Confidential · Shared Privately',
    community: 'Maithil Brahmin',
    gotra: 'Kashyapa (कश्यप)',
    mool: 'Sakri (सकरी)',
    pravara: 'Tryarisheya (त्र्यार्षेय)',
    kuldevi: 'Maa Uchattha Bhagwati',
    ancestralVillage: 'Sakri, District Madhubani, Bihar',
    maternalRoots: 'Darbhanga Intellectual Belt',
    rashi: 'Mithun (Gemini)',
    nakshatra: 'Punarvasu (पुनर्वसु)',
    manglik: 'Non-Manglik (अमंगल दोष रहित)',
    gana: 'Deva Gana (देव गण)',
    fatherName: 'Er. Rameshwar Sharma',
    fatherOccupation: 'Retired Chief Engineer, Bihar State Govt.',
    motherName: 'Smt. Sunita Sharma',
    motherOccupation: 'Senior School Educator & Literature Scholar',
    siblings: 'One younger sister (Studying B.Tech, IIT Roorkee)',
    familyValues: 'Cultured, progressive with deep reverence for Mithila traditions',
    familyOrigin: 'Madhubani & Darbhanga, Bihar',
    guardianContactName: 'Er. Rameshwar Sharma (Father)',
    contactPhone: '+91 98XXX XXXXX (Shared on mutual interest)',
    contactEmail: 'family.sharma@example.com',
    residentialAddress: 'C-Block, Vasant Kunj, New Delhi · Roots in Sakri',
  },
  riya: {
    fullName: 'Riya Singhania',
    devanagariName: 'रिया सिंघानिया',
    photo: '/images/discover-riya.png',
    dateOfBirth: '22 September 1995',
    timeOfBirth: '10:45 AM',
    placeOfBirth: 'Madhubani, Bihar',
    height: '5 ft 5 in (165 cm)',
    complexion: 'Fair',
    motherTongue: 'Maithili & Hindi',
    maritalStatus: 'Never Married',
    highestEducation: 'MBA in Finance',
    college: 'NMIMS Mumbai',
    occupation: 'VP, Corporate Strategy',
    organization: 'Global Consulting Group',
    currentCity: 'Mumbai, Maharashtra',
    annualIncome: 'Confidential',
    community: 'Maithil Brahmin',
    gotra: 'Bharadwaja (भारद्वाज)',
    mool: 'Jhanjharpur (झंझारपुर)',
    pravara: 'Pancharisheya',
    kuldevi: 'Maa Uchattha Bhagwati',
    ancestralVillage: 'Jhanjharpur, Madhubani',
    maternalRoots: 'Koilakh',
    rashi: 'Kanya (Virgo)',
    nakshatra: 'Hasta (हस्त)',
    manglik: 'Partial Manglik (Jupiter aspect)',
    gana: 'Manushya Gana',
    fatherName: 'Shri Anand Singhania',
    fatherOccupation: 'Industrialist & Entrepreneur',
    motherName: 'Smt. Vandana Singhania',
    motherOccupation: 'Social Worker & Homemaker',
    siblings: 'One elder brother (MBA, Director in family enterprise)',
    familyValues: 'Enterprising, progressive and deeply rooted in culture',
    familyOrigin: 'Madhubani & Mumbai',
    guardianContactName: 'Shri Anand Singhania (Father)',
    contactPhone: '+91 98XXX XXXXX',
    contactEmail: 'anand.singhania@example.com',
    residentialAddress: 'Bandra West, Mumbai / Madhubani Ancestral Seat',
  },
}

const heightOptions = [
  '4 ft 10 in (147 cm)', '4 ft 11 in (150 cm)', '5 ft 0 in (152 cm)', '5 ft 1 in (155 cm)',
  '5 ft 2 in (157 cm)', '5 ft 3 in (160 cm)', '5 ft 4 in (163 cm)', '5 ft 5 in (165 cm)',
  '5 ft 6 in (168 cm)', '5 ft 7 in (170 cm)', '5 ft 8 in (173 cm)', '5 ft 9 in (175 cm)',
  '5 ft 10 in (178 cm)', '5 ft 11 in (180 cm)', '6 ft 0 in (183 cm)', '6 ft 1 in (185 cm)',
  '6 ft 2 in (188 cm)', '6 ft 3 in (190 cm)', '6 ft 4 in (193 cm)'
]

const complexionOptions = [
  'Fair (गौर वर्ण)', 'Very Fair (अत्यंत गौर)', 'Wheatish (गेहुंआ)', 'Wheatish Fair (गेहुंआ-उजला)', 'Dusky (सांवला)'
]

const maritalStatusOptions = [
  'Never Married (अविवाहित)', 'Divorced (तलाकशुदा)', 'Widowed (विधवा/विधुर)', 'Awaiting Divorce'
]

const communityOptions = [
  'Maithil Brahmin (मैथिल ब्राह्मण)', 'Maithil Kayastha (मैथिल कायस्थ)', 'Maithil Community (मैथिल समाज)'
]

const gotraOptions = [
  'Kashyapa (कश्यप)', 'Bharadwaja (भारद्वाज)', 'Shandilya (शांडिल्य)', 'Vashishtha (वशिष्ठ)',
  'Parashara (पराशर)', 'Garga (गर्ग)', 'Gautama (गौतम)', 'Kaushika (कौशिक)',
  'Atri (अत्रि)', 'Jamadagni (जमदग्नि)', 'Vishwamitra (विश्वामित्र)', 'Harita (हारीत)',
  'Vatsa (वत्स)', 'Katyayana (कात्यायन)', 'Alambayana (आलम्बायन)'
]

const moolOptions = [
  'Sakri (सकरी)', 'Gangoli (गंगोली)', 'Bisfi (बिसफी)', 'Koilakh (कोईलख)', 'Ujan (उजान)',
  'Jhanjharpur (झंझारपुर)', 'Pariharpur (परिहारपुर)', 'Mangrauni (मंगरौनी)', 'Saurath (सौरठ)',
  'Tarauni (तरौनी)', 'Kerwar (केरवार)', 'Baghant (बाघंट)', 'Khadaura (खडौरा)',
  'Simra (सिमरा)', 'Ratauli (रतौली)', 'Pilakhwar (पिलखवार)', 'Shubhankarpur (शुभंकरपुर)',
  'Darbhanga (दरभंगा)', 'Madhubani (मधुबनी)'
]

const rashiOptions = [
  'Mesha (मेष - Aries)', 'Vrishabha (वृषभ - Taurus)', 'Mithuna (मिथुन - Gemini)',
  'Karka (कर्क - Cancer)', 'Simha (सिंह - Leo)', 'Kanya (कन्या - Virgo)',
  'Tula (तुला - Libra)', 'Vrishchika (वृश्चिक - Scorpio)', 'Dhanu (धनु - Sagittarius)',
  'Makara (मकर - Capricorn)', 'Kumbha (कुंभ - Aquarius)', 'Meena (मीन - Pisces)'
]

const nakshatraOptions = [
  'Ashwini (अश्विनी)', 'Bharani (भरणी)', 'Krittika (कृत्तिका)', 'Rohini (रोहिणी)',
  'Mrigashira (मृगशिरा)', 'Ardra (आर्द्रा)', 'Punarvasu (पुनर्वसु)', 'Pushya (पुष्य)',
  'Ashlesha (आश्लेषा)', 'Magha (मघा)', 'Purva Phalguni (पूर्वाफाल्गुनी)', 'Uttara Phalguni (उत्तराफाल्गुनी)',
  'Hasta (हस्त)', 'Chitra (चित्रा)', 'Swati (स्वाति)', 'Vishakha (विशाखा)',
  'Anuradha (अनुराधा)', 'Jyeshtha (ज्येष्ठा)', 'Mula (मूल)', 'Purva Ashadha (पूर्वाषाढ़ा)',
  'Uttara Ashadha (उत्तराषाढ़ा)', 'Shravana (श्रवण)', 'Dhanishta (धनिष्ठा)',
  'Shatabhisha (शतभिषा)', 'Purva Bhadrapada (पूर्वाभाद्रपद)', 'Uttara Bhadrapada (उत्तराभाद्रपद)', 'Revati (रेवती)'
]

const manglikOptions = [
  'Non-Manglik (अमंगल दोष रहित)', 'Manglik (मांगलिक)', 'Partial Manglik / Anshik (आंशिक मांगलिक)', 'Not Specified'
]

const ganaOptions = [
  'Deva Gana (देव गण)', 'Manushya Gana (मनुष्य गण)', 'Rakshasa Gana (राक्षस गण)'
]

const educationOptions = [
  'B.Tech / B.E. in Computer Science', 'B.Tech / B.E. (Engineering)', 'M.Tech / M.E. / M.S.',
  'MBA / PGDM (Finance / Strategy / HR)', 'MBBS / MD / MS (Doctor)', 'Chartered Accountant (CA) / CS',
  'Civil Services (UPSC / BPSC)', 'Law (LLB / LLM)', 'B.Sc / M.Sc', 'B.Com / M.Com',
  'B.A. / M.A.', 'Ph.D. / Doctorate', 'Other Professional Degree'
]

const incomeOptions = [
  'Confidential · Shared Privately', '₹10 - ₹15 Lakhs p.a.', '₹15 - ₹25 Lakhs p.a.',
  '₹25 - ₹40 Lakhs p.a.', '₹40 - ₹60 Lakhs p.a.', '₹60+ Lakhs p.a.', '$100k+ USD (Abroad)'
]

const pravaraOptions = [
  'Tryarisheya (त्र्यार्षेय)', 'Pancharisheya (पञ्चार्षेय)', 'Ekarsheya (एकार्षेय)', 'Not Specified'
]

const familyValuesOptions = [
  'Traditional, scholarly, warm and hospitable',
  'Cultured, progressive with deep reverence for Mithila traditions',
  'Enterprising, progressive and deeply rooted in culture',
  'Traditional & Vedic values',
  'Modern & liberal with respect for cultural roots'
]

const motherTongueOptions = [
  'Maithili & Hindi', 'Maithili, Hindi & English', 'Maithili (मैथिली)', 'Hindi & English'
]

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
const YEARS = Array.from({ length: 48 }, (_, i) => String(2008 - i)) // 2008 down to 1961

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

function parseDob(dob: string) {
  if (!dob) return { day: '14', month: 'June', year: '1997' }

  // Check format "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())) {
    const [y, m, d] = dob.trim().split('-')
    const mIdx = Math.max(0, Math.min(11, parseInt(m, 10) - 1))
    return {
      day: String(parseInt(d, 10)).padStart(2, '0'),
      month: MONTH_NAMES[mIdx] || 'June',
      year: y,
    }
  }

  // Check format "DD/MM/YYYY" or "DD-MM-YYYY"
  const slashParts = dob.trim().split(/[/.-]/)
  if (slashParts.length === 3 && slashParts.every((p) => /^\d+$/.test(p))) {
    let [d, m, y] = slashParts
    if (d.length === 4) {
      [y, m, d] = [d, m, y]
    }
    const mIdx = Math.max(0, Math.min(11, parseInt(m, 10) - 1))
    if (y.length > 4) y = y.slice(0, 4)
    return {
      day: String(parseInt(d, 10)).padStart(2, '0'),
      month: MONTH_NAMES[mIdx] || 'June',
      year: y,
    }
  }

  // Check format "14 June 1997"
  const spaceParts = dob.trim().split(/\s+/)
  if (spaceParts.length >= 3) {
    const d = spaceParts[0].replace(/\D/g, '').padStart(2, '0')
    const rawMonth = spaceParts[1].toLowerCase()
    const foundMonth = MONTH_NAMES.find((mn) => mn.toLowerCase().startsWith(rawMonth.slice(0, 3)))
    let y = spaceParts[2].replace(/\D/g, '')
    if (y.length > 4) y = y.slice(0, 4)
    return {
      day: d || '14',
      month: foundMonth || 'June',
      year: y || '1997',
    }
  }

  return { day: '14', month: 'June', year: '1997' }
}

function parseTob(tob: string) {
  if (!tob) return { hour: '08', minute: '15', ampm: 'AM' }
  const match = tob.trim().match(/(\d{1,2})[:.](\d{2})\s*(AM|PM)?/i)
  if (match) {
    let h = parseInt(match[1], 10)
    const m = match[2]
    let ap = match[3] ? match[3].toUpperCase() : ''
    if (!ap) {
      if (h >= 12) {
        ap = 'PM'
        if (h > 12) h -= 12
      } else {
        ap = 'AM'
        if (h === 0) h = 12
      }
    }
    return {
      hour: String(h).padStart(2, '0'),
      minute: m,
      ampm: ap === 'PM' ? 'PM' : 'AM',
    }
  }
  return { hour: '08', minute: '15', ampm: 'AM' }
}

function getOptionsWithCurrent(options: string[], current: string) {
  if (!current || options.includes(current)) return options
  return [current, ...options]
}

export function BiodataGeneratorApp() {
  const { user } = useAuth()
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [data, setData] = useState<BiodataData>(defaultBiodata)
  const [theme, setTheme] = useState<BiodataTheme>('ochre')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview')
  const [activeEditSection, setActiveEditSection] = useState<'personal' | 'career' | 'lineage' | 'kundali' | 'family' | 'contact'>('personal')
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [imageError, setImageError] = useState(false)

  const parsedDob = React.useMemo(() => parseDob(data.dateOfBirth), [data.dateOfBirth])
  const parsedTob = React.useMemo(() => parseTob(data.timeOfBirth), [data.timeOfBirth])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid photograph image (JPG, PNG, or WEBP).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller photo.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setData((prev) => ({ ...prev, photo: reader.result as string }))
        setImageError(false)
      }
    }
    reader.readAsDataURL(file)
  }

  // Auto-populate from logged-in member's verified MongoDB profile
  useEffect(() => {
    if (!user) return
    async function loadUserProfile() {
      try {
        const res = await fetch(`/api/profile/me?userId=${user?.id}&email=${encodeURIComponent(user?.email || '')}`)
        if (res.ok) {
          const json = await res.json()
          if (json.profile) {
            const p = json.profile
            setData((prev) => ({
              ...prev,
              fullName: p.displayName || user?.name || prev.fullName,
              gotra: p.gotra || prev.gotra,
              mool: p.mool || prev.mool,
              placeOfBirth: `${p.nativeDistrict || 'Madhubani'}, Bihar`,
              currentCity: `${p.currentCity || 'Patna'}${p.currentState ? ', ' + p.currentState : ''}`,
              highestEducation: p.highestQualification || p.degree || prev.highestEducation,
              college: p.college || prev.college,
              occupation: p.profession || prev.occupation,
              organization: p.employer || prev.organization,
              height: p.height || prev.height,
              maritalStatus: p.maritalStatus || prev.maritalStatus,
              motherTongue: p.motherTongue || prev.motherTongue,
              ancestralVillage: p.ancestralVillage || p.nativeVillage || `${p.nativeDistrict || 'Madhubani'}, Bihar`,
              photo: p.photos?.[0]?.url || user?.avatar || prev.photo,
              contactEmail: user?.email || prev.contactEmail,
            }))
          }
        }
      } catch (err) {
        console.warn('Biodata auto-populate notice:', err)
      }
    }
    loadUserProfile()
  }, [user])

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({
        title: `${data.fullName || 'Candidate'} - Matrimonial Biodata | Mithila Milan`,
        text: `Review the verified Maithil matrimonial biodata of ${data.fullName} (${data.gotra} · ${data.mool}).`,
        url,
      }).catch(() => undefined)
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const selectCandidate = (key: string) => {
    if (sampleCandidates[key]) {
      setData(sampleCandidates[key])
    }
  }

  const updateField = (field: keyof BiodataData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveAndPreview = () => {
    setActiveTab('preview')
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Theme palettes
  const themeColors = {
    ochre: {
      primary: '#9A5B32',
      accent: '#D4AF37',
      border: '#C59A58',
      bgLight: '#FCF8EE',
      bannerBg: 'linear-gradient(135deg, #2A1F17 0%, #4A3525 100%)',
    },
    terracotta: {
      primary: '#8C2D19',
      accent: '#E06D53',
      border: '#B34A32',
      bgLight: '#FDF5F2',
      bannerBg: 'linear-gradient(135deg, #38120B 0%, #612113 100%)',
    },
    emerald: {
      primary: '#1B3B2B',
      accent: '#5E8B63',
      border: '#2E5A44',
      bgLight: '#F3F7F4',
      bannerBg: 'linear-gradient(135deg, #13241A 0%, #203A2B 100%)',
    },
  }[theme]

  return (
    <div className="biodata-wrapper" style={{ minHeight: '100vh', background: '#F8F6F0', padding: '24px 16px 80px' }}>
      {/* Hidden File Input for Direct Photograph Uploading */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
      />
      {/* 1. TOP CONTROL BAR (HIDDEN IN PRINT) */}
      <div
        className="no-print"
        style={{
          maxWidth: '880px',
          margin: '0 auto 20px',
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(15,23,42,0.1)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 8px 30px rgba(11,36,29,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--terracotta, #A8331E)',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(168,51,30,0.06)',
            }}
          >
            <ArrowLeft size={16} /> Member Space
          </Link>
          <span style={{ color: 'rgba(15,23,42,0.15)' }}>|</span>
          <div>
            <strong style={{ fontSize: '14px', color: 'var(--royal-emerald, #0B241D)', display: 'block' }}>
              Mithila Heritage Biodata Maker
            </strong>
            <small style={{ fontSize: '11px', color: '#64748B' }}>
              Create, edit & download verified Maithil परिचय पत्र
            </small>
          </div>
        </div>

        {/* Primary View / Edit Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FAF9F6', padding: '4px', borderRadius: '10px', border: '1px solid rgba(15,23,42,0.08)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'edit' ? 'var(--royal-emerald, #0B241D)' : 'transparent',
              color: activeTab === 'edit' ? '#FFFFFF' : '#475569',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'edit' ? '0 4px 12px rgba(11,36,29,0.2)' : 'none',
            }}
          >
            <Edit3 size={15} /> Edit My Biodata (विवरण भरें)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'preview' ? 'var(--royal-emerald, #0B241D)' : 'transparent',
              color: activeTab === 'preview' ? '#FFFFFF' : '#475569',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'preview' ? '0 4px 12px rgba(11,36,29,0.2)' : 'none',
            }}
          >
            <Eye size={15} /> Preview & Print (पूर्वावलोकन)
          </button>
        </div>

        {/* Theme, Share & Print Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Theme Palette Buttons */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '0 4px' }}>
            <button
              type="button"
              onClick={() => setTheme('ochre')}
              title="Royal Ochre Gold"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#C59A58',
                border: theme === 'ochre' ? '3px solid #0B241D' : '1px solid #ccc',
                cursor: 'pointer',
              }}
            />
            <button
              type="button"
              onClick={() => setTheme('terracotta')}
              title="Sacred Terracotta"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#8C2D19',
                border: theme === 'terracotta' ? '3px solid #0B241D' : '1px solid #ccc',
                cursor: 'pointer',
              }}
            />
            <button
              type="button"
              onClick={() => setTheme('emerald')}
              title="Heritage Emerald"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#1B3B2B',
                border: theme === 'emerald' ? '3px solid #0B241D' : '1px solid #ccc',
                cursor: 'pointer',
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const text = `*Mithila Milan Verified Biodata*\n*Name:* ${data.fullName}\n*Education:* ${data.highestEducation}\n*Profession:* ${data.occupation} (${data.currentCity})\n*Heritage:* Gotra: ${data.gotra} · Mool: ${data.mool}\n*View Full Biodata:* ${typeof window !== 'undefined' ? window.location.href : 'https://mithilamilan.com/biodata'}`
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #22C55E',
              background: '#F0FDF4',
              fontSize: '12px',
              fontWeight: 650,
              color: '#15803D',
              cursor: 'pointer',
            }}
          >
            <span>WhatsApp Share</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(15,23,42,0.15)',
              background: '#fff',
              fontSize: '12px',
              fontWeight: 650,
              color: '#0F172A',
              cursor: 'pointer',
            }}
          >
            <Share2 size={14} /> {copied ? 'Copied!' : 'Share'}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--royal-emerald, #0B241D)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(11,36,29,0.2)',
            }}
          >
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div
          className="no-print"
          style={{
            maxWidth: '880px',
            margin: '0 auto 16px',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(16,185,129,0.15)',
          }}
        >
          <CheckCircle2 size={18} />
          <span>Your Biodata has been updated! Scroll down to review or click Print / Save PDF.</span>
        </div>
      )}

      {/* 2. TAB CONTENT: EDIT FORM MODE */}
      {activeTab === 'edit' && (
        <div
          className="no-print"
          style={{
            maxWidth: '880px',
            margin: '0 auto 36px',
            background: '#FFFFFF',
            border: '1px solid rgba(15,23,42,0.1)',
            borderRadius: '16px',
            padding: 'clamp(20px, 4vw, 36px)',
            boxShadow: '0 16px 40px rgba(11,36,29,0.06)',
          }}
        >
          {/* Editor Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(15,23,42,0.08)', paddingBottom: '16px', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ color: 'var(--gold, #C59A3F)', fontSize: '11px', fontWeight: 750, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> Customise Your Sacred Biodata
              </span>
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '26px', margin: '4px 0 0', fontWeight: 600, color: 'var(--royal-emerald, #0B241D)' }}>
                अपना वैवाहिक परिचय पत्र तैयार करें
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setData(blankBiodata)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(15,23,42,0.15)',
                  background: '#FFFFFF',
                  color: '#64748B',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={13} /> Reset Blank
              </button>
              <button
                type="button"
                onClick={handleSaveAndPreview}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--royal-emerald, #0B241D)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(11,36,29,0.2)',
                }}
              >
                <Eye size={15} /> Save & View Sheet
              </button>
            </div>
          </div>

          {/* Section Navigation Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
            {[
              { id: 'personal', label: '१. व्यक्तिगत विवरण', icon: User },
              { id: 'career', label: '२. शिक्षा आ आजीविका', icon: Briefcase },
              { id: 'lineage', label: '३. गोत्र, मूल आ परम्परा', icon: Scroll },
              { id: 'kundali', label: '४. कुंडली विवरण', icon: Compass },
              { id: 'family', label: '५. पारिवारिक पृष्ठभूमि', icon: Home },
              { id: 'contact', label: '६. संपर्क विवरण', icon: PhoneCall },
            ].map((sec) => {
              const Icon = sec.icon
              const isActive = activeEditSection === sec.id
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveEditSection(sec.id as any)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: isActive ? '1px solid var(--royal-emerald, #0B241D)' : '1px solid rgba(15,23,42,0.1)',
                    background: isActive ? 'rgba(11,36,29,0.06)' : '#FFFFFF',
                    color: isActive ? 'var(--royal-emerald, #0B241D)' : '#64748B',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 550,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={14} /> {sec.label}
                </button>
              )
            })}
          </div>

          {/* Form Fields by Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1. PERSONAL PARTICULARS */}
            {activeEditSection === 'personal' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    value={data.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="e.g. Aarav Narayan"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Name in Devanagari (मैथिली / हिन्दी)
                  </label>
                  <input
                    type="text"
                    value={data.devanagariName}
                    onChange={(e) => updateField('devanagariName', e.target.value)}
                    placeholder="e.g. आरव नारायण"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                {/* Date of Birth Dropdown Group */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 650, color: '#334155' }}>
                      Date of Birth (जन्म तिथि)
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--terracotta, #8C2D19)', fontWeight: 650 }}>
                      {data.dateOfBirth || '—'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 1.2fr', gap: '6px' }}>
                    <select
                      value={parsedDob.day}
                      onChange={(e) => {
                        const newDay = e.target.value
                        updateField('dateOfBirth', `${newDay} ${parsedDob.month} ${parsedDob.year}`)
                      }}
                      style={{ width: '100%', padding: '9px 6px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '12px', background: '#fff' }}
                      title="Day"
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    <select
                      value={parsedDob.month}
                      onChange={(e) => {
                        const newMonth = e.target.value
                        updateField('dateOfBirth', `${parsedDob.day} ${newMonth} ${parsedDob.year}`)
                      }}
                      style={{ width: '100%', padding: '9px 6px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '12px', background: '#fff' }}
                      title="Month"
                    >
                      {MONTH_NAMES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>

                    <select
                      value={parsedDob.year}
                      onChange={(e) => {
                        const newYear = e.target.value
                        updateField('dateOfBirth', `${parsedDob.day} ${parsedDob.month} ${newYear}`)
                      }}
                      style={{ width: '100%', padding: '9px 6px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '12px', background: '#fff' }}
                      title="Year"
                    >
                      {getOptionsWithCurrent(YEARS, parsedDob.year).map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time of Birth Dropdown Group */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 650, color: '#334155' }}>
                      Time of Birth (जन्म समय)
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--terracotta, #8C2D19)', fontWeight: 650 }}>
                      {data.timeOfBirth || '—'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.1fr 1.3fr', gap: '6px' }}>
                    <select
                      value={parsedTob.hour}
                      onChange={(e) => {
                        const newHour = e.target.value
                        updateField('timeOfBirth', `${newHour}:${parsedTob.minute} ${parsedTob.ampm}`)
                      }}
                      style={{ width: '100%', padding: '9px 6px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '12px', background: '#fff' }}
                      title="Hour"
                    >
                      {HOURS.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>

                    <select
                      value={parsedTob.minute}
                      onChange={(e) => {
                        const newMinute = e.target.value
                        updateField('timeOfBirth', `${parsedTob.hour}:${newMinute} ${parsedTob.ampm}`)
                      }}
                      style={{ width: '100%', padding: '9px 6px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '12px', background: '#fff' }}
                      title="Minute"
                    >
                      {getOptionsWithCurrent(MINUTES, parsedTob.minute).map((m) => (
                        <option key={m} value={m}>
                          :{m}
                        </option>
                      ))}
                    </select>

                    <select
                      value={parsedTob.ampm}
                      onChange={(e) => {
                        const newAmpm = e.target.value
                        updateField('timeOfBirth', `${parsedTob.hour}:${parsedTob.minute} ${newAmpm}`)
                      }}
                      style={{ width: '100%', padding: '9px 6px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '12px', background: '#fff', fontWeight: 650 }}
                      title="AM / PM"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    value={data.placeOfBirth}
                    onChange={(e) => updateField('placeOfBirth', e.target.value)}
                    placeholder="e.g. Darbhanga, Bihar"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Height (ऊंचाई)
                  </label>
                  <select
                    value={data.height}
                    onChange={(e) => updateField('height', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="">Select Height</option>
                    {getOptionsWithCurrent(heightOptions, data.height).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Complexion (वर्ण)
                  </label>
                  <select
                    value={data.complexion}
                    onChange={(e) => updateField('complexion', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="">Select Complexion</option>
                    {getOptionsWithCurrent(complexionOptions, data.complexion).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Mother Tongue (मातृभाषा)
                  </label>
                  <select
                    value={data.motherTongue}
                    onChange={(e) => updateField('motherTongue', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="">Select Mother Tongue</option>
                    {getOptionsWithCurrent(motherTongueOptions, data.motherTongue).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Marital Status (वैवाहिक स्थिति)
                  </label>
                  <select
                    value={data.maritalStatus}
                    onChange={(e) => updateField('maritalStatus', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    {getOptionsWithCurrent(maritalStatusOptions, data.maritalStatus).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Profile Photograph Upload & Preview */}
                <div style={{ gridColumn: '1 / -1', background: '#FAF9F6', border: '1.5px dashed #CBD5E1', borderRadius: '12px', padding: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--royal-emerald, #0B241D)', marginBottom: '10px' }}>
                    Profile Photograph (वैवाहिक चित्र)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '96px',
                        borderRadius: '8px',
                        border: '2px solid var(--gold, #C59A3F)',
                        overflow: 'hidden',
                        position: 'relative',
                        background: '#ECECEC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {data.photo && !imageError ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={data.photo}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '20px', fontWeight: 700, color: '#64748B', display: 'block' }}>
                            {(data.fullName || 'MM').slice(0, 2).toUpperCase()}
                          </span>
                          <small style={{ fontSize: '9px', color: '#94A3B8' }}>No Photo</small>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 18px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--royal-emerald, #0B241D)',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(11,36,29,0.15)',
                          }}
                        >
                          <Upload size={14} /> Upload / Update Photo
                        </button>
                        {data.photo && (
                          <button
                            type="button"
                            onClick={() => {
                              setData((prev) => ({ ...prev, photo: '' }))
                              setImageError(false)
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: '1px solid #EF4444',
                              background: '#FFF',
                              color: '#EF4444',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={13} /> Remove Photo
                          </button>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        Select a clear JPG, PNG or WEBP portrait from your device (Max 5MB). Or choose a sample portrait:
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Sample Avatars:</span>
                        {[
                          { label: 'Aarav', path: '/images/discover-aarav.png' },
                          { label: 'Riya', path: '/images/discover-riya.png' },
                          { label: 'Dev', path: '/images/discover-dev.png' },
                          { label: 'Anjali', path: '/images/discover-anjali.png' },
                          { label: 'Mitali', path: '/images/mitali-profile.png' },
                        ].map((preset) => (
                          <button
                            key={preset.path}
                            type="button"
                            onClick={() => {
                              setData((prev) => ({ ...prev, photo: preset.path }))
                              setImageError(false)
                            }}
                            style={{
                              fontSize: '11px',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              border: data.photo === preset.path ? '1px solid var(--royal-emerald, #0B241D)' : '1px solid #CBD5E1',
                              background: data.photo === preset.path ? 'rgba(11,36,29,0.08)' : '#FFFFFF',
                              color: data.photo === preset.path ? 'var(--royal-emerald, #0B241D)' : '#475569',
                              fontWeight: data.photo === preset.path ? 700 : 500,
                              cursor: 'pointer',
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CAREER & EDUCATION */}
            {activeEditSection === 'career' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Highest Qualification (शिक्षा)
                  </label>
                  <select
                    value={data.highestEducation}
                    onChange={(e) => updateField('highestEducation', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="">Select Qualification</option>
                    {getOptionsWithCurrent(educationOptions, data.highestEducation).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    College / University
                  </label>
                  <input
                    type="text"
                    value={data.college}
                    onChange={(e) => updateField('college', e.target.value)}
                    placeholder="e.g. IISc Bengaluru / IIT Delhi"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Current Role / Designation
                  </label>
                  <input
                    type="text"
                    value={data.occupation}
                    onChange={(e) => updateField('occupation', e.target.value)}
                    placeholder="e.g. Lead Product Designer"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Current Employer / Organization
                  </label>
                  <input
                    type="text"
                    value={data.organization}
                    onChange={(e) => updateField('organization', e.target.value)}
                    placeholder="e.g. FinTech Innovation Labs"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Work Location / Current City
                  </label>
                  <input
                    type="text"
                    value={data.currentCity}
                    onChange={(e) => updateField('currentCity', e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Annual Compensation (आय)
                  </label>
                  <select
                    value={data.annualIncome}
                    onChange={(e) => updateField('annualIncome', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    {getOptionsWithCurrent(incomeOptions, data.annualIncome).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* 3. LINEAGE & GOTRA (PANJI) */}
            {activeEditSection === 'lineage' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Community / Samudaya (समुदाय)
                  </label>
                  <select
                    value={data.community}
                    onChange={(e) => updateField('community', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    {getOptionsWithCurrent(communityOptions, data.community).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Gotra (गोत्र) *
                  </label>
                  <select
                    value={data.gotra}
                    onChange={(e) => updateField('gotra', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="">Select Gotra</option>
                    {getOptionsWithCurrent(gotraOptions, data.gotra).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Mool (मूल) *
                  </label>
                  <select
                    value={data.mool}
                    onChange={(e) => updateField('mool', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="">Select Mool</option>
                    {getOptionsWithCurrent(moolOptions, data.mool).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Pravara (प्रवर)
                  </label>
                  <select
                    value={data.pravara}
                    onChange={(e) => updateField('pravara', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    {getOptionsWithCurrent(pravaraOptions, data.pravara).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Ancestral Village
                  </label>
                  <input
                    type="text"
                    value={data.ancestralVillage}
                    onChange={(e) => updateField('ancestralVillage', e.target.value)}
                    placeholder="e.g. Sakri, Darbhanga"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Kuldevi / Devta
                  </label>
                  <input
                    type="text"
                    value={data.kuldevi}
                    onChange={(e) => updateField('kuldevi', e.target.value)}
                    placeholder="e.g. Maa Uchattha Bhagwati"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Maternal Roots (मातृ पक्ष)
                  </label>
                  <input
                    type="text"
                    value={data.maternalRoots}
                    onChange={(e) => updateField('maternalRoots', e.target.value)}
                    placeholder="e.g. Jhanjharpur / Koilakh"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
              </div>
            )}

            {/* 4. KUNDALI & ASTROLOGICAL */}
            {activeEditSection === 'kundali' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Moon Rashi (राशि)
                  </label>
                  <select
                    value={data.rashi}
                    onChange={(e) => updateField('rashi', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="">Select Moon Rashi</option>
                    {getOptionsWithCurrent(rashiOptions, data.rashi).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Birth Nakshatra (नक्षत्र)
                  </label>
                  <select
                    value={data.nakshatra}
                    onChange={(e) => updateField('nakshatra', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="">Select Nakshatra</option>
                    {getOptionsWithCurrent(nakshatraOptions, data.nakshatra).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Manglik Status (मांगलिक दोष)
                  </label>
                  <select
                    value={data.manglik}
                    onChange={(e) => updateField('manglik', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    {getOptionsWithCurrent(manglikOptions, data.manglik).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Gana (गण)
                  </label>
                  <select
                    value={data.gana}
                    onChange={(e) => updateField('gana', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    {getOptionsWithCurrent(ganaOptions, data.gana).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* 5. FAMILY BACKGROUND */}
            {activeEditSection === 'family' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Father&apos;s Full Name
                  </label>
                  <input
                    type="text"
                    value={data.fatherName}
                    onChange={(e) => updateField('fatherName', e.target.value)}
                    placeholder="e.g. Shri K. N. Narayan"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Father&apos;s Profession
                  </label>
                  <input
                    type="text"
                    value={data.fatherOccupation}
                    onChange={(e) => updateField('fatherOccupation', e.target.value)}
                    placeholder="e.g. Retired Bank Manager, SBI"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Mother&apos;s Full Name
                  </label>
                  <input
                    type="text"
                    value={data.motherName}
                    onChange={(e) => updateField('motherName', e.target.value)}
                    placeholder="e.g. Smt. Sarita Narayan"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Mother&apos;s Profession
                  </label>
                  <input
                    type="text"
                    value={data.motherOccupation}
                    onChange={(e) => updateField('motherOccupation', e.target.value)}
                    placeholder="e.g. Homemaker & Writer"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Brothers & Sisters (Siblings)
                  </label>
                  <input
                    type="text"
                    value={data.siblings}
                    onChange={(e) => updateField('siblings', e.target.value)}
                    placeholder="e.g. One younger sister (Married in Pune)"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Family Values & Heritage (पारिवारिक मूल्य)
                  </label>
                  <select
                    value={data.familyValues}
                    onChange={(e) => updateField('familyValues', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                  >
                    {getOptionsWithCurrent(familyValuesOptions, data.familyValues).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* 6. CONTACT DETAILS */}
            {activeEditSection === 'contact' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Elder / Guardian Contact Name
                  </label>
                  <input
                    type="text"
                    value={data.guardianContactName}
                    onChange={(e) => updateField('guardianContactName', e.target.value)}
                    placeholder="e.g. Shri K. N. Narayan (Father)"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Contact Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={data.contactPhone}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                    placeholder="e.g. +91 94XXX XXXXX"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={data.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    placeholder="e.g. narayan.family@example.com"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Residence Address
                  </label>
                  <input
                    type="text"
                    value={data.residentialAddress}
                    onChange={(e) => updateField('residentialAddress', e.target.value)}
                    placeholder="e.g. Indiranagar, Bengaluru / Darbhanga Ancestral Home"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px' }}
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions for Form */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(15,23,42,0.08)' }}>
              <button
                type="button"
                onClick={handleSaveAndPreview}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--royal-emerald, #0B241D)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(11,36,29,0.25)',
                }}
              >
                <Check size={16} /> Save & View Printable Biodata ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. THE OPULENT BIODATA SHEET (PRINT-READY DOCUMENT) */}
      <article
        id="printable-biodata"
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          background: '#FFFDF9',
          border: `4px double ${themeColors.border}`,
          borderRadius: '16px',
          padding: '36px clamp(20px, 5vw, 44px)',
          boxShadow: '0 20px 60px rgba(11,36,29,0.1)',
          position: 'relative',
        }}
      >
        {/* Floating Quick-Edit Action for Preview Mode */}
        {activeTab === 'preview' && (
          <div
            className="no-print"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '99px',
                border: '1px solid var(--royal-emerald, #0B241D)',
                background: '#FFFFFF',
                color: 'var(--royal-emerald, #0B241D)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease',
              }}
            >
              <Edit3 size={13} /> Edit Fields
            </button>
          </div>
        )}

        {/* Decorative Traditional Corner Motifs */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', color: themeColors.primary, fontSize: '18px' }}>✦</div>
        <div style={{ position: 'absolute', top: '12px', right: '12px', color: themeColors.primary, fontSize: '18px' }}>✦</div>
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', color: themeColors.primary, fontSize: '18px' }}>✦</div>
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', color: themeColors.primary, fontSize: '18px' }}>✦</div>

        {/* Auspicious Invocations Header */}
        <div style={{ textAlign: 'center', borderBottom: `2px solid ${themeColors.border}`, paddingBottom: '18px', marginBottom: '24px' }}>
          <div style={{ fontFamily: 'serif', fontSize: '15px', fontWeight: 700, color: themeColors.primary, letterSpacing: '0.14em', marginBottom: '4px' }}>
            ॥ श्री गणेशाय नमः ॥ · ॥ शुभ विवाह ॥
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '32px', margin: '4px 0', fontWeight: 600, color: '#1B2D26' }}>
            वैवाहिक परिचय पत्र
          </h1>
          <span style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(27,45,38,0.65)' }}>
            Mithila Milan Verified Matrimonial Biodata
          </span>
        </div>

        {/* Profile Header Block: Photo + Core Identity */}
        <div
          className="biodata-hero-block"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            alignItems: 'center',
            background: themeColors.bgLight,
            border: `1px solid ${themeColors.border}`,
            borderRadius: '12px',
            padding: 'clamp(16px, 4vw, 24px)',
            marginBottom: '28px',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: themeColors.primary, fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              <ShieldCheck size={14} /> Verified Member Profile
            </div>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(24px, 5vw, 30px)', margin: '0 0 2px', fontWeight: 700, color: '#1B2D26' }}>
              {data.fullName || 'Candidate Name'}
            </h2>
            <div style={{ fontFamily: 'serif', fontSize: '18px', color: themeColors.primary, fontWeight: 600, marginBottom: '8px' }}>
              {data.devanagariName || 'नाम'}
            </div>
            <p style={{ margin: '0 0 10px', fontSize: '14px', color: 'rgba(27,45,38,0.75)', fontWeight: 500 }}>
              {data.occupation} {data.organization ? `· ${data.organization}` : ''}
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '12px', color: '#1B2D26' }}>
              {data.height && <span><strong>Height:</strong> {data.height}</span>}
              {data.currentCity && <span><strong>Current City:</strong> {data.currentCity}</span>}
            </div>
          </div>

          {/* Photo with Gold Frame */}
          <div
            style={{
              position: 'relative',
              width: '180px',
              height: '210px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: `3px solid ${themeColors.primary}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              justifySelf: 'center',
              backgroundColor: '#F8F5EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {data.photo && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.photo}
                alt={data.fullName || 'Candidate photo'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(197,154,63,0.18) 0%, rgba(168,51,30,0.12) 100%)',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: themeColors.primary,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: 700,
                    fontFamily: 'serif',
                    marginBottom: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  {(data.fullName || 'MM').slice(0, 2).toUpperCase()}
                </div>
                <strong style={{ fontSize: '12px', color: '#1B2D26', display: 'block' }}>
                  {data.fullName || 'Member Profile'}
                </strong>
                <span style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
                  Click camera to add photo
                </span>
              </div>
            )}

            {/* Quick Upload Hover/Action Button in Preview mode (no-print) */}
            <div
              className="no-print"
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 6,
              }}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload / Change Photograph"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.7)',
                  background: 'rgba(11,36,29,0.85)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                <Camera size={13} /> Update Photo
              </button>
            </div>

            {/* Subtle Biodata Watermark */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(27,45,38,0.85)',
                color: '#fffaf1',
                fontSize: '9px',
                textAlign: 'center',
                padding: '3px 0',
                letterSpacing: '0.08em',
              }}
            >
              ✦ MITHILA MILAN
            </div>
          </div>
        </div>

        {/* SECTION 1: PERSONAL PARTICULARS */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1.5px solid ${themeColors.primary}`, paddingBottom: '6px', marginBottom: '14px' }}>
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', fontWeight: 700, color: themeColors.primary }}>
              १. व्यक्तिगत विवरण (Personal Particulars)
            </span>
          </div>

          <div className="biodata-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px 24px', fontSize: '13px' }}>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Date of Birth:</span> <strong>{data.dateOfBirth || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Time of Birth:</span> <strong>{data.timeOfBirth || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Place of Birth:</span> <strong>{data.placeOfBirth || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Height & Complexion:</span> <strong>{data.height} {data.complexion ? `· ${data.complexion}` : ''}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Mother Tongue:</span> <strong>{data.motherTongue || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Marital Status:</span> <strong>{data.maritalStatus || '—'}</strong></div>
          </div>
        </section>

        {/* SECTION 2: ACADEMIC & PROFESSIONAL BACKGROUND */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1.5px solid ${themeColors.primary}`, paddingBottom: '6px', marginBottom: '14px' }}>
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', fontWeight: 700, color: themeColors.primary }}>
              २. शिक्षा आ आजीविका (Education & Career)
            </span>
          </div>

          <div className="biodata-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px 24px', fontSize: '13px' }}>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Highest Qualification:</span> <strong>{data.highestEducation || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>College / University:</span> <strong>{data.college || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Current Designation:</span> <strong>{data.occupation || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Current Employer:</span> <strong>{data.organization || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Work Location:</span> <strong>{data.currentCity || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Annual Compensation:</span> <strong>{data.annualIncome || 'Confidential'}</strong></div>
          </div>
        </section>

        {/* SECTION 3: MITHILA CULTURAL & LINEAGE HERITAGE (PANJI) */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1.5px solid ${themeColors.primary}`, paddingBottom: '6px', marginBottom: '14px' }}>
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', fontWeight: 700, color: themeColors.primary }}>
              ३. गोत्र, मूल आ कुल परम्परा (Ancestral Lineage)
            </span>
          </div>

          <div
            className="biodata-grid-2col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px 24px',
              fontSize: '13px',
              background: themeColors.bgLight,
              border: `1px dashed ${themeColors.border}`,
              padding: '16px 20px',
              borderRadius: '8px',
            }}
          >
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Community:</span> <strong>{data.community || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Gotra (गोत्र):</span> <strong style={{ color: themeColors.primary, fontSize: '14px' }}>{data.gotra || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Mool (मूल):</span> <strong style={{ color: themeColors.primary, fontSize: '14px' }}>{data.mool || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Pravara (प्रवर):</span> <strong>{data.pravara || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Ancestral Village:</span> <strong>{data.ancestralVillage || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Kuldevi / Devta:</span> <strong>{data.kuldevi || '—'}</strong></div>
            <div style={{ gridColumn: '1 / -1' }}>
              <span style={{ color: 'rgba(27,45,38,0.6)' }}>Maternal Roots (मातृ पक्ष):</span> <strong>{data.maternalRoots || '—'}</strong>
            </div>
          </div>
        </section>

        {/* SECTION 4: KUNDALI & ASTROLOGICAL DETAILS */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1.5px solid ${themeColors.primary}`, paddingBottom: '6px', marginBottom: '14px' }}>
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', fontWeight: 700, color: themeColors.primary }}>
              ४. कुंडली विवरण (Horoscope & Astrological Data)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px 16px', fontSize: '13px' }}>
            <div><span style={{ color: 'rgba(27,45,38,0.6)', display: 'block', fontSize: '11px' }}>Rashi (राशि)</span> <strong>{data.rashi || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)', display: 'block', fontSize: '11px' }}>Nakshatra (नक्षत्र)</span> <strong>{data.nakshatra || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)', display: 'block', fontSize: '11px' }}>Manglik Status</span> <strong>{data.manglik || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)', display: 'block', fontSize: '11px' }}>Gana (गण)</span> <strong>{data.gana || '—'}</strong></div>
          </div>
        </section>

        {/* SECTION 5: FAMILY BACKGROUND */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1.5px solid ${themeColors.primary}`, paddingBottom: '6px', marginBottom: '14px' }}>
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', fontWeight: 700, color: themeColors.primary }}>
              ५. पारिवारिक पृष्ठभूमि (Family Background)
            </span>
          </div>

          <div className="biodata-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px 24px', fontSize: '13px' }}>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Father&apos;s Name:</span> <strong>{data.fatherName || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Father&apos;s Profession:</span> <strong>{data.fatherOccupation || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Mother&apos;s Name:</span> <strong>{data.motherName || '—'}</strong></div>
            <div><span style={{ color: 'rgba(27,45,38,0.6)' }}>Mother&apos;s Profession:</span> <strong>{data.motherOccupation || '—'}</strong></div>
            <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'rgba(27,45,38,0.6)' }}>Siblings:</span> <strong>{data.siblings || '—'}</strong></div>
            <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'rgba(27,45,38,0.6)' }}>Family Values:</span> <strong>{data.familyValues || '—'}</strong></div>
          </div>
        </section>

        {/* SECTION 6: CONTACT & ELDER DETAILS */}
        <section style={{ borderTop: `2px solid ${themeColors.border}`, paddingTop: '18px', marginTop: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', lineHeight: 1.7, color: 'rgba(27,45,38,0.85)' }}>
              <div><strong>Elder Contact:</strong> {data.guardianContactName || '—'}</div>
              <div><strong>Telephone / Mobile:</strong> {data.contactPhone || '—'}</div>
              <div><strong>Email Correspondence:</strong> {data.contactEmail || '—'}</div>
              <div><strong>Residence:</strong> {data.residentialAddress || '—'}</div>
            </div>

            {/* Mithila Milan Official QR / Trust Seal */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  border: `2px solid ${themeColors.primary}`,
                  borderRadius: '8px',
                  display: 'grid',
                  placeItems: 'center',
                  background: '#fff',
                  padding: '6px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                }}
              >
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  <rect x="0" y="0" width="30" height="30" fill={themeColors.primary} />
                  <rect x="5" y="5" width="20" height="20" fill="#fff" />
                  <rect x="10" y="10" width="10" height="10" fill={themeColors.primary} />
                  <rect x="70" y="0" width="30" height="30" fill={themeColors.primary} />
                  <rect x="75" y="5" width="20" height="20" fill="#fff" />
                  <rect x="80" y="10" width="10" height="10" fill={themeColors.primary} />
                  <rect x="0" y="70" width="30" height="30" fill={themeColors.primary} />
                  <rect x="5" y="75" width="20" height="20" fill="#fff" />
                  <rect x="10" y="80" width="10" height="10" fill={themeColors.primary} />
                  <circle cx="50" cy="50" r="10" fill={themeColors.primary} />
                  <rect x="40" y="15" width="8" height="8" fill={themeColors.primary} />
                  <rect x="52" y="75" width="12" height="8" fill={themeColors.primary} />
                  <rect x="75" y="45" width="8" height="15" fill={themeColors.primary} />
                </svg>
              </div>
              <small style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: themeColors.primary, marginTop: '4px' }}>
                Scan to Verify Profile
              </small>
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(27,45,38,0.1)', textAlign: 'center', fontSize: '10px', color: 'rgba(27,45,38,0.5)', letterSpacing: '0.04em' }}>
            Generated via Mithila Milan Sanctuary · Anti-Dowry Covenant Signed · DPDP Act 2023 Compliant
          </div>
        </section>
      </article>

      {/* Print Stylesheet Overrides */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print, header, footer, .mobile-bottom-nav {
            display: none !important;
          }
          .biodata-wrapper {
            background: #ffffff !important;
            padding: 0 !important;
          }
          #printable-biodata {
            box-shadow: none !important;
            border: 2px double #8C2D19 !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            page-break-after: avoid !important;
          }
        }
      `}</style>
    </div>
  )
}

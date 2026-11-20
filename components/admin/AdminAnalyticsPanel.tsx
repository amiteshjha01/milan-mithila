'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import type { AdminAnalyticsPayload, AnalyticsRange, DistributionItem, PeriodDelta } from '@/lib/admin-analytics'
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Clock,
  Crown,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Flame,
  Globe2,
  Heart,
  HeartHandshake,
  Info,
  Layers,
  Lock,
  MapPin,
  MessageSquare,
  PieChart,
  Printer,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'

interface AdminAnalyticsPanelProps {
  analytics: AdminAnalyticsPayload | null | undefined
  range: AnalyticsRange
  onRangeChange: (nextRange: AnalyticsRange) => void
  onNavigateTab?: (tab: 'members' | 'vip' | 'database') => void
  loading?: boolean
}

const PALETTE = ['#0B241D', '#C59A3F', '#8C2D19', '#15803D', '#1D4ED8', '#7C3AED', '#0E7490', '#B45309']

const CARD_STYLE: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '14px',
  padding: '22px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
}

const TABULAR: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  if (!Number.isFinite(diffMs) || diffMs < 0) return 'just now'
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

function DeltaPill({ delta, windowDays }: { delta: PeriodDelta; windowDays: number }) {
  if (delta.deltaPct === null) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          padding: '2px 8px',
          borderRadius: '999px',
          background: '#F1F5F9',
          color: '#64748B',
          fontSize: '11px',
          fontWeight: 700,
        }}
      >
        — 0% vs prev {windowDays}d
      </span>
    )
  }
  const positive = delta.deltaPct >= 0
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        padding: '2px 8px',
        borderRadius: '999px',
        background: positive ? '#DCFCE7' : '#FEE2E2',
        color: positive ? '#166534' : '#991B1B',
        fontSize: '11px',
        fontWeight: 700,
        ...TABULAR,
      }}
    >
      {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {positive ? '+' : ''}
      {delta.deltaPct}% vs prev {windowDays}d
    </span>
  )
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const safe = values.length >= 2 ? values : [0, ...(values.length ? values : [0])]
  const max = Math.max(...safe, 1)
  const w = 110
  const h = 32
  const step = w / Math.max(safe.length - 1, 1)
  const pts = safe.map((v, i) => `${(i * step).toFixed(1)},${(h - 3 - (v / max) * (h - 6)).toFixed(1)}`)
  const linePath = `M ${pts.join(' L ')}`
  const areaPath = `${linePath} L ${w},${h} L 0,${h} Z`
  const gradId = `spark-${color.replace('#', '')}-${safe.length}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ overflow: 'visible', flexShrink: 0 }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HealthRadialGauge({ score, grade, status }: { score: number; grade: string; status: string }) {
  const r = 46
  const circ = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, score))
  const dash = (clamped / 100) * circ
  const ringColor = clamped >= 80 ? '#4ADE80' : clamped >= 60 ? '#F4D068' : '#FCA5A5'

  return (
    <div style={{ position: 'relative', width: '116px', height: '116px', flexShrink: 0 }}>
      <svg viewBox="0 0 116 116" width="116" height="116" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="58" cy="58" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
        <circle
          cx="58"
          cy="58"
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '26px', fontWeight: 800, color: '#FAF8F5', lineHeight: 1, ...TABULAR }}>{clamped}</span>
        <span
          style={{
            marginTop: '3px',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: ringColor,
            textTransform: 'uppercase',
          }}
        >
          Grade {grade}
        </span>
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', marginTop: '1px' }}>{status}</span>
      </div>
    </div>
  )
}

function HorizontalBarList({
  items,
  accentColor = '#0B241D',
  emptyText = 'No data recorded yet.',
}: {
  items: DistributionItem[]
  accentColor?: string
  emptyText?: string
}) {
  if (!items || items.length === 0) {
    return <p style={{ fontSize: '12px', color: '#94A3B8', margin: '8px 0' }}>{emptyText}</p>
  }
  const maxCount = Math.max(...items.map((i) => i.count), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
      {items.map((item, idx) => (
        <div key={`${item.label}-${idx}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '12px', marginBottom: '5px', gap: '8px' }}>
            <span style={{ color: '#1E293B', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
            <span style={{ color: '#475569', fontWeight: 700, flexShrink: 0, ...TABULAR }}>
              {item.count} <span style={{ color: '#94A3B8', fontWeight: 500 }}>({item.percentage}%)</span>
            </span>
          </div>
          <div style={{ height: '7px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.max(item.count > 0 ? 5 : 0, Math.round((item.count / maxCount) * 100))}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
                borderRadius: '999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function DonutChart({
  items,
  centerValue,
  centerLabel,
}: {
  items: DistributionItem[]
  centerValue: string | number
  centerLabel: string
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const total = items.reduce((sum, i) => sum + i.count, 0)
  const radius = 56
  const strokeWidth = 18
  const circumference = 2 * Math.PI * radius

  let cumulative = 0
  const segments = items.map((item, idx) => {
    const fraction = total > 0 ? item.count / total : 0
    const dashLength = fraction * circumference
    const dashOffset = -cumulative * circumference
    cumulative += fraction
    return {
      ...item,
      color: PALETTE[idx % PALETTE.length],
      dashLength,
      dashOffset,
    }
  })

  const active = hoveredIdx !== null ? segments[hoveredIdx] : null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: '146px', height: '146px', flexShrink: 0 }}>
        <svg viewBox="0 0 146 146" width="146" height="146" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="73" cy="73" r={radius} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
          {total > 0 &&
            segments.map((seg, idx) => (
              <circle
                key={seg.label}
                cx="73"
                cy="73"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={hoveredIdx === idx ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={`${seg.dashLength} ${circumference}`}
                strokeDashoffset={seg.dashOffset}
                style={{ cursor: 'pointer', transition: 'stroke-width 0.15s ease' }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
            padding: '12px',
          }}
        >
          <strong style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1, ...TABULAR }}>
            {active ? `${active.percentage}%` : centerValue}
          </strong>
          <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginTop: '3px' }}>
            {active ? active.label : centerLabel}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: '145px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {segments.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>No member data yet.</p>
        ) : (
          segments.map((seg, idx) => (
            <div
              key={seg.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                padding: '5px 8px',
                borderRadius: '7px',
                background: hoveredIdx === idx ? '#F8FAFC' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: seg.color, flexShrink: 0 }} />
                <span style={{ color: '#1E293B', fontWeight: 600 }}>{seg.label}</span>
              </div>
              <span style={{ color: '#334155', fontWeight: 700, ...TABULAR }}>
                {seg.count} <span style={{ color: '#94A3B8', fontWeight: 500 }}>({seg.percentage}%)</span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function SectionTitle({
  icon,
  iconBg,
  title,
  subtitle,
  right,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  subtitle?: string
  right?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: iconBg,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 750, color: '#0F172A', letterSpacing: '-0.01em' }}>{title}</h3>
          {subtitle && <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#64748B' }}>{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

export default function AdminAnalyticsPanel({
  analytics,
  range,
  onRangeChange,
  onNavigateTab,
  loading = false,
}: AdminAnalyticsPanelProps) {
  const [chartMode, setChartMode] = useState<'cumulative' | 'stacked'>('cumulative')
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null)
  const [culturalTab, setCulturalTab] = useState<'gotra' | 'mool' | 'community' | 'panji'>('gotra')
  const [careerTab, setCareerTab] = useState<'sectors' | 'professions' | 'qualifications'>('sectors')
  const [queueTab, setQueueTab] = useState<'pending' | 'demand'>('pending')

  const timelineSummary = useMemo(() => {
    const pts = analytics?.timeline || []
    return pts.reduce(
      (acc, p) => {
        acc.signups += p.signups
        acc.interests += p.interests
        acc.shortlists += p.shortlists
        acc.vipLeads += p.vipLeads
        return acc
      },
      { signups: 0, interests: 0, shortlists: 0, vipLeads: 0 }
    )
  }, [analytics?.timeline])

  const handleExportJson = () => {
    if (!analytics) return
    const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mithila-milan-executive-analytics-${analytics.range}-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportCsv = () => {
    if (!analytics) return
    const rows: string[][] = [
      ['Section', 'Metric', 'Value', 'Percentage'],
      ['Health', 'Overall Health Score', String(analytics.healthScore.overall), `Grade ${analytics.healthScore.grade}`],
      ['Health', 'Trust Pillar', String(analytics.healthScore.pillars.trust), ''],
      ['Health', 'Quality Pillar', String(analytics.healthScore.pillars.quality), ''],
      ['Health', 'Balance Pillar', String(analytics.healthScore.pillars.balance), ''],
      ['Health', 'Velocity Pillar', String(analytics.healthScore.pillars.velocity), ''],
      ['Overview', 'Total Members', String(analytics.overview.totalMembers), '100%'],
      ['Overview', 'Verified Profiles', String(analytics.overview.verifiedProfiles), `${analytics.overview.verificationRate}%`],
      ['Overview', 'Average Profile Completion', `${analytics.overview.avgProfileCompletion}%`, ''],
      ['Overview', 'Active Users (24h / 7d / 30d)', `${analytics.overview.activeUsers24h} / ${analytics.overview.activeUsers7d} / ${analytics.overview.activeUsers30d}`, ''],
      ['Overview', 'Conversations & Messages', `${analytics.overview.totalConversations} chats / ${analytics.overview.totalMessages} msgs`, ''],
      ['Liquidity', 'Gender Ratio', analytics.liquidity.genderRatioLabel, ''],
      ['Liquidity', 'Interests per Member', String(analytics.liquidity.interestsPerMember), ''],
      ['Funnel', 'Interests Sent / Accepted', `${analytics.funnel.interestsSent} / ${analytics.funnel.interestsAccepted}`, `${analytics.funnel.interestAcceptanceRate}%`],
      ['VIP Pipeline', 'Total / Converted', `${analytics.vipPipeline.total} / ${analytics.vipPipeline.converted}`, `${analytics.vipPipeline.conversionRate}%`],
      ...analytics.demographics.gender.map((g) => ['Gender', g.label, String(g.count), `${g.percentage}%`]),
      ...analytics.geography.topNativeDistricts.map((d) => ['Native District', d.label, String(d.count), `${d.percentage}%`]),
      ...analytics.geography.topCurrentCities.map((c) => ['Current City', c.label, String(c.count), `${c.percentage}%`]),
      ...analytics.cultural.topGotras.map((g) => ['Gotra', g.label, String(g.count), `${g.percentage}%`]),
      ...analytics.cultural.topMools.map((m) => ['Mool', m.label, String(m.count), `${m.percentage}%`]),
    ]

    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mithila-milan-executive-analytics-${analytics.range}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!analytics) {
    return (
      <div style={{ ...CARD_STYLE, padding: '56px', textAlign: 'center', color: '#64748B' }}>
        <BarChart3 size={34} color="#C59A3F" style={{ margin: '0 auto 12px' }} />
        <p style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>Synthesizing live MongoDB Atlas telemetry...</p>
      </div>
    )
  }

  // Timeline SVG math
  const pts = analytics.timeline
  const chartW = 820
  const chartH = 235
  const padL = 38
  const padR = 18
  const padT = 20
  const padB = 34
  const innerW = chartW - padL - padR
  const innerH = chartH - padT - padB

  const maxCumulative = Math.max(...pts.map((p) => p.cumulativeMembers), 1)
  const maxStacked = Math.max(...pts.map((p) => p.signups + p.interests + p.shortlists + p.vipLeads), 1)
  const yMax = chartMode === 'cumulative' ? maxCumulative : maxStacked

  const stepX = pts.length > 1 ? innerW / (pts.length - 1) : innerW
  const barStep = pts.length > 0 ? innerW / pts.length : innerW
  const barW = Math.max(5, Math.min(26, barStep * 0.56))

  const areaCoords = pts.map((p, i) => {
    const x = pts.length > 1 ? padL + i * stepX : padL + innerW / 2
    const y = padT + innerH - (p.cumulativeMembers / yMax) * innerH
    return { x, y, pt: p }
  })

  const smoothLinePath =
    areaCoords.length > 1
      ? areaCoords.reduce((acc, c, i, arr) => {
          if (i === 0) return `M ${c.x.toFixed(1)},${c.y.toFixed(1)}`
          const prev = arr[i - 1]
          const cx = ((prev.x + c.x) / 2).toFixed(1)
          return `${acc} C ${cx},${prev.y.toFixed(1)} ${cx},${c.y.toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}`
        }, '')
      : ''

  const smoothAreaPath =
    areaCoords.length > 1
      ? `${smoothLinePath} L ${areaCoords[areaCoords.length - 1].x.toFixed(1)},${(padT + innerH).toFixed(1)} L ${areaCoords[0].x.toFixed(1)},${(padT + innerH).toFixed(1)} Z`
      : ''

  const hoveredPoint = hoveredPointIdx !== null ? pts[hoveredPointIdx] : null

  const funnelSteps = [
    { label: 'Registered Members', count: analytics.funnel.totalMembers, color: '#0B241D' },
    { label: 'Admin Verified Profiles', count: analytics.funnel.verifiedMembers, color: '#15803D' },
    { label: 'Photos Uploaded', count: analytics.funnel.profilesWithPhotos, color: '#0E7490' },
    { label: 'Interest Signals Sent', count: analytics.funnel.interestsSent, color: '#8C2D19' },
    { label: 'Mutual Matches Accepted', count: analytics.funnel.interestsAccepted, color: '#C59A3F' },
    { label: 'Active Family Conversations', count: analytics.funnel.activeConversations, color: '#1D4ED8' },
  ]
  const funnelBase = Math.max(analytics.funnel.totalMembers, ...funnelSteps.map((s) => s.count), 1)

  const pillars = [
    { label: 'Trust & Verification', value: analytics.healthScore.pillars.trust, color: '#4ADE80' },
    { label: 'Profile Quality', value: analytics.healthScore.pillars.quality, color: '#F4D068' },
    { label: 'Gender Balance', value: analytics.healthScore.pillars.balance, color: '#60A5FA' },
    { label: 'Match Velocity', value: analytics.healthScore.pillars.velocity, color: '#FB923C' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. EXECUTIVE INTELLIGENCE HERO BANNER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071914 0%, #0B241D 48%, #153D31 100%)',
          borderRadius: '16px',
          padding: '26px 28px',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '0 16px 40px rgba(11, 36, 29, 0.16)',
          color: '#FAF8F5',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-60px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap', position: 'relative' }}>
          {/* Left: Title + Controls */}
          <div style={{ flex: '1 1 420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'rgba(74, 222, 128, 0.14)',
                  border: '1px solid rgba(74, 222, 128, 0.35)',
                  color: '#86EFAC',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80' }} />
                LIVE ATLAS TELEMETRY
              </span>
              <span style={{ fontSize: '11.5px', color: 'rgba(250,248,245,0.62)' }}>
                Synced {new Date(analytics.generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(22px, 2.4vw, 28px)',
                fontWeight: 700,
                margin: '0 0 6px',
                color: '#FAF8F5',
                letterSpacing: '-0.01em',
              }}
            >
              Executive Intelligence & <em style={{ color: '#F4D068' }}>Growth Analytics</em>
            </h2>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: 'rgba(250,248,245,0.72)', maxWidth: '620px', lineHeight: 1.5 }}>
              Real-time marketplace liquidity, verification health, Mithila lineage demographics, VIP concierge conversion, and DPDP Act 2023 compliance metrics.
            </p>

            {/* Controls Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'inline-flex',
                  background: 'rgba(255,255,255,0.08)',
                  padding: '3px',
                  borderRadius: '9px',
                  border: '1px solid rgba(212,175,55,0.28)',
                }}
              >
                {(
                  [
                    { id: '7d', label: '7D' },
                    { id: '30d', label: '30D' },
                    { id: '90d', label: '90D' },
                    { id: 'all', label: 'All Time' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={loading}
                    onClick={() => onRangeChange(opt.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: loading ? 'wait' : 'pointer',
                      background: range === opt.id ? '#D4AF37' : 'transparent',
                      color: range === opt.id ? '#0B241D' : 'rgba(250,248,245,0.78)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleExportCsv}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 13px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#FAF8F5',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <FileSpreadsheet size={14} color="#86EFAC" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 13px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#FAF8F5',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Download size={14} color="#F4D068" />
                <span>JSON</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 13px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#FAF8F5',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Printer size={14} color="rgba(250,248,245,0.8)" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Right: Platform Health Composite Score Card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <HealthRadialGauge
              score={analytics.healthScore.overall}
              grade={analytics.healthScore.grade}
              status={analytics.healthScore.status}
            />
            <div style={{ minWidth: '175px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#F4D068' }}>
                Platform Health Index
              </div>
              {pillars.map((pl) => (
                <div key={pl.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(250,248,245,0.85)', marginBottom: '3px' }}>
                    <span>{pl.label}</span>
                    <strong style={TABULAR}>{pl.value}%</strong>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pl.value}%`, height: '100%', background: pl.color, borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. AUTOMATED EXECUTIVE SIGNALS */}
      {analytics.insights.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '12px' }}>
          {analytics.insights.map((ins, idx) => {
            const palette =
              ins.level === 'warning'
                ? { bg: '#FFFBEB', border: '#FDE68A', accent: '#D97706', text: '#92400E', icon: <AlertTriangle size={15} color="#D97706" /> }
                : ins.level === 'action'
                ? { bg: '#FEF2F2', border: '#FECACA', accent: '#DC2626', text: '#991B1B', icon: <Flame size={15} color="#DC2626" /> }
                : ins.level === 'success'
                ? { bg: '#F0FDF4', border: '#BBF7D0', accent: '#16A34A', text: '#166534', icon: <CheckCircle2 size={15} color="#16A34A" /> }
                : { bg: '#EFF6FF', border: '#BFDBFE', accent: '#2563EB', text: '#1E40AF', icon: <Info size={15} color="#2563EB" /> }
            return (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${palette.border}`,
                  borderLeft: `4px solid ${palette.accent}`,
                  borderRadius: '11px',
                  padding: '13px 15px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 2px 10px rgba(15,23,42,0.025)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>{palette.icon}</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '12.5px', color: palette.text, marginBottom: '3px' }}>
                      {ins.title}
                    </strong>
                    <span style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.45, display: 'block' }}>{ins.detail}</span>
                  </div>
                </div>
                {ins.metric && (
                  <span
                    style={{
                      flexShrink: 0,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: palette.bg,
                      color: palette.text,
                      fontSize: '10.5px',
                      fontWeight: 800,
                      ...TABULAR,
                    }}
                  >
                    {ins.metric}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 3. FOUR EXECUTIVE PERFORMANCE CARDS WITH SPARKLINES & PERIOD DELTAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {/* Member Acquisition */}
        <div style={CARD_STYLE}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
              Member Acquisition
            </span>
            <UserPlus size={16} color="#0B241D" />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1, ...TABULAR }}>
                {analytics.periodComparison.signups.current}
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginLeft: '6px' }}>
                  / {analytics.periodComparison.windowDays}d
                </span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <DeltaPill delta={analytics.periodComparison.signups} windowDays={analytics.periodComparison.windowDays} />
              </div>
            </div>
            <Sparkline values={pts.map((p) => p.signups)} color="#0B241D" />
          </div>
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', fontSize: '11.5px', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
            <span>Total members: <strong style={{ color: '#0F172A' }}>{analytics.overview.totalMembers}</strong></span>
            <span>Avg quality: <strong style={{ color: '#0F172A' }}>{analytics.overview.avgProfileCompletion}%</strong></span>
          </div>
        </div>

        {/* Interest Velocity */}
        <div style={CARD_STYLE}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
              Interest Velocity
            </span>
            <Heart size={16} color="#8C2D19" />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#8C2D19', lineHeight: 1.1, ...TABULAR }}>
                {analytics.periodComparison.interests.current}
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginLeft: '6px' }}>
                  / {analytics.periodComparison.windowDays}d
                </span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <DeltaPill delta={analytics.periodComparison.interests} windowDays={analytics.periodComparison.windowDays} />
              </div>
            </div>
            <Sparkline values={pts.map((p) => p.interests)} color="#8C2D19" />
          </div>
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', fontSize: '11.5px', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
            <span>Accept rate: <strong style={{ color: '#15803D' }}>{analytics.funnel.interestAcceptanceRate}%</strong></span>
            <span>Per member: <strong style={{ color: '#0F172A' }}>{analytics.liquidity.interestsPerMember}</strong></span>
          </div>
        </div>

        {/* Active Retention */}
        <div style={CARD_STYLE}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
              Active Retention
            </span>
            <Activity size={16} color="#1D4ED8" />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D4ED8', lineHeight: 1.1, ...TABULAR }}>
                {analytics.overview.activeUsers7d}
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginLeft: '6px' }}>WAU (7d)</span>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', fontSize: '11px', color: '#475569' }}>
                <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '2px 7px', borderRadius: '999px', fontWeight: 700 }}>
                  {analytics.overview.activeUsers24h} DAU
                </span>
                <span style={{ background: '#F1F5F9', color: '#334155', padding: '2px 7px', borderRadius: '999px', fontWeight: 700 }}>
                  {analytics.overview.activeUsers30d} MAU
                </span>
              </div>
            </div>
            <Sparkline values={pts.map((p) => p.cumulativeMembers)} color="#1D4ED8" />
          </div>
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', fontSize: '11.5px', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
            <span>Live sessions: <strong style={{ color: '#0F172A' }}>{analytics.overview.activeSessions}</strong></span>
            <span>Gender ratio: <strong style={{ color: '#0F172A' }}>{analytics.liquidity.genderRatioLabel}</strong></span>
          </div>
        </div>

        {/* Messaging & Trust Safety */}
        <div style={CARD_STYLE}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
              Dialogue & Trust Safety
            </span>
            <MessageSquare size={16} color="#0E7490" />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1, ...TABULAR }}>
                {analytics.overview.totalMessages}
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginLeft: '6px' }}>messages</span>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', fontSize: '11px' }}>
                <span style={{ background: '#ECFEFF', color: '#0E7490', padding: '2px 7px', borderRadius: '999px', fontWeight: 700 }}>
                  {analytics.overview.totalConversations} chats
                </span>
                <span
                  style={{
                    background: analytics.overview.openGrievances > 0 ? '#FEE2E2' : '#DCFCE7',
                    color: analytics.overview.openGrievances > 0 ? '#991B1B' : '#166534',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    fontWeight: 700,
                  }}
                >
                  {analytics.overview.openGrievances} open reports
                </span>
              </div>
            </div>
            <Sparkline values={pts.map((p) => p.vipLeads + p.shortlists)} color="#0E7490" />
          </div>
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', fontSize: '11.5px', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
            <span>Avg msgs/chat: <strong style={{ color: '#0F172A' }}>{analytics.overview.avgMessagesPerConversation}</strong></span>
            <span>Chai invites: <strong style={{ color: '#0F172A' }}>{analytics.overview.chaiInvitesSent}</strong></span>
          </div>
        </div>
      </div>

      {/* 4. DUAL-MODE INTERACTIVE GROWTH & ACTIVITY CHART */}
      <div style={CARD_STYLE}>
        <SectionTitle
          icon={<TrendingUp size={17} color="#0B241D" />}
          iconBg="#ECFDF5"
          title={`Platform Growth & Activity Telemetry (${range === 'all' ? 'All Time' : `Last ${range.toUpperCase()}`})`}
          subtitle={`Window totals: ${timelineSummary.signups} signups · ${timelineSummary.interests} interests · ${timelineSummary.shortlists} shortlists · ${timelineSummary.vipLeads} VIP leads`}
          right={
            <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <button
                type="button"
                onClick={() => setChartMode('cumulative')}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: chartMode === 'cumulative' ? '#0B241D' : 'transparent',
                  color: chartMode === 'cumulative' ? '#FAF8F5' : '#475569',
                }}
              >
                Cumulative Growth Curve
              </button>
              <button
                type="button"
                onClick={() => setChartMode('stacked')}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: chartMode === 'stacked' ? '#0B241D' : 'transparent',
                  color: chartMode === 'stacked' ? '#FAF8F5' : '#475569',
                }}
              >
                Daily Activity Breakdown
              </button>
            </div>
          }
        />

        {/* Interactive Telemetry Readout Bar */}
        <div
          style={{
            minHeight: '32px',
            marginBottom: '12px',
            padding: '7px 14px',
            borderRadius: '9px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            fontSize: '12px',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            ...TABULAR,
          }}
        >
          {hoveredPoint ? (
            <>
              <strong style={{ color: '#0B241D' }}>
                {hoveredPoint.label} ({hoveredPoint.date})
              </strong>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span>Total Members: <strong style={{ color: '#0B241D' }}>{hoveredPoint.cumulativeMembers}</strong></span>
                <span>Signups: <strong style={{ color: '#15803D' }}>+{hoveredPoint.signups}</strong></span>
                <span>Interests: <strong style={{ color: '#8C2D19' }}>{hoveredPoint.interests}</strong></span>
                <span>Shortlists: <strong style={{ color: '#1D4ED8' }}>{hoveredPoint.shortlists}</strong></span>
                <span>VIP Leads: <strong style={{ color: '#B45309' }}>{hoveredPoint.vipLeads}</strong></span>
              </div>
            </>
          ) : (
            <>
              <span style={{ color: '#64748B' }}>Hover over any date column to inspect exact daily telemetry and cumulative growth.</span>
              {chartMode === 'stacked' && (
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: 700 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#0B241D' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#0B241D' }} /> Signups
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#8C2D19' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8C2D19' }} /> Interests
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#1D4ED8' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#1D4ED8' }} /> Shortlists
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#C59A3F' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#C59A3F' }} /> VIP Leads
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', minWidth: '540px', height: '235px', display: 'block' }}>
            <defs>
              <linearGradient id="emeraldGrowthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0B241D" stopOpacity="0.28" />
                <stop offset="65%" stopColor="#C59A3F" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#C59A3F" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padT + innerH * (1 - ratio)
              const tickVal = Math.round(yMax * ratio)
              return (
                <g key={ratio}>
                  <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="#E2E8F0" strokeDasharray={ratio === 0 ? undefined : '3 3'} />
                  <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94A3B8">
                    {tickVal}
                  </text>
                </g>
              )
            })}

            {chartMode === 'cumulative' ? (
              <>
                {smoothAreaPath && <path d={smoothAreaPath} fill="url(#emeraldGrowthFill)" />}
                {smoothLinePath && (
                  <path d={smoothLinePath} fill="none" stroke="#0B241D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                )}

                {areaCoords.map((c, idx) => {
                  const isHovered = hoveredPointIdx === idx
                  const showLabel = pts.length <= 10 || idx === 0 || idx === pts.length - 1 || idx % Math.ceil(pts.length / 7) === 0
                  return (
                    <g
                      key={c.pt.date}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredPointIdx(idx)}
                      onMouseLeave={() => setHoveredPointIdx(null)}
                    >
                      <rect
                        x={c.x - barStep / 2}
                        y={padT}
                        width={barStep}
                        height={innerH}
                        fill="transparent"
                      />
                      {isHovered && (
                        <line x1={c.x} y1={padT} x2={c.x} y2={padT + innerH} stroke="#C59A3F" strokeWidth="1.5" strokeDasharray="3 3" />
                      )}
                      {(isHovered || pts.length <= 14 || idx === pts.length - 1) && (
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r={isHovered ? 5.5 : 3.2}
                          fill={isHovered ? '#C59A3F' : '#0B241D'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                      )}
                      {showLabel && (
                        <text x={c.x} y={chartH - 10} textAnchor="middle" fontSize="10" fill="#64748B">
                          {c.pt.label}
                        </text>
                      )}
                    </g>
                  )
                })}
              </>
            ) : (
              pts.map((p, idx) => {
                const x = padL + idx * barStep + (barStep - barW) / 2
                const isHovered = hoveredPointIdx === idx
                const showLabel = pts.length <= 10 || idx === 0 || idx === pts.length - 1 || idx % Math.ceil(pts.length / 7) === 0
                const segments = [
                  { val: p.signups, color: '#0B241D' },
                  { val: p.interests, color: '#8C2D19' },
                  { val: p.shortlists, color: '#1D4ED8' },
                  { val: p.vipLeads, color: '#C59A3F' },
                ]
                let cursorY = padT + innerH
                return (
                  <g
                    key={p.date}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPointIdx(idx)}
                    onMouseLeave={() => setHoveredPointIdx(null)}
                  >
                    <rect
                      x={padL + idx * barStep}
                      y={padT}
                      width={barStep}
                      height={innerH}
                      fill={isHovered ? 'rgba(197,154,63,0.08)' : 'transparent'}
                    />
                    {segments.map((seg, sIdx) => {
                      if (seg.val <= 0) return null
                      const segH = Math.max(3, (seg.val / yMax) * innerH)
                      cursorY -= segH
                      return <rect key={sIdx} x={x} y={cursorY} width={barW} height={segH} rx={2} fill={seg.color} />
                    })}
                    {showLabel && (
                      <text x={x + barW / 2} y={chartH - 10} textAnchor="middle" fontSize="10" fill="#64748B">
                        {p.label}
                      </text>
                    )}
                  </g>
                )
              })
            )}
          </svg>
        </div>
      </div>

      {/* 5. MATCHMAKING CONVERSION FUNNEL + VIP CONCIERGE PIPELINE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        <div style={CARD_STYLE}>
          <SectionTitle
            icon={<HeartHandshake size={17} color="#8C2D19" />}
            iconBg="#FEF2F2"
            title="Matchmaking Conversion Funnel"
            subtitle="End-to-end progression from registration to family conversation"
            right={
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '4px 10px', borderRadius: '999px', ...TABULAR }}>
                {analytics.funnel.interestAcceptanceRate}% Accept Rate
              </span>
            }
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {funnelSteps.map((step, idx) => {
              const widthPct = Math.max(step.count > 0 ? 7 : 0, Math.round((step.count / funnelBase) * 100))
              const prevCount = idx > 0 ? funnelSteps[idx - 1].count : null
              const stepConversion =
                prevCount && prevCount > 0 ? Math.min(100, Math.round((step.count / prevCount) * 100)) : null
              return (
                <div key={step.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '5px' }}>
                    <span style={{ color: '#1E293B', fontWeight: 600 }}>
                      <span style={{ color: '#94A3B8', marginRight: '6px', fontWeight: 700 }}>0{idx + 1}</span>
                      {step.label}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', ...TABULAR }}>
                      {stepConversion !== null && (
                        <span style={{ fontSize: '10.5px', color: '#64748B', background: '#F1F5F9', padding: '1px 6px', borderRadius: '999px', fontWeight: 700 }}>
                          {stepConversion}% of prev
                        </span>
                      )}
                      <strong style={{ color: '#0F172A', minWidth: '22px', textAlign: 'right' }}>{step.count}</strong>
                    </div>
                  </div>
                  <div style={{ height: '10px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${widthPct}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${step.color} 0%, ${step.color}CC 100%)`,
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
            {[
              { label: 'PENDING', val: analytics.funnel.interestsPending, bg: '#FFFBEB', fg: '#B45309' },
              { label: 'ACCEPTED', val: analytics.funnel.interestsAccepted, bg: '#F0FDF4', fg: '#15803D' },
              { label: 'DECLINED', val: analytics.funnel.interestsDeclined, bg: '#FEF2F2', fg: '#B91C1C' },
              { label: 'WITHDRAWN', val: analytics.funnel.interestsWithdrawn, bg: '#F8FAFC', fg: '#475569' },
            ].map((st) => (
              <div key={st.label} style={{ background: st.bg, padding: '9px 6px', borderRadius: '9px', textAlign: 'center' }}>
                <div style={{ fontSize: '17px', fontWeight: 800, color: st.fg, ...TABULAR }}>{st.val}</div>
                <small style={{ fontSize: '9.5px', color: st.fg, fontWeight: 700, letterSpacing: '0.04em' }}>{st.label}</small>
              </div>
            ))}
          </div>
        </div>

        {/* Milan Select (VIP) Pipeline */}
        <div style={{ ...CARD_STYLE, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <SectionTitle
              icon={<Crown size={17} color="#B45309" />}
              iconBg="#FEF3C7"
              title="Milan Select (VIP) Revenue Pipeline"
              subtitle="High-intent private concierge matchmaking inquiries"
              right={
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#92400E', background: '#FEF3C7', padding: '4px 10px', borderRadius: '999px', ...TABULAR }}>
                  {analytics.vipPipeline.conversionRate}% Converted
                </span>
              }
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
              <div style={{ padding: '15px 12px', borderRadius: '11px', background: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', ...TABULAR }}>{analytics.vipPipeline.newLeads}</div>
                <small style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>NEW LEADS</small>
              </div>
              <div style={{ padding: '15px 12px', borderRadius: '11px', background: '#FFFBEB', border: '1px solid #FDE68A', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#B45309', ...TABULAR }}>{analytics.vipPipeline.contacted}</div>
                <small style={{ fontSize: '10.5px', color: '#92400E', fontWeight: 700 }}>CONTACTED</small>
              </div>
              <div style={{ padding: '15px 12px', borderRadius: '11px', background: '#F0FDF4', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803D', ...TABULAR }}>{analytics.vipPipeline.converted}</div>
                <small style={{ fontSize: '10.5px', color: '#166534', fontWeight: 700 }}>CONVERTED</small>
              </div>
            </div>

            <strong style={{ display: 'block', fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Inquiries by Concierge Tier
            </strong>
            <HorizontalBarList items={analytics.vipPipeline.byTier} accentColor="#C59A3F" emptyText="No VIP inquiries recorded yet." />
          </div>

          <div
            style={{
              marginTop: '18px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              fontSize: '12px',
              color: '#475569',
            }}
          >
            <span>
              Total concierge inquiries: <strong style={{ color: '#0F172A' }}>{analytics.vipPipeline.total}</strong>
            </span>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('vip')}
                style={{
                  border: 'none',
                  background: '#0B241D',
                  color: '#F4D068',
                  padding: '5px 11px',
                  borderRadius: '7px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Open VIP Queue →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6. LIVE ACTIVITY PULSE + ACTION QUEUE / TOP DEMAND LEADERBOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Live Platform Activity Feed */}
        <div style={CARD_STYLE}>
          <SectionTitle
            icon={<Clock size={17} color="#0B241D" />}
            iconBg="#ECFDF5"
            title="Live Platform Activity Pulse"
            subtitle="Chronological stream of recent signups, interests, shortlists & VIP leads"
          />

          {analytics.recentActivity.length === 0 ? (
            <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '12px 0' }}>No platform events recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
              {analytics.recentActivity.map((ev) => {
                const badgeStyle =
                  ev.type === 'SIGNUP'
                    ? { bg: '#ECFDF5', fg: '#065F46', dot: '#10B981' }
                    : ev.type === 'INTEREST'
                    ? { bg: '#FEF2F2', fg: '#991B1B', dot: '#EF4444' }
                    : ev.type === 'VIP_LEAD'
                    ? { bg: '#FEF3C7', fg: '#92400E', dot: '#D97706' }
                    : { bg: '#EFF6FF', fg: '#1E40AF', dot: '#3B82F6' }
                return (
                  <div
                    key={ev.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#F8FAFC',
                      border: '1px solid #F1F5F9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', minWidth: 0 }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: badgeStyle.dot, marginTop: '5px', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', lineHeight: 1.35 }}>{ev.title}</div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{ev.subtitle}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 7px',
                          borderRadius: '999px',
                          background: badgeStyle.bg,
                          color: badgeStyle.fg,
                          fontSize: '10px',
                          fontWeight: 700,
                        }}
                      >
                        {ev.badge}
                      </span>
                      <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '3px' }}>{formatRelativeTime(ev.timestamp)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Action Queue & Top Marketplace Demand */}
        <div style={CARD_STYLE}>
          <SectionTitle
            icon={<Award size={17} color="#B45309" />}
            iconBg="#FEF3C7"
            title={queueTab === 'pending' ? 'Pending Verification Queue' : 'Top Marketplace Demand'}
            subtitle={queueTab === 'pending' ? 'Unverified profiles waiting for admin badge review' : 'Profiles receiving the most interests & shortlists'}
            right={
              <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setQueueTab('pending')}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: queueTab === 'pending' ? '#0B241D' : 'transparent',
                    color: queueTab === 'pending' ? '#FAF8F5' : '#64748B',
                  }}
                >
                  Pending ({analytics.overview.unverifiedProfiles})
                </button>
                <button
                  type="button"
                  onClick={() => setQueueTab('demand')}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: queueTab === 'demand' ? '#0B241D' : 'transparent',
                    color: queueTab === 'demand' ? '#FAF8F5' : '#64748B',
                  }}
                >
                  Top Demand
                </button>
              </div>
            }
          />

          {queueTab === 'pending' ? (
            analytics.pendingVerifications.length === 0 ? (
              <div style={{ padding: '28px 16px', textAlign: 'center', background: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0', color: '#166534' }}>
                <CheckCircle2 size={24} style={{ margin: '0 auto 6px' }} />
                <strong style={{ display: 'block', fontSize: '13px' }}>All Member Profiles Verified</strong>
                <span style={{ fontSize: '11.5px' }}>Zero profiles are waiting in the verification queue.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analytics.pendingVerifications.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                        {m.name}{' '}
                        <Link href={`/profiles/${m.profileCode}`} target="_blank" style={{ fontSize: '11px', fontFamily: 'monospace', color: '#0B241D', textDecoration: 'none', marginLeft: '4px' }}>
                          {m.profileCode} <ExternalLink size={10} style={{ display: 'inline' }} />
                        </Link>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                        {m.city} · Roots: {m.nativeDistrict} · Joined {formatRelativeTime(m.createdAt)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', background: '#FEF3C7', padding: '2px 8px', borderRadius: '999px', ...TABULAR }}>
                        {m.completion}% complete
                      </span>
                    </div>
                  </div>
                ))}
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('members')}
                    style={{
                      marginTop: '4px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #0B241D',
                      background: '#0B241D',
                      color: '#FAF8F5',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Review & Verify in Member Directory →
                  </button>
                )}
              </div>
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {analytics.topDemandedProfiles.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '12px 0' }}>No member profiles recorded yet.</p>
              ) : (
                analytics.topDemandedProfiles.map((p, idx) => (
                  <div
                    key={p.profileCode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#F8FAFC',
                      border: '1px solid #F1F5F9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: idx === 0 ? '#C59A3F' : '#E2E8F0',
                          color: idx === 0 ? '#0B241D' : '#334155',
                          fontSize: '11px',
                          fontWeight: 800,
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <Link href={`/profiles/${p.profileCode}`} target="_blank" style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}>
                          {p.name}
                        </Link>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          {p.profileCode} · {p.city} · {p.gotra}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontWeight: 700, ...TABULAR }}>
                      <span style={{ background: '#FEF2F2', color: '#8C2D19', padding: '2px 7px', borderRadius: '999px' }}>
                        {p.interestsReceived} ♥
                      </span>
                      <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '2px 7px', borderRadius: '999px' }}>
                        {p.shortlistsReceived} ★
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 7. DEMOGRAPHICS & MARKETPLACE BALANCE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' }}>
        <div style={CARD_STYLE}>
          <SectionTitle
            icon={<PieChart size={17} color="#0B241D" />}
            iconBg="#ECFDF5"
            title="Gender Balance"
            subtitle="Marketplace liquidity & ratio"
            right={
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0B241D', background: '#F1F5F9', padding: '3px 8px', borderRadius: '999px', ...TABULAR }}>
                {analytics.liquidity.genderRatioLabel}
              </span>
            }
          />
          <DonutChart items={analytics.demographics.gender} centerValue={analytics.overview.totalMembers} centerLabel="Members" />
        </div>

        <div style={CARD_STYLE}>
          <SectionTitle
            icon={<Users size={17} color="#1D4ED8" />}
            iconBg="#EFF6FF"
            title="Age Cohorts"
            subtitle="Member age segmentation"
            right={
              <span style={{ fontSize: '11px', color: '#475569', fontWeight: 700, background: '#F8FAFC', padding: '3px 8px', borderRadius: '999px', border: '1px solid #E2E8F0', ...TABULAR }}>
                Avg {analytics.demographics.avgAge} · Med {analytics.demographics.medianAge}
              </span>
            }
          />
          <HorizontalBarList items={analytics.demographics.ageBuckets} accentColor="#1D4ED8" />
        </div>

        <div style={CARD_STYLE}>
          <SectionTitle
            icon={<Layers size={17} color="#8C2D19" />}
            iconBg="#FEF2F2"
            title="Account & Family Composition"
            subtitle="Self vs Parent/Guardian managed accounts"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <HorizontalBarList items={analytics.demographics.accountRoles} accentColor="#8C2D19" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '9px' }}>
                <small style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Account Status
                </small>
                {analytics.demographics.accountStatus.map((st) => (
                  <div key={st.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px', ...TABULAR }}>
                    <span style={{ color: '#334155' }}>{st.label}</span>
                    <strong>{st.count}</strong>
                  </div>
                ))}
              </div>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '9px' }}>
                <small style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Auth Provider
                </small>
                {analytics.demographics.authProviders.map((ap) => (
                  <div key={ap.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px', ...TABULAR }}>
                    <span style={{ color: '#334155' }}>{ap.label}</span>
                    <strong>{ap.count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. MITHILA GEOGRAPHY & CULTURAL LINEAGE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' }}>
        <div style={CARD_STYLE}>
          <SectionTitle icon={<MapPin size={17} color="#0B241D" />} iconBg="#ECFDF5" title="Native Mithila Districts" subtitle="Ancestral roots distribution" />
          <HorizontalBarList items={analytics.geography.topNativeDistricts} accentColor="#0B241D" />
        </div>

        <div style={CARD_STYLE}>
          <SectionTitle icon={<Globe2 size={17} color="#0E7490" />} iconBg="#ECFEFF" title="Current Cities & Diaspora" subtitle="Where members currently reside & work" />
          <HorizontalBarList items={analytics.geography.topCurrentCities} accentColor="#0E7490" />
        </div>

        <div style={CARD_STYLE}>
          <SectionTitle
            icon={<Sparkles size={17} color="#8C2D19" />}
            iconBg="#FEF2F2"
            title="Mithila Lineage & Heritage"
            subtitle="Self-reported cultural demographics"
            right={
              <div style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap' }}>
                {(
                  [
                    { id: 'gotra', label: 'Gotra' },
                    { id: 'mool', label: 'Mool' },
                    { id: 'community', label: 'Community' },
                    { id: 'panji', label: 'Panji' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCulturalTab(t.id)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: culturalTab === t.id ? '1px solid #8C2D19' : '1px solid #E2E8F0',
                      background: culturalTab === t.id ? '#8C2D19' : '#ffffff',
                      color: culturalTab === t.id ? '#ffffff' : '#64748B',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            }
          />
          <HorizontalBarList
            items={
              culturalTab === 'gotra'
                ? analytics.cultural.topGotras
                : culturalTab === 'mool'
                ? analytics.cultural.topMools
                : culturalTab === 'community'
                ? analytics.cultural.communities
                : analytics.cultural.panjiAvailability
            }
            accentColor="#8C2D19"
          />
        </div>
      </div>

      {/* 9. PROFILE QUALITY HEATMAP, CAREER & DPDP PRIVACY COMPLIANCE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' }}>
        <div style={CARD_STYLE}>
          <SectionTitle
            icon={<ShieldCheck size={17} color="#B45309" />}
            iconBg="#FEF3C7"
            title="Profile Completion Heatmap"
            subtitle="Section-by-section drop-off diagnostics"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analytics.completionBreakdown.map((sec) => {
              const barColor = sec.percentage >= 80 ? '#15803D' : sec.percentage >= 50 ? '#C59A3F' : '#DC2626'
              return (
                <div key={sec.section}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#1E293B', fontWeight: 600 }}>{sec.label}</span>
                    <span style={{ color: '#334155', fontWeight: 700, ...TABULAR }}>
                      {sec.completed}/{sec.total} ({sec.percentage}%)
                    </span>
                  </div>
                  <div style={{ height: '7px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${sec.percentage}%`, height: '100%', background: barColor, borderRadius: '999px' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={CARD_STYLE}>
          <SectionTitle
            icon={<Briefcase size={17} color="#0B241D" />}
            iconBg="#ECFDF5"
            title="Education & Career Mix"
            subtitle="Professional & academic profile"
            right={
              <div style={{ display: 'inline-flex', gap: '4px' }}>
                {(
                  [
                    { id: 'sectors', label: 'Sectors' },
                    { id: 'professions', label: 'Professions' },
                    { id: 'qualifications', label: 'Degrees' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCareerTab(t.id)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: careerTab === t.id ? '1px solid #0B241D' : '1px solid #E2E8F0',
                      background: careerTab === t.id ? '#0B241D' : '#ffffff',
                      color: careerTab === t.id ? '#ffffff' : '#64748B',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            }
          />
          <HorizontalBarList
            items={
              careerTab === 'sectors'
                ? analytics.career.workingSectors
                : careerTab === 'professions'
                ? analytics.career.topProfessions
                : analytics.career.topQualifications
            }
            accentColor="#0B241D"
          />
        </div>

        <div style={CARD_STYLE}>
          <SectionTitle
            icon={<Lock size={17} color="#15803D" />}
            iconBg="#F0FDF4"
            title="DPDP Act 2023 & Trust Scorecard"
            subtitle="Verification coverage & member privacy posture"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
            <div style={{ background: '#F8FAFC', borderRadius: '9px', padding: '10px 12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', ...TABULAR }}>{analytics.privacyTrust.emailVerifiedCount}</div>
              <small style={{ fontSize: '11px', color: '#64748B' }}>Email Verified</small>
            </div>
            <div style={{ background: '#F8FAFC', borderRadius: '9px', padding: '10px 12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', ...TABULAR }}>{analytics.privacyTrust.phoneVerifiedCount}</div>
              <small style={{ fontSize: '11px', color: '#64748B' }}>Phone Verified</small>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '9px', padding: '10px 12px', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803D', ...TABULAR }}>{analytics.privacyTrust.identityVerifiedCount}</div>
              <small style={{ fontSize: '11px', color: '#166534' }}>Admin / ID Verified</small>
            </div>
            <div style={{ background: '#EFF6FF', borderRadius: '9px', padding: '10px 12px', border: '1px solid #BFDBFE' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#1D4ED8', ...TABULAR }}>{analytics.privacyTrust.consentLogsRecorded}</div>
              <small style={{ fontSize: '11px', color: '#1E40AF' }}>DPDP Consent Logs</small>
            </div>
          </div>

          <small style={{ display: 'block', fontSize: '10.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Profile Visibility Posture
          </small>
          <HorizontalBarList items={analytics.privacyTrust.profileVisibility} accentColor="#15803D" />
        </div>
      </div>
    </div>
  )
}

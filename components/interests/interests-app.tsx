'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Check, Compass, Heart, MessageCircle, Send, Loader2
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import AuthenticatedShell from '@/components/layout/authenticated-shell'

type InterestItem = {
  id: string
  profileId: string
  name: string
  age: number
  city: string
  profession: string
  nativeDistrict: string
  community: string
  initials: string
  avatar?: string
  date: string
  note?: string
  status: 'pending' | 'accepted' | 'declined'
}

export default function InterestsApp() {
  const { user } = useAuth()
  const [tab, setTab] = useState<'received' | 'sent'>('received')
  const [receivedList, setReceivedList] = useState<InterestItem[]>([])
  const [sentList, setSentList] = useState<InterestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    async function loadInterests() {
      try {
        setLoading(true)
        const [intRes, profRes] = await Promise.all([
          fetch(`/api/interests?userId=${user?.id || 'guest'}`),
          fetch('/api/profiles')
        ])

        const profMap = new Map<string, any>()
        if (profRes.ok) {
          const pData = await profRes.json()
          for (const p of pData.profiles || []) {
            const code = p.profileCode || p.id || p._id
            profMap.set(code, p)
          }
        }

        if (intRes.ok) {
          const iData = await intRes.json()
          
          const mapInterest = (item: any, isReceived = false): InterestItem => {
            const targetId = isReceived ? item.senderId : (item.receiverId || item.targetProfileId)
            const p = profMap.get(targetId) || {}
            return {
              id: item._id,
              profileId: targetId || 'MM-MEMBER',
              name: p.name || p.displayName || targetId || 'Maithil Seeker',
              age: p.age || 27,
              city: p.city || p.currentCity || 'Mithila Region',
              profession: p.profession || p.role || 'Professional',
              nativeDistrict: p.nativeDistrict || 'Mithila',
              community: p.community || 'Maithil community',
              initials: p.name ? p.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'MM',
              avatar: p.photos?.[0] || p.avatar,
              date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent',
              note: item.personalNote || item.note || undefined,
              status: (item.status?.toLowerCase() || 'pending') as any,
            }
          }

          const rawSent = iData.sent || iData.interests || []
          const rawReceived = iData.received || []

          setSentList(rawSent.map((item: any) => mapInterest(item, false)))
          setReceivedList(rawReceived.map((item: any) => mapInterest(item, true)))
        }
      } catch (err) {
        console.error('Failed to load interests from MongoDB:', err)
      } finally {
        setLoading(false)
      }
    }
    loadInterests()
  }, [user])

  const handleAccept = async (id: string, name: string) => {
    try {
      await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ACCEPT', interestId: id }),
      })
      setReceivedList((items) =>
        items.map((item) => (item.id === id ? { ...item, status: 'accepted' } : item))
      )
      showToast(`Interest accepted from ${name}! You can now exchange messages.`)
    } catch {
      showToast('Error accepting interest.')
    }
  }

  const handleDecline = async (id: string, name: string) => {
    try {
      await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DECLINE', interestId: id }),
      })
      setReceivedList((items) =>
        items.map((item) => (item.id === id ? { ...item, status: 'declined' } : item))
      )
      showToast(`Politely declined interest from ${name}.`)
    } catch {
      showToast('Error declining interest.')
    }
  }

  const handleWithdraw = async (id: string, name: string, profileId: string) => {
    try {
      await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE', receiverId: profileId, senderId: user?.id || 'seeker' }),
      })
      setSentList((items) => items.filter((item) => item.id !== id))
      showToast(`Withdrew your interest to ${name}.`)
    } catch {
      showToast('Error withdrawing interest.')
    }
  }

  const activeList = tab === 'received' ? receivedList : sentList

  return (
    <AuthenticatedShell activeKey="interests" breadcrumbTitle="Interests">
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <p className="eyebrow"><span className="eyebrow-line" /> Mutual interest</p>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', margin: '14px 0 10px', fontWeight: 600, color: '#0B241D' }}>
            Your <em>connections.</em>
          </h1>
          <p style={{ color: 'rgba(32,50,44,0.65)', fontSize: '15px', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
            In Mithila Milan, expressing interest is a respectful knock at the door. Conversations only begin when both parties have agreed.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
          <button
            type="button"
            onClick={() => setTab('received')}
            style={{
              background: 'transparent',
              border: 0,
              borderBottom: tab === 'received' ? '2px solid var(--terracotta)' : '2px solid transparent',
              padding: '12px 18px',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '14px',
              fontWeight: 650,
              color: tab === 'received' ? 'var(--terracotta)' : 'rgba(32,50,44,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Heart size={16} /> Received ({receivedList.filter((i) => i.status === 'pending').length} pending)
          </button>
          <button
            type="button"
            onClick={() => setTab('sent')}
            style={{
              background: 'transparent',
              border: 0,
              borderBottom: tab === 'sent' ? '2px solid var(--terracotta)' : '2px solid transparent',
              padding: '12px 18px',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '14px',
              fontWeight: 650,
              color: tab === 'sent' ? 'var(--terracotta)' : 'rgba(32,50,44,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Send size={16} /> Sent ({sentList.length})
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto 12px', color: '#1B4D3E' }} />
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(32,50,44,0.7)' }}>Loading connections from database...</p>
          </div>
        ) : activeList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <p style={{ color: 'rgba(32,50,44,0.6)', fontSize: '16px', margin: '0 0 10px', fontWeight: 600 }}>
              {tab === 'received' ? 'No pending expressions of interest received yet.' : 'No sent expressions of interest yet.'}
            </p>
            <p style={{ color: 'rgba(32,50,44,0.5)', fontSize: '13px', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.5 }}>
              {tab === 'received'
                ? 'When other verified members view your profile and express interest, their polite introductions will appear here.'
                : 'Explore verified candidates across Darbhanga, Madhubani, Saharsa and express thoughtful interest.'}
            </p>
            <Link href="/discover" className="button button-primary">
              Explore Discover profiles ↗
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeList.map((item) => (
              <article
                key={item.id}
                style={{
                  background: 'var(--paper)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto',
                  gap: '24px',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(32,50,44,0.03)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <span
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'var(--sage)',
                        color: 'var(--forest)',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                        fontSize: '15px',
                        letterSpacing: '0.05em',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '2px solid rgba(166,93,63,0.35)',
                        flexShrink: 0,
                      }}
                    >
                      {item.avatar && !item.avatar.includes('placeholder') ? (
                        <Image src={item.avatar} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="48px" />
                      ) : (
                        item.initials
                      )}
                    </span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                        <Link href={`/profiles/${item.profileId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          <h3 style={{ margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', fontWeight: 600 }}>
                            {item.name}, {item.age}
                          </h3>
                        </Link>
                        <span style={{ fontSize: '12px', color: 'rgba(32,50,44,0.5)' }}>{item.profileId}</span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'rgba(32,50,44,0.7)' }}>
                        {item.profession} · {item.city} · Native: {item.nativeDistrict}
                      </p>
                    </div>
                  </div>

                  {item.note && (
                    <blockquote
                      style={{
                        margin: '12px 0 14px',
                        padding: '10px 14px',
                        background: 'var(--cream)',
                        borderLeft: '3px solid var(--terracotta)',
                        fontSize: '13px',
                        color: 'rgba(32,50,44,0.8)',
                        fontStyle: 'italic',
                        borderRadius: '0 4px 4px 0',
                      }}
                    >
                      “{item.note}”
                    </blockquote>
                  )}

                  <div style={{ fontSize: '11px', color: 'rgba(32,50,44,0.45)', display: 'flex', gap: '16px' }}>
                    <span>{item.date}</span>
                    <span>Community: {item.community}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                  {tab === 'received' ? (
                    item.status === 'accepted' ? (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={16} /> Mutual Connection
                        </span>
                        <Link href={`/messages?user=${item.profileId}`} className="button button-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                          <MessageCircle size={14} /> Message
                        </Link>
                      </div>
                    ) : item.status === 'declined' ? (
                      <span style={{ color: 'rgba(32,50,44,0.4)', fontSize: '13px' }}>Declined</span>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="button button-outline"
                          onClick={() => handleDecline(item.id, item.name)}
                          style={{ padding: '9px 16px', fontSize: '12px' }}
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          className="button button-primary"
                          onClick={() => handleAccept(item.id, item.name)}
                          style={{ padding: '9px 18px', fontSize: '12px' }}
                        >
                          <Check size={14} /> Accept Interest
                        </button>
                      </div>
                    )
                  ) : (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: item.status === 'accepted' ? 'var(--sage)' : 'var(--cream)',
                          color: item.status === 'accepted' ? 'var(--forest)' : 'rgba(32,50,44,0.7)',
                        }}
                      >
                        {item.status === 'accepted' ? 'Accepted' : 'Awaiting Reply'}
                      </span>
                      {item.status === 'accepted' ? (
                        <Link href={`/messages?user=${item.profileId}`} className="button button-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                          <MessageCircle size={14} /> Message
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleWithdraw(item.id, item.name, item.profileId)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(32,50,44,0.2)',
                            borderRadius: '999px',
                            padding: '6px 12px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            color: 'rgba(32,50,44,0.6)',
                          }}
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  )}

                  <Link href={`/profiles/${item.profileId}`} style={{ fontSize: '12px', color: 'var(--terracotta)', textDecoration: 'none', fontWeight: 600 }}>
                    View full profile ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--forest)',
            color: 'var(--cream)',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={16} color="#d99a78" /> {toast}
        </div>
      )}
    </AuthenticatedShell>
  )
}

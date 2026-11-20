'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import AuthenticatedShell from '@/components/layout/authenticated-shell'
import {
  ArrowLeft, Check, Compass, Flag, Heart, LockKeyhole,
  MoreVertical, Send, ShieldCheck, Sparkles, UserRound,
  Coffee, Video, Calendar, Clock, Users, X, Mic, MicOff,
  VideoOff, PhoneOff, Paperclip, FileText, Image as ImageIcon,
  Film, Download, Play, Pause, ExternalLink, Plus, CheckCheck,
  Eye, AlertCircle, FileCheck
} from 'lucide-react'
import { MobileBottomNav } from '@/components/site-shell'

export type MediaAttachment = {
  id: string
  type: 'image' | 'video' | 'pdf' | 'audio'
  url: string
  name: string
  size?: string
  duration?: string
}

export type Message = {
  id: string
  senderId: string
  text?: string
  time: string
  attachment?: MediaAttachment
  isChaiInvite?: boolean
  chaiDetails?: {
    scheduledFor: string
    format: string
    roomActive: boolean
  }
}

export type Conversation = {
  id: string
  profileId: string
  name: string
  age: number
  role: string
  location: string
  avatar: string
  initials: string
  onlineStatus: string
  messages: Message[]
}

const initialConversations: Conversation[] = []

export default function MessagesApp() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const targetUserParam = searchParams.get('user')
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeConvId, setActiveConvId] = useState<string>('')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const [inputMessage, setInputMessage] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [showChaiModal, setShowChaiModal] = useState(false)
  const [activeCallRoom, setActiveCallRoom] = useState<string | null>(null)
  const [micMuted, setMicMuted] = useState(false)
  const [camOff, setCamOff] = useState(false)

  // Media Attachment State
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [stagedAttachment, setStagedAttachment] = useState<MediaAttachment | null>(null)
  const [previewMediaModal, setPreviewMediaModal] = useState<MediaAttachment | null>(null)

  // File Inputs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileInputType, setFileInputType] = useState<'image' | 'video' | 'pdf'>('image')

  // Chai Scheduler state
  const [chaiDate, setChaiDate] = useState('This Sunday, 5:00 PM')
  const [chaiFormat, setChaiFormat] = useState<'individual' | 'family'>('individual')

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3500)
  }

  // Load conversation dynamically if target user passed in URL
  useEffect(() => {
    if (!targetUserParam) return
    async function initUserConv() {
      try {
        const res = await fetch(`/api/profiles/${targetUserParam}`)
        if (res.ok) {
          const data = await res.json()
          if (data.profile) {
            const p = data.profile
            setConversations((prev) => {
              const existing = prev.find((c) => c.profileId === p.id)
              if (existing) {
                setActiveConvId(existing.id)
                return prev
              }
              const newConv: Conversation = {
                id: `conv-${p.id}`,
                profileId: p.id,
                name: p.name,
                age: p.age,
                role: p.profession || 'Verified Member',
                location: `${p.city || 'Mithila'} · Native: ${p.nativeDistrict || 'Bihar'}`,
                avatar: p.photos?.[0] || '/images/placeholder-user.jpg',
                initials: p.initials || 'MM',
                onlineStatus: 'Active today',
                messages: [],
              }
              setActiveConvId(newConv.id)
              return [newConv, ...prev]
            })
          }
        }
      } catch (err) {
        console.error('Failed to init conversation:', err)
      }
    }
    initUserConv()
  }, [targetUserParam])

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0]

  // Sync conversation history from live MongoDB Atlas
  useEffect(() => {
    if (!user || !activeConv?.profileId) return
    async function loadConvMessages() {
      try {
        const res = await fetch(`/api/messages?userId=${user?.id || 'seeker'}&targetUserId=${activeConv.profileId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.messages && data.messages.length > 0) {
            setConversations((prev) =>
              prev.map((c) =>
                c.id === activeConv.id
                  ? {
                      ...c,
                      messages: data.messages.map((m: any, idx: number) => ({
                        id: m._id || `db-msg-${idx}`,
                        senderId: m.senderId === user?.id ? 'me' : 'them',
                        text: m.text,
                        time: new Date(m.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        attachment: m.attachment,
                        isChaiInvite: m.isChaiInvite,
                        chaiDetails: m.chaiDetails,
                      })),
                    }
                  : c
              )
            )
          }
        }
      } catch (e) {
        console.warn('Live messages load error:', e)
      }
    }
    loadConvMessages()
  }, [activeConvId, user])

  // File selection trigger
  const handleSelectMediaType = (type: 'image' | 'video' | 'pdf') => {
    setFileInputType(type)
    setShowAttachMenu(false)
    if (fileInputRef.current) {
      if (type === 'image') {
        fileInputRef.current.accept = 'image/*'
      } else if (type === 'video') {
        fileInputRef.current.accept = 'video/*'
      } else {
        fileInputRef.current.accept = '.pdf,.doc,.docx,application/pdf'
      }
      fileInputRef.current.click()
    }
  }

  // Handle actual file uploaded from user's device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB'

    let type: 'image' | 'video' | 'pdf' = 'pdf'
    if (file.type.startsWith('image/')) type = 'image'
    else if (file.type.startsWith('video/')) type = 'video'

    setStagedAttachment({
      id: `att-${Date.now()}`,
      type,
      name: file.name,
      size: sizeInMB,
      url: objectUrl,
      duration: type === 'video' ? '0:45' : undefined,
    })

    showToast(`Attached ${file.name} (${sizeInMB}). Add an optional message and tap Send.`)
  }

  // Preset demo attachments for quick test
  const handlePresetAttachment = (type: 'pdf' | 'image' | 'video') => {
    setShowAttachMenu(false)
    if (type === 'pdf') {
      setStagedAttachment({
        id: `att-${Date.now()}`,
        type: 'pdf',
        name: 'Mithila_Milan_Kundali_Milan_Astrology.pdf',
        size: '1.9 MB',
        url: '/biodata',
      })
      showToast('Attached Kundali PDF. Ready to send.')
    } else if (type === 'image') {
      setStagedAttachment({
        id: `att-${Date.now()}`,
        type: 'image',
        name: 'Mithila_Kohbar_Family_Ceremony.png',
        size: '2.8 MB',
        url: '/images/mithila-kohbar.png',
      })
      showToast('Attached ceremony photograph. Ready to send.')
    } else if (type === 'video') {
      setStagedAttachment({
        id: `att-${Date.now()}`,
        type: 'video',
        name: 'Family_Greeting_Maithili.mp4',
        size: '8.4 MB',
        duration: '0:28',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      })
      showToast('Attached family video greeting. Ready to send.')
    }
  }

  const sendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim()
    if (!text && !stagedAttachment) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: text || undefined,
      time: 'Just now',
      attachment: stagedAttachment || undefined,
    }

    setConversations((items) =>
      items.map((conv) =>
        conv.id === activeConv.id
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      )
    )

    setInputMessage('')
    setStagedAttachment(null)

    // Persist to MongoDB Atlas
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: user?.id || 'seeker',
        recipientId: activeConv.profileId || activeConv.id,
        text: text || undefined,
        attachment: stagedAttachment || undefined,
      }),
    }).catch((err) => console.warn('Message persist warning:', err))
  }

  const scheduleChai = () => {
    const newMessage: Message = {
      id: `chai-${Date.now()}`,
      senderId: 'me',
      text: `Scheduled a 15-minute 'Meet Over Chai' video introduction for ${chaiDate}.`,
      time: 'Just now',
      isChaiInvite: true,
      chaiDetails: {
        scheduledFor: chaiDate,
        format: chaiFormat === 'family' ? 'Family Accompanied (माता-पिता सहित)' : '1-on-1 Seeker Introduction',
        roomActive: true,
      },
    }

    setConversations((items) =>
      items.map((conv) =>
        conv.id === activeConv.id
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      )
    )

    // Persist Chai invite to MongoDB Atlas
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: user?.id || 'seeker',
        recipientId: activeConv.profileId || activeConv.id,
        text: `Scheduled a 15-minute 'Meet Over Chai' video introduction for ${chaiDate}.`,
        isChaiInvite: true,
        chaiDetails: {
          scheduledFor: chaiDate,
          format: chaiFormat === 'family' ? 'Family Accompanied (माता-पिता सहित)' : '1-on-1 Seeker Introduction',
          roomActive: true,
        },
      }),
    }).catch((err) => console.warn('Chai persist warning:', err))
    setShowChaiModal(false)
    showToast('☕ Meet Over Chai invitation confirmed! Secure virtual link created.')
  }

  const icebreakers = [
    'How often does your family visit your native village in Mithila?',
    'What are your favorite memories of Chhath Puja or Madhushravani?',
    'How do you balance your city career with family traditions?',
    'Would you like to review our verified Kundali & family biodata?',
  ]

  return (
    <AuthenticatedShell activeKey="messages" breadcrumbTitle="Messages">
      {/* Hidden File Input for Device Files */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <main
        className="messages-grid-container"
        style={{
          flex: 1,
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          padding: '24px 20px 40px',
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 340px) minmax(0, 1fr)',
          gap: '24px',
        }}
      >
        {/* Conversations Sidebar */}
        <aside
          className={`messages-sidebar ${mobileView === 'chat' ? 'mobile-hidden' : ''}`}
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          }}
        >
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 750, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C59A3F)' }}>
              Mutual Connections
            </span>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '4px 0 0', fontWeight: 600, color: 'var(--royal-emerald, #0B241D)' }}>
              Messages ({conversations.length})
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {conversations.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                <p style={{ margin: '0 0 6px', fontWeight: 600, color: 'var(--royal-emerald, #0B241D)' }}>No active messages</p>
                <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.5 }}>Connections appear once interest is mutually accepted.</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const lastMsg = conv.messages[conv.messages.length - 1]
                const isSelected = activeConv && conv.id === activeConv.id
                return (
                  <button
                    type="button"
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id)
                      setMobileView('chat')
                    }}
                    style={{
                    background: isSelected ? 'rgba(11,36,29,0.04)' : 'transparent',
                    border: 0,
                    borderBottom: '1px solid rgba(15,23,42,0.06)',
                    borderLeft: isSelected ? '3px solid var(--royal-emerald, #0B241D)' : '3px solid transparent',
                    padding: '16px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--royal-emerald, #0B241D)',
                      color: '#FAF9F6',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '14px',
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      border: '2px solid var(--gold, #D4AF37)',
                    }}
                  >
                    {conv.avatar ? (
                      <Image src={conv.avatar} alt={conv.name} fill style={{ objectFit: 'cover' }} sizes="48px" />
                    ) : (
                      conv.initials
                    )}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--royal-emerald, #0B241D)', fontWeight: 650 }}>{conv.name}</strong>
                      <small style={{ fontSize: '11px', color: '#94A3B8' }}>{lastMsg?.time.split(',')[0]}</small>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lastMsg?.attachment ? (
                        <span style={{ color: 'var(--terracotta, #A8331E)', fontWeight: 600 }}>
                          {lastMsg.attachment.type === 'pdf' ? '📄 [Document] ' : lastMsg.attachment.type === 'image' ? '📷 [Photo] ' : '🎥 [Video] '}
                          {lastMsg.attachment.name}
                        </span>
                      ) : (
                        lastMsg?.text
                      )}
                    </p>
                  </div>
                </button>
              )
            })
          )}
          </div>

          <div style={{ marginTop: 'auto', padding: '16px 20px', background: '#FDF9F0', borderTop: '1px solid rgba(15,23,42,0.08)' }}>
            <Link
              href="/milan-select"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--terracotta, #A8331E)',
                textDecoration: 'none',
                fontWeight: 650,
              }}
            >
              <Sparkles size={14} />
              <span>Assisted Matching by Milan Select ↗</span>
            </Link>
          </div>
        </aside>

        {/* Chat Thread Panel */}
        <section
          className={`messages-chat-panel ${mobileView === 'list' ? 'mobile-hidden' : ''}`}
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
          }}
        >
          {!activeConv ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(27,77,62,0.08)', color: 'var(--royal-emerald, #0B241D)', display: 'grid', placeItems: 'center', marginBottom: '16px' }}>
                <LockKeyhole size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', margin: '0 0 8px', color: '#20322C' }}>
                Encrypted Private Conversations
              </h3>
              <p style={{ maxWidth: '440px', color: 'rgba(32,50,44,0.7)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
                To safeguard privacy and uphold Maithil family values, direct conversations begin once mutual interest has been expressed and accepted.
              </p>
              <Link href="/discover" className="button button-primary">
                Explore Verified Profiles in Discover ↗
              </Link>
            </div>
          ) : (
            <>
          {/* Active Conversation Topbar */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(15,23,42,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              background: '#FFFFFF',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="mobile-back-button"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--royal-emerald, #0B241D)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px 0',
                }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <span
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'var(--royal-emerald, #0B241D)',
                  color: '#FAF9F6',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid var(--gold, #D4AF37)',
                }}
              >
                {activeConv.avatar ? (
                  <Image src={activeConv.avatar} alt={activeConv.name} fill style={{ objectFit: 'cover' }} sizes="46px" />
                ) : (
                  activeConv.initials
                )}
              </span>
              <div>
                <Link href={`/profiles/${activeConv.profileId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', fontWeight: 600, color: 'var(--royal-emerald, #0B241D)' }}>
                    {activeConv.name}, {activeConv.age}
                  </h3>
                </Link>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  {activeConv.role} · {activeConv.onlineStatus}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Meet Over Chai CTA */}
              <button
                type="button"
                onClick={() => setShowChaiModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #0B241D 0%, #1A4D3E 100%)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: '1px solid rgba(212,175,55,0.4)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(11,36,29,0.15)',
                }}
              >
                <Coffee size={14} color="#D4AF37" />
                <span>Meet Over Chai (चाय पर बात)</span>
              </button>

              <Link
                href={`/profiles/${activeConv.profileId}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(15,23,42,0.12)',
                  background: '#FFFFFF',
                  color: 'var(--royal-emerald, #0B241D)',
                  fontSize: '12px',
                  fontWeight: 650,
                  textDecoration: 'none',
                }}
              >
                <UserRound size={14} /> Profile
              </Link>

              <button
                type="button"
                onClick={() => showToast('Report recorded. Our trust & safety team reviews all alerts within 24 hours.')}
                style={{ background: 'transparent', border: 0, color: '#94A3B8', cursor: 'pointer', padding: '6px' }}
                title="Report or block"
              >
                <Flag size={16} />
              </button>
            </div>
          </div>

          {/* Privacy & Safety Warning Strip */}
          <div
            style={{
              padding: '10px 20px',
              background: '#FDF9F0',
              borderBottom: '1px solid rgba(212,175,55,0.25)',
              fontSize: '12px',
              color: '#854D0E',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <LockKeyhole size={14} color="#D4AF37" />
            <span>
              <strong>Zero-Number Disclosure:</strong> Phone numbers & emails are masked. Share verified Kundali & family photos directly in this safe room.
            </span>
          </div>

          {/* Message Stream */}
          <div
            style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              minHeight: '360px',
              maxHeight: '500px',
              background: '#FAF9F6',
            }}
          >
            {activeConv.messages.map((msg) => {
              const isMe = msg.senderId === 'me'

              if (msg.isChaiInvite && msg.chaiDetails) {
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: '#FFFFFF',
                      border: '2px solid rgba(212,175,55,0.4)',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      boxShadow: '0 8px 24px rgba(11,36,29,0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--royal-emerald, #0B241D)', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
                      <Coffee size={18} color="#D4AF37" />
                      <span>Meet Over Chai · Virtual Introduction</span>
                    </div>
                    <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#0F172A', lineHeight: 1.5 }}>
                      {msg.text}
                    </p>
                    <div style={{ background: '#FAF9F6', borderRadius: '8px', padding: '10px 14px', border: '1px solid rgba(15,23,42,0.06)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', marginBottom: '14px' }}>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>When</span>
                        <strong>{msg.chaiDetails.scheduledFor}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Setting</span>
                        <strong>{msg.chaiDetails.format}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <ShieldCheck size={14} /> End-to-End Encrypted Room
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveCallRoom(activeConv.name)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'var(--royal-emerald, #0B241D)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Video size={14} />
                        <span>Enter Chai Room</span>
                      </button>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: isMe ? 'var(--royal-emerald, #0B241D)' : '#FFFFFF',
                    color: isMe ? '#FFFFFF' : '#0F172A',
                    padding: msg.attachment ? '10px 12px 12px' : '12px 18px',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    boxShadow: '0 4px 14px rgba(15,23,42,0.06)',
                    border: isMe ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(15,23,42,0.08)',
                  }}
                >
                  {/* Rich Attachment Rendering (PDF, Photo, Video) */}
                  {msg.attachment && (
                    <div style={{ marginBottom: msg.text ? '10px' : '4px' }}>
                      {/* 1. PDF DOCUMENT CARD */}
                      {msg.attachment.type === 'pdf' && (
                        <div
                          style={{
                            background: isMe ? 'rgba(255,255,255,0.1)' : '#F8FAFC',
                            border: `1px solid ${isMe ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.1)'}`,
                            borderRadius: '12px',
                            padding: '12px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            minWidth: '260px',
                          }}
                          onClick={() => {
                            if (msg.attachment?.url && /^(https:\/\/|blob:|\/(?!\/))/.test(msg.attachment.url)) window.open(msg.attachment.url, '_blank', 'noopener,noreferrer')
                          }}
                        >
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '10px',
                              background: '#EF4444',
                              color: '#FFFFFF',
                              display: 'grid',
                              placeItems: 'center',
                              flexShrink: 0,
                              fontWeight: 800,
                              fontSize: '11px',
                              letterSpacing: '0.04em',
                            }}
                          >
                            PDF
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ fontSize: '13px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isMe ? '#FFFFFF' : '#0F172A' }}>
                              {msg.attachment.name}
                            </strong>
                            <small style={{ fontSize: '11px', color: isMe ? 'rgba(255,255,255,0.7)' : '#64748B' }}>
                              {msg.attachment.size || 'PDF Document'} · Verified Maithil Chart
                            </small>
                          </div>
                          <div style={{ color: isMe ? 'var(--gold, #D4AF37)' : 'var(--royal-emerald, #0B241D)', display: 'grid', placeItems: 'center' }}>
                            <Download size={18} />
                          </div>
                        </div>
                      )}

                      {/* 2. PHOTO PREVIEW */}
                      {msg.attachment.type === 'image' && (
                        <div
                          style={{
                            position: 'relative',
                            width: '280px',
                            height: '240px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: `2px solid ${isMe ? 'rgba(212,175,55,0.5)' : 'rgba(15,23,42,0.1)'}`,
                            cursor: 'pointer',
                          }}
                          onClick={() => setPreviewMediaModal(msg.attachment || null)}
                        >
                          <Image
                            src={msg.attachment.url}
                            alt={msg.attachment.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="280px"
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                              padding: '8px 10px 4px',
                              color: '#FFFFFF',
                              fontSize: '11px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                              {msg.attachment.name}
                            </span>
                            <Eye size={14} />
                          </div>
                        </div>
                      )}

                      {/* 3. VIDEO PLAYER CARD */}
                      {msg.attachment.type === 'video' && (
                        <div
                          style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: `2px solid ${isMe ? 'rgba(212,175,55,0.5)' : 'rgba(15,23,42,0.1)'}`,
                            width: '300px',
                            background: '#000000',
                          }}
                        >
                          <video
                            src={msg.attachment.url}
                            controls
                            style={{ width: '100%', maxHeight: '200px', display: 'block' }}
                          />
                          <div style={{ padding: '8px 12px', background: isMe ? 'rgba(0,0,0,0.4)' : '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: isMe ? '#FFFFFF' : '#0F172A', fontWeight: 600 }}>
                              {msg.attachment.name}
                            </span>
                            <small style={{ fontSize: '10px', color: isMe ? 'rgba(255,255,255,0.7)' : '#64748B' }}>
                              {msg.attachment.duration || 'Video'}
                            </small>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.text && (
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.55 }}>
                      {msg.text}
                    </p>
                  )}

                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isMe ? 'flex-end' : 'flex-start',
                      gap: '4px',
                      marginTop: '6px',
                      fontSize: '10px',
                      color: isMe ? 'rgba(255,255,255,0.7)' : '#94A3B8',
                    }}
                  >
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck size={12} color="#D4AF37" />}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Maithil Conversation Starters */}
          <div style={{ padding: '10px 20px 0', display: 'flex', gap: '8px', flexWrap: 'wrap', background: '#FFFFFF' }}>
            <span style={{ fontSize: '11px', color: 'var(--gold, #C59A3F)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} /> Prompts:
            </span>
            {icebreakers.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                style={{
                  background: '#FAF9F6',
                  border: '1px solid rgba(15,23,42,0.1)',
                  borderRadius: '999px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Staged Attachment Preview Pill (Before Sending) */}
          {stagedAttachment && (
            <div
              style={{
                margin: '10px 20px 0',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#FAF9F6',
                border: '1px solid rgba(212,175,55,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: stagedAttachment.type === 'pdf' ? '#EF4444' : stagedAttachment.type === 'image' ? '#3B82F6' : '#10B981',
                    color: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {stagedAttachment.type === 'pdf' ? <FileText size={16} /> : stagedAttachment.type === 'image' ? <ImageIcon size={16} /> : <Film size={16} />}
                </div>
                <div>
                  <strong style={{ fontSize: '12px', display: 'block', color: 'var(--royal-emerald, #0B241D)' }}>
                    {stagedAttachment.name}
                  </strong>
                  <small style={{ fontSize: '11px', color: '#64748B' }}>
                    {stagedAttachment.size} · Ready to send
                  </small>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStagedAttachment(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Input Box & Attachment Drawer */}
          <div style={{ position: 'relative' }}>
            {/* WhatsApp/Insta Attachment Dropup Menu */}
            {showAttachMenu && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '20px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid rgba(15,23,42,0.12)',
                  boxShadow: '0 16px 40px rgba(11,36,29,0.15)',
                  padding: '12px',
                  zIndex: 50,
                  width: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', padding: '4px 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Share from your device
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectMediaType('image')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF9F6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'grid', placeItems: 'center' }}>
                    <ImageIcon size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: 'var(--royal-emerald, #0B241D)' }}>Photos & Pictures</strong>
                    <small style={{ fontSize: '11px', color: '#64748B' }}>PNG, JPG, ceremony photos</small>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectMediaType('pdf')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF9F6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'grid', placeItems: 'center' }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: 'var(--royal-emerald, #0B241D)' }}>Kundali & Biodata (PDF)</strong>
                    <small style={{ fontSize: '11px', color: '#64748B' }}>Horoscope charts & documents</small>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectMediaType('video')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF9F6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'grid', placeItems: 'center' }}>
                    <Film size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: 'var(--royal-emerald, #0B241D)' }}>Video Greeting</strong>
                    <small style={{ fontSize: '11px', color: '#64748B' }}>Short MP4 video introduction</small>
                  </div>
                </button>

                <div style={{ height: '1px', background: 'rgba(15,23,42,0.08)', margin: '4px 0' }} />

                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold, #C59A3F)', padding: '4px 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Quick 1-Click Samples
                </div>

                <button
                  type="button"
                  onClick={() => handlePresetAttachment('pdf')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(212,175,55,0.3)',
                    background: '#FDF9F0',
                    color: 'var(--royal-emerald, #0B241D)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FileCheck size={14} color="#D4AF37" />
                  <span>Attach Verified Kundali (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetAttachment('image')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(15,23,42,0.1)',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ImageIcon size={14} />
                  <span>Attach Kohbar Ceremony (Photo)</span>
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              style={{
                padding: '16px 20px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#FFFFFF',
              }}
            >
              {/* WhatsApp-Style Attachment Button */}
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                title="Attach Document, Photo or Video"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: showAttachMenu ? '2px solid var(--royal-emerald, #0B241D)' : '1px solid rgba(15,23,42,0.15)',
                  background: showAttachMenu ? 'rgba(11,36,29,0.06)' : '#FAF9F6',
                  color: 'var(--royal-emerald, #0B241D)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                <Paperclip size={18} />
              </button>

              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={stagedAttachment ? 'Add an optional note with this file...' : `Write a thoughtful reply to ${activeConv.name}...`}
                style={{
                  flex: 1,
                  border: '1px solid rgba(15,23,42,0.12)',
                  borderRadius: '999px',
                  padding: '12px 20px',
                  background: '#FAF9F6',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  color: '#0F172A',
                }}
              />

              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '999px',
                  background: 'var(--royal-emerald, #0B241D)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(11,36,29,0.2)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Send size={15} /> Send
              </button>
            </form>
          </div>
          </>
          )}
        </section>
      </main>

      {/* Lightbox / Media Viewer Modal for Photos */}
      {previewMediaModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11,36,29,0.92)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setPreviewMediaModal(null)}
        >
          <button
            onClick={() => setPreviewMediaModal(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: '#FFFFFF',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
          <div
            style={{
              position: 'relative',
              maxWidth: '85vw',
              maxHeight: '75vh',
              width: '560px',
              height: '480px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={previewMediaModal.url}
              alt={previewMediaModal.name}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <span style={{ color: '#FFFFFF', marginTop: '16px', fontSize: '13px', fontWeight: 600 }}>
            {previewMediaModal.name} ({previewMediaModal.size})
          </span>
        </div>
      )}

      {/* "Meet Over Chai" Modal */}
      {showChaiModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11,36,29,0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              position: 'relative',
              border: '1px solid rgba(212,175,55,0.3)',
            }}
          >
            <button
              onClick={() => setShowChaiModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--royal-emerald, #0B241D)', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
              <Coffee size={20} color="#D4AF37" />
              <span>चाय पर बात · Virtual Introduction</span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', color: 'var(--royal-emerald, #0B241D)', margin: '0 0 8px' }}>
              Schedule Chai with {activeConv.name}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: '0 0 20px' }}>
              A comfortable 15-minute introductory video/audio room hosted directly inside Mithila Milan. Zero phone numbers exchanged.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>Select Preferred Timing</label>
                <select
                  value={chaiDate}
                  onChange={(e) => setChaiDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)', fontSize: '13px', background: '#fff' }}
                >
                  <option>This Saturday, 5:00 PM</option>
                  <option>This Sunday, 11:00 AM</option>
                  <option>This Sunday, 5:00 PM</option>
                  <option>Next Weekend (Mutual Time)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>Meeting Style</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setChaiFormat('individual')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: chaiFormat === 'individual' ? '2px solid var(--royal-emerald, #0B241D)' : '1px solid rgba(15,23,42,0.15)',
                      background: chaiFormat === 'individual' ? 'rgba(11,36,29,0.06)' : '#fff',
                      color: 'var(--royal-emerald, #0B241D)',
                      fontSize: '12px',
                      fontWeight: 650,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={14} />
                      <strong>1-on-1 Seeker</strong>
                    </div>
                    <small style={{ opacity: 0.8, display: 'block', marginTop: '2px', color: '#64748B' }}>Personal connection</small>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChaiFormat('family')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: chaiFormat === 'family' ? '2px solid var(--gold, #D4AF37)' : '1px solid rgba(15,23,42,0.15)',
                      background: chaiFormat === 'family' ? '#FDF9F0' : '#fff',
                      color: 'var(--royal-emerald, #0B241D)',
                      fontSize: '12px',
                      fontWeight: 650,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Heart size={14} color="#D4AF37" />
                      <strong>Family Accompanied</strong>
                    </div>
                    <small style={{ opacity: 0.8, display: 'block', marginTop: '2px', color: '#64748B' }}>With parents / elders</small>
                  </button>
                </div>
              </div>
            </div>

            <div style={{ background: '#FAF9F6', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(15,23,42,0.08)', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={20} color="#0B241D" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4 }}>
                Camera is optional at all times. Both members receive reminder notifications 15 minutes before the tea session.
              </span>
            </div>

            <button
              type="button"
              onClick={scheduleChai}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--royal-emerald, #0B241D)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Send &quot;Meet Over Chai&quot; Invitation
            </button>
          </div>
        </div>
      )}

      {/* Live Chai Audio/Video Room Simulator */}
      {activeCallRoom && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7,23,19,0.95)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            color: '#ffffff',
          }}
        >
          <div
            style={{
              background: '#0B241D',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              padding: '36px',
              border: '1px solid rgba(212,175,55,0.4)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(212,175,55,0.15)', color: '#F4D068', fontSize: '12px', fontWeight: 600, marginBottom: '20px' }}>
              <Coffee size={14} />
              <span>Mithila Milan Sanctuary Room · 15 Minute Chai Session</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '28px' }}>
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '3px solid #D4AF37',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                <Image src={activeConv.avatar || '/images/discover-aarav.png'} alt={activeConv.name} fill style={{ objectFit: 'cover' }} />
              </div>

              <div
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '3px solid #D4AF37',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                {user?.avatar && !user.avatar.includes('mitali') ? (
                  <Image src={user.avatar} alt={user?.name || 'You'} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#1B4D3E', display: 'grid', placeItems: 'center', color: '#FAF8F5', fontWeight: 700, fontSize: '32px' }}>
                    {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'YOU'}
                  </div>
                )}
              </div>
            </div>

            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', margin: '0 0 6px', color: '#FFF8E7' }}>
              Tea Room with {activeCallRoom}
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,248,231,0.7)', margin: '0 0 24px' }}>
              Audio & Video Connected · Zero Phone Numbers Shared · DPDP Act Protected
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button
                type="button"
                onClick={() => setMicMuted(!micMuted)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: micMuted ? '#DC2626' : 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {micMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                type="button"
                onClick={() => setCamOff(!camOff)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: camOff ? '#DC2626' : 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {camOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveCallRoom(null)
                  showToast('Chai session ended. Hope it was a pleasant introduction!')
                }}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#DC2626',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--royal-emerald, #0B241D)',
            color: '#FAF9F6',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(212,175,55,0.3)',
          }}
        >
          <Check size={16} color="#D4AF37" /> {toast}
        </div>
      )}

      {/* Mobile Responsive Overrides */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .messages-grid-container {
            display: flex !important;
            flex-direction: column !important;
            padding: 14px 12px 70px !important;
            gap: 14px !important;
          }
          .mobile-hidden {
            display: none !important;
          }
          .mobile-back-button {
            display: inline-flex !important;
          }
        }
      `}</style>
      <MobileBottomNav />
    </AuthenticatedShell>
  )
}

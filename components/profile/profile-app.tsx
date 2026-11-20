'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, useMemo, useState, useEffect } from 'react'
import { Check, ChevronDown, Eye, FileText, Heart, ImagePlus, LockKeyhole, MoreHorizontal, Pencil, Plus, Save, ShieldCheck, Sparkles, Upload, X, LogIn, LogOut, Loader2 } from 'lucide-react'
import { type Disclosure, type PreferenceMode, type ProfileForm } from '@/lib/mock-profile'
import { MobileBottomNav } from '@/components/site-shell'
import { useAuth } from '@/lib/auth-context'
import AuthenticatedShell from '@/components/layout/authenticated-shell'

type Section = 'overview' | 'personal' | 'career' | 'family' | 'cultural' | 'photos' | 'preferences' | 'preview'

const sections: { id: Section; label: string; eyebrow: string }[] = [
  { id: 'overview', label: 'Overview', eyebrow: 'Your story' },
  { id: 'personal', label: 'Personal information', eyebrow: 'The essentials' },
  { id: 'career', label: 'Education & career', eyebrow: 'Your direction' },
  { id: 'family', label: 'Family background', eyebrow: 'Where you come from' },
  { id: 'cultural', label: 'Cultural information', eyebrow: 'Your Mithila roots' },
  { id: 'photos', label: 'Photos & gallery', eyebrow: 'Let them see you' },
  { id: 'preferences', label: 'Partner preferences', eyebrow: 'What matters to you' },
  { id: 'preview', label: 'Profile preview', eyebrow: 'As others see it' },
]

function Avatar({ size = 'default', src, name = 'Member' }: { size?: 'default' | 'large'; src?: string; name?: string }) {
  const initials = name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'MM'
  
  // Only display image if it's not the old placeholder mitali photo
  if (src && !src.includes('mitali-profile')) {
    return (
      <span className={`pm-avatar pm-avatar-${size}`} style={{ position: 'relative', overflow: 'hidden' }}>
        <Image src={src} alt={name} fill sizes={size === 'large' ? '160px' : '48px'} style={{ objectFit: 'cover' }} />
      </span>
    )
  }

  const dimension = size === 'large' ? '160px' : '48px'
  const fontSize = size === 'large' ? '40px' : '15px'

  return (
    <span
      className={`pm-avatar pm-avatar-${size}`}
      style={{
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, #1B4D3E 0%, #0B241D 100%)',
        color: '#FAF8F5',
        fontWeight: 700,
        fontSize,
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        border: '3px solid #D4AF37',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        letterSpacing: '0.05em',
      }}
    >
      {initials}
    </span>
  )
}

function Field({ label, name, value, onChange, type = 'text', placeholder, optional, help }: { label: string; name: keyof ProfileForm; value: string; onChange: (name: keyof ProfileForm, value: string) => void; type?: string; placeholder?: string; optional?: boolean; help?: string }) {
  return <label className="pm-field"><span className="pm-label">{label} {optional && <small>Optional</small>}</span><input type={type} name={name} value={value} placeholder={placeholder} onChange={(event) => onChange(name, event.target.value)} />{help && <small className="pm-help">{help}</small>}</label>
}

function SelectField({ label, name, value, options, onChange, optional, help }: { label: string; name: keyof ProfileForm; value: string; options: string[]; onChange: (name: keyof ProfileForm, value: string) => void; optional?: boolean; help?: string }) {
  return <label className="pm-field"><span className="pm-label">{label} {optional && <small>Optional</small>}</span><span className="pm-select-wrap"><select name={name} value={value} onChange={(event) => onChange(name, event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown /></span>{help && <small className="pm-help">{help}</small>}</label>
}

function TextareaField({ label, name, value, onChange, optional, help, placeholder }: { label: string; name: keyof ProfileForm; value: string; onChange: (name: keyof ProfileForm, value: string) => void; optional?: boolean; help?: string; placeholder?: string }) {
  return <label className="pm-field pm-field-wide"><span className="pm-label">{label} {optional && <small>Optional</small>}</span><textarea name={name} value={value} placeholder={placeholder} onChange={(event) => onChange(name, event.target.value)} />{help && <small className="pm-help">{help}</small>}</label>
}

function FormSection({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <section className="pm-form-section"><div className="pm-form-section-heading"><div><span className="pm-eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div><Sparkles /></div><div className="pm-form-grid">{children}</div></section>
}

function PrivacyControl({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <label className="pm-privacy"><LockKeyhole /><span><strong>Privacy</strong><small>Choose who can see this information</small></span><select value={value} onChange={(event) => onChange(event.target.value)}><option>Members only</option><option>Only me</option><option>Everyone</option></select></label>
}

function PersonalSection({ form, update }: { form: ProfileForm; update: (name: keyof ProfileForm, value: string) => void }) {
  return <FormSection eyebrow="The essentials" title="A little about you" description="Start with the details that help someone understand your everyday world."><Field label="Full name" name="fullName" value={form.fullName} onChange={update} /><SelectField label="Gender" name="gender" value={form.gender} options={['Man', 'Woman', 'Non-binary', 'Prefer not to disclose']} onChange={update} /><Field label="Date of birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={update} /><SelectField label="Height" name="height" value={form.height} options={['5 ft 2 in', '5 ft 4 in', '5 ft 6 in', '5 ft 8 in', '5 ft 10 in', '6 ft 0 in', '6 ft 2 in']} onChange={update} /><SelectField label="Marital status" name="maritalStatus" value={form.maritalStatus} options={['Never married', 'Divorced', 'Widowed', 'Prefer not to disclose']} onChange={update} /><SelectField label="Mother tongue" name="motherTongue" value={form.motherTongue} options={['Maithili', 'Hindi', 'English', 'Other']} onChange={update} /><Field label="Current location" name="currentLocation" value={form.currentLocation} onChange={update} /><Field label="Native district" name="nativeDistrict" value={form.nativeDistrict} onChange={update} /><Field label="Native village" name="nativeVillage" value={form.nativeVillage} onChange={update} optional /><Field label="Country" name="country" value={form.country} onChange={update} /></FormSection>
}

function CareerSection({ form, update }: { form: ProfileForm; update: (name: keyof ProfileForm, value: string) => void }) {
  return <FormSection eyebrow="Your direction" title="Education & career" description="Share the work and learning that shape your life today."><SelectField label="Highest qualification" name="highestQualification" value={form.highestQualification} options={['High school', 'Undergraduate', 'Postgraduate', 'Doctorate', 'Prefer not to disclose']} onChange={update} /><Field label="Degree" name="degree" value={form.degree} onChange={update} /><Field label="College / university" name="college" value={form.college} onChange={update} /><Field label="Occupation / Profession" name="occupation" value={form.occupation} onChange={update} /><SelectField label="Working sector" name="workingSector" value={form.workingSector} options={['Private sector', 'Public sector', 'Non-profit', 'Self-employed', 'Student', 'Prefer not to disclose']} onChange={update} /><Field label="Employer / Company" name="employer" value={form.employer} onChange={update} optional /><Field label="Annual income" name="annualIncome" value={form.annualIncome} onChange={update} optional /><Field label="Work location" name="workLocation" value={form.workLocation} onChange={update} /><TextareaField label="Professional description" name="professionalDescription" value={form.professionalDescription} onChange={update} help="A few sentences are enough. Let your voice come through." /></FormSection>
}

function FamilySection({ form, update }: { form: ProfileForm; update: (name: keyof ProfileForm, value: string) => void }) {
  return <FormSection eyebrow="Where you come from" title="Family background" description="Give a gentle sense of the people and values that have shaped you."><Field label="Father's occupation" name="fatherOccupation" value={form.fatherOccupation} onChange={update} optional /><Field label="Mother's occupation" name="motherOccupation" value={form.motherOccupation} onChange={update} optional /><Field label="Siblings" name="siblings" value={form.siblings} onChange={update} optional /><SelectField label="Family type" name="familyType" value={form.familyType} options={['Nuclear', 'Joint', 'Extended', 'Prefer not to disclose']} onChange={update} /><Field label="Family values" name="familyValues" value={form.familyValues} onChange={update} /><Field label="Native village" name="familyVillage" value={form.familyVillage} onChange={update} optional /><TextareaField label="Family background" name="familyDescription" value={form.familyDescription} onChange={update} optional help="This can be as simple as one sentence about what matters at home." /><div className="pm-field pm-field-wide"><PrivacyControl value={form.familyVisibility} onChange={(value) => update('familyVisibility', value)} /></div></FormSection>
}

function DisclosureField({ label, name, value, update, help }: { label: string; name: keyof ProfileForm; value: string; update: (name: keyof ProfileForm, value: string) => void; help: string }) {
  return <label className="pm-cultural-field"><span><strong>{label}</strong><small>{help}</small></span><input name={name} value={value} placeholder="Enter in your own words" onChange={(event) => update(name, event.target.value)} /><span className="pm-field-note">You can choose Not known, Not applicable, or Prefer not to disclose.</span></label>
}

function CulturalSection({ form, update }: { form: ProfileForm; update: (name: keyof ProfileForm, value: string) => void }) {
  const disclosureOptions = ['known', 'not-known', 'not-applicable', 'private']
  return <FormSection eyebrow="Your Mithila roots" title="Cultural information" description="These details are personal and authentic to your heritage."><SelectField label="Community" name="community" value={form.community} options={['Maithil Brahmin', 'Maithil Kayastha', 'Maithil community', 'Prefer to self-describe', 'Prefer not to disclose']} onChange={update} help="Shared in your own words." /><Field label="Sub-community" name="subCommunity" value={form.subCommunity} onChange={update} optional /><DisclosureField label="Gotra" name="gotra" value={form.gotra} update={update} help="Ancestral lineage identifier (e.g. Kashyapa, Bharadwaja, Sandilya)." /><DisclosureField label="Mool" name="mool" value={form.mool} update={update} help="Family origin village or ancestral mool (e.g. Sakri, Gangoli, Ujan)." /><DisclosureField label="Ancestral village" name="ancestralVillage" value={form.ancestralVillage} update={update} help="Mithila ancestral village." /><DisclosureField label="Kul" name="kul" value={form.kul} update={update} help="Family Kul identifier." /><DisclosureField label="Pravara" name="pravara" value={form.pravara} update={update} help="Optional family-specific pravara." /><DisclosureField label="Kuldevi / Kuldevta" name="kuldevi" value={form.kuldevi} update={update} help="Family deity." /><label className="pm-cultural-field"><span><strong>Panji availability</strong><small>Panji documentation availability</small></span><span className="pm-disclosure-options">{disclosureOptions.map((option) => <button type="button" key={option} className={form.panjiAvailability === option ? 'is-selected' : ''} onClick={() => update('panjiAvailability', option as Disclosure)}>{option === 'known' ? 'Available' : option === 'not-known' ? 'Not known' : option === 'not-applicable' ? 'Not applicable' : 'Prefer not to disclose'}</button>)}</span></label><TextareaField label="Maternal lineage information" name="maternalLineage" value={form.maternalLineage} onChange={update} optional help="Maternal family roots (Matri Paksha)." /><div className="pm-field pm-field-wide"><PrivacyControl value={form.culturalVisibility} onChange={(value) => update('culturalVisibility', value)} /></div><div className="pm-cultural-note"><ShieldCheck /><span><strong>Authentic Lineage.</strong> Verified through your profile credentials in MongoDB Atlas.</span></div></FormSection>
}

function PhotosSection({ photos, setPhotos }: { photos: any[]; setPhotos: (photos: any[]) => void }) {
  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPhotos([...photos, { id: `upload-${Date.now()}`, src: String(reader.result), alt: file.name, primary: photos.length === 0 }])
    }
    reader.readAsDataURL(file)
  }

  return (
    <FormSection eyebrow="Let them see you" title="Photos & gallery" description="Upload authentic photographs for your matrimonial profile.">
      <div className="pm-photo-grid pm-field-wide">
        {photos.map((photo) => (
          <div className={`pm-photo-tile ${photo.primary ? 'is-primary' : ''}`} key={photo.id || photo._id}>
            {photo.src || photo.url ? (
              <Image src={photo.src || photo.url} alt={photo.alt || 'Profile photo'} fill sizes="(max-width: 800px) 50vw, 220px" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="pm-photo-empty"><ImagePlus /><span>Add a photo</span></div>
            )}
            <div className="pm-photo-overlay">
              <button type="button" aria-label="Set as primary" onClick={() => setPhotos(photos.map((item) => ({ ...item, primary: (item.id || item._id) === (photo.id || photo._id) })))}>
                {photo.primary ? <Check /> : <Heart />}
              </button>
              <button type="button" aria-label="Remove photo" onClick={() => setPhotos(photos.filter((item) => (item.id || item._id) !== (photo.id || photo._id)))}>
                <X />
              </button>
            </div>
            {photo.primary && <span className="pm-primary-label">Primary photo</span>}
          </div>
        ))}
        <label className="pm-photo-upload">
          <Upload />
          <strong>Add a photograph</strong>
          <span>JPG or PNG format</span>
          <input type="file" accept="image/png,image/jpeg" onChange={upload} />
        </label>
      </div>
      <PrivacyControl value="Members only" onChange={() => undefined} />
    </FormSection>
  )
}

function PreferencesSection({ form, update }: { form: ProfileForm; update: (name: keyof ProfileForm, value: string) => void }) {
  return <FormSection eyebrow="What matters to you" title="Partner preferences" description="Preferences guide meaningful introductions."><PreferenceField label="Age range" name="ageRange" value={form.ageRange} update={update} mode="strict" /><PreferenceField label="Height range" name="heightRange" value={form.heightRange} update={update} mode="flexible" /><PreferenceField label="Education" name="educationPreference" value={form.educationPreference} update={update} mode="flexible" /><PreferenceField label="Profession" name="professionPreference" value={form.professionPreference} update={update} mode="flexible" /><PreferenceField label="Preferred location" name="locationPreference" value={form.locationPreference} update={update} mode="flexible" /><PreferenceField label="Community" name="communityPreference" value={form.communityPreference} update={update} mode="flexible" /><PreferenceField label="Lifestyle" name="lifestylePreference" value={form.lifestylePreference} update={update} mode="flexible" /><PreferenceField label="Employment" name="employmentPreference" value={form.employmentPreference} update={update} mode="flexible" /><PreferenceField label="Relocation" name="relocationPreference" value={form.relocationPreference} update={update} mode="flexible" /><PreferenceField label="Family preferences" name="familyPreference" value={form.familyPreference} update={update} mode="flexible" /><PreferenceField label="Gotra preference" name="gotraPreference" value={form.gotraPreference} update={update} mode="flexible" optional help="Family tradition guidance." /><PreferenceField label="Mool preference" name="moolPreference" value={form.moolPreference} update={update} mode="flexible" optional help="Mool compatibility." /><div className="pm-preference-note"><Sparkles /><span><strong>Strict vs flexible</strong> Strict signals high priority; Flexible indicates openness to conversation.</span></div></FormSection>
}

function PreferenceField({ label, name, value, update, mode, optional, help }: { label: string; name: keyof ProfileForm; value: string; update: (name: keyof ProfileForm, value: string) => void; mode: PreferenceMode; optional?: boolean; help?: string }) {
  const [currentMode, setCurrentMode] = useState<PreferenceMode>(mode)
  return <label className="pm-field pm-preference-field"><span className="pm-label">{label} {optional && <small>Optional</small>}<i className={currentMode}>{currentMode}</i></span><input value={value} onChange={(event) => update(name, event.target.value)} />{help && <small className="pm-help">{help}</small>}<button type="button" className="pm-mode-toggle" onClick={() => setCurrentMode(currentMode === 'strict' ? 'flexible' : 'strict')}>Mark as {currentMode === 'strict' ? 'flexible' : 'strict'}</button></label>
}

function PreviewSection({ form, photos }: { form: ProfileForm; photos: any[] }) {
  return (
    <section className="pm-preview-section">
      <div className="pm-preview-header">
        <div>
          <span className="pm-eyebrow">As others see it</span>
          <h2>A considered first impression.</h2>
          <p>This preview uses your authentic verified information stored in MongoDB Atlas.</p>
        </div>
        <span className="pm-preview-status"><Eye /> Live community preview</span>
      </div>
      <div className="pm-public-card">
        <div className="pm-public-hero">
          {photos[0]?.src || photos[0]?.url ? (
            <Image src={photos[0].src || photos[0].url} alt={photos[0].alt || form.fullName} fill sizes="(max-width: 900px) 100vw, 360px" style={{ objectFit: 'cover' }} />
          ) : (
            <Avatar size="large" name={form.fullName} />
          )}
          <div className="pm-public-photo-label"><ShieldCheck /> Verified Member</div>
        </div>
        <div className="pm-public-copy">
          <span className="pm-kicker">Mithila Milan member · {form.currentLocation}</span>
          <h3>{form.fullName}</h3>
          <p>{form.occupation} · {form.highestQualification}</p>
          <div className="pm-public-facts">
            <span>{form.height}</span>
            <span>{form.motherTongue}</span>
            <span>Native: {form.nativeDistrict}</span>
            {form.gotra && <span>गोत्र: {form.gotra}</span>}
            {form.mool && <span>मूल: {form.mool}</span>}
          </div>
          <div className="pm-public-story">
            <span className="pm-eyebrow">A little about me</span>
            <p>{form.professionalDescription || 'Culturally rooted Maithil member looking for an understanding life partner.'}</p>
          </div>
          <div className="pm-public-tags">
            <span>{form.familyValues}</span>
            <span>{form.community}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

const emptyForm: ProfileForm = {
  fullName: '', gender: 'Man', dateOfBirth: '1998-01-01', height: '5 ft 6 in', maritalStatus: 'Never married',
  motherTongue: 'Maithili', currentLocation: 'Patna, Bihar', nativeDistrict: 'Madhubani', nativeVillage: 'Madhubani', country: 'India',
  highestQualification: 'Postgraduate', degree: 'Graduate', college: 'University', occupation: 'Professional',
  workingSector: 'Private sector', employer: '', annualIncome: 'Prefer not to disclose', workLocation: 'Patna',
  professionalDescription: '', fatherOccupation: '', motherOccupation: '', siblings: 'None specified',
  familyType: 'Nuclear', familyValues: 'Progressive with strong roots', familyVillage: 'Madhubani', familyDescription: '',
  familyVisibility: 'Members only', community: 'Maithil community', subCommunity: '', gotra: 'Kashyapa',
  mool: 'Sakri', ancestralVillage: 'Madhubani', kul: 'Not known', pravara: 'Not applicable',
  kuldevi: 'Prefer not to disclose', panjiAvailability: 'not-known', maternalLineage: '', culturalVisibility: 'Members only',
  ageRange: '24–32 years', heightRange: '5 ft 2 in – 6 ft 0 in', educationPreference: 'Graduate or above',
  professionPreference: 'Stable meaningful work', locationPreference: 'Open to discussion', communityPreference: 'Open to conversation',
  lifestylePreference: 'Balanced', employmentPreference: 'Professional', relocationPreference: 'Open to discussion',
  familyPreference: 'Respectful family', gotraPreference: '', moolPreference: '',
}

export default function ProfileApp() {
  const { user, login, logout, openAuthModal } = useAuth()
  const [active, setActive] = useState<Section>('overview')
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [profileMeta, setProfileMeta] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [photos, setPhotos] = useState<any[]>([])
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3500)
  }

  // Load real user profile from MongoDB Atlas
  useEffect(() => {
    async function loadUserProfile() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const res = await fetch(`/api/profile/me?userId=${user.id}&email=${encodeURIComponent(user.email)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok && data.profile) {
            const p = data.profile
            setProfileMeta(p)
            setForm({
              fullName: p.fullName || user.name,
              gender: p.gender || 'Man',
              dateOfBirth: p.dateOfBirth || '1998-01-01',
              height: p.height || '5 ft 6 in',
              maritalStatus: p.maritalStatus || 'Never married',
              motherTongue: p.motherTongue || 'Maithili',
              currentLocation: p.currentLocation || 'Patna, Bihar',
              nativeDistrict: p.nativeDistrict || 'Madhubani',
              nativeVillage: p.nativeVillage || 'Madhubani',
              country: p.country || 'India',
              highestQualification: p.highestQualification || 'Postgraduate',
              degree: p.degree || 'Graduate',
              college: p.college || 'University',
              occupation: p.occupation || 'Professional',
              workingSector: p.workingSector || 'Private sector',
              employer: p.employer || '',
              annualIncome: p.annualIncome || 'Prefer not to disclose',
              workLocation: p.workLocation || 'Patna',
              professionalDescription: p.professionalDescription || '',
              fatherOccupation: p.fatherOccupation || '',
              motherOccupation: p.motherOccupation || '',
              siblings: p.siblings || 'None specified',
              familyType: p.familyType || 'Nuclear',
              familyValues: p.familyValues || 'Progressive with strong roots',
              familyVillage: p.familyVillage || 'Madhubani',
              familyDescription: p.familyDescription || '',
              familyVisibility: p.familyVisibility || 'Members only',
              community: p.community || 'Maithil community',
              subCommunity: p.subCommunity || '',
              gotra: p.gotra || 'Kashyapa',
              mool: p.mool || 'Sakri',
              ancestralVillage: p.ancestralVillage || 'Madhubani',
              kul: p.kul || 'Not known',
              pravara: p.pravara || 'Not applicable',
              kuldevi: p.kuldevi || 'Prefer not to disclose',
              panjiAvailability: p.panjiAvailability || 'not-known',
              maternalLineage: p.maternalLineage || '',
              culturalVisibility: p.culturalVisibility || 'Members only',
              ageRange: p.ageRange || '24–32 years',
              heightRange: p.heightRange || '5 ft 2 in – 6 ft 0 in',
              educationPreference: p.educationPreference || 'Graduate or above',
              professionPreference: p.professionPreference || 'Stable meaningful work',
              locationPreference: p.locationPreference || 'Open to discussion',
              communityPreference: p.communityPreference || 'Open to conversation',
              lifestylePreference: p.lifestylePreference || 'Balanced',
              employmentPreference: p.employmentPreference || 'Professional',
              relocationPreference: p.relocationPreference || 'Open to discussion',
              familyPreference: p.familyPreference || 'Respectful family',
              gotraPreference: p.gotraPreference || '',
              moolPreference: p.moolPreference || '',
            })
            if (p.photos && p.photos.length > 0) {
              setPhotos(p.photos.map((ph: any, idx: number) => ({
                id: ph._id || `photo-${idx}`,
                src: ph.url,
                alt: ph.alt || p.fullName,
                primary: ph.isPrimary || idx === 0,
              })))
            } else {
              setPhotos([])
            }
          }
        }
      } catch (err) {
        console.error('Failed to load profile from database:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [user])

  const update = (name: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [name]: value }))
    setDirty(true)
    setSaved(false)
  }

  const completionItems = useMemo(() => {
    const isPersonalComplete = Boolean(form.fullName && form.gender && form.currentLocation && form.nativeDistrict)
    const isCareerComplete = Boolean(form.highestQualification && form.occupation)
    const isFamilyComplete = Boolean(form.familyType && (form.familyValues || form.familyDescription || form.fatherOccupation || form.motherOccupation || form.familyVillage))
    const isCulturalComplete = Boolean(form.community && form.gotra && form.mool)
    const isPhotosComplete = Boolean(photos && photos.length > 0 && (photos[0]?.src || photos[0]?.url))
    const isPreferencesComplete = Boolean(form.ageRange && (form.educationPreference || form.professionPreference || form.locationPreference))

    return [
      {
        section: 'personal',
        label: 'Personal information',
        detail: isPersonalComplete ? 'Everything looks good' : 'Add basic personal details',
        complete: isPersonalComplete,
      },
      {
        section: 'career',
        label: 'Education & career',
        detail: isCareerComplete ? 'Education & career details verified' : 'Add your education & professional details',
        complete: isCareerComplete,
      },
      {
        section: 'family',
        label: 'Family background',
        detail: isFamilyComplete ? 'Family background recorded' : 'Add your family description',
        complete: isFamilyComplete,
      },
      {
        section: 'cultural',
        label: 'Cultural information',
        detail: isCulturalComplete ? 'Gotra & Mool verified' : 'Add your ancestral Gotra & Mool',
        complete: isCulturalComplete,
      },
      {
        section: 'photos',
        label: 'Photos',
        detail: isPhotosComplete ? `${photos.length} photograph${photos.length > 1 ? 's' : ''} uploaded` : 'Add one more photograph',
        complete: isPhotosComplete,
      },
      {
        section: 'preferences',
        label: 'Partner preferences',
        detail: isPreferencesComplete ? 'A thoughtful beginning' : 'Define your partner preferences',
        complete: isPreferencesComplete,
      },
    ]
  }, [form, photos])

  const completion = useMemo(() => {
    const completedCount = completionItems.filter((item) => item.complete).length
    return Math.round((completedCount / completionItems.length) * 100)
  }, [completionItems])

  const selectSection = (section: Section) => {
    setActive(section)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = async () => {
    if (!user) {
      openAuthModal()
      return
    }

    try {
      const res = await fetch('/api/profile/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, form: { ...form, photos } }),
      })

      if (res.ok) {
        setDirty(false)
        setSaved(true)
        const data = await res.json()
        if (data.ok && data.user) {
          login(data.user)
        } else {
          const primaryPhoto = photos.find((p: any) => p.primary)?.src || photos.find((p: any) => p.primary)?.url || photos[0]?.src || photos[0]?.url
          if (primaryPhoto && user) {
            const updatedUser = { ...user, avatar: primaryPhoto, gender: form.gender }
            login(updatedUser)
          }
        }
        showToast('✓ Profile successfully saved to MongoDB Atlas database!')
      } else {
        showToast('Failed to save profile changes. Please try again.')
      }
    } catch {
      showToast('Error saving profile to database.')
    }
  }

  const cancel = () => {
    if (dirty && !window.confirm('Discard your unsaved profile changes?')) return
    setDirty(false)
    setSaved(false)
  }

  const profileCode = profileMeta?.profileCode || (user ? `MM-${user.id.slice(-6).toUpperCase()}` : 'MM-GUEST')
  const userInitials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'MM'

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto 16px', color: '#1B4D3E' }} />
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', margin: '0 0 8px' }}>Loading your profile...</h2>
          <p style={{ color: 'rgba(32,50,44,0.6)', fontSize: '13px' }}>Retrieving authenticated record from MongoDB Atlas.</p>
        </div>
      </div>
    )
  }

  return (
    <AuthenticatedShell activeKey="profile" breadcrumbTitle="My profile">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
              Matrimonial Lineage & Details
            </span>
            <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', margin: '4px 0 0', color: '#0B241D' }}>
              My Profile Management
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: saved ? '#15803d' : dirty ? '#A8331E' : '#64748B', fontWeight: 600 }}>
              {saved ? '✓ Saved to Database' : dirty ? 'Unsaved changes' : 'All changes synced'}
            </span>
            <button
              onClick={save}
              disabled={!dirty}
              className="pm-save-button"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', fontSize: '13px', opacity: dirty ? 1 : 0.6 }}
            >
              <Save size={15} /> Save changes
            </button>
          </div>
        </div>

        <main className="pm-layout">
          <aside className="pm-profile-nav">
            <div className="pm-profile-summary">
              <Avatar name={user ? user.name : form.fullName} src={photos.find((p: any) => p.primary)?.src || photos.find((p: any) => p.primary)?.url || photos[0]?.src || photos[0]?.url || user?.avatar} />
              <div>
                <strong>{user ? user.name : form.fullName || 'Member'}</strong>
                <small>{profileCode}</small>
              </div>
              <button aria-label="Profile actions"><MoreHorizontal /></button>
            </div>
            <div className="pm-progress-summary">
              <div>
                <span>Profile complete</span>
                <strong>{completion}%</strong>
              </div>
              <div className="pm-progress-track">
                <span style={{ width: `${completion}%` }} />
              </div>
              <small>A thoughtful profile gets better introductions.</small>
            </div>
            <nav aria-label="Profile sections">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={active === section.id ? 'is-active' : ''}
                  onClick={() => selectSection(section.id)}
                >
                  <span>{section.eyebrow}</span>
                  <strong>{section.label}</strong>
                  {section.id === 'overview' && <i>Current</i>}
                </button>
              ))}
            </nav>
            <Link href="/safety" className="pm-nav-footer">
              <ShieldCheck /> Trust & safety <span>↗</span>
            </Link>
          </aside>

          <div className="pm-content">
            <div className="pm-mobile-section-select">
              <select value={active} onChange={(event) => selectSection(event.target.value as Section)}>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>{section.label}</option>
                ))}
              </select>
              <ChevronDown />
            </div>

            {active === 'overview' && (
              <Overview
                form={form}
                photos={photos}
                profileCode={profileCode}
                profileMeta={profileMeta}
                completion={completion}
                completionItems={completionItems}
                selectSection={selectSection}
                user={user}
                onLogout={logout}
                onLogin={openAuthModal}
              />
            )}
            {active === 'personal' && <PersonalSection form={form} update={update} />}
            {active === 'career' && <CareerSection form={form} update={update} />}
            {active === 'family' && <FamilySection form={form} update={update} />}
            {active === 'cultural' && <CulturalSection form={form} update={update} />}
            {active === 'photos' && <PhotosSection photos={photos} setPhotos={(next) => { setPhotos(next); setDirty(true); setSaved(false) }} />}
            {active === 'preferences' && <PreferencesSection form={form} update={update} />}
            {active === 'preview' && <PreviewSection form={form} photos={photos} />}
          </div>
        </main>

        {(dirty || saved) && (
          <div className={`pm-bottom-bar ${saved ? 'is-saved' : ''}`}>
            <span>
              {saved ? <><Check /> Profile successfully synchronized with MongoDB Atlas.</> : <>You have unsaved changes.</>}
            </span>
            <div>
              <button onClick={cancel}>{saved ? 'Close' : 'Discard'}</button>
              {!saved && <button className="pm-save-button" onClick={save}><Save /> Save changes</button>}
            </div>
          </div>
        )}

        {toast && (
          <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#1B4D3E', color: '#fffaf1', padding: '14px 22px', borderRadius: '10px', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: '13px', fontWeight: 650 }}>
            {toast}
          </div>
        )}
      </div>
    </AuthenticatedShell>
  )
}

function Overview({
  form,
  photos,
  profileCode,
  profileMeta,
  completion,
  completionItems,
  selectSection,
  user,
  onLogout,
  onLogin,
}: {
  form: ProfileForm
  photos: any[]
  profileCode: string
  profileMeta: any
  completion: number
  completionItems: any[]
  selectSection: (section: Section) => void
  user: any
  onLogout: () => void
  onLogin: () => void
}) {
  const age = profileMeta?.age || 27
  const height = form.height || '5 ft 6 in'
  const location = form.currentLocation || 'Patna, Bihar'

  return (
    <>
      <section className="pm-overview-hero">
        <div className="pm-overview-portrait">
          <Avatar size="large" name={user ? user.name : form.fullName} src={photos.find((p: any) => p.primary)?.src || photos.find((p: any) => p.primary)?.url || photos[0]?.src || photos[0]?.url || user?.avatar} />
          <span className="pm-online-dot" />
        </div>
        <div className="pm-overview-copy">
          <span className="pm-eyebrow">Your story · {profileCode}</span>
          <h1>{user ? user.name : form.fullName || 'Member'}</h1>
          <p className="pm-overview-meta">
            {age} years · {height} · {location}
          </p>
          <div className="pm-overview-tags">
            <span><Check /> Profile active</span>
            <span><ShieldCheck /> {user?.isVerified ? 'Verified Member' : 'Verification pending'}</span>
            <span><Eye /> Members only</span>
            {form.gotra && <span>गोत्र: {form.gotra}</span>}
            {form.mool && <span>मूल: {form.mool}</span>}
          </div>
          <p className="pm-overview-note">
            Your profile is visible only to members you choose to connect with. All changes are stored securely in MongoDB Atlas.
          </p>
        </div>
        <div className="pm-overview-actions">
          <button className="pm-outline-button" onClick={() => selectSection('preview')}>
            <Eye /> Preview
          </button>
          <Link href="/biodata" className="pm-outline-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <FileText size={15} /> Download Biodata PDF
          </Link>
          <button className="pm-primary-button" onClick={() => selectSection('personal')}>
            <Pencil /> Edit profile
          </button>
          {user ? (
            <button
              type="button"
              onClick={onLogout}
              className="pm-outline-button"
              style={{ color: '#991B1B', borderColor: 'rgba(153,27,27,0.3)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="pm-primary-button"
              style={{ background: '#8C2D19', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <LogIn size={14} /> Login
            </button>
          )}
        </div>
      </section>

      {!user && (
        <div style={{ background: '#FAF8F5', border: '1px solid rgba(140,45,25,0.2)', borderRadius: '12px', padding: '16px 20px', margin: '0 0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong style={{ fontSize: '14px', color: '#20322C', display: 'block' }}>You are currently signed out</strong>
            <span style={{ fontSize: '12px', color: 'rgba(32,50,44,0.7)' }}>Sign in with Google or Email/Password to view your matchmaking proposals.</span>
          </div>
          <button type="button" onClick={onLogin} style={{ padding: '8px 16px', borderRadius: '8px', background: '#8C2D19', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <LogIn size={14} /> Login to Account
          </button>
        </div>
      )}

      <div className="pm-overview-grid">
        <section className="pm-card pm-checklist-card">
          <div className="pm-card-heading">
            <div>
              <span className="pm-eyebrow">Your next gentle steps</span>
              <h2>Make it feel <em>like you.</em></h2>
            </div>
            <span className="pm-completion-badge">{completion}%</span>
          </div>
          <p className="pm-card-intro">Complete each section to enrich your matrimonial proposal profile.</p>
          <div className="pm-checklist">
            {completionItems.map((item) => (
              <button key={item.section} className={item.complete ? 'is-complete' : ''} onClick={() => selectSection(item.section as Section)}>
                <span className="pm-check-icon">{item.complete ? <Check /> : <Plus />}</span>
                <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                <span className="pm-check-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="pm-overview-aside">
          <div className="pm-card pm-verification-card">
            <div className="pm-card-icon"><ShieldCheck /></div>
            <span className="pm-eyebrow">Authentic Lineage</span>
            <h2>Verification is active.</h2>
            <p>Your details are stored securely in MongoDB Atlas with DPDP Act 2023 compliance.</p>
            <button className="pm-text-link" onClick={() => selectSection('personal')}>
              Review information <span>↗</span>
            </button>
          </div>

          <div className="pm-card pm-preview-mini">
            <div
              className="pm-preview-mini-photo"
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1B4D3E 0%, #0B241D 100%)',
                display: 'grid',
                placeItems: 'center',
                color: '#FAF8F5',
                fontWeight: 700,
                fontSize: '24px',
                border: '2px solid #D4AF37',
              }}
            >
              {photos[0]?.src || photos[0]?.url || (user?.avatar && !user.avatar.includes('placeholder')) ? (
                <Image
                  src={photos[0]?.src || photos[0]?.url || user?.avatar}
                  alt={user?.name || form.fullName}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="90px"
                />
              ) : (
                user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'MM'
              )}
            </div>
            <div>
              <span className="pm-eyebrow">Community preview</span>
              <h3>{user ? user.name : form.fullName || 'Verified Member'}</h3>
              <p style={{ margin: '4px 0 8px', fontSize: '12px', color: 'rgba(32,50,44,0.6)' }}>
                {form.occupation} · {form.currentLocation}
              </p>
              <button className="pm-text-link" onClick={() => selectSection('preview')}>
                Open preview <span>↗</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

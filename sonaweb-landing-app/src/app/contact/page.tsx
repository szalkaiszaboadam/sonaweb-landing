'use client'

import { useState, useRef, useEffect, type FormEvent, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Footer } from '@/components/footer'

// ---------- ADATOK ----------
const SERVICES_DATA = [
  {
    id: 'web',
    title: 'WEBFEJLESZTÉS',
    heading: 'MIRE VAN SZÜKSÉGED?',
    subServices: ['UX / UI DESIGN', 'VÁLLALATI WEBOLDAL', 'LANDING PAGE', 'WEBSHOP & E-KERESKEDELEM', 'EGYEDI WEBES PLATFORMOK', 'HOSTING & KARBANTARTÁS'],
  },
  {
    id: 'content',
    title: 'TARTALOMGYÁRTÁS',
    heading: 'MILYEN TARTALOMRA?',
    subServices: ['KREATÍV KONCEPCIÓ', 'PRECÍZIÓS SZÖVEGÍRÁS', 'REKLÁMFILM & FOTÓZÁS', 'RÖVID VIDEÓK (TIKTOK)', 'GRAFIKAI TERVEZÉS', 'ANIMÁCIÓ'],
  },
  {
    id: 'ads',
    title: 'HIRDETÉSKEZELÉS',
    heading: 'HOL HIRDETNÉL?',
    subServices: ['META KAMPÁNYOK', 'GOOGLE ADS', 'TIKTOK ADS', 'RETARGETING STRATÉGIA', 'KONVERZIÓ OPTIMALIZÁLÁS', 'ANALITIKA & RIPORTÁLÁS'],
  },
  {
    id: 'brand',
    title: 'MÁRKASTRATÉGIA',
    heading: 'MIN DOLGOZZUNK?',
    subServices: ['MÁRKA ARCHITEKTÚRA', 'POZICIONÁLÁS', 'BRAND IDENTITY', 'KOMMUNIKÁCIÓS STRATÉGIA', 'NAMING (NÉVADÁS)', 'PIACKUTATÁS'],
  },
]

const TIMELINE_OPTIONS = [
  '1-2 HÓNAPON BELÜL',
  '3-6 HÓNAP MÚLVA',
  'IDÉN, DE RÁÉR',
  'NINCS FIX DÁTUM'
]

const BUDGET_OPTIONS = [
  '500 EZER FT ALATT',
  '500 EZER - 1.5 MILLIÓ FT',
  '1.5 - 3 MILLIÓ FT',
  '3 MILLIÓ FT FELETT',
  'MÉG KÉPLÉKENY'
]

type Flow = 'none' | 'project' | 'message' | 'team'
type Status = 'idle' | 'sending' | 'sent' | 'error'
type FormState = { name: string; email: string; phone: string; message: string }

const EMPTY_FORM: FormState = { name: '', email: '', phone: '', message: '' }
const EASE = [0.16, 1, 0.3, 1] as const
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// ---------- STÍLUSOK ----------
const HEADING =
  'font-display text-[clamp(2.5rem,7vw,100px)] font-extrabold uppercase leading-[1.1] tracking-[-1px] md:tracking-[-3px] text-white text-center mb-10 md:mb-14 max-w-[1000px]'

const LABEL = 'font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase'

// JAVÍTÁS: Levettük az 'uppercase'-t a beírt szövegről, de a placeholder nagybetűs marad. 
// A méretezés és a betűtípus teljesen megegyezik az eredetivel.
const FIELD =
  'font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold w-full bg-transparent border-b px-0 py-4 text-white placeholder:text-[#606060] placeholder:uppercase focus:outline-none transition-colors'

// ---------- KISEBB KOMPONENSEK ----------
function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex overflow-hidden my-[-2px] py-[2px]">
      <span className="inline-flex items-center whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute left-0 inline-flex items-center whitespace-nowrap translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  )
}

function PrimaryButton({
  children, onClick, type = 'button', disabled,
}: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${LABEL} group inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-[#0a0a0a] overflow-hidden transition-opacity duration-300 disabled:opacity-25 disabled:pointer-events-none`}
    >
      <Roll>{children}</Roll>
    </button>
  )
}

function GhostButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`${LABEL} text-[#606060] hover:text-white transition-colors px-2 py-3.5`}>
      {children}
    </button>
  )
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10">{children}</div>
}

// JAVÍTÁS: Auto-expanding textarea (automatikusan növekvő szövegmező görgetés helyett)
function Field({
  label, value, onChange, error, type = 'text', multiline = false, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string
  type?: string; multiline?: boolean; autoComplete?: string
}) {
  const cls = `${FIELD} ${error ? 'border-[#BF2234]' : 'border-white/10 focus:border-white'}`
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Ez a hatás felel azért, hogy a szövegmező automatikusan növekedjen gépeléskor
  useEffect(() => {
    if (multiline && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value, multiline])

  return (
    <label className="block w-full text-left">
      <span className="sr-only">{label}</span>
      {multiline ? (
        <textarea
          ref={textareaRef}
          placeholder={label}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={2}
          className={`${cls} resize-none overflow-hidden leading-[1.6]`}
        />
      ) : (
        <input
          type={type}
          placeholder={label}
          value={value}
          autoComplete={autoComplete}
          onChange={e => onChange(e.target.value)}
          aria-invalid={!!error}
          className={cls}
        />
      )}
      <span className={`block h-4 mt-1.5 font-inter text-[11px] tracking-[-0.2px] font-semibold uppercase text-[#BF2234] transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>
        {error}
      </span>
    </label>
  )
}

function Option({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`${LABEL} md:text-[16px] md:leading-[16px] px-3 py-2.5 focus:outline-none focus-visible:text-white transition-colors ${
        selected ? 'text-white' : 'text-[#606060] hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

function OptionGrid({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 md:gap-x-5 w-full max-w-3xl">{children}</div>
}

// ---------- OLDAL ----------
export default function ContactPage() {
  const [flow, setFlow] = useState<Flow>('none')
  const [step, setStep] = useState(0)
  
  const [selectedMainIds, setSelectedMainIds] = useState<string[]>([])
  const [selectedSubServices, setSelectedSubServices] = useState<Record<string, string[]>>({})
  const [timeline, setTimeline] = useState<string | null>(null)
  const [budget, setBudget] = useState<string | null>(null)
  
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<Status>('idle')

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const toggleMain = (id: string) =>
    setSelectedMainIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      return SERVICES_DATA.map(s => s.id).filter(i => next.includes(i))
    })

  const toggleSub = (mainId: string, sub: string) =>
    setSelectedSubServices(prev => {
      const cur = prev[mainId] || []
      return { ...prev, [mainId]: cur.includes(sub) ? cur.filter(n => n !== sub) : [...cur, sub] }
    })

  const setField = (key: keyof FormState) => (value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const reset = () => {
    setFlow('none')
    setStep(0)
    setSelectedMainIds([])
    setSelectedSubServices({})
    setTimeline(null)
    setBudget(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setStatus('idle')
  }

  const goNext = () => {
    if (step === 0 && selectedMainIds.length === 0) return
    setStep(s => s + 1)
    scrollTop()
  }

  const goBack = () => {
    if (step === 0) reset()
    else setStep(s => Math.max(0, s - 1))
    scrollTop()
  }

  const validate = () => {
    const e: Partial<FormState> = {}
    if (form.name.trim().length < 2) e.name = 'KÉRLEK ADD MEG A NEVED'
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'ÉRVÉNYES E-MAIL CÍM KELL'
    if (flow !== 'project' && form.message.trim().length < 5) e.message = 'ÍRJ LEGALÁBB PÁR SZÓT'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (status === 'sending' || !validate()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: flow,
          ...form,
          timeline,
          budget,
          services: flow === 'project'
            ? selectedMainIds.map(id => ({
                category: SERVICES_DATA.find(s => s.id === id)?.title,
                items: selectedSubServices[id] || [],
              }))
            : undefined,
        }),
      })
      if (!res.ok) throw new Error('send failed')
      setStatus('sent')
      scrollTop()
    } catch {
      setStatus('error')
    }
  }

  const totalSteps = selectedMainIds.length + 4
  const progress = flow === 'project' ? ((step + 1) / totalSteps) * 100 : 0
  
  const isTimelineStep = step === selectedMainIds.length + 1
  const isBudgetStep = step === selectedMainIds.length + 2
  const isFinalStep = step === selectedMainIds.length + 3
  
  const currentCategory =
    step > 0 && step <= selectedMainIds.length ? SERVICES_DATA.find(s => s.id === selectedMainIds[step - 1]) : undefined

  const viewKey =
    status === 'sent' ? 'sent'
    : flow === 'none' ? 'none'
    : flow === 'message' ? 'message'
    : flow === 'team' ? 'team'
    : isFinalStep ? 'final'
    : isBudgetStep ? 'budget'
    : isTimelineStep ? 'timeline'
    : `step-${step}`

  const contactFields = () => (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1 w-full max-w-2xl mt-10">
      <Field label="NEVED" value={form.name} onChange={setField('name')} error={errors.name} autoComplete="name" />
      <Field label="E-MAIL CÍMED" type="email" value={form.email} onChange={setField('email')} error={errors.email} autoComplete="email" />
      <Field label="TELEFONSZÁM (NEM KÖTELEZŐ)" type="tel" value={form.phone} onChange={setField('phone')} autoComplete="tel" />
      <Field
        label={flow === 'team' ? 'MESÉLJ MAGADRÓL ÉS ARRÓL, MIBEN VAGY JÓ' : flow === 'message' ? 'MIBEN SEGÍTHETÜNK?' : 'PÁR SZÓ A PROJEKTRŐL (NEM KÖTELEZŐ)'}
        multiline
        value={form.message}
        onChange={setField('message')}
        error={errors.message}
      />
      {status === 'error' && (
        <p role="alert" className="font-inter text-[12px] tracking-[-0.2px] font-semibold uppercase text-[#BF2234] text-center mt-2">
          NEM SIKERÜLT ELKÜLDENI. PRÓBÁLD ÚJRA KICSIT KÉSŐBB.
        </p>
      )}
      <Actions>
        <GhostButton onClick={flow === 'project' ? goBack : reset}>VISSZA</GhostButton>
        <PrimaryButton type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'KÜLDÖM...' : 'ELKÜLDÖM'}
        </PrimaryButton>
      </Actions>
    </form>
  )

  return (
    <div className="w-full flex flex-col bg-[#0a0a0a] text-white font-inter selection:bg-[#BF2234]">
      
      {/* VÉKONY PIROS PROGRESS BAR */}
      {flow === 'project' && status !== 'sent' && (
        <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
          <motion.div
            className="h-full bg-[#BF2234]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
      )}

      <div className="min-h-[100svh] w-full flex flex-col relative">
        <div className="h-28 md:h-36 w-full shrink-0" />

        <main className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 w-full max-w-[1600px] mx-auto pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewKey}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="w-full flex flex-col items-center justify-center text-center"
            >
              {/* KEZDŐ */}
              {viewKey === 'none' && (
                <>
                  <h1 className={HEADING}>MIVEL KEZDJÜK?</h1>
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6">
                    <PrimaryButton onClick={() => setFlow('project')}>ÚJ PROJEKT</PrimaryButton>
                    <PrimaryButton onClick={() => setFlow('message')}>KÉRDÉSEM VAN</PrimaryButton>
                    <PrimaryButton onClick={() => setFlow('team')}>CSAPATBA JELENTKEZEM</PrimaryButton>
                  </div>
                </>
              )}

              {/* SIMA ÜZENET */}
              {(viewKey === 'message' || viewKey === 'team') && (
                <>
                  <h1 className={HEADING}>{viewKey === 'team' ? 'LEGYÉL A CSAPAT RÉSZE' : 'MESÉLJ NEKÜNK'}</h1>
                  {contactFields()}
                </>
              )}

              {/* 1. LÉPÉS: FŐSZOLGÁLTATÁSOK */}
              {viewKey === 'step-0' && (
                <>
                  <h1 className={HEADING}>MI LENNE A PROJEKT?</h1>
                  <OptionGrid>
                    {SERVICES_DATA.map(s => (
                      <Option key={s.id} label={s.title} selected={selectedMainIds.includes(s.id)} onClick={() => toggleMain(s.id)} />
                    ))}
                  </OptionGrid>
                  <Actions>
                    <GhostButton onClick={goBack}>VISSZA</GhostButton>
                    <PrimaryButton onClick={goNext} disabled={selectedMainIds.length === 0}>KÖVETKEZŐ</PrimaryButton>
                  </Actions>
                </>
              )}

              {/* 2...N LÉPÉS: ALSZOLGÁLTATÁSOK */}
              {currentCategory && (
                <>
                  <h1 className={HEADING}>{currentCategory.heading}</h1>
                  <OptionGrid>
                    {currentCategory.subServices.map(sub => (
                      <Option
                        key={sub}
                        label={sub}
                        selected={(selectedSubServices[currentCategory.id] || []).includes(sub)}
                        onClick={() => toggleSub(currentCategory.id, sub)}
                      />
                    ))}
                  </OptionGrid>
                  <Actions>
                    <GhostButton onClick={goBack}>VISSZA</GhostButton>
                    <PrimaryButton onClick={goNext}>KÖVETKEZŐ</PrimaryButton>
                  </Actions>
                </>
              )}

              {/* IDŐZÍTÉS (TIMELINE) */}
              {viewKey === 'timeline' && (
                <>
                  <h1 className={HEADING}>MIKORRA LEGYEN KÉSZ?</h1>
                  <OptionGrid>
                    {TIMELINE_OPTIONS.map(opt => (
                      <Option
                        key={opt}
                        label={opt}
                        selected={timeline === opt}
                        onClick={() => setTimeline(opt)}
                      />
                    ))}
                  </OptionGrid>
                  <Actions>
                    <GhostButton onClick={goBack}>VISSZA</GhostButton>
                    <PrimaryButton onClick={goNext} disabled={!timeline}>KÖVETKEZŐ</PrimaryButton>
                  </Actions>
                </>
              )}

              {/* BÜDZSÉ (BUDGET) */}
              {viewKey === 'budget' && (
                <>
                  <h1 className={HEADING}>MILYEN KERETTEL SZÁMOLJUNK?</h1>
                  <OptionGrid>
                    {BUDGET_OPTIONS.map(opt => (
                      <Option
                        key={opt}
                        label={opt}
                        selected={budget === opt}
                        onClick={() => setBudget(opt)}
                      />
                    ))}
                  </OptionGrid>
                  <Actions>
                    <GhostButton onClick={goBack}>VISSZA</GhostButton>
                    <PrimaryButton onClick={goNext} disabled={!budget}>ÁTNÉZEM</PrimaryButton>
                  </Actions>
                </>
              )}

              {/* VÉGSŐ LÉPÉS */}
              {viewKey === 'final' && (
                <>
                  <h1 className={HEADING}>HOGYAN ÉRÜNK EL?</h1>

                  <div className="w-full max-w-2xl flex flex-col border-t border-white/10 mb-10">
                    {/* Alszolgáltatások kilistázása */}
                    {selectedMainIds.map((mainId) => {
                      const category = SERVICES_DATA.find(s => s.id === mainId)
                      if (!category) return null
                      const subs = selectedSubServices[mainId] || []
                      return (
                        <div
                          key={mainId}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:py-5 border-b border-white/10 gap-2 sm:gap-6 text-left"
                        >
                          <span className="font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#606060] shrink-0">
                            {category.title}
                          </span>
                          <span className="font-inter text-[13px] md:text-[14px] leading-[1.4] tracking-[-0.4px] font-semibold uppercase text-white sm:text-right">
                            {subs.length > 0 ? subs.join(', ') : 'MÉG NYITOTT'}
                          </span>
                        </div>
                      )
                    })}
                    
                    {/* Időzítés kilistázása */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:py-5 border-b border-white/10 gap-2 sm:gap-6 text-left">
                      <span className="font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#606060] shrink-0">
                        IDŐZÍTÉS
                      </span>
                      <span className="font-inter text-[13px] md:text-[14px] leading-[1.4] tracking-[-0.4px] font-semibold uppercase text-white sm:text-right">
                        {timeline || 'NEM MEGADOTT'}
                      </span>
                    </div>

                    {/* Büdzsé kilistázása */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:py-5 border-b border-white/10 gap-2 sm:gap-6 text-left">
                      <span className="font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#606060] shrink-0">
                        KÖLTSÉGKERET
                      </span>
                      <span className="font-inter text-[13px] md:text-[14px] leading-[1.4] tracking-[-0.4px] font-semibold uppercase text-white sm:text-right">
                        {budget || 'NEM MEGADOTT'}
                      </span>
                    </div>
                  </div>

                  {contactFields()}
                </>
              )}

                            {/* SIKER */}
              {viewKey === 'sent' && (
                <>
                  <h1 className={HEADING}>MEGKAPTUK!</h1>
                  {/* ITT LETT ÁTÍRVA A SZÍN TEXT-WHITE-RA */}
                  <p className="font-inter text-[14px] md:text-[16px] leading-[1.5] tracking-[-0.4px] font-semibold uppercase text-white max-w-md mb-10">
                    ÁTNÉZZÜK, ÉS HAMAROSAN JELENTKEZÜNK.
                  </p>
                  <PrimaryButton onClick={reset}>VISSZA AZ ELEJÉRE</PrimaryButton>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <div className="w-full shrink-0 bg-[#0a0a0a]">
        <Footer />
      </div>
    </div>
  )
}

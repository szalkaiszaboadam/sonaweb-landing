'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { sendLeadEmail } from '@/app/actions/email'

const ALL_QUESTIONS = [
  {
    id: 'services',
    title: 'Mely területeken tudunk segíteni?',
    multiSelect: true,
    options: [
      { label: 'Weboldal / Webshop fejlesztés', value: 'web', basePrice: 0, monthlyPrice: 0 },
      { label: 'Hirdetéskezelés (Meta, Google)', value: 'ads', basePrice: 0, monthlyPrice: 0 },
      { label: 'Videógyártás (TikTok, Reels)', value: 'tiktok', basePrice: 0, monthlyPrice: 0 },
      { label: 'Közösségi média menedzsment', value: 'social', basePrice: 0, monthlyPrice: 0 },
      { label: 'Marketing automatizáció & Email', value: 'email', basePrice: 0, monthlyPrice: 0 }
    ]
  },
  {
    id: 'webType',
    title: 'Milyen típusú weboldalra van szükséged?',
    showIf: (data: any) => data.services?.some((s: any) => s.value === 'web'),
    options: [
      { label: 'Bemutatkozó / Landing page', value: 'landing', basePrice: 250000, monthlyPrice: 0 },
      { label: 'Komplex vállalati weboldal', value: 'corporate', basePrice: 450000, monthlyPrice: 0 },
      { label: 'Webáruház (E-kereskedelem)', value: 'webshop', basePrice: 750000, monthlyPrice: 0 },
      { label: 'Egyedi webes platform / Portál', value: 'custom', basePrice: 1500000, monthlyPrice: 0 }
    ]
  },
  {
    id: 'maintenance',
    title: 'Kéred a weboldal folyamatos havi felügyeletét?',
    showIf: (data: any) => data.services?.some((s: any) => s.value === 'web'),
    options: [
      { label: 'Alap hosting (önálló karbantartás)', value: 'basic', basePrice: 0, monthlyPrice: 0 },
      { label: 'Prémium üzemeltetés & havi fejlesztés', value: 'premium', basePrice: 0, monthlyPrice: 35000 }
    ]
  },
  {
    id: 'marketingScale',
    title: 'Mekkora léptékű marketing kampányban gondolkodsz?',
    showIf: (data: any) => data.services?.some((s: any) => ['ads', 'email'].includes(s.value)),
    options: [
      { label: 'Induló (1-2 csatorna, stabil jelenlét)', value: 'basic', basePrice: 0, monthlyPrice: 120000 },
      { label: 'Skálázódó (Haladó hirdetések, tölcsérek)', value: 'pro', basePrice: 0, monthlyPrice: 250000 },
      { label: 'Dinamikus (Agresszív piaci jelenlét)', value: 'scale', basePrice: 0, monthlyPrice: 450000 }
    ]
  },
  {
    id: 'contentScale',
    title: 'Milyen intenzitású tartalomgyártást tervezel?',
    showIf: (data: any) => data.services?.some((s: any) => ['social', 'tiktok'].includes(s.value)),
    options: [
      { label: 'Havi 8-10 videó / vizuális anyag', value: 'basic', basePrice: 0, monthlyPrice: 150000 },
      { label: 'Heti rendszeres prémium forgatás', value: 'pro', basePrice: 0, monthlyPrice: 280000 },
      { label: 'Teljes körű külső kreatív stáb', value: 'extreme', basePrice: 0, monthlyPrice: 450000 }
    ]
  },
  {
    id: 'timeline',
    title: 'Milyen ütemezéssel szeretnél elindulni?',
    options: [
      { label: 'Ráér (2-3 hónapon belül)', value: 'normal', multiplier: 1.0 },
      { label: 'Normál (1-1.5 hónapon belül)', value: 'fast', multiplier: 1.15 },
      { label: 'Sürgős (Azonnali prioritás)', value: 'rush', multiplier: 1.35 }
    ]
  }
]

interface EstimateDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function EstimateDrawer({ isOpen, onClose }: EstimateDrawerProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '' })
  const [calculatedQuote, setCalculatedQuote] = useState({ oneTime: 0, monthly: 0 })
  const [, setLeadId] = useState<string | null>(null)
  const leadIdRef = useRef<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Háttér görgetés letiltása megnyitáskor
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = 'unset'
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const activeQuestions = ALL_QUESTIONS.filter(q => (q.showIf ? q.showIf(formData) : true))
  const currentQuestion = activeQuestions[step]
  const isFormStep = step === activeQuestions.length
  const isSuccessStep = step > activeQuestions.length

  const saveProgressToFirebase = async (currentAnswers: any, currentStep: number) => {
    try {
      const db = getDb()
      if (!leadIdRef.current) {
        leadIdRef.current = 'pending'
        const docRef = await addDoc(collection(db, 'leads'), {
          status: 'in_progress',
          lastStep: currentStep,
          answers: currentAnswers,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
        leadIdRef.current = docRef.id
        setLeadId(docRef.id)
      } else if (leadIdRef.current !== 'pending') {
        await updateDoc(doc(db, 'leads', leadIdRef.current), {
          lastStep: currentStep,
          answers: currentAnswers,
          updatedAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Mentési hiba:', error)
    }
  }

  const handleOptionSelect = (option: any) => {
    if (!currentQuestion) return

    if (currentQuestion.multiSelect) {
      setFormData(prev => {
        const currentArray = prev[currentQuestion.id] || []
        const isExisting = currentArray.some((item: any) => item.value === option.value)
        const newData = isExisting
          ? { ...prev, [currentQuestion.id]: currentArray.filter((item: any) => item.value !== option.value) }
          : { ...prev, [currentQuestion.id]: [...currentArray, option] }
        saveProgressToFirebase(newData, step)
        return newData
      })
    } else {
      setFormData(prev => {
        const newData = { ...prev, [currentQuestion.id]: option }
        saveProgressToFirebase(newData, step)
        return newData
      })
      setTimeout(() => setStep(prev => prev + 1), 260)
    }
  }

  const calculateFinalQuote = () => {
    let oneTime = 0
    let monthly = 0

    Object.values(formData).forEach(val => {
      if (Array.isArray(val)) {
        val.forEach(item => {
          oneTime += item.basePrice || 0
          monthly += item.monthlyPrice || 0
        })
      } else if (val && typeof val === 'object') {
        oneTime += val.basePrice || 0
        monthly += val.monthlyPrice || 0
      }
    })

    const multiplier = formData.timeline?.multiplier || 1.0
    oneTime = Math.round(oneTime * multiplier)
    return { oneTime, monthly }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const quote = calculateFinalQuote()
    setCalculatedQuote(quote)

    const finalData = {
      status: 'completed',
      client: contactData,
      answers: formData,
      quote,
      updatedAt: serverTimestamp()
    }

    try {
      if (leadIdRef.current && leadIdRef.current !== 'pending') {
        await updateDoc(doc(getDb(), 'leads', leadIdRef.current), finalData)
      } else {
        await addDoc(collection(getDb(), 'leads'), { ...finalData, createdAt: serverTimestamp() })
      }
      await sendLeadEmail(finalData)
      setStep(activeQuestions.length + 1)
    } catch {
      alert('Hiba történt a küldés során. Kérlek próbáld újra!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(amount)
  }

  const progress = ((step + 1) / (activeQuestions.length + 2)) * 100

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Sötétített, elmosott háttér */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000]/70 backdrop-blur-sm"
          />

          {/* Maga a Drawer panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full max-w-[620px] flex-col justify-between border-l border-[#1C1C1C] bg-[#0A0A0A] text-[#F4F2F0] shadow-2xl"
          >
            {/* Felső vékony progress bar */}
            <div className="absolute top-0 left-0 h-1 w-full bg-[#1A1A1A]">
              <motion.div
                className="h-full bg-[#BF2234]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Fejléc: Lépés vissza + Bezárás */}
            <div className="flex items-center justify-between px-6 pt-7 pb-4">
              <div>
                {!isSuccessStep && step > 0 && (
                  <button
                    onClick={() => setStep(prev => prev - 1)}
                    className="group inline-flex items-center gap-1.5 font-inter text-xs font-semibold uppercase tracking-wider text-[#5A5755] transition-colors hover:text-[#F4F2F0]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    Vissza
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {!isSuccessStep && (
                  <span className="font-inter text-xs font-bold uppercase tracking-widest text-[#BF2234]">
                    {step + 1} / {activeQuestions.length + 1}
                  </span>
                )}
                <button
                  onClick={onClose}
                  aria-label="Bezárás"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#222222] bg-[#111111] text-[#9E9A98] transition-colors hover:border-[#444] hover:text-[#F4F2F0]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Középső interaktív felület */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {!isSuccessStep ? (
                <div className="flex flex-col">
                  <h2 className="mb-6 font-display text-[clamp(1.4rem,3vw,1.9rem)] font-extrabold uppercase leading-tight tracking-tight text-[#F4F2F0]">
                    {currentQuestion ? currentQuestion.title : 'Hova küldhetjük a kalkulációt?'}
                  </h2>

                  <AnimatePresence mode="wait">
                    {currentQuestion && (
                      <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-2.5"
                      >
                        {currentQuestion.options.map(option => {
                          const isSelected = currentQuestion.multiSelect
                            ? formData[currentQuestion.id]?.some((item: any) => item.value === option.value)
                            : formData[currentQuestion.id]?.value === option.value

                          return (
                            <button
                              key={option.value}
                              onClick={() => handleOptionSelect(option)}
                              className={`group flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 ${
                                isSelected
                                  ? 'border-[#BF2234] bg-[#161616]'
                                  : 'border-[#1C1C1C] bg-[#111111] hover:border-[#333333] hover:bg-[#141414]'
                              }`}
                            >
                              <span
                                className={`font-inter text-[14px] font-medium transition-colors ${
                                  isSelected ? 'text-[#F4F2F0]' : 'text-[#9E9A98] group-hover:text-[#F4F2F0]'
                                }`}
                              >
                                {option.label}
                              </span>

                              <div
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                  isSelected ? 'border-[#BF2234] bg-[#BF2234] text-white' : 'border-[#333333]'
                                }`}
                              >
                                {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                              </div>
                            </button>
                          )
                        })}

                        {currentQuestion.multiSelect && (
                          <button
                            onClick={() => setStep(prev => prev + 1)}
                            disabled={!(formData[currentQuestion.id]?.length > 0)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#F4F2F0] py-3.5 font-inter text-[13px] font-semibold uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-white disabled:opacity-30"
                          >
                            <span>Tovább</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </motion.div>
                    )}

                    {isFormStep && (
                      <motion.div
                        key="form-step"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                          <input
                            type="text"
                            required
                            placeholder="Teljes neved"
                            value={contactData.name}
                            onChange={e => setContactData({ ...contactData, name: e.target.value })}
                            className="w-full rounded-xl border border-[#1C1C1C] bg-[#111111] px-4 py-3.5 font-inter text-[14px] text-[#F4F2F0] placeholder:text-[#555] focus:border-[#BF2234] focus:outline-none"
                          />
                          <input
                            type="email"
                            required
                            placeholder="Email címed"
                            value={contactData.email}
                            onChange={e => setContactData({ ...contactData, email: e.target.value })}
                            className="w-full rounded-xl border border-[#1C1C1C] bg-[#111111] px-4 py-3.5 font-inter text-[14px] text-[#F4F2F0] placeholder:text-[#555] focus:border-[#BF2234] focus:outline-none"
                          />
                          <input
                            type="tel"
                            placeholder="Telefonszámod (opcionális)"
                            value={contactData.phone}
                            onChange={e => setContactData({ ...contactData, phone: e.target.value })}
                            className="w-full rounded-xl border border-[#1C1C1C] bg-[#111111] px-4 py-3.5 font-inter text-[14px] text-[#F4F2F0] placeholder:text-[#555] focus:border-[#BF2234] focus:outline-none"
                          />

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#F4F2F0] py-3.5 font-inter text-[13px] font-semibold uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-white disabled:opacity-50"
                          >
                            <span>{isSubmitting ? 'Kalkuláció készítése...' : 'Kalkuláció megtekintése'}</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Eredmény képernyő */
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-6 text-center"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#BF2234] text-white">
                    <Check className="h-6 w-6" strokeWidth={2.5} />
                  </div>

                  <h2 className="mb-2 font-display text-2xl font-black uppercase tracking-tight text-[#F4F2F0]">
                    Kalkuláció elkészült
                  </h2>
                  <p className="mb-6 font-inter text-[13px] leading-relaxed text-[#9E9A98]">
                    A részleteket elküldtük a(z) <span className="font-semibold text-[#F4F2F0]">{contactData.email}</span> címre.
                  </p>

                  <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#1C1C1C] bg-[#111111] p-5 text-left">
                    {calculatedQuote.oneTime > 0 && (
                      <div>
                        <span className="block font-inter text-[11px] font-bold uppercase tracking-wider text-[#7A7674]">
                          Becsült induló fejlesztési díj
                        </span>
                        <span className="font-display text-2xl font-black text-[#F4F2F0]">
                          {formatPrice(calculatedQuote.oneTime)}-tól
                        </span>
                      </div>
                    )}

                    {calculatedQuote.monthly > 0 && (
                      <div className="border-t border-[#1C1C1C] pt-3">
                        <span className="block font-inter text-[11px] font-bold uppercase tracking-wider text-[#7A7674]">
                          Becsült havi menedzsment díj
                        </span>
                        <span className="font-display text-2xl font-black text-[#BF2234]">
                          {formatPrice(calculatedQuote.monthly)} / hó-tól
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={onClose}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#222222] bg-[#141414] px-6 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-wider text-[#F4F2F0] transition-colors hover:border-[#444]"
                  >
                    Bezárás
                  </button>
                </motion.div>
              )}
            </div>

            {/* Alsó mikro-lábléc */}
            <div className="border-t border-[#141414] px-6 py-4">
              <div className="flex flex-col items-center justify-between gap-2.5 text-[11px] text-[#5A5755] sm:flex-row">
                <span>SONAWEB © 2026</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/legal/privacy-policy" className="transition-colors hover:text-[#F4F2F0]">Adatkezelési tájékoztató</Link>
                  <Link href="/legal/cookie-policy" className="transition-colors hover:text-[#F4F2F0]">Cookie tájékoztató</Link>
                  <Link href="/legal/imprint" className="transition-colors hover:text-[#F4F2F0]">Impresszum</Link>
                </div>
                <div className="flex items-center gap-3">
                  <a href="#" className="transition-colors hover:text-[#F4F2F0]">Instagram</a>
                  <a href="#" className="transition-colors hover:text-[#F4F2F0]">Facebook</a>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
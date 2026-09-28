'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Footer } from '@/components/footer'

// --- ADATBÁZIS ---
const SERVICES_DATA = [
  {
    id: 'web',
    title: 'WEBFEJLESZTÉS',
    subServices: [
      'UX / UI DESIGN',
      'VÁLLALATI WEBOLDAL',
      'LANDING PAGE',
      'WEBSHOP & E-KERESKEDELEM',
      'EGYEDI WEBES PLATFORMOK',
      'HOSTING & KARBANTARTÁS'
    ]
  },
  {
    id: 'content',
    title: 'TARTALOMGYÁRTÁS',
    subServices: [
      'KREATÍV KONCEPCIÓ',
      'PRECÍZIÓS SZÖVEGÍRÁS',
      'REKLÁMFILM & FOTÓZÁS',
      'RÖVID VIDEÓK (TIKTOK)',
      'GRAFIKAI TERVEZÉS',
      'ANIMÁCIÓ'
    ]
  },
  {
    id: 'ads',
    title: 'HIRDETÉSKEZELÉS',
    subServices: [
      'META KAMPÁNYOK',
      'GOOGLE ADS',
      'TIKTOK ADS',
      'RETARGETING STRATÉGIA',
      'KONVERZIÓ OPTIMALIZÁLÁS',
      'ANALITIKA & RIPORTÁLÁS'
    ]
  },
  {
    id: 'brand',
    title: 'MÁRKASTRATÉGIA',
    subServices: [
      'MÁRKA ARCHITEKTÚRA',
      'POZICIONÁLÁS',
      'BRAND IDENTITY',
      'KOMMUNIKÁCIÓS STRATÉGIA',
      'NAMING (NÉVADÁS)',
      'PIACKUTATÁS'
    ]
  },
]

export default function ContactPage() {
  const [flow, setFlow] = useState<'none' | 'project' | 'message'>('none') 
  
  const [step, setStep] = useState(0)
  const [selectedMainIds, setSelectedMainIds] = useState<string[]>([])
  const [selectedSubServices, setSelectedSubServices] = useState<Record<string, string[]>>({})

  const toggleMainService = (id: string) => {
    setSelectedMainIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const toggleSubService = (mainId: string, subName: string) => {
    setSelectedSubServices(prev => {
      const current = prev[mainId] || []
      const updated = current.includes(subName) ? current.filter(n => n !== subName) : [...current, subName]
      return { ...prev, [mainId]: updated }
    })
  }

  const handleNext = () => {
    if (step === 0 && selectedMainIds.length === 0) return
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    if (step === 0) {
      setFlow('none')
      setSelectedMainIds([])
      setSelectedSubServices({})
    } else {
      setStep(prev => Math.max(0, prev - 1))
    }
  }

  const totalSteps = selectedMainIds.length + 1
  const progressPercentage = flow === 'project' ? (selectedMainIds.length === 0 ? 0 : (step / totalSteps) * 100) : 0

  const currentMainServiceId = step > 0 && step <= selectedMainIds.length ? selectedMainIds[step - 1] : null
  const currentCategory = currentMainServiceId ? SERVICES_DATA.find(s => s.id === currentMainServiceId) : null
  const isFinalStep = step > selectedMainIds.length

  // === STÍLUSOK ===
  const HEADING_STYLE = "font-display text-[clamp(3rem,8vw,110px)] font-extrabold uppercase leading-[1.0] tracking-[-1.5px] md:tracking-[-3px] text-white text-center mb-10 md:mb-14 max-w-[1400px]"
  const SUBTITLE_STYLE = "font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#606060] text-center mb-6 block"
  
  const PRIMARY_BTN_CLASS = "group flex w-full sm:w-auto items-center justify-center rounded-full bg-white px-5 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#0A0A0A] overflow-hidden"
  const SECONDARY_BTN_CLASS = "group flex w-full sm:w-auto items-center justify-center rounded-full bg-transparent border border-[#333] hover:border-white px-5 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white transition-colors duration-300"
  
  // Opciók: Sima letisztult tipográfia dobozok és zárójelek nélkül
  const OPTION_CLASS = (isSelected: boolean) => 
    `font-inter text-[16px] md:text-[20px] leading-[1.2] tracking-[-0.5px] font-semibold uppercase transition-colors focus:outline-none ${
      isSelected ? 'text-white' : 'text-[#555] hover:text-[#999]'
    }`

  return (
    <div className="w-full flex flex-col bg-[#0A0A0A] text-white font-inter selection:bg-[#BF2234]">
      
      {/* VÉKONY PIROS PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-transparent z-50">
        <motion.div 
          className="h-full bg-[#BF2234]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="min-h-[100svh] w-full flex flex-col relative">
        <div className="h-28 md:h-36 w-full shrink-0" />

        <main className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 w-full max-w-[1600px] mx-auto pb-20">
          <AnimatePresence mode="wait">
            
            {/* ========================================== */}
            {/* 0. LÉPÉS: KEZDŐKÉPERNYŐ                   */}
            {/* ========================================== */}
            {flow === 'none' && (
              <motion.div
                key="flow-none"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col items-center justify-center"
              >
                <h1 className={HEADING_STYLE}>
                  VÁGJUNK BELE.
                </h1>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 w-full sm:w-auto">
                  <button onClick={() => setFlow('project')} className={PRIMARY_BTN_CLASS}>
                    <span className="relative inline-flex overflow-hidden my-[-2px] py-[2px]">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
                        PROJEKT INDÍTÁSA <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                      </span>
                      <span className="absolute left-0 inline-flex items-center gap-1.5 whitespace-nowrap translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                        PROJEKT INDÍTÁSA <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                      </span>
                    </span>
                  </button>

                  <button onClick={() => setFlow('message')} className={SECONDARY_BTN_CLASS}>
                    SIMA ÜZENET
                  </button>
                </div>
              </motion.div>
            )}

            {/* ========================================== */}
            {/* A) SIMA ÜZENET NÉZET                       */}
            {/* ========================================== */}
            {flow === 'message' && (
              <motion.div
                key="flow-message"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col items-center justify-center"
              >
                <h1 className={HEADING_STYLE}>
                  ÍRJ NEKÜNK.
                </h1>

                <form className="flex flex-col gap-6 w-full max-w-2xl mt-4">
                  <input type="text" placeholder="TELJES NÉV" className="w-full bg-transparent border-b border-[#333] px-0 py-4 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors" />
                  <input type="email" placeholder="E-MAIL CÍM" className="w-full bg-transparent border-b border-[#333] px-0 py-4 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors" />
                  <input type="tel" placeholder="TELEFONSZÁM" className="w-full bg-transparent border-b border-[#333] px-0 py-4 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors" />
                  <textarea placeholder="ÜZENETED..." className="w-full bg-transparent border-b border-[#333] px-0 py-4 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors resize-none h-28" />
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 w-full sm:w-auto">
                    <button type="button" onClick={() => setFlow('none')} className="text-[#606060] hover:text-white font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase transition-colors px-2 py-3.5">
                      VISSZA
                    </button>
                    <button type="button" className={PRIMARY_BTN_CLASS}>
                      <span className="relative inline-flex overflow-hidden my-[-2px] py-[2px]">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
                          KÜLDÉS <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                        </span>
                        <span className="absolute left-0 inline-flex items-center gap-1.5 whitespace-nowrap translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                          KÜLDÉS <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                        </span>
                      </span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ========================================== */}
            {/* B) PROJEKT KÉRDŐÍV LÉPÉSEI                 */}
            {/* ========================================== */}
            
            {/* 1. LÉPÉS */}
            {flow === 'project' && step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col items-center justify-center"
              >
                <h1 className={HEADING_STYLE}>
                  MILYEN PROJEKTEN DOLGOZUNK?
                </h1>

                {/* Minimalista Tipográfia Opciók */}
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-12 md:gap-y-6 w-full max-w-4xl mb-12">
                  {SERVICES_DATA.map(service => {
                    const isSelected = selectedMainIds.includes(service.id)
                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleMainService(service.id)}
                        className={OPTION_CLASS(isSelected)}
                      >
                        {service.title}{isSelected && <span className="text-[#BF2234]">.</span>}
                      </button>
                    )
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 h-12 w-full sm:w-auto mt-4">
                  <button onClick={handleBack} className="text-[#606060] hover:text-white font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase transition-colors px-2 py-3.5">
                    VISSZA
                  </button>
                  
                  <AnimatePresence>
                    {selectedMainIds.length > 0 && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                        <button onClick={handleNext} className={PRIMARY_BTN_CLASS}>
                          <span className="relative inline-flex overflow-hidden my-[-2px] py-[2px]">
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
                              TOVÁBB <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                            </span>
                            <span className="absolute left-0 inline-flex items-center gap-1.5 whitespace-nowrap translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                              TOVÁBB <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                            </span>
                          </span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* 2...N LÉPÉS */}
            {flow === 'project' && step > 0 && !isFinalStep && currentCategory && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col items-center justify-center"
              >
                <span className={SUBTITLE_STYLE}>
                  {currentCategory.title}
                </span>
                
                <h1 className={HEADING_STYLE}>
                  MIRE VAN SZÜKSÉG PONTOSAN?
                </h1>

                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-12 md:gap-y-6 w-full max-w-4xl mb-12">
                  {currentCategory.subServices.map(sub => {
                    const isSelected = (selectedSubServices[currentCategory.id] || []).includes(sub)
                    return (
                      <button
                        key={sub}
                        onClick={() => toggleSubService(currentCategory.id, sub)}
                        className={OPTION_CLASS(isSelected)}
                      >
                         {sub}{isSelected && <span className="text-[#BF2234]">.</span>}
                      </button>
                    )
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto mt-4">
                  <button onClick={handleBack} className="text-[#606060] hover:text-white font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase transition-colors px-2 py-3.5">
                    VISSZA
                  </button>
                  <button onClick={handleNext} className={PRIMARY_BTN_CLASS}>
                      <span className="relative inline-flex overflow-hidden my-[-2px] py-[2px]">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
                          {step === selectedMainIds.length ? 'ÖSSZEGZÉS' : 'TOVÁBB'} <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                        </span>
                        <span className="absolute left-0 inline-flex items-center gap-1.5 whitespace-nowrap translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                           {step === selectedMainIds.length ? 'ÖSSZEGZÉS' : 'TOVÁBB'} <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                        </span>
                      </span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* VÉGSŐ LÉPÉS */}
            {flow === 'project' && isFinalStep && (
              <motion.div
                key="final-step"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col items-center text-center max-w-4xl mx-auto"
              >
                <h1 className={HEADING_STYLE}>
                  ADD MEG AZ ADATAIDAT.
                </h1>

                {/* Kiválasztott elemek listája (Nincs pipa, csak szöveg) */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-12 text-[#606060]">
                  {selectedMainIds.map(mainId => {
                    const category = SERVICES_DATA.find(s => s.id === mainId)
                    if (!category) return null
                    return (
                      <span key={mainId} className="font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase">
                        {category.title}
                      </span>
                    )
                  })}
                </div>
                
                {/* Űrlap */}
                <form className="flex flex-col gap-6 w-full max-w-2xl">
                  <input type="text" placeholder="TELJES NÉV" className="w-full bg-transparent border-b border-[#333] px-0 py-4 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors" />
                  <input type="email" placeholder="E-MAIL CÍM" className="w-full bg-transparent border-b border-[#333] px-0 py-4 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors" />
                  <input type="tel" placeholder="TELEFONSZÁM" className="w-full bg-transparent border-b border-[#333] px-0 py-4 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors" />
                    
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 w-full sm:w-auto">
                    <button type="button" onClick={handleBack} className="text-[#606060] hover:text-white font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase transition-colors px-2 py-3.5">
                      VISSZA
                    </button>
                    <button type="button" className={PRIMARY_BTN_CLASS}>
                      <span className="relative inline-flex overflow-hidden my-[-2px] py-[2px]">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
                          ÁRAJÁNLAT KÉRÉSE <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                        </span>
                        <span className="absolute left-0 inline-flex items-center gap-1.5 whitespace-nowrap translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                          ÁRAJÁNLAT KÉRÉSE <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                        </span>
                      </span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      <div className="w-full shrink-0 bg-[#0A0A0A]">
        <Footer />
      </div>
    </div>
  )
}

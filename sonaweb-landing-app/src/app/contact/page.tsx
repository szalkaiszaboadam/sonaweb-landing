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
    setStep(prev => Math.max(0, prev - 1))
  }

  const totalSteps = selectedMainIds.length + 1
  const progressPercentage = selectedMainIds.length === 0 ? 0 : (step / totalSteps) * 100

  const currentMainServiceId = step > 0 && step <= selectedMainIds.length ? selectedMainIds[step - 1] : null
  const currentCategory = currentMainServiceId ? SERVICES_DATA.find(s => s.id === currentMainServiceId) : null
  const isFinalStep = step > selectedMainIds.length

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0A0A0A] text-white font-inter selection:bg-[#BF2234] relative">
      
      {/* VÉKONY PROGRESS BAR A TETEJÉN (FIXED) */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-[#111] z-50">
        <motion.div 
          className="h-full bg-[#BF2234]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* NAVBAR HELYKIHAGYÁS */}
      <div className="h-28 md:h-36 w-full shrink-0" />

      {/* KÖZÉPSŐ TARTALOM (Rugalmas magasság, engedi a görgetést, ha szükséges) */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 w-full max-w-[1200px] mx-auto py-12">
        <AnimatePresence mode="wait">
          
          {/* 1. LÉPÉS: FŐ KATEGÓRIÁK */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center justify-center"
            >
              <span className="mb-8 font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#606060] text-center">
                MILYEN PROJEKTEN DOLGOZUNK?
              </span>

              <div className="flex flex-col items-center gap-4 w-full mb-12">
                {SERVICES_DATA.map(service => {
                  const isSelected = selectedMainIds.includes(service.id)
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleMainService(service.id)}
                      className="group focus:outline-none"
                    >
                      <span className={`font-display text-[clamp(1.8rem,4vw,50px)] font-extrabold uppercase leading-[1] tracking-[-1px] transition-colors duration-300 ${isSelected ? 'text-white' : 'text-[#444] group-hover:text-[#888]'}`}>
                        {service.title}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="h-12 flex justify-center w-full">
                <AnimatePresence>
                  {selectedMainIds.length > 0 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                      <button onClick={handleNext} className="group flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#0A0A0A] overflow-hidden sm:w-auto">
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

          {/* 2...N LÉPÉS: ALSZOLGÁLTATÁSOK */}
          {step > 0 && !isFinalStep && currentCategory && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center justify-center"
            >
              <span className="mb-4 font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#BF2234] text-center">
                {currentCategory.title}
              </span>
              
              <h2 className="mb-10 font-display text-[clamp(1.8rem,4vw,48px)] font-extrabold uppercase leading-[1.1] tracking-[-1px] text-white text-center">
                MILYEN RÉSZLETEKRE VAN SZÜKSÉG?
              </h2>

              <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl mb-12">
                {currentCategory.subServices.map(sub => {
                  const isSelected = (selectedSubServices[currentCategory.id] || []).includes(sub)
                  return (
                    <button
                      key={sub}
                      onClick={() => toggleSubService(currentCategory.id, sub)}
                      className={`px-6 py-3.5 rounded-full border transition-all duration-300 font-inter text-[13px] font-semibold uppercase tracking-[-0.4px] focus:outline-none ${
                        isSelected 
                          ? 'bg-white text-[#0A0A0A] border-white' 
                          : 'bg-transparent text-[#888] border-[#333] hover:border-[#666] hover:text-white'
                      }`}
                    >
                      {sub}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-6">
                <button onClick={handleBack} className="text-[#606060] hover:text-white font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase transition-colors px-2 py-3.5">
                  VISSZA
                </button>
                <button onClick={handleNext} className="group flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#0A0A0A] overflow-hidden sm:w-auto">
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

          {/* VÉGSŐ LÉPÉS: TISZTA, KÉTOSZLOPOS ŰRLAP */}
          {isFinalStep && (
            <motion.div
              key="final-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col md:flex-row gap-12 lg:gap-20 max-w-5xl mx-auto"
            >
              
              {/* Bal oldal: Összegző lista */}
              <div className="w-full md:w-5/12 flex flex-col">
                <h2 className="font-display text-[28px] md:text-[36px] font-extrabold uppercase leading-[1.1] tracking-[-1px] text-white mb-8">
                  KIVÁLASZTOTT <br className="hidden md:block" />
                  ELEMEK
                </h2>
                
                <div className="flex flex-col gap-6 border-t border-[#222] pt-6">
                  {selectedMainIds.map(mainId => {
                    const category = SERVICES_DATA.find(s => s.id === mainId)
                    const selectedSubs = selectedSubServices[mainId] || []
                    if (!category || selectedSubs.length === 0) return null

                    return (
                      <div key={mainId} className="flex flex-col gap-2">
                        <span className="font-inter text-[13px] font-semibold uppercase text-[#606060] tracking-[-0.4px]">
                          {category.title}
                        </span>
                        <ul className="flex flex-col gap-1.5">
                          {selectedSubs.map(sub => (
                            <li key={sub} className="font-inter text-[14px] md:text-[15px] font-medium text-white flex items-start gap-2">
                              <span className="text-[#BF2234] mt-1 text-[10px]">■</span> {sub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Jobb oldal: Az űrlap */}
              <div className="w-full md:w-7/12 flex flex-col">
                <p className="font-inter text-[14px] leading-[1.6] text-[#888] uppercase tracking-[-0.4px] font-semibold mb-8">
                  ADD MEG AZ ADATAIDAT, ÉS AZONNAL ELKÜLDJÜK AZ ELŐZETES ÁRAJÁNLATOT E-MAILBEN.
                </p>

                <form className="flex flex-col gap-5 w-full text-left mb-10">
                  <input 
                    type="text" 
                    placeholder="TELJES NÉV" 
                    className="w-full bg-transparent border-b border-[#333] px-0 py-4 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors"
                  />
                  <input 
                    type="email" 
                    placeholder="E-MAIL CÍM" 
                    className="w-full bg-transparent border-b border-[#333] px-0 py-4 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors"
                  />
                  <input 
                    type="tel" 
                    placeholder="TELEFONSZÁM (OPCIONÁLIS)" 
                    className="w-full bg-transparent border-b border-[#333] px-0 py-4 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors"
                  />
                </form>
                  
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button type="button" onClick={handleBack} className="text-[#606060] hover:text-white font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase transition-colors px-2 py-3.5">
                    VISSZA
                  </button>
                    
                  <button type="button" className="group flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#0A0A0A] overflow-hidden sm:w-auto">
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
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* HIVATALOS FOOTER (Most már rendesen látható a görgetésnek köszönhetően) */}
      <div className="w-full shrink-0 mt-20">
        <Footer />
      </div>
    </div>
  )
}

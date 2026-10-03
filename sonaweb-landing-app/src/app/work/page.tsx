'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Footer } from '@/components/footer'
import { useCustomCursor } from '@/components/custom-cursor'

const CONTAINER = "mx-auto w-full max-w-[1800px] px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 2xl:px-36"

// --- PROJEKTEK ADATBÁZISA ---
const WORKS = [
  { 
    title: 'DUKAY WINERY', 
    category: 'WEBFEJLESZTÉS', 
    year: '2024', 
    image: '/dukay-winery-1.webp', 
    link: '#' 
  },
  { 
    title: 'SOL CAR', 
    category: 'HIRDETÉSKEZELÉS', 
    year: '2023', 
    image: '/solcar-1.webp', 
    link: '#' 
  },
  { 
    title: 'GÁZGÉPKER', 
    category: 'WEBFEJLESZTÉS',
    year: '2024', 
    image: '/gazgepker-2.webp', 
    link: '#' 
  },
  { 
    title: 'CARL COZMO', 
    category: 'MÁRKASTRATÉGIA', 
    year: '2024', 
    image: '/carl-cozmo-3.webp', 
    link: '#' 
  },
  { 
    title: 'AEROPRODUKT ZRT.', 
    category: 'TARTALOMGYÁRTÁS', 
    year: '2024', 
    image: '/aeroprodukt-2.mp4', 
    isVideo: true,
    link: '#' 
  },
  { 
    title: 'FRÖCCSTERASZ', 
    category: 'HIRDETÉSKEZELÉS', 
    year: '2023', 
    image: '/dukay-winery-2.webp', 
    link: '#' 
  },
  { 
    title: 'TÜRKIZ BUDAPEST', 
    category: 'TARTALOMGYÁRTÁS', 
    year: '2023', 
    image: '/carl-cozmo-2.webp', 
    link: '#' 
  },
  { 
    title: 'BORI TANYA', 
    category: 'MÁRKASTRATÉGIA', 
    year: '2023', 
    image: '/solcar-1.webp', 
    link: '#' 
  },
  { 
    title: 'TTMBIO', 
    category: 'WEBFEJLESZTÉS', 
    year: '2024', 
    image: '/gazgepker-1.webp', 
    link: '#' 
  },
  { 
    title: 'JUHOS GÉPBÉR', 
    category: 'HIRDETÉSKEZELÉS', 
    year: '2024', 
    image: '/dukay-winery-1.webp', 
    link: '#' 
  }
]

// --- EDITORIAL RÁCS CONFIG ---
const EDITORIAL_CONFIGS = [
  { gridClass: 'md:col-span-7 md:col-start-1', aspect: 'md:aspect-[16/11]' },
  { gridClass: 'md:col-span-4 md:col-start-9 md:mt-36 lg:mt-48', aspect: 'md:aspect-[3/4]' },
  { gridClass: 'md:col-span-5 md:col-start-1 md:-mt-18 lg:-mt-28', aspect: 'md:aspect-square' },
  { gridClass: 'md:col-span-6 md:col-start-7 md:mt-24 lg:mt-32', aspect: 'md:aspect-[16/11]' },
  { gridClass: 'md:col-span-6 md:col-start-1 md:-mt-8 lg:-mt-12', aspect: 'md:aspect-[4/5]' },
  { gridClass: 'md:col-span-5 md:col-start-8 md:mt-20 lg:mt-28', aspect: 'md:aspect-square' },
]

function GridProjectItem({ project, config }: { project: typeof WORKS[0], config: typeof EDITORIAL_CONFIGS[0] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-18%', '18%'])
  const { setCursor, clearCursor } = useCustomCursor()

  const isVideo = project.image.match(/\.(mp4|webm|ogg)$/i)

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col ${config.gridClass}`}
    >
      <Link href={project.link} className="flex w-full flex-col" onClick={clearCursor}>
        <div 
          onMouseEnter={() => setCursor({ active: true, label: 'Megnézem' })}
          onMouseLeave={clearCursor}
          className={`relative mb-4 w-full overflow-hidden rounded-2xl bg-white/[0.02] aspect-[4/3] ${config.aspect}`}
        >
          
          {/* MOBIL NÉZET: Nincs parallax effekt, pontosan kitölti a 4:3-as dobozt */}
          <div className="relative h-full w-full md:hidden">
            {isVideo ? (
              <video src={project.image} autoPlay muted loop playsInline className="h-full w-full object-cover" />
            ) : (
              <Image src={project.image} alt={project.title} fill className="object-cover" />
            )}
          </div>

          {/* ASZTALI NÉZET: Mozgó (parallax) effekt, csak gépen látszik */}
          <motion.div style={{ y }} className="relative -top-[20%] h-[140%] w-full will-change-transform hidden md:block">
            {isVideo ? (
              <video src={project.image} autoPlay muted loop playsInline className="h-full w-full object-cover" />
            ) : (
              <Image src={project.image} alt={project.title} fill className="object-cover" />
            )}
          </motion.div>
          
        </div>

        <div className="w-full px-1 flex justify-between items-center">
          <h3 className="font-inter text-[13px] md:text-[14px] font-semibold uppercase text-white">
            {project.title}
          </h3>
          <span className="font-inter text-[13px] md:text-[14px] font-semibold uppercase text-[#606060]">
            {project.category}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState('ÖSSZES')
  const [viewMode, setViewMode] = useState<'grid' | 'index'>('index')
  const [hoveredIndexIdx, setHoveredIndexIdx] = useState<number | null>(null)

  // Lebegő kép kurzorkövetése (Lista nézethez)
  const springX = useSpring(0, { damping: 40, stiffness: 300 })
  const springY = useSpring(0, { damping: 40, stiffness: 300 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      springX.set(e.clientX)
      springY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [springX, springY])

  const filters = ['ÖSSZES', 'WEBFEJLESZTÉS', 'TARTALOMGYÁRTÁS', 'HIRDETÉSKEZELÉS', 'MÁRKASTRATÉGIA']

  const filteredWorks = activeFilter === 'ÖSSZES' 
    ? WORKS 
    : WORKS.filter(w => w.category.toUpperCase() === activeFilter.toUpperCase())

  return (
    <main className="min-h-[100svh] flex flex-col bg-[#0a0a0a] font-inter text-white selection:bg-[#BF2234] selection:text-white pt-32 md:pt-48">
      
      {/* --- FŐ TARTALOM --- */}
      <div className={`${CONTAINER} flex-1 flex flex-col pb-20`}>

        {/* --- KÖZÉPRE IGAZÍTOTT CÍM --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center justify-center text-center mb-20 md:mb-32"
        >
          <h1 className="font-display text-[clamp(2.5rem,7vw,90px)] font-extrabold uppercase leading-[1.2] tracking-[-1.5px] md:tracking-[-2px] text-white">
            MUNKÁINK
          </h1>
        </motion.div>

        {/* FELSŐ VEZÉRLŐSÁV */}
        <div className="flex flex-row justify-between mb-16">
          
          {/* Bal oldal: Szűrők */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-5 font-inter text-[13px] md:text-[14px] font-semibold uppercase">
            {filters.map((filter) => {
              const isActive = activeFilter === filter
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`transition-colors duration-300 py-1 text-left ${
                    isActive ? 'text-white' : 'text-[#606060] hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              )
            })}
          </div>

          {/* Jobb oldal: Rács / Lista váltó */}
          <div className="flex flex-col justify-end items-end md:flex-row md:items-center gap-2 md:gap-5 font-inter text-[13px] md:text-[14px] font-semibold uppercase">
            <button 
              onClick={() => setViewMode('grid')}
              className={`transition-colors py-1 text-right ${viewMode === 'grid' ? 'text-white' : 'text-[#606060] hover:text-white'}`}
            >
              RÁCS
            </button>
            <button 
              onClick={() => setViewMode('index')}
              className={`transition-colors py-1 text-right ${viewMode === 'index' ? 'text-white' : 'text-[#606060] hover:text-white'}`}
            >
              LISTA
            </button>
          </div>
        </div>

        {/* TARTALOM MEGJELENÍTÉSE */}
        <AnimatePresence mode="wait">
          
          {/* 1. RÁCS NÉZET */}
          {viewMode === 'grid' ? (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-6 lg:gap-x-10 lg:gap-y-24"
            >
              {filteredWorks.map((project, i) => (
                <GridProjectItem 
                  key={project.title} 
                  project={project} 
                  config={EDITORIAL_CONFIGS[i % EDITORIAL_CONFIGS.length]} 
                />
              ))}
            </motion.div>
          ) : (
            
            /* 2. LISTA NÉZET */
            <motion.div
              key="index-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col border-t border-white/10"
              onMouseLeave={() => setHoveredIndexIdx(null)}
            >
              {filteredWorks.map((project, idx) => {
                // isFaded = IGAZ, ha az egér a listában van, de EGY MÁSIK soron
                const isFaded = hoveredIndexIdx !== null && hoveredIndexIdx !== idx

                return (
                  <Link
                    key={project.title}
                    href={project.link}
                    onMouseEnter={() => setHoveredIndexIdx(idx)}
                    className="group relative block w-full border-b border-white/10 py-5 z-10 hover:z-50"
                  >
                    <div className="relative z-20 w-full">

                      {/* === 1. MOBIL NÉZET (Csak telefonon látszik) === */}
                      <div className={`flex md:hidden items-stretch justify-between w-full transition-opacity duration-300 ${isFaded ? 'opacity-30' : 'opacity-100'}`}>
                        {/* Szövegek balra */}
                        <div className="flex flex-col justify-between pr-4 w-[60%]">
                          <div>
                            <div className="font-inter text-[13px] font-semibold uppercase text-white mb-1">
                              {project.title}
                            </div>
                            <div className="font-inter text-[13px] font-semibold uppercase text-[#606060]">
                              {project.category}
                            </div>
                          </div>
                          <div className="mt-auto pt-4 text-white">
                            <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
                          </div>
                        </div>

                        {/* Statikus kép jobbra */}
                        <div className="relative w-[120px] shrink-0 aspect-[4/3] overflow-hidden bg-white/[0.02] rounded-md">
                          {project.isVideo ? (
                            <video src={project.image} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                          ) : (
                            <Image src={project.image} alt={project.title} fill className="object-cover" />
                          )}
                        </div>
                      </div>

                      {/* === 2. ASZTALI NÉZET (Csak gépen látszik - Tökéletes 4 oszlopos Grid) === */}
                      {/* Alapból FEHÉR (text-white). Ha isFaded igaz, akkor SZÜRKE (text-[#606060]) lesz */}
                      <div className={`hidden md:grid grid-cols-4 items-center w-full font-inter text-[14px] font-semibold uppercase transition-colors duration-300 ${
                        isFaded ? 'text-[#606060]' : 'text-white'
                      }`}>
                        
                        {/* 1. Oszlop: CÍM */}
                        <div className="text-left pr-4">{project.title}</div>

                        {/* 2. Oszlop: KATEGÓRIA */}
                        <div className="text-left pr-4">{project.category}</div>

                        {/* 3. Oszlop: ÉVSZÁM */}
                        <div className="text-left pr-4">{project.year}</div>

                        {/* 4. Oszlop: GOMB (Jobbra igazítva) */}
                        <div className="flex items-center justify-end gap-1.5">
                          PROJEKT MEGTEKINTÉSE 
                          <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                        </div>
                        
                      </div>
                    </div>

                    {/* === ASZTALI HOVER KÉP (Rollolós) === */}
                    <div className="hidden md:block absolute right-[260px] xl:right-[280px] top-1/2 -translate-y-1/2 w-[220px] xl:w-[260px] aspect-[16/10] pointer-events-none transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] [clip-path:inset(0%_0%_100%_0%)] group-hover:[clip-path:inset(0%_0%_0%_0%)] rounded-lg overflow-hidden shadow-2xl z-30 bg-[#0a0a0a]">
                      {project.isVideo ? (
                        <video src={project.image} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                      ) : (
                        <Image src={project.image} alt={project.title} fill className="object-cover" />
                      )}
                    </div>

                  </Link>
                )
              })}
            </motion.div>

          )}

        </AnimatePresence>

      </div>
      
      {/* FOOTER */}
      <div className="w-full shrink-0 bg-[#0a0a0a]">
        <Footer />
      </div>
    </main>
  )
}

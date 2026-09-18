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
    link: '/work/dukay-winery' 
  },
  { 
    title: 'SOL CAR', 
    category: 'HIRDETÉSKEZELÉS', 
    year: '2023', 
    image: '/solcar-1.webp', 
    link: '/work/sol-car' 
  },
  { 
    title: 'GÁZGÉPKER', 
    category: 'WEBFEJLESZTÉS', 
    year: '2024', 
    image: '/gazgepker-2.webp', 
    link: '/work/gazgepker' 
  },
  { 
    title: 'CARL COZMO', 
    category: 'MÁRKASTRATÉGIA', 
    year: '2024', 
    image: '/carl-cozmo-3.webp', 
    link: '/work/carl-cozmo' 
  },
  { 
    title: 'AEROPRODUKT ZRT.', 
    category: 'TARTALOMGYÁRTÁS', 
    year: '2024', 
    image: '/aeroprodukt-2.mp4', 
    isVideo: true,
    link: '/work/aeroprodukt' 
  },
  { 
    title: 'FRÖCCSTERASZ', 
    category: 'HIRDETÉSKEZELÉS', 
    year: '2023', 
    image: '/dukay-winery-2.webp', 
    link: '/work/froccsterasz' 
  },
  { 
    title: 'TÜRKIZ BUDAPEST', 
    category: 'TARTALOMGYÁRTÁS', 
    year: '2023', 
    image: '/carl-cozmo-2.webp', 
    link: '/work/turkiz-budapest' 
  },
  { 
    title: 'BORI TANYA', 
    category: 'MÁRKASTRATÉGIA', 
    year: '2023', 
    image: '/solcar-1.webp', 
    link: '/work/bori-tanya' 
  },
  { 
    title: 'TTMBIO', 
    category: 'WEBFEJLESZTÉS', 
    year: '2024', 
    image: '/gazgepker-1.webp', 
    link: '/work/ttmbio' 
  },
  { 
    title: 'JUHOS GÉPBÉR', 
    category: 'HIRDETÉSKEZELÉS', 
    year: '2024', 
    image: '/dukay-winery-1.webp', 
    link: '/work/juhos-gepber' 
  }
]

// --- EDITORIAL RÁCS CONFIG ---
const EDITORIAL_CONFIGS = [
  { gridClass: 'md:col-span-7 md:col-start-1', aspect: 'aspect-[16/11]' },
  { gridClass: 'md:col-span-4 md:col-start-9 md:mt-36 lg:mt-48', aspect: 'aspect-[3/4]' },
  { gridClass: 'md:col-span-5 md:col-start-1 md:-mt-18 lg:-mt-28', aspect: 'aspect-square' },
  { gridClass: 'md:col-span-6 md:col-start-7 md:mt-24 lg:mt-32', aspect: 'aspect-[16/11]' },
  { gridClass: 'md:col-span-6 md:col-start-1 md:-mt-8 lg:-mt-12', aspect: 'aspect-[4/5]' },
  { gridClass: 'md:col-span-5 md:col-start-8 md:mt-20 lg:mt-28', aspect: 'aspect-square' },
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
          className={`relative mb-4 w-full overflow-hidden rounded-2xl bg-white/[0.02] ${config.aspect}`}
        >
          <motion.div style={{ y }} className="relative -top-[20%] h-[140%] w-full will-change-transform">
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
    <main className="min-h-[100svh] flex flex-col bg-[#0A0A0A] font-inter text-white selection:bg-[#BF2234] selection:text-white pt-32 md:pt-48">
      
      {/* --- LEBEGŐ KÉP A LISTA NÉZETHEZ --- */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
        <motion.div
          style={{ x: springX, y: springY }}
          className="absolute top-0 left-0 -ml-[120px] -mt-[160px] w-[240px] h-[320px] flex items-center justify-center"
        >
          <AnimatePresence>
            {viewMode === 'index' && hoveredIndexIdx !== null && (
              <motion.div
                key={hoveredIndexIdx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 overflow-hidden rounded-[1.5rem] bg-[#111]"
              >
                {filteredWorks[hoveredIndexIdx].isVideo ? (
                  <video
                    src={filteredWorks[hoveredIndexIdx].image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={filteredWorks[hoveredIndexIdx].image}
                    alt={filteredWorks[hoveredIndexIdx].title}
                    fill
                    className="object-cover"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* --- FŐ TARTALOM --- */}
      <div className={`${CONTAINER} flex-1 flex flex-col pb-20`}>

        {/* --- KÖZÉPRE IGAZÍTOTT CÍM (Jogi oldalak stílusában) --- */}
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-16">
          
          {/* Bal oldal: Szűrők */}
          <div className="flex flex-wrap items-center gap-3 md:gap-5 font-inter text-[13px] md:text-[14px] font-semibold uppercase">
            {filters.map((filter) => {
              const isActive = activeFilter === filter
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`transition-colors duration-300 py-1 ${
                    isActive ? 'text-white' : 'text-[#606060] hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              )
            })}
          </div>

          {/* Jobb oldal: Rács / Lista váltó */}
          <div className="flex items-center gap-3 font-inter text-[13px] md:text-[14px] font-semibold uppercase text-white">
            <button 
              onClick={() => setViewMode('grid')}
              className={`transition-colors ${viewMode === 'grid' ? 'text-white' : 'text-[#606060] hover:text-white'}`}
            >
              RÁCS
            </button>
            <button 
              onClick={() => setViewMode('index')}
              className={`transition-colors ${viewMode === 'index' ? 'text-white' : 'text-[#606060] hover:text-white'}`}
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
                const isFaded = hoveredIndexIdx !== null && hoveredIndexIdx !== idx

                return (
                  <Link
                    key={project.title}
                    href={project.link}
                    onMouseEnter={() => setHoveredIndexIdx(idx)}
                    className="group block w-full border-b border-white/10 py-5 md:py-6"
                  >
                    <div className={`flex flex-col sm:flex-row items-start sm:items-center w-full transition-opacity duration-300 ${
                      isFaded ? 'opacity-20' : 'opacity-100'
                    }`}>
                      
                      {/* CÍM */}
                      <div className="w-full sm:w-1/4 font-inter text-[13px] md:text-[14px] font-semibold uppercase text-white mb-2 sm:mb-0 text-left">
                        {project.title}
                      </div>
                      
                      {/* KATEGÓRIA */}
                      <div className="w-full sm:w-1/4 font-inter text-[13px] md:text-[14px] font-semibold uppercase text-white mb-2 sm:mb-0 sm:text-center">
                        {project.category}
                      </div>

                      {/* ÉV */}
                      <div className="w-full sm:w-1/4 font-inter text-[13px] md:text-[14px] font-semibold uppercase text-white mb-2 sm:mb-0 sm:text-center">
                        {project.year}
                      </div>

                      {/* GOMB (Eredeti landing oldal nyíl stílus) */}
                      <div className="w-full sm:w-1/4 font-inter text-[13px] md:text-[14px] font-semibold uppercase text-white flex items-center sm:justify-end gap-1.5">
                        PROJEKT MEGTEKINTÉSE 
                        <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
      
      {/* FOOTER */}
      <div className="w-full shrink-0">
        <Footer />
      </div>
    </main>
  )
}

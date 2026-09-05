'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const CONTAINER = 'mx-auto w-full max-w-[1340px] px-6'

interface FooterProps {
  variant?: 'default' | 'minimal'
  className?: string
}

export function Footer({ variant = 'default', className = '' }: FooterProps) {
  const isMinimal = variant === 'minimal'
  const baseClasses = className || 'relative w-full bg-[#BF2234] overflow-hidden z-0'
  
  // Függöny (Curtain Reveal) hatás figyelése
  const footerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-35%", "0%"])

  return (
    <footer ref={footerRef} className={baseClasses}>
      <motion.div 
        style={!isMinimal ? { y } : {}}
        className={`w-full relative ${isMinimal ? 'py-6' : 'pt-6 pb-6 md:pt-8 md:pb-8'}`}
      >
        <div className={`${CONTAINER} flex flex-col relative z-10`}>
          
          {/* 1. INFORMÁCIÓK */}
          <div className={`w-full flex flex-col lg:flex-row items-center justify-between gap-6 mb-6 md:mb-8 ${isMinimal ? 'mb-0' : ''}`}>
            
            {/* Bal oldal: Copyright */}
            <div className="flex shrink-0 items-center">
              <span className="font-inter text-[13px] tracking-widest font-bold uppercase text-white">
                SONAWEB © {new Date().getFullYear()}
              </span>
            </div>
            
            {/* Jobb oldal: Jogi linkek és Social linkek */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6 md:gap-10 font-inter text-[13px] tracking-wide font-semibold uppercase">
              
              {/* Szöveges linkek (Jogi): Text Roll effektus */}
              <div className="flex flex-wrap justify-center gap-5 md:gap-8">
                <Link href="/legal/privacy-policy" className="group text-white">
                  <span className="relative inline-flex overflow-hidden">
                    <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                      Adatkezelési tájékoztató
                    </span>
                    <span className="absolute left-0 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                      Adatkezelési tájékoztató
                    </span>
                  </span>
                </Link>
                <Link href="/legal/cookie-policy" className="group text-white">
                  <span className="relative inline-flex overflow-hidden">
                    <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                      Cookie tájékoztató
                    </span>
                    <span className="absolute left-0 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                      Cookie tájékoztató
                    </span>
                  </span>
                </Link>
                <Link href="/legal/imprint" className="group text-white">
                  <span className="relative inline-flex overflow-hidden">
                    <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                      Impresszum
                    </span>
                    <span className="absolute left-0 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                      Impresszum
                    </span>
                  </span>
                </Link>
              </div>
              
              {/* Ikon + Szöveges linkek (Közösségi média): Text Roll effektus */}
              <div className="flex flex-wrap justify-center gap-5 md:gap-8">
                <a href="#" target="_blank" rel="noopener noreferrer" className="group text-white">
                  <span className="relative inline-flex overflow-hidden">
                    <span className="flex items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                      Instagram
                    </span>
                    <span className="absolute left-0 flex items-center gap-2 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                      Instagram
                    </span>
                  </span>
                </a>
                
                <a href="#" target="_blank" rel="noopener noreferrer" className="group text-white">
                  <span className="relative inline-flex overflow-hidden">
                    <span className="flex items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                      Facebook
                    </span>
                    <span className="absolute left-0 flex items-center gap-2 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                      Facebook
                    </span>
                  </span>
                </a>
              </div>

            </div>
            
          </div>

          {/* 2. SOLID FEHÉR SZÖVEG */}
          {!isMinimal && (
            <div className="w-full flex flex-col items-center relative z-0">
              <span className="sr-only">MADE BY GEN Z</span>
              <div aria-hidden="true" className="w-[104%] -ml-[2%] flex">
                <svg 
                  className="w-full h-auto overflow-visible" 
                  viewBox="0 0 1040 400" 
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text 
                    x="20" 
                    y="160" 
                    textLength="1000" 
                    lengthAdjust="spacingAndGlyphs" 
                    fill="#FFFFFF" 
                    fontSize="195" 
                    fontWeight="900" 
                    fontFamily="'Montserrat', sans-serif" 
                  >
                    MADE BY
                  </text>
                  <text 
                    x="20" 
                    y="380" 
                    textLength="1000" 
                    lengthAdjust="spacingAndGlyphs" 
                    fill="#FFFFFF" 
                    fontSize="260" 
                    fontWeight="900" 
                    fontFamily="'Montserrat', sans-serif" 
                  >
                    GEN Z
                  </text>
                </svg>
              </div>
            </div>
          )}
          
        </div>
      </motion.div>
    </footer>
  )
}
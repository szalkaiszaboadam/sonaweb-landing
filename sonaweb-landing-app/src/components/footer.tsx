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
  const baseClasses = className || 'relative w-full bg-[#FF1A1A] overflow-hidden z-0'
  
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
        // 1. TÁVOLSÁG (Legfelül és Legalul): Egységes pt-5/pb-5 (mobilon 4)
        className={`w-full relative ${isMinimal ? 'py-4' : 'pt-4 pb-4 md:pt-5 md:pb-5'}`}
      >
        <div className={`${CONTAINER} flex flex-col relative z-10`}>
          
          {/* INFORMÁCIÓK */}
          {/* 2. TÁVOLSÁG (Linkek alatt): Egységes mb-5 (mobilon 4) */}
          <div className={`w-full flex flex-col lg:flex-row items-center justify-between gap-6 ${isMinimal ? 'mb-0' : 'mb-4 md:mb-5'}`}>
            
            {/* Bal oldal: Copyright */}
            <div className="flex shrink-0 items-center">
              <span className="font-inter text-[13px] tracking-wide font-semibold uppercase text-[#0A0A0A]">
                © {new Date().getFullYear()} SONAWEB KFT.
              </span>
            </div>
            
            {/* Középső: Social linkek */}
            <div className="flex shrink-0 items-center justify-center gap-5 md:gap-8 font-inter text-[13px] tracking-wide font-semibold uppercase">
              <a href="#" target="_blank" rel="noopener noreferrer" className="group text-[#0A0A0A]">
                <span className="relative inline-flex overflow-hidden">
                  <span className="flex items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                    Instagram
                  </span>
                  <span className="absolute left-0 flex items-center gap-2 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Instagram
                  </span>
                </span>
              </a>
              
              <a href="#" target="_blank" rel="noopener noreferrer" className="group text-[#0A0A0A]">
                <span className="relative inline-flex overflow-hidden">
                  <span className="flex items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                    Facebook
                  </span>
                  <span className="absolute left-0 flex items-center gap-2 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Facebook
                  </span>
                </span>
              </a>
            </div>

            {/* Jobb oldal: Jogi linkek */}
            <div className="flex shrink-0 items-center justify-end gap-5 md:gap-8 font-inter text-[13px] tracking-wide font-semibold uppercase">
              <Link href="/legal/privacy-policy" className="group text-[#0A0A0A]">
                <span className="relative inline-flex overflow-hidden">
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                    Adatkezelési tájékoztató
                  </span>
                  <span className="absolute left-0 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Adatkezelési tájékoztató
                  </span>
                </span>
              </Link>
              <Link href="/legal/cookie-policy" className="group text-[#0A0A0A]">
                <span className="relative inline-flex overflow-hidden">
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                    Cookie tájékoztató
                  </span>
                  <span className="absolute left-0 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Cookie tájékoztató
                  </span>
                </span>
              </Link>
              <Link href="/legal/imprint" className="group text-[#0A0A0A]">
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
            
          </div>

          {/* SOLID FEHÉR SZÖVEG */}
          {!isMinimal && (
            <div className="w-full flex flex-col items-center relative z-0">
              <span className="sr-only">MADE BY GEN Z</span>
              
              {/* 3. TÁVOLSÁG (Két sor között): Egységes gap-5 (mobilon 4), az SVG-k most pontosan a szöveghatárig érnek */}
              <div aria-hidden="true" className="w-[104%] -ml-[2%] flex flex-col gap-4 md:gap-5">
                
                {/* 1. Különálló SVG: MADE BY */}
                <svg 
                  className="w-full h-auto overflow-visible" 
                  viewBox="0 0 1040 155" 
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text 
                    x="20" 
                    y="150" 
                    textLength="1000" 
                    lengthAdjust="spacingAndGlyphs" 
                    fill="#000000" 
                    fontSize="195" 
                    fontWeight="900" 
                    fontFamily="'Montserrat', sans-serif"
                    style={{ letterSpacing: '-0.03em', wordSpacing: '-0.06em' }}
                  >
                    MADE BY
                  </text>
                </svg>

                {/* 2. Különálló SVG: GEN Z */}
                <svg 
                  className="w-full h-auto overflow-visible" 
                  viewBox="0 0 1040 200" 
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text 
                    x="20" 
                    y="195" 
                    textLength="1000" 
                    lengthAdjust="spacingAndGlyphs" 
                    fill="#000000" 
                    fontSize="260" 
                    fontWeight="900" 
                    fontFamily="'Montserrat', sans-serif"
                    style={{ letterSpacing: '-0.03em', wordSpacing: '-0.06em' }}
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
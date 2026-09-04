'use client'

import Link from 'next/link'

const CONTAINER = 'mx-auto w-full max-w-[1340px] px-6'

interface FooterProps {
  variant?: 'default' | 'minimal'
  className?: string
}

export function Footer({ variant = 'default', className = '' }: FooterProps) {
  const isMinimal = variant === 'minimal'
  
  const baseClasses = className || 'relative z-0 w-full bg-[#0A0A0A] overflow-hidden'

  return (
    <footer className={baseClasses}>
      
      {/* Nincs több motion.div, sima statikus konténer */}
      <div className={`w-full relative ${isMinimal ? 'py-8' : 'pt-20 pb-6 md:pt-24'}`}>
        
        {/* ── FLUID BLOB MOZGÓ HÁTTÉR ── */}
        {!isMinimal && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="fluid-blob-field opacity-60 saturate-150">
              <span className="blob blob-1" />
              <span className="blob blob-2" />
              <span className="blob blob-3" />
              <span className="blob blob-4" />
              <span className="blob blob-5" />
            </div>
            {/* Sötétítő átmenet felülről */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
          </div>
        )}

        {/* ── TARTALOM ── */}
        <div className={`${CONTAINER} flex flex-col relative z-10`}>
          
          {/* 1. INFORMÁCIÓS SÁV */}
          <div className={`w-full flex flex-col md:flex-row items-start justify-between gap-10 mb-12 md:mb-16 ${isMinimal ? 'mb-0 opacity-70 hover:opacity-100' : ''}`}>
            
            {/* Bal oldal: Gigantikus Copyright */}
            <div className="flex shrink-0 items-center">
              <span className="font-display text-[32px] md:text-[42px] leading-none tracking-tight font-bold uppercase text-[#F4F2F0]">
                SONAWEB © {new Date().getFullYear()}
              </span>
            </div>

            {/* Jobb oldal: Jogi linkek és Social */}
            <div className="flex flex-col items-start md:items-end gap-3 md:gap-4">
              
              {/* Felső sor: Jogi linkek (Szürkítve) */}
              <div className="flex flex-wrap justify-start md:justify-end gap-5 md:gap-8 font-inter text-[13px] leading-[13px] tracking-wide font-semibold uppercase text-[#9E9A98]">
                <Link href="/legal/privacy-policy" className="transition-colors duration-300 hover:text-[#F4F2F0]">Adatkezelési tájékoztató</Link>
                <Link href="/legal/cookie-policy" className="transition-colors duration-300 hover:text-[#F4F2F0]">Cookie tájékoztató</Link>
                <Link href="/legal/imprint" className="transition-colors duration-300 hover:text-[#F4F2F0]">Impresszum</Link>
              </div>

              {/* Alsó sor: Közösségi média (Szürkítve) */}
              <div className="flex shrink-0 items-center justify-start md:justify-end gap-6 font-inter text-[13px] leading-[13px] tracking-wide font-semibold uppercase text-[#9E9A98]">
                <a href="#" className="transition-colors duration-300 hover:text-[#F4F2F0]">Instagram</a>
                <a href="#" className="transition-colors duration-300 hover:text-[#F4F2F0]">Facebook</a>
              </div>

            </div>

          </div>

          {/* 2. FEHÉR, SVG ALAPÚ SZÖVEG */}
          {!isMinimal && (
            <div className="w-full flex flex-col items-center relative z-0 -mt-4 md:-mt-8">
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
                    fill="#F4F2F0" 
                    fontSize="195" 
                    fontWeight="900" 
                    fontFamily="'Montserrat', sans-serif"
                    style={{ filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.6))' }}
                  >
                    MADE BY
                  </text>

                  <text 
                    x="20" 
                    y="380" 
                    textLength="1000" 
                    lengthAdjust="spacingAndGlyphs" 
                    fill="#F4F2F0" 
                    fontSize="260" 
                    fontWeight="900" 
                    fontFamily="'Montserrat', sans-serif"
                    style={{ filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.6))' }}
                  >
                    GEN Z
                  </text>
                </svg>
              </div>
            </div>
          )}

        </div>
      </div>

    </footer>
  ) 
}
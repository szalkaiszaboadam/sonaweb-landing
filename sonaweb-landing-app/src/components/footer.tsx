'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ShaderGradient } from '@/components/shader-gradient'

export const CONTAINER = "mx-auto w-full max-w-[1800px] px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 2xl:px-36"

interface FooterProps {
  variant?: 'default' | 'minimal'
  className?: string
}

export function Footer({ variant = 'default', className = '' }: FooterProps) {
  const isMinimal = variant === 'minimal'
  const baseClasses = className || 'relative w-full bg-[#0A0A0A] overflow-hidden z-0'
  const footerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  })
  
  const textY = useTransform(scrollYProgress, [0, 1], ["-35%", "0%"])
  const bgY = useTransform(scrollYProgress, [0, 1], ["-40%", "10%"])

  return (
    <footer ref={footerRef} className={baseClasses}>
      <motion.div 
        style={{ y: bgY }} 
        className="absolute left-0 right-0 top-[-20%] h-[150%] z-0 pointer-events-none opacity-90"
      >
        <ShaderGradient className="absolute inset-0 h-full w-full" />
      </motion.div>

      <motion.div 
        style={!isMinimal ? { y: textY } : {}}
        className={`w-full relative z-10 ${isMinimal ? 'py-4' : 'pt-4 pb-4 md:pt-5 md:pb-5'}`}
      >
        <div className={`${CONTAINER} flex flex-col relative z-10`}>
          
          {/* Felső navigációs rész: Grid mobilon (auto méretezéssel), Flex asztalin */}
          <div className={`relative z-20 w-full grid grid-cols-[auto_auto] justify-between gap-x-4 gap-y-12 lg:flex lg:flex-row lg:items-center lg:justify-between ${isMinimal ? 'mb-0' : 'mb-6 md:mb-5'}`}>
            
            {/* 1. Jogi linkek (Mobil: Bal oszlop, Asztali: Jobb oldal) */}
            <div className="col-start-1 row-start-1 flex flex-col items-start gap-y-3 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase lg:order-3 lg:flex-row lg:w-auto lg:shrink-0 lg:items-center lg:justify-end lg:gap-8">
              <Link href="/legal/privacy-policy" className="group text-white">
                <span className="relative inline-flex overflow-hidden py-1">
                  <span className="inline-block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[180%]">
                    Adatkezelési tájékoztató
                  </span>
                  <span className="absolute inset-0 flex items-center whitespace-nowrap translate-y-[180%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Adatkezelési tájékoztató
                  </span>
                </span>
              </Link>
              <Link href="/legal/cookie-policy" className="group text-white">
                <span className="relative inline-flex overflow-hidden py-1">
                  <span className="inline-block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[180%]">
                    Cookie tájékoztató
                  </span>
                  <span className="absolute inset-0 flex items-center whitespace-nowrap translate-y-[180%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Cookie tájékoztató
                  </span>
                </span>
              </Link>
              <Link href="/legal/imprint" className="group text-white">
                <span className="relative inline-flex overflow-hidden py-1">
                  <span className="inline-block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[180%]">
                    Impresszum
                  </span>
                  <span className="absolute inset-0 flex items-center whitespace-nowrap translate-y-[180%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Impresszum
                  </span>
                </span>
              </Link>
            </div>
            
            {/* 2. Közösségi linkek (Mobil: Jobb oszlop, teljesen jobbra tolva) */}
            <div className="col-start-2 row-start-1 flex flex-col items-start justify-self-end gap-y-3 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase lg:justify-self-auto lg:order-2 lg:flex-row lg:w-auto lg:shrink-0 lg:items-center lg:justify-center lg:gap-8">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group text-white">
                <span className="relative inline-flex overflow-hidden py-1">
                  <span className="inline-block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[180%]">
                    Instagram
                  </span>
                  <span className="absolute inset-0 flex items-center whitespace-nowrap translate-y-[180%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Instagram
                  </span>
                </span>
              </a>
              
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="group text-white">
                <span className="relative inline-flex overflow-hidden py-1">
                  <span className="inline-block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[180%]">
                    Facebook
                  </span>
                  <span className="absolute inset-0 flex items-center whitespace-nowrap translate-y-[180%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Facebook
                  </span>
                </span>
              </a>
            </div>

            {/* 3. Copyright (Mobil: Alsó sor, Asztali: Bal oldal) */}
            <div className="col-span-2 col-start-1 row-start-2 flex items-start lg:col-span-1 lg:order-1 lg:items-center lg:shrink-0 lg:row-start-auto">
              <span className="font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase whitespace-nowrap text-white">
                  © {new Date().getFullYear()} SONAWEB KFT.
              </span>
            </div>
            
          </div>

          {!isMinimal && (
            <div className="w-full flex flex-col items-center relative z-0">
              <span className="sr-only">MADE BY GEN Z</span>
              
              <div aria-hidden="true" className="w-[104%] -ml-[2%] flex flex-col gap-4 md:gap-5">
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
                     fill="#FFFFFF" 
                     fontSize="195" 
                     fontWeight="900" 
                     fontFamily="'Montserrat', sans-serif"
                     style={{ letterSpacing: '-0.03em', wordSpacing: '-0.06em' }}
                  >
                    MADE BY
                  </text>
                </svg>

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
                     fill="#FFFFFF" 
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

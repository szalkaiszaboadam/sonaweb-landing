'use client'

import { motion } from 'motion/react'
import { Footer } from '@/components/footer'

const CONTAINER = "mx-auto w-full max-w-[1400px] px-6 sm:px-8 md:px-12 lg:px-20"

function PolicySection({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-16 py-8 md:py-10">
      <div className="md:w-1/3 shrink-0">
        <span className="font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#606060] block md:mt-1">
          {label}
        </span>
      </div>
      <div className="md:w-2/3 flex flex-col gap-6 font-inter text-[18px] leading-[1.6] text-white">
        {children}
      </div>
    </div>
  )
}

export default function ImprintPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] font-inter text-white selection:bg-[#BF2234] selection:text-white pt-32 md:pt-48 flex flex-col">
      <div className={`${CONTAINER} flex-1`}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center justify-center text-center mb-20 md:mb-32"
        >
          <h1 className="font-display text-[clamp(2.5rem,7vw,90px)] font-extrabold uppercase leading-[1.2] tracking-[-1.5px] md:tracking-[-2px] text-white">
            IMPRESSZUM
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col pb-20"
        >
          
          <PolicySection label="SZOLGÁLTATÓ ADATAI">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Cégnév:</span>
              <span>SONAWEB Kft.</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Székhely:</span>
              <span>6600 Csongrád, Példa utca 12.</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Cégjegyzékszám:</span>
              <span>06-09-123456</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Adószám:</span>
              <span>12345678-1-42</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Képviseli:</span>
              <span>Kovács Bence (Ügyvezető)</span>
            </div>
          </PolicySection>

          <PolicySection label="ELÉRHETŐSÉGEK">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">E-mail cím:</span>
              <a href="mailto:hello@sonaweb.hu" className="underline underline-offset-4 w-fit">hello@sonaweb.hu</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Telefonszám:</span>
              <span>+36 30 123 4567</span>
            </div>
          </PolicySection>

          <PolicySection label="TÁRHELYSZOLGÁLTATÓ">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Név:</span>
              <span>Vercel Inc.</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Cím:</span>
              <span>340 S Lemon Ave #4133, Walnut, CA 91789, USA</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">E-mail:</span>
              <span>privacy@vercel.com</span>
            </div>
          </PolicySection>

        </motion.div>
      </div>
      
      <Footer />
    </main>
  )
}

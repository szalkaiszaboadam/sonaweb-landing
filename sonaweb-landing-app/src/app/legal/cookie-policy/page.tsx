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

export default function CookiePolicyPage() {
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
            COOKIE<br />TÁJÉKOZTATÓ
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col pb-20"
        >
          
          <PolicySection label="MI AZ A SÜTI?">
            <p>
              A sütik (cookie-k) kis méretű szöveges fájlok, amelyeket a weboldal helyez el a számítógépeden vagy mobileszközödön a látogatásod során. Segítenek abban, hogy az oldal megfelelően működjön, illetve megjegyezze az alapvető beállításaidat.
            </p>
          </PolicySection>

          <PolicySection label="MILYEN SÜTIKET HASZNÁLUNK?">
            <p>
              Oldalunk kizárólag feltétlenül szükséges, technikai sütiket használ, amelyek a böngészés alapvető működéséhez és a biztonsághoz elengedhetetlenek. Ezek nélkül az oldal nem funkcionálna megfelelően. 
            </p>
            <p>
              Nem használunk és nem telepítünk olyan sütiket, amelyek célja a látogatók követése, harmadik féltől származó hirdetések megjelenítése, vagy személyes profilok építése.
            </p>
          </PolicySection>

          <PolicySection label="HOGYAN KEZELHETED">
            <p>
              A legtöbb böngésző alapértelmezés szerint automatikusan elfogadja a sütiket. Lehetőséged van arra, hogy böngésződ beállításaiban megtiltsd a sütik használatát, vagy értesítést kérj arról, ha egy weboldal sütit próbál menteni az eszközödön.
            </p>
            <p>
              Kérjük, vedd figyelembe, hogy a technikai sütik letiltása esetén előfordulhat, hogy az oldal egyes funkciói nem működnek tökéletesen.
            </p>
          </PolicySection>

        </motion.div>
      </div>
      
      <Footer />
    </main>
  )
}

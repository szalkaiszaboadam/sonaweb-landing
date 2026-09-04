'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

// A tartalom keskenyebb konténert kap a jobb olvashatóságért (max-w-[800px])
const CONTENT_CONTAINER = 'mx-auto w-full max-w-[800px] px-6'
// A footer megtartja az eredeti szélességet
const FOOTER_CONTAINER = 'mx-auto w-full max-w-[1340px] px-6'
import type { Metadata } from 'next';
import { Footer } from '@/components/footer'



export default function ImprintPage() {
  return (
    <main data-theme="dark" className="min-h-screen bg-[#0A0A0A] pt-32 text-[#F4F2F0] lg:pt-44">
      
      <article className={`${CONTENT_CONTAINER} pb-24 md:pb-32`}>
        
        {/* --- FEJLÉC --- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 md:mb-16 border-b border-[#1A1A1A] pb-8 md:pb-12"
        >
          <p className="mb-4 font-inter text-xs font-bold uppercase tracking-[0.2em] text-[#BF2234]">
            Jogi Dokumentumok
          </p>
          <h1 className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-black uppercase leading-[1.05] tracking-[-0.02em]">
            Impresszum
          </h1>
          <p className="mt-6 font-inter text-sm font-medium text-[#5A5755]">
            Utolsó frissítés: 2026. július 05.
          </p>
        </motion.div>

        {/* --- TARTALOM --- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          // A space-y-10 gondoskodik a szekciók közötti távolságról
          className="font-inter text-base font-medium leading-relaxed text-[#9E9A98] space-y-10 md:text-lg"
        >
          
          <section>
            <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-tight text-[#F4F2F0]">
              FELTÖLTÉS ALATT...
            </h2> {/*1. Bevezetés*/}
            {/* <p>
              Ez a dokumentum sablonként szolgál a jogi szövegekhez. A bekezdéseket ilyen &lt;p&gt; tagek közé kell majd bemásolnod, hogy megkapják ezt a letisztult, könnyen olvasható stílust.
            </p>*/}
          </section>

 {/* 

          <section>
            <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-tight text-[#F4F2F0]">
              2. Kezelt adatok köre
            </h2>
            <p className="mb-4">
              Ha listát szeretnél használni a jogi dokumentumban (például felsorolni a cookie-kat vagy az adatokat), azt így teheted meg:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#9E9A98]">
              <li>Kapcsolattartási adatok (Név, E-mail cím)</li>
              <li>Technikai azonosítók (IP cím, böngésző adatok)</li>
              <li>Analitikai információk</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-tight text-[#F4F2F0]">
              3. Az adatkezelés célja
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </section>
*/}
        </motion.div>
      </article>

      <Footer />
    </main>
  )
}
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

export default function PrivacyPolicyPage() {
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
            ADATKEZELÉSI<br />TÁJÉKOZTATÓ
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col pb-20"
        >
          
          <PolicySection label="MIT GYŰJTÜNK">
            <p>
              A weboldalon nincsenek felhasználói fiókok és látogatói bejelentkezések. Az egyetlen személyes adat, amellyel rendelkezünk, az, amit te önként megadsz nekünk: ha kitöltöd a kapcsolatfelvételi vagy árajánlatkérő űrlapunkat.
            </p>
            <p>
              Ilyenkor megkapjuk a nevedet, az e-mail címedet, esetlegesen a telefonszámodat, illetve az üzeneted tartalmát — ezeket az információkat pedig kizárólag arra használjuk, hogy válaszoljunk neked és elkészítsük a kért árajánlatot. Nem teszünk fel semmilyen kéretlen levelezőlistára.
            </p>
          </PolicySection>

          <PolicySection label="SÜTIK ÉS ANALITIKA">
            <p>
              A publikus weboldalunk nem használ olyan sütiket (cookies), amelyek harmadik fél számára továbbítanának adatokat, és nem futtatunk agresszív analitikai szoftvereket, amelyek követnének téged az interneten. Nem építünk rólad profilt.
            </p>
            <p>
              A weboldal a Vercel szerverein fut, amely a biztonságos és gyors működés érdekében alapvető technikai adatokat (például a hálózati IP címedet) dolgozhat fel a saját adatvédelmi irányelvei szerint.
            </p>
          </PolicySection>

          <PolicySection label="KIK VANNAK BEVONVA">
            <p>
              A weboldal stabil működéséhez és a beérkező e-mailek kezeléséhez néhány megbízható, iparági sztenderd partnert veszünk igénybe. A Vercelt használjuk a weboldal hosztolására, az e-mailek kezelésére pedig titkosított levelezőszervereket. 
            </p>
            <p>
              Ezek a partnerek szigorúan csak a szolgáltatás nyújtásához elengedhetetlen technikai adatokat dolgozzák fel, és semmilyen formában nem értékesítik a személyes adataidat.
            </p>
          </PolicySection>

          <PolicySection label="ADATBIZTONSÁG">
            <p>
              Mivel nem gyűjtünk tömegesen felhasználói adatokat, és nem tárolunk szenzitív információkat a szervereinken, a kiszivárgás kockázata minimális. A beérkező megkereséseket zárt, titkosított rendszerben kezeljük, amelyhez csak a SONAWEB Kft. jogosult munkatársai férhetnek hozzá.
            </p>
          </PolicySection>

          <PolicySection label="KÉRDÉSED VAN?">
            <p>
              Ha bármilyen kérdésed lenne ezzel az adatkezelési tájékoztatóval kapcsolatban, vagy szeretnéd gyakorolni az adataid törléséhez fűződő jogodat, nyugodtan írj nekünk a <a href="mailto:hello@sonaweb.hu" className="underline underline-offset-4">hello@sonaweb.hu</a> e-mail címre.
            </p>
          </PolicySection>

        </motion.div>
      </div>
      
      <Footer />
    </main>
  )
}

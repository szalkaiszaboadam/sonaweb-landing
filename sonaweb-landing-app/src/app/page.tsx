'use client'

// 1. Az importok közé tedd be:
import { EstimateDrawer } from '@/components/estimate-drawer'

import {
  useRef,
  useEffect,
  useState,
  useContext,
  useMemo, // <--- EZT ADD HOZZÁ!s
  createContext,
  useCallback,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  motion,
  type Variants,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useAnimationFrame,
  wrap,
  type MotionValue,
} from 'motion/react'
import { ArrowRight, ArrowLeft, ArrowUpRight, Plus, Pause, Play } from 'lucide-react'
import { useCustomCursor } from '@/components/custom-cursor'
import { Footer } from '@/components/footer'

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'


type ScrollContextValue = {
  smoothY: MotionValue<number>
}
const ScrollContext = createContext<ScrollContextValue | null>(null)

export function useSmoothScroll() {
  return useContext(ScrollContext)
}

const CONTAINER = 'mx-auto w-full max-w-[1340px] px-6'


const PROJECTS = [
  { name: 'TechFlow / B2B SaaS', src: '/placeholder.svg', h: 'h-[280px] md:h-[360px]', href: '/work/projekt-1'  },
  { name: 'DataSync / Enterprise', src: '/placeholder.svg', h: 'h-[340px] md:h-[480px]', href: '/work/projekt-1'  },
  { name: 'OmniPay / FinTech', src: '/placeholder.svg', h: 'h-[240px] md:h-[320px]', href: '/work/projekt-1'  },
  { name: 'CloudScale / AI Platform', src: '/placeholder.svg', h: 'h-[300px] md:h-[400px]', href: '/work/projekt-1'  },
  { name: '<TestimonialsSection />', src: '/placeholder.svg', h: 'h-[280px] md:h-[380px]', href: '/work/projekt-1'  },
]

export function WorksCarousel() {
  const [isHovered, setIsHovered] = useState(false)
  const baseX = useMotionValue(0)

  const { setCursor, clearCursor } = useCustomCursor()

  // ── EXTRÉM LASSÚ ALAPSEBESSÉG ÉS SZINTE ÁLLÓ HOVER ──
  const NORMAL_SPEED = -0.008
  const HOVER_SPEED = -0.002

  const velocity = useMotionValue(NORMAL_SPEED)
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 })

  useEffect(() => {
    if (isHovered) {
      velocity.set(HOVER_SPEED)
    } else {
      velocity.set(NORMAL_SPEED)
    }
  }, [isHovered, velocity])

  useAnimationFrame((t, delta) => {
    let moveBy = smoothVelocity.get() * (delta / 16)
    baseX.set(baseX.get() + moveBy)
  })

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  return (
    // Innen levettük a hover figyelést, hogy ne az egész sáv reagáljon
    <div className="overflow-hidden w-full flex">
      <motion.div
        className="flex items-start gap-3 md:gap-4 px-5 md:px-6"
        style={{ x }}
      >
        {[...PROJECTS, ...PROJECTS, ...PROJECTS, ...PROJECTS].map((project, i) => (
          <div key={i} className="flex flex-col shrink-0">
            
            {/* A teljes elem most már egy kattintható link */}
            <Link href={project.href || '#'} className="group flex flex-col">
              
              {/* HOVER FIGYELÉS CSAK A KÉPEN: Itt lassít és itt adja a kurzort */}
              <div
                className={`relative w-[260px] md:w-[360px] ${project.h} overflow-hidden rounded-xl bg-white/5`}
                onMouseEnter={() => {
                  setIsHovered(true)
                  setCursor({ active: true, label: 'Megnézem' })
                }}
                onMouseLeave={() => {
                  setIsHovered(false)
                  clearCursor()
                }}
              >
                <Image
                  src={project.src}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="mt-5 w-fit">
                {/* Tiszta fehér szöveg, semmi hover színváltozás */}
                <h4 className="font-inter text-[13px] font-semibold uppercase tracking-[-0.2px] text-white">
                  {project.name}
                </h4>
              </div>

            </Link>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ── ADATOK ──
const TESTIMONIALS = [
  {
    quote: 'A SONAWEB hat hét alatt újrahúzta az online jelenlétünket. A konverzió megugrott, a folyamat pedig végig profi és zökkenőmentes volt.',
    name: 'Fischer Elena',
    role: 'Alapító, Aurélie Skincare',
  },
  {
    quote: 'Az egyetlen csapat, amely valóban érti a dizájnt és a számokat is. A hirdetéseink két év után először nyereségesek.',
    name: 'Vogel Márk',
    role: 'Ügyvezető, Northpeak Outdoors',
  },
  {
    quote: 'Olyan, mintha lenne egy saját kreatív részlegünk — csak sokkal gyorsabban és megszállottan az eredményekre fókuszálva.',
    name: 'Nagy Petra',
    role: 'Marketingvezető, Lumen Studio',
  },
  {
    quote: 'Minden leadott munka felülmúlta az elvárásainkat. Új mércét állítottak fel abban, amit egy ügynökségtől ma elvárunk.',
    name: 'Becker Tamás',
    role: 'Igazgató, Halcyon Hotels',
  },
]

const CLIENTS = [
  { name: 'TÜRKIZ', logo: '/logos/turkiz.svg' },
  { name: 'Rózsé Budapest', logo: '/logos/rozse.svg' },
  { name: 'SZVG Tools', logo: '/logos/szvg-tools.svg' },
  { name: 'Haberkorn', logo: '/logos/haberkorn.svg' },
  { name: 'C-Univerzál', logo: '/logos/c-univerzal.svg' },
  { name: 'Titanium', logo: '/logos/titanium.svg' },
  { name: 'Bori Tanya', logo: '/logos/bori-tanya.svg' },
  { name: 'Nexus', logo: '/logos/nexus.svg' },
  { name: 'OmniPay', logo: '/logos/omnipay.svg' },
  { name: 'CloudScale', logo: '/logos/cloudscale.svg' },
]



// ── 1. MEGOLDÁSOK SZEKCIÓ ──
const NEW_SERVICES = [
  {
    index: '01',
    category: 'DIGITÁLIS',
    desc: 'Komplex platformokat építünk, amelyek a prémium dizájnt mérhető üzleti eredményekkel kötik össze. A látvány és a technológiai funkció kompromisszummentes egyensúlya.',
    tags: ['Weboldalak', 'Landing oldalak', 'Webshopok', 'UX/UI']
  },
  {
    index: '02',
    category: 'TARTALOM',
    desc: 'Megállítjuk a görgetést. Olyan márkaazonos, tűéles vizuális anyagokat és koncepciókat készítünk, amelyek azonnali professzionalizmust és bizalmat közvetítenek.',
    tags: ['Videógyártás', 'Márkafotózás', 'Kreatív koncepciók', 'Szövegírás']
  },
  {
    index: '03',
    category: 'MARKETING',
    desc: 'Adatvezérelt, precíziós kampányrendszerek. Nem hiúsági mérőszámokat kergetünk, hanem stabil ügyfélszerzést és kiszámítható bevételt generálunk.',
    tags: ['Meta Ads', 'Google Ads', 'SEO', 'Email Automatizáció']
  },
  {
    index: '04',
    category: 'NÖVEKEDÉS',
    desc: 'Kiszámíthatóság a találgatás helyett. Stratégiai átvilágítás, mély analitika és iteratív optimalizálás a hosszú távú, skálázható piaci előnyért.',
    tags: ['Stratégia', 'Mérési rendszerek', 'CRO', 'Értékesítési tölcsérek']
  }
]

export function Services() {
  return (
    <section className="relative z-10 w-full bg-[#0A0A0A] py-24 md:py-36" data-theme="dark">
      <div className={`${CONTAINER}`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-6 border-b border-[#F4F2F0]/10 pb-12 md:flex-row md:items-end md:justify-between md:gap-12 md:pb-16"
        >
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] font-extrabold uppercase leading-[0.88] tracking-[-2px] text-[#F4F2F0]">
            Megoldások
          </h2>
          <p className="max-w-sm font-inter text-[15px] font-medium leading-relaxed text-[#9E9A98] md:text-right">
            Prémium digitális termékek és célzott növekedési rendszerek olyan B2B vállalatoknak, amelyek piaci szintlépésre készülnek.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col"
        >
          {NEW_SERVICES.map((service, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="group relative overflow-hidden border-b border-[#F4F2F0]/10"
            >
              {/* Finom 5%-os fehér áttetszőség hoverre */}
              <div className="absolute inset-0 origin-left scale-x-0 bg-[#F4F2F0]/5 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
              
              {/* Körvonalas szellemszám */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 select-none font-display text-[clamp(9rem,16vw,14rem)] font-black leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(244,242,240,0.08)] md:block ${
                  i % 2 === 0 ? '-right-6 lg:-right-10' : '-left-6 lg:-left-10'
                }`}
              >
                {service.index}
              </span>

              <div className="relative grid grid-cols-1 gap-6 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                <h3 className="font-display text-[2.25rem] font-bold uppercase leading-[0.95] tracking-tight text-[#F4F2F0] md:col-span-4 md:text-[2.75rem]">
                  {service.category}
                </h3>
                
                <div className="md:col-span-8">
                  <p className="mb-8 max-w-xl font-inter text-[16px] font-medium leading-[1.6] text-[#9E9A98] md:text-[18px]">
                    {service.desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {service.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="rounded-full border border-[#F4F2F0]/10 bg-[#F4F2F0]/5 px-4 py-2 font-inter text-[12px] font-semibold tracking-wider text-[#F4F2F0]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── 2. FLOW SZEKCIÓ ──
const FLOW_STEPS = [
  {
    step: '01',
    title: 'Felfedezés & Stratégia',
    desc: 'Mélyfúrás a márkádba. Legyen szó új arculatról, videóforgatásról vagy weboldalról, először megértjük a piacodat, a versenytársakat és az üzleti céljaidat. Ebből építünk betonbiztos alapot.',
    output: 'Stratégiai terv, Kutatási brief'
  },
  {
    step: '02',
    title: 'Koncepció & Tervezés',
    desc: 'Vizuális irányvonalak, hirdetési struktúrák vagy forgatókönyvek kidolgozása. Megtervezzük azt a kompromisszummentes minőséget, ami azonnal elválaszt a versenytársaidtól.',
    output: 'Design tervek, Storyboard, Kampánystruktúra'
  },
  {
    step: '03',
    title: 'Kivitelezés & Gyártás',
    desc: 'A tervek valósággá válnak. Pixelpontos kódolás, prémium fotó- és videógyártás, vagy hirdetési kreatívok készítése. Nyers kreativitás, maximális precizitással fűszerezve.',
    output: 'Éles weboldal, Kész videók/fotók, Hirdetési anyagok'
  },
  {
    step: '04',
    title: 'Indítás & Skálázás',
    desc: 'Az indulás csak a kezdet. Élesítjük a projektet, majd adatok alapján optimalizálunk. Teszteljük a hirdetéseket és finomhangoljuk a konverziót, hogy a befektetésed maximálisan megtérüljön.',
    output: 'Elindított kampány, Folyamatos optimalizálás'
  }
]

const STEP_OFFSET = [
  'md:ml-0',
  'md:ml-10 lg:ml-16',
  'md:ml-20 lg:ml-32',
  'md:ml-32 lg:ml-48',
]

export function FlowSection() {
  return (
    <section className="relative z-10 w-full bg-[#0A0A0A] pb-24 pt-12 md:pb-36 md:pt-16" data-theme="dark">
      <div className={`${CONTAINER}`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-16 max-w-lg md:mb-24"
        >
          <h2 className="font-display text-[clamp(3rem,7vw,5.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-2px] text-[#F4F2F0]">
            Flow
          </h2>
          <p className="mt-5 font-inter text-[15px] font-medium leading-relaxed text-[#9E9A98]">
            Univerzális, bevált munkafolyamatunk. Így lesz egy kezdeti ötletből és briefből kézzelfogható, mérhető eredményt hozó projekt.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          className="flex flex-col"
        >
          {FLOW_STEPS.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className={`transition-[margin] ${STEP_OFFSET[idx]}`}
            >
              {idx !== 0 && <div className="ml-[1.375rem] h-8 w-px bg-[#F4F2F0]/10" />}
              <div className="flex items-start gap-6 border-b border-[#F4F2F0]/10 pb-12 pt-2 md:pb-16">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#BF2234] font-inter text-[13px] font-bold text-[#BF2234]">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="mb-4 font-display text-[1.75rem] font-bold uppercase leading-[1.02] tracking-tight text-[#F4F2F0] md:text-[2.25rem]">
                    {item.title}
                  </h3>
                  <p className="mb-6 max-w-xl font-inter text-[16px] font-medium leading-[1.65] text-[#9E9A98] md:text-[17px]">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-inter text-[11px] font-bold uppercase tracking-widest text-[#9E9A98]">
                      Kimenet:
                    </span>
                    <span className="font-inter text-[13px] font-semibold tracking-wider text-[#F4F2F0]">
                      {item.output}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── 3. WORKS CAROUSEL (Részlet) ──
// Csak a háttereket cseréljük opacity-alapúra
// a kártyákon a `bg-[#141414]` helyett használd ezt: `bg-[#F4F2F0]/5`

// ── 4. SOCIAL PROOF SZEKCIÓ ──
export function SocialProofSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const current = TESTIMONIALS[currentIndex]

  return (
    <section className="relative z-10 w-full bg-[#0A0A0A] py-28 md:py-40 overflow-hidden" data-theme="dark">
      <div className={`${CONTAINER} flex flex-col items-center text-center`}>
        
        <p className="mb-10 font-inter text-[13px] font-semibold uppercase tracking-widest text-[#9E9A98]">
          Akikkel már dolgoztunk
        </p>

        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] mb-28 md:mb-36">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 45, ease: 'linear', repeat: Infinity }}
            className="flex w-max items-center gap-14 md:gap-24 py-2"
          >
           {[...CLIENTS, ...CLIENTS].map((client, i) => (
              <div key={i} className="relative h-10 w-28 md:h-12 md:w-36 opacity-40">
                <Image
                  src={client.logo} 
                  alt={`${client.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mb-6 font-display text-5xl md:text-6xl font-black leading-none text-white select-none">
          “
        </div>

        <div className="relative w-full max-w-4xl min-h-[190px] md:min-h-[170px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <h3 className="font-display text-[clamp(1.65rem,3.5vw,2.65rem)] font-medium leading-[1.3] tracking-tight text-white max-w-3xl">
                {current.quote}
              </h3>

              <div className="mt-8 flex flex-col items-center gap-1">
                <span className="font-inter text-[15px] font-bold text-white">
                  {current.name}
                </span>
                <span className="font-inter text-[13px] font-medium text-[#9E9A98]">
                  {current.role}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pöttyök: Opacity alapú fehérek */}
        <div className="mt-12 flex items-center justify-center gap-3">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Ugrás a(z) ${i + 1}. véleményre`}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                currentIndex === i 
                  ? 'bg-white' 
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

// ── 5. ABOUT SZEKCIÓ (Light Mode) ──
export function AboutSection() {
  return (
    <section id="about" className="relative z-10 w-full scroll-mt-28 bg-white py-24 md:py-36" data-theme="light">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -15% 0px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.15 } }
        }}
        className={`${CONTAINER} grid gap-12 md:gap-16 lg:grid-cols-12 lg:items-center`}
      >
        {/* Light módban a határolókhoz a Fekete (#0A0A0A) opacity-s verzióját használjuk! */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.98 },
            show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="relative h-[380px] w-full overflow-hidden rounded-3xl border border-[#0A0A0A]/10 bg-[#0A0A0A]/5 lg:col-span-6 lg:h-[520px]"
        >
          <motion.div
            variants={{
              hidden: { scale: 1.1 },
              show: { scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="absolute inset-0 h-full w-full"
          >
            <Image 
              src="/placeholder.svg" 
              alt="Rólunk" 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw" 
              className="object-cover" 
            />
          </motion.div>
        </motion.div>

        <div className="flex flex-col justify-center text-left lg:col-span-6 lg:pl-6">
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 25 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="mb-8 font-display text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold uppercase leading-[1.02] tracking-[-1.5px] md:tracking-[-3px] text-[#0A0A0A]"
          >
            Nem vagyunk <br className="hidden lg:block" /> hagyományos <br className="hidden lg:block" /> ügynökség.
          </motion.h2>

          {/* Másodlagos szöveg: 70%-os fekete */}
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }} 
            className="mb-10 font-inter text-[16px] md:text-[18px] font-normal leading-[1.7] text-[#0A0A0A]/70"
          >
            Hisszük, hogy a prémium dizájn és a tűpontos stratégia nem létezhet egymás nélkül. Nincsenek felesleges körök és account menedzser hadsereg. Csak nyers kreativitás, adatalapú döntések és kompromisszummentes kivitelezés.
          </motion.p>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
          >
            <Link 
              href="/start" 
              className="group inline-flex items-center justify-center rounded-full bg-[#BF2234] px-7 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white overflow-hidden"
            >
              {/* TEXT ROLL EFFEKTUS */}
              <span className="relative inline-flex overflow-hidden">
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                  Vágjunk bele
                </span>
                <span className="absolute left-0 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                  Vágjunk bele
                </span>
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}





export default function HomePage() {
const [isEstimateOpen, setIsEstimateOpen] = useState(false)

  return (
   <main className="bg-[#0A0A0A] font-inter text-[#F4F2F0] selection:bg-[#BF2234] selection:text-[#F4F2F0]">
    
<style>{`
        .fluid-blob-field { position: absolute; inset: -30%; background: transparent; filter: blur(20px) saturate(1.2); }
        .blob { position: absolute; border-radius: 50%; mix-blend-mode: lighten; will-change: transform; opacity: 0.9; }
        
        /* Élénk, sötét háttéren is jól mutató vörös árnyalatok a #BF2234 köré építve */
        .blob-1 { width: 55%; height: 55%; top: 5%; left: 0%; background: radial-gradient(circle, #D92B3D 0%, rgba(217,43,61,0) 70%); animation: drift1 14s ease-in-out infinite; }
        .blob-2 { width: 60%; height: 60%; top: 20%; left: 55%; background: radial-gradient(circle, #BF2234 0%, rgba(191,34,52,0) 70%); animation: drift2 16s ease-in-out infinite; }
        .blob-3 { width: 45%; height: 45%; top: 45%; left: 25%; background: radial-gradient(circle, #E52E42 0%, rgba(229,46,66,0) 70%); animation: drift3 12s ease-in-out infinite; }
        .blob-4 { width: 40%; height: 40%; top: -5%; left: 35%; background: radial-gradient(circle, #BF2234 0%, rgba(191,34,52,0) 70%); animation: drift4 18s ease-in-out infinite; }
        .blob-5 { width: 50%; height: 50%; top: 40%; left: -5%; background: radial-gradient(circle, #9E1B2A 0%, rgba(158,27,42,0) 70%); animation: drift5 15s ease-in-out infinite; }
        
        @keyframes drift1 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 33% { transform: translate(25%, 15%) scale(1.15); } 66% { transform: translate(-10%, 25%) scale(0.9); } }
        @keyframes drift2 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 33% { transform: translate(-20%, 20%) scale(0.9); } 66% { transform: translate(-30%, -10%) scale(1.1); } }
        @keyframes drift3 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 50% { transform: translate(20%, -20%) scale(1.2); } }
        @keyframes drift4 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 50% { transform: translate(15%, 30%) scale(0.85); } }
        @keyframes drift5 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 50% { transform: translate(30%, 10%) scale(1.1); } }
      `}</style>


{/* Hero */}
      <section data-theme="dark" className="relative flex min-h-[100svh] w-full flex-col items-center justify-between overflow-hidden bg-[#0A0A0A] pt-[15vh] md:pt-[20vh]">
        <motion.div className="mx-auto w-full max-w-[1340px] px-6 relative z-30 flex flex-1 flex-col items-center justify-center text-center -mt-12 md:-mt-20">
          <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }} className="flex w-full flex-col items-center">
            
            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }} className="w-full mb-8 md:mb-10 flex justify-center">
              <div className="relative w-full h-[28vw] md:h-[18vw] overflow-hidden" style={{ WebkitMask: 'url(/sonaweb-logo-white.png) center/contain no-repeat', mask: 'url(/sonaweb-logo-white.png) center/contain no-repeat', transform: 'translateZ(0)', filter: 'drop-shadow(0 0 45px rgba(191,34,52,0.55)) drop-shadow(0 0 90px rgba(191,34,52,0.35))' }}>
                <div className="fluid-blob-field">
                  <span className="blob blob-1" /><span className="blob blob-2" /><span className="blob blob-3" /><span className="blob blob-4" /><span className="blob blob-5" />
                </div>
              </div>
            </motion.div>
            
            <motion.p variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }} className="max-w-2xl font-inter text-[16px] font-semibold leading-[22.4px] tracking-[-0.2px] text-white mb-8 md:mb-12">
              A senior B2B brand and web studio. We design brands and the websites that carry them, built to the standard of the best work on the web, then help both grow.
            </motion.p>
            
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }} className="mb-12 md:mb-16">
              
              {/* "Text Roll" Gomb */}
              <Link 
                href="/start" 
                className="group flex w-full items-center justify-center rounded-full bg-white px-7 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#0A0A0A] overflow-hidden sm:w-auto"
              >
                <span className="relative inline-flex overflow-hidden">
                  {/* Eredeti szöveg: kicsúszik felfelé */}
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                    Start a project
                  </span>
                  {/* Új szöveg: alulról becsúszik */}
                  <span className="absolute left-0 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Start a project
                  </span>
                </span>
              </Link>

            </motion.div>

          </motion.div>
        </motion.div>
        <div className="w-full relative z-20 pb-8 md:pb-12"><WorksCarousel /></div>
      </section>

      <SocialProofSection />
      <AboutSection />


{/* ── MINIMALISTA, KÖZÉPRE ZÁRT CTA ── */}
      <section className="relative z-10 w-full bg-[#0A0A0A] py-32 md:py-48 overflow-hidden" data-theme="dark">
        <div className={`${CONTAINER} flex flex-col items-center justify-center text-center`}>
          
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
            }}
            className="flex w-full flex-col items-center"
          >
            {/* 1. DISZKRÉT KIS MEGJEGYZÉS */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="mb-8 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#9E9A98]"
            >
              Nincsenek felesleges körök
            </motion.p>

            {/* 2. FŐCÍM (Sorköz az About szekcióhoz igazítva: leading-[1.02]) */}
            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 35 },
                show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="mb-10 font-display text-[clamp(2.75rem,7vw,90px)] font-extrabold uppercase leading-[1.02] tracking-[-1.5px] md:tracking-[-3px] text-white max-w-4xl"
            >
              Indítsuk el a <br className="hidden md:block" /> közös munkát.
            </motion.h2>

            {/* 3. LEÍRÁS */}
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="mb-14 max-w-2xl font-inter text-[16px] md:text-[18px] font-medium leading-[1.7] text-[#9E9A98]"
            >
              Készen állsz a szintlépésre? Mesélj a céljaidról, mi pedig megtervezzük és megépítjük a prémium megoldást, ami mérhető eredményeket hoz.
            </motion.p>

            {/* 4. GOMB */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
            >
              <Link
                href="/start"
                className="group inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#0A0A0A] overflow-hidden"
              >
                <span className="relative inline-flex overflow-hidden">
                  <span className="flex items-center gap-1.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                    Start a project
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="absolute left-0 flex items-center gap-1.5 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Start a project
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                </span>
              </Link>
            </motion.div>

          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
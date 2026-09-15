'use client'


import {
  useRef,
  useEffect,
  useState,
  useContext,
  useMemo,
  createContext,
  useCallback,
  type MouseEvent as ReactMouseEvent,
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
import { ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Footer } from '@/components/footer'
import { useCustomCursor } from '@/components/custom-cursor'


type ScrollContextValue = {
  smoothY: MotionValue<number>
}
const ScrollContext = createContext<ScrollContextValue | null>(null)

export function useSmoothScroll() {
  return useContext(ScrollContext)
}
// @/constants/layout.ts (vagy ahol a CONTAINER konstansod definiálva van)
export const CONTAINER = "mx-auto w-full max-w-[1800px] px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 2xl:px-36"



const PROJECTS = [
  { name: 'TechFlow / B2B SaaS', src: '/placeholder.svg', h: 'h-[280px] md:h-[360px]', href: '/work/projekt-1' },
  { name: 'DataSync / Enterprise', src: '/placeholder.svg', h: 'h-[340px] md:h-[480px]', href: '/work/projekt-1' },
  { name: 'OmniPay / FinTech', src: '/placeholder.svg', h: 'h-[240px] md:h-[320px]', href: '/work/projekt-1' },
  { name: 'CloudScale / AI Platform', src: '/placeholder.svg', h: 'h-[300px] md:h-[400px]', href: '/work/projekt-1' },
  { name: '<TestimonialsSection />', src: '/placeholder.svg', h: 'h-[280px] md:h-[380px]', href: '/work/projekt-1' },
]



export function WorksCarousel() {
  const baseX = useMotionValue(0)
  const SPEED = -0.008
  const velocity = useMotionValue(SPEED)
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 })

  useAnimationFrame((t, delta) => {
    let moveBy = smoothVelocity.get() * (delta / 16)
    baseX.set(baseX.get() + moveBy)
  })

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  // Egy leheletnyivel nagyobb méretek, megtartva az arányokat és az eltérő formátumokat
  const CAROUSEL_DIMS = [
    { width: 'w-[350px] md:w-[500px]', height: 'h-[250px] md:h-[360px]' }, // Széles fekvő
    { width: 'w-[245px] md:w-[345px]', height: 'h-[375px] md:h-[530px]' }, // Magas álló portré
    { width: 'w-[290px] md:w-[410px]', height: 'h-[290px] md:h-[410px]' }, // Nagyobb négyzet
    { width: 'w-[260px] md:w-[370px]', height: 'h-[335px] md:h-[470px]' }, // Közepes portré
    { width: 'w-[325px] md:w-[460px]', height: 'h-[280px] md:h-[390px]' }, // Klasszikus fekvő
  ]

  return (
    <div className="flex w-full overflow-hidden">
      <motion.div
        className="flex items-start gap-4 px-4 md:gap-6 md:px-6"
        style={{ x }}
      >
        {[...PROJECTS, ...PROJECTS, ...PROJECTS, ...PROJECTS].map((project, i) => {
          const dim = CAROUSEL_DIMS[i % CAROUSEL_DIMS.length]

          return (
            <div key={i} className="flex shrink-0 flex-col">
              <div
                className={`relative ${dim.width} ${dim.height} overflow-hidden rounded-2xl bg-white/5`}
              >
                <Image
                  src={project.src}
                  alt={project.name || 'Project Image'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}




const SERVICES = [
  {
    num: '01',
    title: 'Web & Rendszerek',
    deliverables: [
      'Next.js platformok',
      'Headless e-commerce',
      'Design system & UI',
      'Egyedi rendszerek',
    ],
  },
  {
    num: '02',
    title: 'Tartalom & Média',
    deliverables: [
      'Márkafilmek & reklám',
      'Social média produkció',
      'Art direction',
      'Kampányfotográfia',
    ],
  },
  {
    num: '03',
    title: 'Hirdetés & Növekedés',
    deliverables: [
      'Meta & Google Ads',
      'Értékesítési funnelek',
      'Konverzióoptimalizálás',
      'Szerveroldali analitika',
    ],
  },
  {
    num: '04',
    title: 'Stratégia & AI',
    deliverables: [
      'Answer Engine Optimization',
      'Generatív AI keresés',
      'Technikai SEO audit',
      'Márkapozicionálás',
    ],
  },
] as const
 
export function Services() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
 
  return (
    <section
      id="services"
      className="relative z-10 w-full bg-[#0A0A0A] py-32 md:py-48 overflow-hidden"
      data-theme="dark"
    >
      <div className={CONTAINER}>
        {/* ── FEJLÉC ── */}
        <div className="mb-16 flex items-center justify-between md:mb-24">
          <span className="font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-bold uppercase text-white/40">
            Szolgáltatások
          </span>
          <span className="flex items-center gap-2 font-inter text-[13px] font-bold uppercase tracking-[-0.2px] text-white/30 md:text-[14px]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#D90429]" />
            04 terület
          </span>
        </div>
 
        {/* ── SOROK ── */}
        <div className="flex flex-col border-t border-white/10">
          {SERVICES.map((service, i) => {
            const isHovered = hoveredIdx === i
            const isDimmed = hoveredIdx !== null && hoveredIdx !== i
 
            return (
              <button
                key={service.num}
                type="button"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onFocus={() => setHoveredIdx(i)}
                onBlur={() => setHoveredIdx(null)}
                className="group grid w-full grid-cols-[auto_1fr] items-center gap-x-6 border-b border-white/10 py-2 text-left focus:outline-none md:grid-cols-[56px_1fr_minmax(0,340px)] md:gap-x-10 md:py-3"
              >
                {/* Sorszám — csak desktopon, mint egy futó index */}
                <span
                  className={`hidden font-inter text-[13px] font-bold tracking-[-0.2px] transition-colors duration-300 md:block ${
                    isHovered ? 'text-[#D90429]' : 'text-white/25'
                  }`}
                >
                  {service.num}
                </span>
 
                {/* Cím */}
                <span
                  className={`font-display text-[clamp(2.2rem,6vw,84px)] font-extrabold uppercase leading-[1] tracking-[-1.5px] transition-colors duration-300 ease-out md:tracking-[-2.5px] ${
                    isDimmed ? 'text-white/25' : 'text-white'
                  }`}
                >
                  {service.title}
                </span>
 
                {/* Kompetenciák — fix helyen álló, fade-elő lista a sor jobb szélén, nem tolja el a layoutot */}
                <div className="col-span-2 hidden overflow-hidden pl-[76px] md:col-span-1 md:block md:pl-0">
                  <ul
                    className={`space-y-1.5 transition-all duration-300 ease-out ${
                      isHovered ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
                    }`}
                  >
                    {service.deliverables.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 font-inter text-[13px] font-medium text-white/50"
                      >
                        <span className="h-px w-3 shrink-0 bg-white/25" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
 
                {/* Mobilon a lista a cím alatt fut, sima szöveges felsorolásként, hoverre (érintésre) */}
                <div
                  className={`col-span-2 overflow-hidden transition-all duration-300 ease-out md:hidden ${
                    isHovered ? 'mt-2 max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="font-inter text-[13px] font-medium leading-relaxed text-white/50">
                    {service.deliverables.join(' · ')}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
 
 
 

const CLIENTS = [
  { name: 'Türkiz', logo: '/placeholder-logo.svg' },
  { name: 'Rose Budapest', logo: '/placeholder-logo.svg' },
  { name: 'SZVG Tools', logo: '/placeholder-logo.svg' },
  { name: 'Struktur', logo: '/placeholder-logo.svg' },
]


export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 w-full bg-[#0A0A0A] py-28 md:py-40 overflow-hidden"
      data-theme="dark"
    >
      <div className={CONTAINER}>
        <div className="w-full text-center">
          {/* Eyebrow — halkan futó, ritkított kis felirat a headline felett */}

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 block font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white/40 md:mb-8 md:text-[13px]"

          >
            Rólunk
          </motion.span>
 
          {/* Headline — soronként külön kijelentés, a lényeg aláhúzva */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full font-display text-[clamp(1.9rem,5vw,72px)] font-extrabold uppercase leading-[1.12] tracking-[-1px] text-white md:tracking-[-2px]"
          >
            <span className="block">Soha nem „csak egy weboldal.”</span>
            <span className="block">
              Minden{' '}
              <span className="underline decoration-2 underline-offset-[6px]">
                részlet
              </span>{' '}
              számít.
            </span>
            <span className="block">Digitális élményeket építünk.</span>
            <span className="block">A te ötleted. A mi megszállottságunk.</span>
            <span className="block">
              A te márkád. A mi{' '}
              <span className="underline decoration-2 underline-offset-[6px]">
                játszóterünk
              </span>
              .
            </span>
          </motion.h2>
        </div>
      </div>
    </section>
  )
}
 


// ── 6 PROJEKT ADATAI ──
const PROJECTS2 = [
  {
    title: 'TÜRKIZ Restaurant',
    image: '/dukay-winnery-1.webp',
    link: '/work/turkiz',
  },
  {
    title: 'Rose Budapest',
    image: '/solcar-1.webp',
    link: '/work/rose',
  },
  {
    title: 'SZVG Tools',
    image: '/gazgepker-2.webp',
    link: '/work/szvg',
  },
  {
    title: 'Struktur Marketing',
    image: '/placeholder.svg',
    link: '/work/struktur',
  },
  {
    title: 'Aura Studio',
    image: '/placeholder.svg',
    link: '/work/aura',
  },
  {
    title: 'Kavics Atelier',
    image: '/placeholder.svg',
    link: '/work/kavics',
  },
]

// ── 12-OSZLOPOS EDITORIAL GRID KONFIGURÁCIÓ ──
const EDITORIAL_CONFIGS = [
  {
    gridClass: 'md:col-span-7 md:col-start-1',
    aspect: 'aspect-[16/11]',
  },
  {
    gridClass: 'md:col-span-4 md:col-start-9 md:mt-36 lg:mt-48',
    aspect: 'aspect-[3/4]',
  },
  {
    gridClass: 'md:col-span-5 md:col-start-1 md:-mt-18 lg:-mt-28',
    aspect: 'aspect-square',
  },
  {
    gridClass: 'md:col-span-6 md:col-start-7 md:mt-24 lg:mt-32',
    aspect: 'aspect-[16/11]',
  },
  {
    gridClass: 'md:col-span-6 md:col-start-1 md:-mt-8 lg:-mt-12',
    aspect: 'aspect-[4/5]',
  },
  {
    gridClass: 'md:col-span-5 md:col-start-8 md:mt-20 lg:mt-28',
    aspect: 'aspect-square',
  },
]

function ProjectItem({
  project,
  config,
  setCursor,
  clearCursor,
}: {
  project: (typeof PROJECTS2)[0]
  config: (typeof EDITORIAL_CONFIGS)[0]
  setCursor: (state: { active: boolean; label: string }) => void
  clearCursor: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <div
      ref={containerRef}
      className={`group flex flex-col ${config.gridClass}`}
    >
      <Link href={project.link} className="flex w-full flex-col">
        {/* Képkeret parallaxis réteggel */}
        <div
          className={`relative mb-4 w-full overflow-hidden rounded-2xl bg-white/[0.02] ${config.aspect}`}
          onMouseEnter={() => setCursor({ active: true, label: 'Megnézem' })}
          onMouseLeave={() => clearCursor()}
        >
          <motion.div
            style={{ y }}
            className="relative -top-[10%] h-[120%] w-full will-change-transform"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          </motion.div>
        </div>

        {/* Szöveg a kép alatt: 1:1 a gomb tipográfiája, tiszta fehérben */}
        <div className="w-full px-1">
          <h3 className="font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white">
            {project.title}
          </h3>
        </div>
      </Link>
    </div>
  )
}

export function SelectedWork() {
  const { setCursor, clearCursor } = useCustomCursor()

  return (
    <section id="work" className="relative z-10 w-full bg-[#0A0A0A] py-28 md:py-44 overflow-hidden" data-theme="dark">
      <div className={CONTAINER}>

        {/* Balra zárt, minimalista kis cím a nagycím helyett */}
        <div className="mb-14 flex justify-start md:mb-20">
          <span className="font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white/40">
            Kiemelt munkáink
          </span>
        </div>

        {/* 12-oszlopos szerkesztői rács */}
        <div className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-6 lg:gap-x-10 lg:gap-y-24">
          {PROJECTS2.map((project, i) => (
            <ProjectItem
              key={project.title}
              project={project}
              config={EDITORIAL_CONFIGS[i]}
              setCursor={setCursor}
              clearCursor={clearCursor}
            />
          ))}
        </div>

      </div>

      {/* ── AKIKKEL MÁR DOLGOZTUNK SLIDER ── */}
      <div className="mt-36 md:mt-48 w-full overflow-hidden flex flex-col gap-8">
        <div className={CONTAINER}>
          <p className="font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white/40 text-center">
            Akikkel már dolgoztunk
          </p>
        </div>

        {/* Slider konténer a szélek elsötétítésével */}
        <div className="relative flex w-full overflow-x-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent md:w-48 lg:w-64" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent md:w-48 lg:w-64" />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="flex shrink-0 items-center gap-16 pr-16 md:gap-24 md:pr-24"
          >
            {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
              <div key={i} className="group shrink-0">
                <div className="relative h-8 w-28 opacity-30 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 md:h-10 md:w-36">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {

  return (
    <main className="bg-[#0A0A0A] font-inter text-white selection:bg-[#BF2234] selection:text-white">

      <style>{`
        .fluid-blob-field { position: absolute; inset: -30%; background: transparent; filter: blur(20px) saturate(1.2); }
        .blob { position: absolute; border-radius: 50%; mix-blend-mode: lighten; will-change: transform; opacity: 0.9; }
        
        /* Élénk, sötét háttéren is jól mutató vörös árnyalatok a #BF2234 köré építve */
        .blob-1 { width: 55%; height: 55%; top: 5%; left: 0%; background: radial-gradient(circle, #d90429 100%, rgba(217,43,61,0) 0%); animation: drift1 14s ease-in-out infinite; }
        .blob-2 { width: 60%; height: 60%; top: 20%; left: 55%; background: radial-gradient(circle, #d90429 100%, rgba(191,34,52,0) 00%); animation: drift2 16s ease-in-out infinite; }
        .blob-3 { width: 45%; height: 45%; top: 45%; left: 25%; background: radial-gradient(circle, #d90429 100%, rgba(229,46,66,0) 0%); animation: drift3 12s ease-in-out infinite; }
        .blob-4 { width: 40%; height: 40%; top: -5%; left: 35%; background: radial-gradient(circle, #d90429 100%, rgba(191,34,52,0) 0%); animation: drift4 18s ease-in-out infinite; }
        .blob-5 { width: 50%; height: 50%; top: 40%; left: -5%; background: radial-gradient(circle, #d90429 100%, rgba(158,27,42,0) 0%); animation: drift5 15s ease-in-out infinite; }
        
        @keyframes drift1 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 33% { transform: translate(25%, 15%) scale(1.15); } 66% { transform: translate(-10%, 25%) scale(0.9); } }
        @keyframes drift2 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 33% { transform: translate(-20%, 20%) scale(0.9); } 66% { transform: translate(-30%, -10%) scale(1.1); } }
        @keyframes drift3 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 50% { transform: translate(20%, -20%) scale(1.2); } }
        @keyframes drift4 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 50% { transform: translate(15%, 30%) scale(0.85); } }
        @keyframes drift5 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 50% { transform: translate(30%, 10%) scale(1.1); } }
      `}</style>


      {/* Hero */}
      <section data-theme="dark" className="relative flex min-h-[100svh] w-full flex-col items-center justify-between overflow-hidden bg-[#0A0A0A] pt-[15vh] md:pt-[20vh]">
        {/* A korábbi mx-auto max-w-[1340px] helyett CONTAINER-t használunk: */}
        <motion.div className={`${CONTAINER} relative z-30 flex flex-1 flex-col items-center justify-center text-center -mt-12 md:-mt-20`}>
          <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }} className="flex w-full flex-col items-center">
            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }} className="w-full mb-8 md:mb-10 flex justify-center">
              <div className="relative w-full h-[28vw] md:h-[18vw] overflow-hidden" style={{ WebkitMask: 'url(/sonaweb-logo-white.png) center/contain no-repeat', mask: 'url(/sonaweb-logo-white.png) center/contain no-repeat', transform: 'translateZ(0)', filter: 'drop-shadow(0 0 45px rgba(191,34,52,0.55)) drop-shadow(0 0 90px rgba(191,34,52,0.35))' }}>
                <div className="fluid-blob-field">
                  <span className="blob blob-1" /><span className="blob blob-2" /><span className="blob blob-3" /><span className="blob blob-4" /><span className="blob blob-5" />
                </div>
              </div>
            </motion.div>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
              className="max-w-[430px] font-inter text-[16px] font-semibold leading-[22.4px] tracking-[-0.2px] text-white mb-8 md:mb-12 text-center"
            >
              Segítünk a márkáknak megérkezni a jelenbe. Figyelemfelkeltő megjelenés és konverzióra épített digitális élmény.
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
                    Vágjunk bele
                  </span>
                  {/* Új szöveg: alulról becsúszik */}
                  <span className="absolute left-0 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Vágjunk bele
                  </span>
                </span>
              </Link>

            </motion.div>

          </motion.div>
        </motion.div>
        <div className="w-full relative z-20 pb-8 md:pb-12"><WorksCarousel /></div>
      </section>

      <AboutSection />
      <SelectedWork />
      <Services />

      {/* ── MINIMALISTA EDITORIAL CTA ── */}
      <section className="relative z-10 w-full bg-[#0A0A0A] py-40 md:py-56 lg:py-64 overflow-hidden" data-theme="dark">
        <div className={`${CONTAINER} relative z-10 flex flex-col items-center justify-center text-center`}>
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
            {/* Cím feletti tájékoztató: pont nélkül, gomb tipográfiával */}
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="mb-6 font-inter text-[13px] md:text-[14px] font-semibold uppercase tracking-[-0.4px] text-white/40 md:mb-8"
            >
              2 perces kérdőív és azonnali előzetes kalkuláció a projektedre
            </motion.span>

            {/* Főcím: Kalibrált méret (max 120px) */}
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 35 },
                show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="mb-14 max-w-6xl font-display text-[clamp(4rem,9vw,120px)] font-extrabold uppercase leading-[0.98] tracking-[-2.5px] md:tracking-[-4.2px] text-white"
            >
              Indítsuk el a <br className="hidden md:block" /> közös munkát
            </motion.h2>

            {/* Gomb */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
            >
              <Link
                href="/start"
                className="group flex w-full items-center justify-center rounded-full bg-white px-7 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#0A0A0A] overflow-hidden sm:w-auto"
              >
                <span className="relative inline-flex overflow-hidden">
                  {/* Eredeti szöveg */}
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                    Vágjunk bele
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                  </span>

                  {/* Becsúszó szöveg */}
                  <span className="absolute left-0 inline-flex items-center gap-1.5 whitespace-nowrap translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    Vágjunk bele
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
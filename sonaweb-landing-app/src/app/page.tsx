'use client'

import {
  useRef,
  useEffect,
  useState,
  useContext,
  useMemo,
  createContext,
  useCallback,
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


type ScrollContextValue = {
  smoothY: MotionValue<number>
}
const ScrollContext = createContext<ScrollContextValue | null>(null)

export function useSmoothScroll() {
  return useContext(ScrollContext)
}

const CONTAINER = 'mx-auto w-full max-w-[1340px] px-6'

// Egyetlen, néma jelölő — nincs szöveg, nincs ALL-CAPS címke, csak egy rövid piros vonás
// a szekció tartalmának kezdete előtt. Ez az egyetlen visszatérő "aláírás" az oldalon.
function Mark() {
  return <span aria-hidden="true" className="mb-6 block h-[3px] w-8 bg-[#FF1A1A] md:mb-8" />
}


const PROJECTS = [
  { name: 'TechFlow / B2B SaaS', src: '/placeholder.svg', h: 'h-[280px] md:h-[360px]', href: '/work/projekt-1' },
  { name: 'DataSync / Enterprise', src: '/placeholder.svg', h: 'h-[340px] md:h-[480px]', href: '/work/projekt-1' },
  { name: 'OmniPay / FinTech', src: '/placeholder.svg', h: 'h-[240px] md:h-[320px]', href: '/work/projekt-1' },
  { name: 'CloudScale / AI Platform', src: '/placeholder.svg', h: 'h-[300px] md:h-[400px]', href: '/work/projekt-1' },
  { name: '<TestimonialsSection />', src: '/placeholder.svg', h: 'h-[280px] md:h-[380px]', href: '/work/projekt-1' },
]

export function WorksCarousel() {
  const baseX = useMotionValue(0)

  // ── ÁLLANDÓ SEBESSÉG (Nincs lassítás) ──
  const SPEED = -0.008
  const velocity = useMotionValue(SPEED)
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 })

  useAnimationFrame((t, delta) => {
    let moveBy = smoothVelocity.get() * (delta / 16)
    baseX.set(baseX.get() + moveBy)
  })

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  return (
    <div className="flex w-full overflow-hidden">
      <motion.div
        className="flex items-center gap-3 px-5 md:gap-4 md:px-6"
        style={{ x }}
      >
        {[...PROJECTS, ...PROJECTS, ...PROJECTS, ...PROJECTS].map((project, i) => {
          // Változatos szélességek index alapján, de egységes magassággal
          const widths = [
            'w-[240px] md:w-[320px]',
            'w-[300px] md:w-[420px]',
            'w-[220px] md:w-[280px]',
            'w-[340px] md:w-[480px]'
          ]
          const currentWidth = widths[i % widths.length]

          return (
            <div key={i} className="flex shrink-0 flex-col">
              {/* 
                Egységes magasság (h-[320px] md:h-[450px]), de változatos szélesség.
                Nincs Link, nincs hover esemény, nincs custom kurzor.
              */}
              <div className={`relative h-[320px] ${currentWidth} overflow-hidden rounded-xl bg-white/5 md:h-[450px]`}>
                <Image
                  src={project.src}
                  alt="Project Image"
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
// Négy kategória — nem egy folyamat lépései, ezért nincs sorszámozva.
const NEW_SERVICES = [
  {
    category: 'Digitális',
    desc: 'Komplex platformokat építünk, amelyek a prémium dizájnt mérhető üzleti eredményekkel kötik össze. A látvány és a technológiai funkció kompromisszummentes egyensúlya.',
    tags: ['Weboldalak', 'Landing oldalak', 'Webshopok', 'UX/UI'],
  },
  {
    category: 'Tartalom',
    desc: 'Megállítjuk a görgetést. Olyan márkaazonos, tűéles vizuális anyagokat és koncepciókat készítünk, amelyek azonnali professzionalizmust és bizalmat közvetítenek.',
    tags: ['Videógyártás', 'Márkafotózás', 'Kreatív koncepciók', 'Szövegírás'],
  },
  {
    category: 'Marketing',
    desc: 'Adatvezérelt, precíziós kampányrendszerek. Nem hiúsági mérőszámokat kergetünk, hanem stabil ügyfélszerzést és kiszámítható bevételt generálunk.',
    tags: ['Meta Ads', 'Google Ads', 'SEO', 'Email automatizáció'],
  },
  {
    category: 'Növekedés',
    desc: 'Kiszámíthatóság a találgatás helyett. Stratégiai átvilágítás, mély analitika és iteratív optimalizálás a hosszú távú, skálázható piaci előnyért.',
    tags: ['Stratégia', 'Mérési rendszerek', 'CRO', 'Értékesítési tölcsérek'],
  },
]

export function Services() {
  return (
    <section className="relative z-10 w-full bg-[#0A0A0A] py-28 md:py-40" data-theme="dark">
      <div className={`${CONTAINER}`}>

        {/* FŐCÍM */}
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <Mark />
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-1.5px] text-white">
              Megoldások
            </h2>
          </div>
          <p className="max-w-sm font-inter text-[16px] leading-[1.6] text-white/70 md:text-right">
            Prémium digitális termékek és célzott növekedési rendszerek B2B vállalatoknak.
          </p>
        </div>

        {/* Csendes, egyenletes sorok — nincs szám, nincs lenyíló, nincs hover-szín-csere */}
        <div className="flex flex-col border-t border-white/10">
          {NEW_SERVICES.map((service, i) => (
            <div
              key={i}
              className="flex flex-col gap-6 border-b border-white/10 py-12 md:grid md:grid-cols-12 md:gap-10 md:py-14"
            >
              <h3 className="font-display text-[28px] font-bold leading-[1.05] text-white md:col-span-3 md:text-[32px]">
                {service.category}
              </h3>
              <p className="font-inter text-[16px] leading-[1.6] text-white/70 md:col-span-6 md:text-[17px]">
                {service.desc}
              </p>
              <div className="flex flex-col gap-1.5 md:col-span-3">
                {service.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="font-inter text-[14px] text-white/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ── 4. VÉLEMÉNYEK SZEKCIÓ ──
export function SocialProofSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [isPaused])

  const current = TESTIMONIALS[currentIndex]
  const goTo = (i: number) => {
    setIsPaused(true)
    setCurrentIndex((i + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  return (
    <section className="relative z-10 w-full bg-[#0A0A0A] py-28 md:py-40" data-theme="dark">
      <div className={CONTAINER}>
        <div className="max-w-3xl">
          <Mark />

          <div className="relative min-h-[140px] md:min-h-[170px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(1.65rem,3.4vw,2.75rem)] font-medium leading-[1.3] tracking-tight text-white"
              >
                {current.quote}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-baseline gap-3"
              >
                <span className="font-inter text-[15px] font-bold text-white">{current.name}</span>
                <span className="font-inter text-[14px] text-white/40">{current.role}</span>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Ugrás a(z) ${i + 1}. véleményre`}
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${currentIndex === i ? 'bg-white' : 'bg-white/20'
                      }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goTo(currentIndex - 1)}
                  aria-label="Előző vélemény"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors duration-300 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                </button>
                <button
                  onClick={() => goTo(currentIndex + 1)}
                  aria-label="Következő vélemény"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors duration-300 hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


const MANIFESTO_BODY = 'Hisszük, hogy a prémium dizájn és a tűpontos stratégia nem létezhet egymás nélkül. Nincsenek felesleges körök, sem sablonok. Csak nyers kreativitás, adatalapú döntések és kompromisszummentes kivitelezés.'

export function AboutSection() {
  return (
    <section id="about" className="relative z-10 w-full bg-[#0A0A0A] py-28 md:py-40" data-theme="dark">
      <div className={CONTAINER}>
        <div className="w-full pt-8 md:pt-12">

          <Mark />

          <h2 className="max-w-3xl font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold uppercase leading-[1.03] tracking-[-1.5px] text-white">
            Nem vagyunk hagyományos ügynökség.
          </h2>

          <p className="mt-8 max-w-xl font-inter text-[17px] leading-[1.65] text-white/70 md:mt-10 md:text-[18px]">
            {MANIFESTO_BODY}
          </p>

          {/* Ügyfelek: egyetlen, csendes sor — nincs cím fölötte, nincs keret, nincs végtelenített mozgás */}
          <div className="mt-24 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-white/10 pt-10 md:mt-32 md:gap-x-14 md:pt-12">
            {CLIENTS.map((client, i) => (
              <div key={i} className="relative h-6 w-20 shrink-0 opacity-35 grayscale transition-opacity duration-300 hover:opacity-90 md:h-7 md:w-24">
                <Image
                  src={client.logo}
                  alt={client.name}
                  fill
                  className="object-contain object-left"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}


const PROJECTS2 = [
  {
    title: 'TÜRKIZ Restaurant',
    category: 'Luxury Brand / Web Design',
    image: '/placeholder.svg', // Cseréld a valós képeidre
    link: '/work/turkiz',
  },
  {
    title: 'Rose Budapest',
    category: 'Landing Page / Animation',
    image: '/placeholder.svg',
    link: '/work/rose',
  },
  {
    title: 'SZVG Tools',
    category: 'B2B Platform / UI',
    image: '/placeholder.svg',
    link: '/work/szvg',
  },
  {
    title: 'Struktur Marketing',
    category: 'Agency Identity / Next.js',
    image: '/placeholder.svg',
    link: '/work/struktur',
  },
]

export function SelectedWork() {
  return (
    <section id="work" className="relative z-10 w-full bg-[#0A0A0A] py-28 md:py-40" data-theme="dark">
      <div className={CONTAINER}>
 
        <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <Mark />
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-1.5px] text-white">
              Kiemelt Munkáink
            </h2>
          </div>
          <p className="max-w-sm font-inter text-[16px] leading-[1.6] text-white/70 md:text-right">
            Válogatott projektek azok közül, amelyeket az elmúlt időszakban építettünk ügyfeleinkkel.
          </p>
        </div>
 
        {/* Nagy, teljes szélességű képek egymás alatt — a portfólió maga a látvány, nincs szükség trükkre */}
        <div className="flex flex-col gap-20 md:gap-32">
          {PROJECTS2.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={project.link} className="group block">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[6px] bg-white/5 md:aspect-[21/10]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between md:mt-6">
                  <h3 className="font-display text-[22px] font-bold text-white md:text-[26px]">
                    {project.title}
                  </h3>
                  <span className="font-inter text-[14px] text-white/40">
                    {project.category}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
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
        .blob-1 { width: 55%; height: 55%; top: 5%; left: 0%; background: radial-gradient(circle, #FF1A1A 0%, rgba(217,43,61,0) 70%); animation: drift1 14s ease-in-out infinite; }
        .blob-2 { width: 60%; height: 60%; top: 20%; left: 55%; background: radial-gradient(circle, #FF1A1A 0%, rgba(191,34,52,0) 70%); animation: drift2 16s ease-in-out infinite; }
        .blob-3 { width: 45%; height: 45%; top: 45%; left: 25%; background: radial-gradient(circle, #FF1A1A 0%, rgba(229,46,66,0) 70%); animation: drift3 12s ease-in-out infinite; }
        .blob-4 { width: 40%; height: 40%; top: -5%; left: 35%; background: radial-gradient(circle, #FF1A1A 0%, rgba(191,34,52,0) 70%); animation: drift4 18s ease-in-out infinite; }
        .blob-5 { width: 50%; height: 50%; top: 40%; left: -5%; background: radial-gradient(circle, #FF1A1A 0%, rgba(158,27,42,0) 70%); animation: drift5 15s ease-in-out infinite; }
        
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

<AboutSection />
<SelectedWork />
      <Services />
      <SocialProofSection />


      {/* ── MINIMALISTA, KÖZÉPRE ZÁRT CTA — halk visszhangja a hero fényudvarnak, hogy lezárja az ívet ── */}
      <section className="relative z-10 w-full bg-[#0A0A0A] py-32 md:py-48 overflow-hidden" data-theme="dark">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] w-[70vw] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[110px]"
          style={{ background: 'radial-gradient(circle, #FF1A1A 0%, rgba(191,34,52,0) 70%)' }}
        />

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
            

{/* 2. FŐCÍM */}
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 35 },
                show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="mb-10 font-display text-[clamp(3.5rem,9vw,120px)] font-extrabold uppercase leading-[0.95] tracking-[-2px] md:tracking-[-4px] text-white max-w-5xl"
            >
              Indítsuk el a <br className="hidden md:block" /> közös munkát.
            </motion.h2>

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
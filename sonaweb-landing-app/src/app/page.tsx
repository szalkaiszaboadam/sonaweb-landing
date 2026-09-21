'use client'

import {
  useRef,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useAnimationFrame,
  wrap,
  type MotionValue,
} from 'motion/react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { Footer } from '@/components/footer'
import { ShaderGradient } from '@/components/shader-gradient'
import { useCustomCursor } from '@/components/custom-cursor' 



type ScrollContextValue = {
  smoothY: MotionValue<number>
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

export function useSmoothScroll() {
  return useContext(ScrollContext)
}

export const CONTAINER = "mx-auto w-full max-w-[1800px] px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 2xl:px-36"

const PROJECTS = [
  { name: 'CARL COZMO',  src: '/carl-cozmo-2.webp', h: 'h-[280px] md:h-[360px]'},
  { name: 'placeholder',  src: '/', h: 'h-[340px] md:h-[480px]'},
  { name: 'Aeroprodukt Zrt.',  src: '/aeroprodukt-2.mp4', h: 'h-[240px] md:h-[320px]'},
  { name: 'DUKAY WINERY',  src: '/dukay-winery-2.webp', h: 'h-[300px] md:h-[400px]'},
  { name: 'GázGépKer', src: '/gazgepker-1.webp', h: 'h-[280px] md:h-[380px]'},
]

export function WorksCarousel() {
  const CAROUSEL_DIMS = [
    { width: 'w-[350px] md:w-[500px]', height: 'h-[250px] md:h-[360px]' },
    { width: 'w-[245px] md:w-[345px]', height: 'h-[375px] md:h-[530px]' },
    { width: 'w-[290px] md:w-[410px]', height: 'h-[290px] md:h-[410px]' },
    { width: 'w-[260px] md:w-[370px]', height: 'h-[335px] md:h-[470px]' },
    { width: 'w-[325px] md:w-[460px]', height: 'h-[280px] md:h-[390px]' },
  ]

  // Csak kétszeres többszörözés szükséges a CSS animációhoz (feleannyi DOM elem)
  const scrollItems = [...PROJECTS, ...PROJECTS]

  return (
    <div className="flex w-full overflow-hidden">
      {/* w-max az elemek egy sorban tartásához, animate-marquee a CSS animációhoz */}
      <div className="flex w-max items-start gap-4 px-4 md:gap-6 md:px-6 animate-marquee hover:[animation-play-state:paused]">
        {scrollItems.map((project, i) => {
          const dim = CAROUSEL_DIMS[i % CAROUSEL_DIMS.length]
          const isVideo = project.src.match(/\.(mp4|webm|ogg)$/i)
          
          // LCP javítás: Az első két elem azonnal (késleltetés nélkül) töltődik be
          const isPriority = i < 2

          return (
            <div key={i} className="flex shrink-0 flex-col">
              <div className={`relative ${dim.width} ${dim.height} overflow-hidden rounded-2xl bg-white/5`}>
                {isVideo ? (
                  <video
                    src={project.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none" // Megakadályozza a felesleges háttéradat-forgalmat
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={project.src}
                    alt={project.name || 'Project'}
                    fill
                    priority={isPriority} 
                    sizes="(max-width: 768px) 350px, 500px" // Hálózati méret optimalizálása mobilra
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


const SERVICES = [
  { 
    title: 'Webfejlesztés', 
    subServices: [
      'UX / UI Design',
      'Vállalati Weboldal',
      'Landing Page',
      'Webshop & E-kereskedelem',
      'Egyedi Webes Platformok',
      'Hosting & Karbantartás'
    ]
  },
  { 
    title: 'Tartalomgyártás', 
    subServices: [
      'Kreatív Koncepció',
      'Precíziós Szövegírás',
      'Reklámfilm & Fotózás',
      'Rövid Videók (TikTok, Reels)',
      'Grafikai Tervezés',
      'Animáció'
    ]
  },
  { 
    title: 'Hirdetéskezelés', 
    subServices: [
      'Meta Kampányok',
      'Google Ads',
      'TikTok Ads',
      'Retargeting Stratégia',
      'Konverzió Optimalizálás',
      'Analitika & Riportálás'
    ]
  },
  { 
    title: 'Márkastratégia', 
    subServices: [
      'Márka Architektúra',
      'Pozicionálás',
      'Brand Identity',
      'Kommunikációs Stratégia',
      'Naming',
      'Piackutatás'
    ]
  },
]

const LONGEST_TITLE = SERVICES.reduce((a, b) => (b.title.length > a.title.length ? b : a)).title
const SERVICES_TITLE_CLASS = 'font-display font-extrabold uppercase leading-[0.95] tracking-[-1px] md:leading-[0.9] md:tracking-[-3px]'

const MEASURE_BASE_PX = 120 

function useFitFontSize(text: string, className: string, minPx = 20, maxPx = 90) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [fontSize, setFontSize] = useState(60)

  useEffect(() => {
    const recalc = () => {
      const container = containerRef.current
      const measure = measureRef.current
      if (!container || !measure) return
      const containerWidth = container.offsetWidth
      const measuredWidth = measure.offsetWidth
      if (!containerWidth || !measuredWidth) return
      const next = (containerWidth / measuredWidth) * MEASURE_BASE_PX
      setFontSize(Math.min(Math.max(next, minPx), maxPx))
    }

    recalc()
    window.addEventListener('resize', recalc)
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(recalc).catch(() => { })
    }
    return () => window.removeEventListener('resize', recalc)
  }, [text, className, minPx, maxPx])

  return { containerRef, measureRef, fontSize }
}

export function Services() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number>(0)
  const { containerRef, measureRef, fontSize } = useFitFontSize(LONGEST_TITLE, SERVICES_TITLE_CLASS)

  const handleToggle = (i: number) => {
    setExpandedIdx(i)
  }

  return (
    <section id="services" className="relative z-10 w-full bg-[#0A0A0A] py-20 md:py-28 lg:py-36 overflow-hidden" data-theme="dark">
      <div className={CONTAINER}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex justify-center md:mb-20 md:justify-start"
        >
          <span className="font-inter text-[14px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#606060]">
            Miben segítünk?
          </span>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="relative flex w-full flex-col items-center"
        >
          <span
            ref={measureRef}
            aria-hidden="true"
            className={`${SERVICES_TITLE_CLASS} pointer-events-none absolute left-0 top-0 -z-10 whitespace-nowrap opacity-0`}
            style={{ fontSize: MEASURE_BASE_PX }}
          >
            {LONGEST_TITLE}
          </span>

          {SERVICES.map((service, i) => {
            const isHovered = hoveredIdx === i
            const isExpanded = expandedIdx === i
            const isActive = isExpanded || isHovered

            return (
              <motion.div
                key={service.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="flex w-full flex-col items-center"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(i)}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onFocus={() => setHoveredIdx(i)}
                  onBlur={() => setHoveredIdx(null)}
                  className={`group flex w-full max-w-full items-center justify-center py-2 focus:outline-none md:py-4 ${
                    isExpanded ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span className="relative inline-flex items-center justify-center">
                    <span
                      style={{ fontSize }}
                      className={`${SERVICES_TITLE_CLASS} block whitespace-nowrap transition-colors duration-300 ease-out ${
                        isActive ? 'text-white' : 'text-[#5E5E5E]'
                      }`}
                    >
                      {service.title}
                    </span>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: isHovered && !isExpanded ? 1 : 0,
                        scale: isHovered && !isExpanded ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 text-white transition-colors md:ml-5"
                    >
                      <Plus style={{ width: fontSize * 0.35, height: fontSize * 0.35 }} strokeWidth={3} />
                    </motion.div>
                  </span>
                </button>

                <AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden w-full"
    >
      <div className="flex flex-col items-center justify-center gap-1.5 pb-8 pt-2 md:pb-12 md:pt-4">
        {service.subServices.map((sub, idx) => (
          <span
            key={idx}
            // 15px-es méret, tiszta fehér szín, hover effektek nélkül
            className="font-inter text-[15px] leading-[15px] tracking-[-0.4px] font-semibold uppercase text-white"
          >
            {sub}
          </span>
        ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>

              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}



export function AboutSection() {
  return (
    <section id="about" className="relative z-10 w-full bg-[#0A0A0A] py-20 md:py-28 lg:py-36 overflow-hidden" data-theme="dark">
      <div className={CONTAINER}>
        <div className="w-full text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 block font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#606060] md:mb-8 md:text-[13px]"
          >
            Rólunk
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            // 1. break-words hozzáadva, clamp minimum levéve 1.75rem-re
            className="mx-auto w-full max-w-6xl font-display text-[clamp(1.75rem,8vw,88px)] font-extrabold uppercase leading-[1.1] tracking-[-1px] text-white md:tracking-[-3px] break-words"
          >
            Sosem csak egy weboldal. A Te márkád a mi meg&shy;szállott&shy;ságunk – minden pixelben ott vagyunk.
          </motion.h2>
        </div>
      </div>
    </section>
  )
}

const PROJECTS2 = [
  { title: 'DUKAY WINERY', image: '/dukay-winery-1.webp', link: '/work/#' },
  { title: 'Sol Car', image: '/solcar-1.webp', link: '/work/#' },
  { title: 'GázGépKer', image: '/gazgepker-2.webp', link: '/work/#' },
  { title: 'CARL COZMO', image: '/carl-cozmo-3.webp', link: '/work/#' },
  { title: 'placeholder2', image: '/', link: '/work/#' },
  { title: 'placeholder3', image: '/', link: '/work/#' },
]

const EDITORIAL_CONFIGS = [
  { gridClass: 'md:col-span-7 md:col-start-1', aspect: 'aspect-[16/11]' },
  { gridClass: 'md:col-span-4 md:col-start-9 md:mt-36 lg:mt-48', aspect: 'aspect-[3/4]' },
  { gridClass: 'md:col-span-5 md:col-start-1 md:-mt-18 lg:-mt-28', aspect: 'aspect-square' },
  { gridClass: 'md:col-span-6 md:col-start-7 md:mt-24 lg:mt-32', aspect: 'aspect-[16/11]' },
  { gridClass: 'md:col-span-6 md:col-start-1 md:-mt-8 lg:-mt-12', aspect: 'aspect-[4/5]' },
  { gridClass: 'md:col-span-5 md:col-start-8 md:mt-20 lg:mt-28', aspect: 'aspect-square' },
]




function ProjectItem({ project, config }: { project: (typeof PROJECTS2)[0], config: (typeof EDITORIAL_CONFIGS)[0] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-18%', '18%'])

  const { setCursor, clearCursor } = useCustomCursor()

  // Eszközméret figyelése a parallax animációhoz
  const [isDesktop, setIsDesktop] = useState(true)
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col ${config.gridClass}`}
    >
      <Link 
        href={project.link} 
        className="flex w-full flex-col"
        onClick={clearCursor}
      >
        <div 
          onMouseEnter={() => setCursor({ active: true, label: 'Megnézem' })}
          onMouseLeave={clearCursor}
          className={`relative mb-4 w-full overflow-hidden rounded-2xl bg-white/[0.02] ${config.aspect}`}
        >
          {/* Mobilon letiltjuk a pozícióeltolást és visszaállítjuk a magasságot 100%-ra */}
          <motion.div 
            style={isDesktop ? { y } : { y: 0 }} 
            className={`relative w-full will-change-transform ${isDesktop ? 'h-[140%] -top-[20%]' : 'h-full top-0'}`}
          >
            <Image src={project.image} alt={project.title} fill className="object-cover" />
          </motion.div>
        </div>

        <div className="w-full px-1">
          <h3 className="font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white">
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  )
}


export function SelectedWork() {
  return (
    <section id="work" className="relative z-10 w-full bg-[#0A0A0A] py-20 md:py-28 lg:py-36 overflow-hidden" data-theme="dark">
      <div className={CONTAINER}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex justify-center md:mb-20 md:justify-start"
        >
          <span className="font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#606060]">
            Amikkel bizonyítottunk
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-6 lg:gap-x-10 lg:gap-y-24">
          {PROJECTS2.map((project, i) => (
            <ProjectItem key={project.title} project={project} config={EDITORIAL_CONFIGS[i]} />
          ))}
        </div>
      </div>
    </section>
  )
}


const CLIENTS = [
  { name: 'Fröccsterasz', logo: '/client-logos/froccsterasz-logo.webp' },
  { name: 'TÜRKIZ Budapest', logo: '/client-logos/turkiz-budapest-logo.webp' },
  { name: 'Sol Car', logo: '/client-logos/solcar-logo.webp' },
  { name: 'Bori Tanya Csongrád', logo: '/client-logos/bori-tanya-csongrad-logo.webp' },
  { name: 'TTMBio', logo: '/client-logos/ttmbio-logo.webp' },
  { name: 'DUKAY WINERY', logo: '/client-logos/dukay-winery-logo.webp' },
  { name: 'Juhos Gépbér Kft.', logo: '/client-logos/juhos-gepber-kft-logo.webp' },
  { name: 'CARL COZMO', logo: '/client-logos/carl-cozmo-logo.webp' },
  { name: 'GázGépKer', logo: '/client-logos/gazgepker-logo.webp' },
]

export function ClientsMarquee() {
  // Elég kétszer duplikálni a zökkenőmentes görgetéshez
  const marqueeClients = [...CLIENTS, ...CLIENTS]

  return (
    <div className="relative z-10 w-full bg-[#0A0A0A] pb-20 md:pb-28 lg:pb-36 flex flex-col" data-theme="dark">
      <div className="relative flex w-full overflow-x-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent md:w-48 lg:w-64" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent md:w-48 lg:w-64" />
        
        {/* CSS alapú lassú görgetés */}
        <div className="flex w-max shrink-0 items-center gap-16 pr-16 md:gap-24 md:pr-24 animate-marquee-slow">
          {marqueeClients.map((client, i) => (
            <div key={i} className="flex shrink-0 items-center justify-center">
              <div className="relative h-20 w-32 md:h-24 md:w-44">
                <Image
                  src={client.logo}
                  alt={client.name}
                  fill
                  sizes="(max-width: 768px) 128px, 176px"
                  className="object-contain brightness-0 invert"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A] font-inter text-white selection:bg-[#BF2234] selection:text-white">
      {/* Hero */}
<section data-theme="dark" className="relative flex min-h-[100svh] w-full flex-col items-center justify-between overflow-hidden bg-[#0A0A0A] pt-[15vh] md:pt-[20vh]">
  <motion.div className={`${CONTAINER} relative z-30 flex flex-1 flex-col items-center justify-center text-center -mt-12 md:-mt-20`}>
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }} className="flex w-full flex-col items-center">

      <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }} className="w-full mb-8 md:mb-10 flex justify-center">
        <div className="relative w-full h-[28vw] md:h-[18vw] overflow-hidden bg-[#0A0A0A]" style={{ WebkitMask: 'url(/sonaweb-logo-white.webp) center/contain no-repeat', mask: 'url(/sonaweb-logo-white.webp) center/contain no-repeat', transform: 'translateZ(0)', filter: 'drop-shadow(0 0 45px rgba(191,34,52,0.55)) drop-shadow(0 0 90px rgba(191,34,52,0.35))' }}>
          <ShaderGradient className="absolute inset-0 h-full w-full" />
        </div>
      </motion.div>

      <motion.p
        variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
        className="max-w-[650px] font-inter text-[16px] md:text-[18px] font-semibold leading-relaxed tracking-[-0.2px] text-white mb-8 md:mb-12 text-center"
      >
        Segítünk a márkáknak megérkezni a jelenbe. Figyelemfelkeltő megjelenés, ami konverziót hoz a digitális térben.
      </motion.p>

      <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }} className="mb-12 md:mb-16">
<Link
  href="/contact"
  className="group flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#0A0A0A] overflow-hidden sm:w-auto"
>
  <span className="relative inline-flex overflow-hidden my-[-2px] py-[2px]">
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
      Vágjunk bele
    </span>
    <span className="absolute left-0 inline-flex items-center gap-1.5 whitespace-nowrap translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
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
      <ClientsMarquee />
      <SelectedWork />
      <Services />
      

      {/* CTA SECTION */}
<section className="relative z-10 w-full bg-[#0A0A0A] py-20 md:py-28 lg:py-36 overflow-hidden" data-theme="dark">
  <div className={CONTAINER}>
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
      }}
      className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between"
    >
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 30 },
          show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
        }}
        // Itt lett nagyobb a cím mérete: clamp(3rem, 8vw, 110px)
        className="text-left font-display text-[clamp(3rem,8vw,110px)] font-extrabold uppercase leading-[1.0] tracking-[-1.5px] text-white"
      >
        Vágjunk<br />bele!
      </motion.h2>

      <div className="flex max-w-[360px] flex-col items-start gap-6 md:items-end md:text-right">
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 15 },
            show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="font-inter text-[18px] leading-[1.6] text-white"
        >
          Kérjen azonnali, kötelezettségmentes árajánlatot két perces kérdőívünk segítségével.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          
<Link
  href="/contact"
  className="group flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#0A0A0A] overflow-hidden sm:w-auto"
>
  <span className="relative inline-flex overflow-hidden my-[-2px] py-[2px]">
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
      Vágjunk bele
      <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
    </span>
    <span className="absolute left-0 inline-flex items-center gap-1.5 whitespace-nowrap translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
      Vágjunk bele
      <ArrowUpRight className="h-[18px] w-[18px] -mr-0.5" strokeWidth={2.5} />
    </span>
  </span>
</Link>


        </motion.div>
      </div>
    </motion.div>
  </div>
</section>


      <Footer />
    </main>
  )
}
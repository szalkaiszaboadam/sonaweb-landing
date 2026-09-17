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
import { ArrowUpRight } from 'lucide-react'
import { Footer } from '@/components/footer'

type ScrollContextValue = {
  smoothY: MotionValue<number>
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

export function useSmoothScroll() {
  return useContext(ScrollContext)
}

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

  const CAROUSEL_DIMS = [
    { width: 'w-[350px] md:w-[500px]', height: 'h-[250px] md:h-[360px]' },
    { width: 'w-[245px] md:w-[345px]', height: 'h-[375px] md:h-[530px]' },
    { width: 'w-[290px] md:w-[410px]', height: 'h-[290px] md:h-[410px]' },
    { width: 'w-[260px] md:w-[370px]', height: 'h-[335px] md:h-[470px]' },
    { width: 'w-[325px] md:w-[460px]', height: 'h-[280px] md:h-[390px]' },
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
              <div className={`relative ${dim.width} ${dim.height} overflow-hidden rounded-2xl bg-white/5`}>
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
  { title: 'Webfejlesztés', desc: 'Személyre szabott, gyors és reszponzív weboldalak, webshopok és komplex portálok fejlesztése, amelyek valós üzleti értéket és konverziót hoznak.' },
  { title: 'Tartalomgyártás', desc: 'Kreatív és vizuálisan lenyűgöző anyagok készítése (fotó, videó, szövegírás), melyek megragadják és hosszú távon is fenntartják a célközönség figyelmét.' },
  { title: 'Hirdetéskezelés', desc: 'Adatalapú, hajszálpontosan célzott kampányok a Google és Meta platformjain, amelyek azonnali, mérhető növekedést garantálnak.' },
  { title: 'Márkastratégia', desc: 'Hosszú távú digitális iránytű, amellyel cége kitűnik a zajból, megerősíti brandjét és bebetonozza piacvezető pozícióját.' },
]

const LONGEST_TITLE = SERVICES.reduce((a, b) => (b.title.length > a.title.length ? b : a)).title
const SERVICES_TITLE_CLASS = 'font-display font-extrabold uppercase leading-[0.95] tracking-[-1px] md:leading-[0.9] md:tracking-[-3px]'
const MEASURE_BASE_PX = 300

function useFitFontSize(text: string, className: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [fontSize, setFontSize] = useState(90)

  useEffect(() => {
    const recalc = () => {
      const container = containerRef.current
      const measure = measureRef.current
      if (!container || !measure) return
      const containerWidth = container.offsetWidth
      const measuredWidth = measure.offsetWidth
      if (!containerWidth || !measuredWidth) return
      const next = (containerWidth / measuredWidth) * MEASURE_BASE_PX
      setFontSize(Math.min(Math.max(next, 26), 180))
    }

    recalc()
    window.addEventListener('resize', recalc)
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(recalc).catch(() => { })
    }
    return () => window.removeEventListener('resize', recalc)
  }, [text, className])

  return { containerRef, measureRef, fontSize }
}

export function Services() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const { containerRef, measureRef, fontSize } = useFitFontSize(LONGEST_TITLE, SERVICES_TITLE_CLASS)

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
          <span className="font-inter text-[13px] md:text-[14px] font-semibold uppercase tracking-wide text-white/40">
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
          {/* Lenyomat a betűméret kiszámításához */}
          <span
            ref={measureRef}
            aria-hidden="true"
            className={`${SERVICES_TITLE_CLASS} pointer-events-none absolute left-0 top-0 -z-10 whitespace-nowrap opacity-0`}
            style={{ fontSize: MEASURE_BASE_PX }}
          >
            {LONGEST_TITLE}
          </span>

          {SERVICES.map((service, i) => {
            const isActive = activeIdx === i
            const isDimmed = activeIdx !== null && !isActive

            return (
              <motion.button
                key={service.title}
                type="button"
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
                }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                onFocus={() => setActiveIdx(i)}
                onBlur={() => setActiveIdx(null)}
                className="group flex w-full max-w-full flex-col items-center justify-center py-3 focus:outline-none md:py-5"
              >
                <span
                  style={{ fontSize }}
                  className={`${SERVICES_TITLE_CLASS} block whitespace-nowrap transition-colors duration-300 ease-out ${isDimmed ? 'text-white/20' : 'text-white'
                    }`}
                >
                  {service.title}
                </span>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl px-4 text-center font-inter text-[15px] leading-relaxed text-white/70 md:text-[17px]">
                        {service.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
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
            className="mb-6 block font-inter text-[13px] md:text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-white/40 md:mb-8 md:text-[13px]"
          >
            Rólunk
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-6xl font-display text-[clamp(2.1rem,6vw,88px)] font-extrabold uppercase leading-[1.1] tracking-[-1.5px] text-white md:tracking-[-3px]"
          >
            Sosem csak egy weboldal. A Te márkád a mi megszállottságunk – minden pixelben ott vagyunk.
          </motion.h2>
        </div>
      </div>
    </section>
  )
}

const PROJECTS2 = [
  { title: 'TÜRKIZ Restaurant', image: '/dukay-winnery-1.webp', link: '/work/turkiz' },
  { title: 'Rose Budapest', image: '/solcar-1.webp', link: '/work/rose' },
  { title: 'SZVG Tools', image: '/gazgepker-2.webp', link: '/work/szvg' },
  { title: 'Struktur Marketing', image: '/placeholder.svg', link: '/work/struktur' },
  { title: 'Aura Studio', image: '/placeholder.svg', link: '/work/aura' },
  { title: 'Kavics Atelier', image: '/placeholder.svg', link: '/work/kavics' },
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

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col ${config.gridClass}`}
    >
      <Link href={project.link} className="flex w-full flex-col">
        <div className={`relative mb-4 w-full overflow-hidden rounded-2xl bg-white/[0.02] ${config.aspect}`}>
          <motion.div style={{ y }} className="relative -top-[20%] h-[140%] w-full will-change-transform">
            <Image src={project.image} alt={project.title} fill className="object-cover" />
          </motion.div>
        </div>
        <div className="w-full px-1">
          <h3 className="font-inter text-[14px] font-semibold uppercase tracking-wide text-white">
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
          <span className="font-inter text-[13px] md:text-[14px] font-semibold uppercase tracking-wide text-white/40">
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
  { name: 'Türkiz', logo: '/placeholder-logo.svg' },
  { name: 'Rose Budapest', logo: '/placeholder-logo.svg' },
  { name: 'SZVG Tools', logo: '/placeholder-logo.svg' },
  { name: 'Struktur', logo: '/placeholder-logo.svg' },
]

export function ClientsMarquee() {
  return (
    <div className="relative z-10 w-full bg-[#0A0A0A] pb-20 md:pb-28 lg:pb-36 flex flex-col" data-theme="dark">
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
              <div className="relative w-full h-[28vw] md:h-[18vw] overflow-hidden bg-[#0A0A0A]" style={{ WebkitMask: 'url(/sonaweb-logo-white.png) center/contain no-repeat', mask: 'url(/sonaweb-logo-white.png) center/contain no-repeat', transform: 'translateZ(0)', filter: 'drop-shadow(0 0 45px rgba(191,34,52,0.55)) drop-shadow(0 0 90px rgba(191,34,52,0.35))' }}>
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 100%', '100% 0%', '0% 0%'],
                  }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-1/2 top-1/2 h-[300%] w-[300%] -translate-x-1/2 -translate-y-1/2 opacity-90"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, #ff1a1a 0%, #d90429 20%, #740013 45%, #0A0A0A 75%)',
                    backgroundSize: '150% 150%',
                  }}
                />
              </div>
            </motion.div>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
              className="max-w-[650px] font-inter text-[16px] md:text-[18px] font-semibold leading-relaxed tracking-[-0.2px] text-white mb-8 md:mb-12 text-center"
            >
              Nem csak jelen vagyunk – uraljuk a felületet. Olyan megjelenést építünk, ami nem hagy hidegen senkit, és tényleg hoz is valamit.
            </motion.p>

            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }} className="mb-12 md:mb-16">
<Link
  href="/contact"
  className="group flex w-full items-center justify-center rounded-full bg-white px-7 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#0A0A0A] overflow-hidden sm:w-auto"
>
  <span className="relative inline-flex overflow-hidden my-[-2px] py-[2px]">
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
      Vágjunk bele
      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
    </span>
    <span className="absolute left-0 inline-flex items-center gap-1.5 whitespace-nowrap translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
      Vágjunk bele
      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
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
      <ClientsMarquee />

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
              className="text-left font-display text-[clamp(2.1rem,6vw,72px)] font-extrabold uppercase leading-[1.05] tracking-[-1px] text-white"
            >
              Vágjunk bele <br /> közösen!
            </motion.h2>

            <div className="flex max-w-[360px] flex-col items-start gap-6 md:items-end md:text-right">
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="font-inter text-[14px] md:text-[15px] leading-[1.6] text-white/60"
              >
                Két perc, pár kattintás – és már úton is van az ingyenes, kötelezettség nélküli árajánlatod.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
                }}
              >
<Link
  href="/contact"
  className="group flex w-full items-center justify-center rounded-full bg-white px-7 py-3.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] font-semibold uppercase text-[#0A0A0A] overflow-hidden sm:w-auto"
>
  <span className="relative inline-flex overflow-hidden my-[-2px] py-[2px]">
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
      Vágjunk bele
      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
    </span>
    <span className="absolute left-0 inline-flex items-center gap-1.5 whitespace-nowrap translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
      Vágjunk bele
      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
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

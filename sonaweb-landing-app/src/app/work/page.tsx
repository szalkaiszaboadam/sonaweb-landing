'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Footer } from '@/components/footer'

export const CONTAINER = "mx-auto w-full max-w-[1800px] px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 2xl:px-36"

const PROJECTS = [
  { title: 'Dukay Pincészet', category: 'Márkaidentitás & Weboldal', image: '/dukay-winnery-1.webp' },
  { title: 'Solcar', category: 'Landing oldal & Kampány', image: '/solcar-1.webp' },
  { title: 'Gazgépker', category: 'Webshop fejlesztés', image: '/gazgepker-1.webp' },
  { title: 'Carl Cozmo', category: 'Tartalomgyártás', image: '/carl-cozmo-2.webp' },
  { title: 'Solcar', category: 'Vizuális arculat', image: '/solcar-2.webp' },
  { title: 'Gazgépker', category: 'Hirdetéskezelés', image: '/gazgepker-2.webp' },
]

const EDITORIAL_CONFIGS = [
  { gridClass: 'md:col-span-7 md:col-start-1', aspect: 'aspect-[16/11]' },
  { gridClass: 'md:col-span-4 md:col-start-9 md:mt-36 lg:mt-48', aspect: 'aspect-[3/4]' },
  { gridClass: 'md:col-span-5 md:col-start-1 md:-mt-18 lg:-mt-28', aspect: 'aspect-square' },
  { gridClass: 'md:col-span-6 md:col-start-7 md:mt-24 lg:mt-32', aspect: 'aspect-[16/11]' },
  { gridClass: 'md:col-span-6 md:col-start-1 md:-mt-8 lg:-mt-12', aspect: 'aspect-[4/5]' },
  { gridClass: 'md:col-span-5 md:col-start-8 md:mt-20 lg:mt-28', aspect: 'aspect-square' },
]

function ProjectItem({ project, config }: { project: (typeof PROJECTS)[0], config: (typeof EDITORIAL_CONFIGS)[0] }) {
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
      <div className="flex w-full flex-col">
        <div className={`relative mb-4 w-full overflow-hidden rounded-2xl bg-white/[0.02] ${config.aspect}`}>
          <motion.div style={{ y }} className="relative -top-[20%] h-[140%] w-full will-change-transform">
            <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
          </motion.div>
        </div>
        <div className="flex w-full items-baseline justify-between gap-4 px-1">
          <h3 className="font-inter text-[14px] font-semibold uppercase tracking-wide text-white">
            {project.title}
          </h3>
          <span className="shrink-0 font-inter text-[12px] font-medium text-white/40">
            {project.category}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function WorkPage() {
  return (
    <main data-theme="dark" className="bg-[#0A0A0A] font-inter text-white selection:bg-[#BF2234] selection:text-white">

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-[#0A0A0A] pt-40 pb-20 md:pt-52 md:pb-28">
        <div className={CONTAINER}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 block font-inter text-[13px] md:text-[14px] font-semibold uppercase tracking-wide text-white/40 md:mb-8"
          >
            Munkáink
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl font-display text-[clamp(2.2rem,6.5vw,80px)] font-extrabold uppercase leading-[1.05] tracking-[-1.5px] text-white md:tracking-[-3px]"
          >
            Ötletből márka, márkából eredmény.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl font-inter text-[15px] md:text-[17px] leading-relaxed text-white/60"
          >
            Válogatás azokból a projektekből, amikben elejétől a végéig benne voltunk – dizájntól a fejlesztésen át a kampányig.
          </motion.p>
        </div>
      </section>

      {/* Editorial grid */}
      <section className="relative z-10 w-full bg-[#0A0A0A] pb-20 md:pb-28 lg:pb-36 overflow-hidden">
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-6 lg:gap-x-10 lg:gap-y-24">
            {PROJECTS.map((project, i) => (
              <ProjectItem key={`${project.title}-${i}`} project={project} config={EDITORIAL_CONFIGS[i]} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 w-full bg-[#0A0A0A] py-20 md:py-28 lg:py-36 overflow-hidden">
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
              A következő <br /> sztori a tiéd?
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

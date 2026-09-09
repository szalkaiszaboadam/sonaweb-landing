'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ArrowUpRight } from 'lucide-react'

const CONTAINER = 'mx-auto w-full max-w-[1340px] px-6'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const headerRef = useRef<any>(null)
  const lenis = useLenis()
  // Megkülönbözteti a valódi (első) betöltést/reloadot a későbbi SPA-navigációtól.
  // FONTOS: a `lenis` kezdetben null, és csak később áll elő — a useEffect emiatt
  // kétszer fut le induláskor (egyszer lenis=null-lal, egyszer a kész példánnyal).
  // A flag-et csak akkor "fogyasztjuk el", amikor a lenis már ténylegesen készen áll,
  // különben pont az az egy futás csúszna át, ami a hibás scrollt okozta.
  const hasHandledInitialLoad = useRef(false)

  useEffect(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''

    if (!lenis) return

    if (!hasHandledInitialLoad.current) {
      hasHandledInitialLoad.current = true
      return
    }

    const handleHashScroll = () => {
      if (!lenis) return
      const hash = window.location.hash
      if (hash) {
        const target = document.querySelector(hash) as HTMLElement
        if (target) {
          lenis.scrollTo(target, { duration: 1.2, offset: 0 })
        }
      } else {
        lenis.scrollTo(0, { immediate: true })
      }
    }

    if (typeof window !== 'undefined' && (window as any).isNavbarTransitioning) {
      window.addEventListener('navbarTransitionFinished', handleHashScroll, { once: true })
    } else {
      setTimeout(handleHashScroll, 100)
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [pathname, lenis])

  const [isHidden, setIsHidden] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setIsHidden(true)
    } else {
      setIsHidden(false)
    }
  })

  const toggleMenu = () => {
    if (!isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
    setIsOpen(false)
  }

  const handlePageLink = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    if (pathname === href) {
      closeMenu()
      return
    }

    if (typeof window !== 'undefined') {
      ; (window as any).isNavbarTransitioning = true
    }

    closeMenu()

    setTimeout(() => {
      router.push(href)
    }, 300)

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        ; (window as any).isNavbarTransitioning = false
        window.dispatchEvent(new Event('navbarTransitionFinished'))
      }
    }, 1150)
  }

  const handleSectionLink = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault()

    if (typeof window !== 'undefined') {
      ; (window as any).isNavbarTransitioning = true
    }

    closeMenu()

    setTimeout(() => {
      if (pathname === '/') {
        const target = document.getElementById(sectionId)
        if (target && lenis) {
          lenis.scrollTo(target, { duration: 1.2, offset: 0 })
        }
        window.history.replaceState(null, '', `/#${sectionId}`)
      } else {
        router.push(`/#${sectionId}`)
      }
    }, 300)

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        ; (window as any).isNavbarTransitioning = false
        window.dispatchEvent(new Event('navbarTransitionFinished'))
      }
    }, 1150)
  }

  const drawerEase = [0.76, 0, 0.24, 1] as [number, number, number, number]
  const textEase = [0.16, 1, 0.3, 1] as [number, number, number, number]

  const navLinks = [
    { title: 'Munkáink', href: '/work' },
    { title: 'Megoldások', href: '/services' },
    { title: 'Rólunk', href: '/#about', sectionId: 'about' },
    { title: 'Blog', href: '/blog' },
    { title: 'Bejelentkezés', href: '/client', hasArrow: true },
  ]

  const drawerVariants = {
    closed: { y: '-100%', transition: { duration: 0.8, ease: drawerEase, delay: 0.2 } },
    opened: { y: '0%', transition: { duration: 0.8, ease: drawerEase } }
  }

  const linkVariants = {
    closed: (i: number) => ({
      y: '100%', opacity: 0,
      transition: { duration: 0.4, ease: drawerEase }
    }),
    opened: (i: number) => ({
      y: '0%', opacity: 1,
      transition: { duration: 0.6, ease: textEase, delay: 0.25 + i * 0.08 }
    })
  }

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -40, opacity: 0 }}
        animate={isHidden && !isOpen ? { y: '-100%', opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-6 z-[70] w-full mix-blend-difference md:top-8"
      >
        <div className={`${CONTAINER} flex items-center justify-between`}>
          
          <Link
            href="/"
            aria-label="SONAWEB home"
            className="flex shrink-0 items-center"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                if (isOpen) closeMenu()
                if (lenis) lenis.scrollTo(0)
                else window.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                if (isOpen) handlePageLink(e, '/')
              }
            }}
          >
            <img
              src="/sonaweb-logo-white.png"
              alt="SONAWEB"
              className="h-5 w-auto object-contain transition-all duration-500 md:h-7"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                onClick={(e) => link.sectionId ? handleSectionLink(e, link.sectionId) : handlePageLink(e, link.href)}
                className="group flex items-center font-inter text-[14px] !font-semibold uppercase text-white"
              >
                {/* Asztali linkek: padding és line-height fix az ékezeteknek, inset-0 pozicionálás */}
                <span className="relative inline-flex overflow-hidden py-1.5 leading-normal">
                  <span className="flex items-center gap-1.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                    {link.title}
                    {link.hasArrow && <ArrowUpRight className="h-[1.2em] w-[1.2em]" strokeWidth={3} />}
                  </span>
                  <span className="absolute inset-0 flex items-center gap-1.5 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    {link.title}
                    {link.hasArrow && <ArrowUpRight className="h-[1.2em] w-[1.2em]" strokeWidth={3} />}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <button
            onClick={toggleMenu}
            className="group md:hidden flex shrink-0 items-center font-inter text-[14px] !font-semibold uppercase text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {/* Mobil Menü Gomb: Explicit BEZÁR / MENÜ szöveg és padding fix */}
            <span className="relative inline-flex overflow-hidden py-1.5 leading-normal">
              <span className="flex items-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                {isOpen ? 'BEZÁR' : 'MENÜ'}
              </span>
              <span className="absolute inset-0 flex items-center translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                {isOpen ? 'BEZÁR' : 'MENÜ'}
              </span>
            </span>
          </button>
          
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            variants={drawerVariants}
            initial="closed"
            animate="opened"
            exit="closed"
            className="md:hidden fixed inset-0 z-[60] flex h-[100dvh] w-screen flex-col items-start bg-[#0A0A0A] px-6 pt-32 touch-none"
          >
            <div className="flex w-full flex-col items-start gap-2">
              {navLinks.map((link, i) => (
                <div key={link.title} className="overflow-hidden w-full">
                  <motion.div custom={i} variants={linkVariants}>
                    <Link
                      href={link.href}
                      className="group flex w-full items-start py-2 text-left"
                      onClick={(e) => link.sectionId ? handleSectionLink(e, link.sectionId) : handlePageLink(e, link.href)}
                    >
                      {/* Mobil linkek: leading-tight és py-2 az ékezetek védelmére, inset-0 pozíció */}
                      <span className="relative inline-flex w-full overflow-hidden py-2 font-display text-[clamp(2rem,7vw,3.5rem)] font-extrabold uppercase leading-tight tracking-[-1.5px] text-white">
                        <span className="flex items-center gap-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                          {link.title}
                          {link.hasArrow && <ArrowUpRight className="h-[0.9em] w-[0.9em] text-white" strokeWidth={3} />}
                        </span>
                        <span className="absolute inset-0 flex items-center gap-3 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                          {link.title}
                          {link.hasArrow && <ArrowUpRight className="h-[0.9em] w-[0.9em] text-white" strokeWidth={3} />}
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
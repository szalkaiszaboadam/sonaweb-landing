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

  useEffect(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''

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

  const [hoveredLink, setHoveredLink] = useState<number | null>(null)
  const [isHidden, setIsHidden] = useState(false)
  const { scrollY } = useScroll()

  // Témafigyelő eltávolítva, csak a görgetés-alapú elrejtés maradt
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
      setHoveredLink(null)
    }
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
    setIsOpen(false)
    setHoveredLink(null)
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
    closed: { y: '-100%', transition: { duration: 0.8, ease: drawerEase, delay: 0.35 } },
    opened: { y: '0%', transition: { duration: 0.8, ease: drawerEase } }
  }

  const linkVariants = {
    closed: (i: number) => ({
      y: '120%', opacity: 0,
      transition: { duration: 0.5, ease: drawerEase, delay: (navLinks.length - 1 - i) * 0.05 }
    }),
    opened: (i: number) => ({
      y: '0%', opacity: 1,
      transition: { duration: 0.8, ease: textEase, delay: 0.4 + i * 0.08 }
    })
  }

  const bottomVariants = {
    closed: { y: 40, opacity: 0, transition: { duration: 0.4, ease: drawerEase, delay: 0 } },
    opened: { y: 0, opacity: 1, transition: { duration: 0.8, ease: textEase, delay: 0.8 } }
  }

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -40, opacity: 0 }}
        animate={isHidden && !isOpen ? { y: '-100%', opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        // Hozzáadva a mix-blend-difference, amivel minden belső elem inverz lesz
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
            {/* Mindig a fehér logót használjuk, a blend mode megoldja a színezést */}
            <img
              src="/sonaweb-logo-white.png"
              alt="SONAWEB"
              className="h-5 w-auto object-contain transition-all duration-500 md:h-7"
            />
          </Link>

          <div className="flex items-center">
            <div className="hidden md:flex items-center gap-7 mr-6">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={(e) => link.sectionId ? handleSectionLink(e, link.sectionId) : handlePageLink(e, link.href)}
                  // Alapból fehér szöveg, hoverre finoman elhalványul
                  className="flex items-center gap-1.5 font-inter text-[14px] leading-[14px] tracking-[-0.4px] !font-semibold uppercase text-white transition-opacity duration-300 hover:opacity-70"
                >
                  {link.title}
                  {link.hasArrow && <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />}
                </Link>
              ))}
            </div>

            <button
              onClick={toggleMenu}
              // Fehér háttér, fekete szöveg. A blend mode miatt világos háttéren ez megfordul.
              className="md:hidden flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-2.5 font-inter text-xs font-bold tracking-wide text-black transition-transform duration-500 hover:scale-105 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? 'Bezár' : 'Menü'}
            </button>
          </div>
          
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            variants={drawerVariants}
            initial="closed"
            animate="opened"
            exit="closed"
            className="md:hidden fixed inset-0 z-[60] flex h-[100dvh] w-screen flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] touch-none"
          >
            <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
              <div
                className="flex w-full flex-col items-center justify-center gap-2 md:gap-4"
                onMouseLeave={() => setHoveredLink(null)}
              >
                {navLinks.map((link, i) => (
                  <div key={link.title} className="w-full overflow-hidden px-4 pb-2 pt-1 text-center">
                    <Link
                      href={link.href}
                      className="block w-full"
                      onClick={(e) => link.sectionId ? handleSectionLink(e, link.sectionId) : handlePageLink(e, link.href)}
                      onMouseEnter={() => setHoveredLink(i)}
                    >
                      <motion.span
                        custom={i}
                        variants={linkVariants}
                        className={`block w-full text-center font-display text-[clamp(1.15rem,6.5vw,5.5rem)] font-black uppercase leading-tight tracking-[-0.02em] transition-colors duration-300 whitespace-nowrap ${hoveredLink === null || hoveredLink === i ? 'text-[#F4F2F0]' : 'text-[#333333]'
                          }`}
                      >
                        {link.title}
                      </motion.span>
                    </Link>
                  </div>
                ))}
              </div>

              <motion.div
                variants={bottomVariants}
                className="absolute bottom-10 left-0 flex w-full flex-col-reverse items-center justify-between gap-6 px-6 md:bottom-12 md:flex-row md:px-12"
              >
                <Link
                  href="/client"
                  onClick={(e) => handlePageLink(e, '/client')}
                  className="font-inter text-sm font-medium tracking-wide text-[#9E9A98] underline decoration-[#9E9A98]/40 underline-offset-4 transition-colors duration-300 hover:text-[#F4F2F0] hover:decoration-[#F4F2F0]"
                >
                  Ügyfélportál bejelentkezés
                </Link>
                <div className="flex items-center gap-6 font-inter text-sm font-medium tracking-wide text-[#9E9A98]">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-[#F4F2F0]">Facebook</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-[#F4F2F0]">Instagram</a>
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-[#F4F2F0]">TikTok</a>
                </div>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
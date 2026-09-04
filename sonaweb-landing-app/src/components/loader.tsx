'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLenis } from 'lenis/react'

export const globalLoaderState = { isFinished: false }

export function useLoaderReady() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // 1. ESET: Még fut a kezdő fekete betöltő képernyő
    if (!globalLoaderState.isFinished) {
      const handleReady = () => setIsReady(true)
      window.addEventListener('loaderFinished', handleReady)
      return () => window.removeEventListener('loaderFinished', handleReady)
    }

    // 2. ESET: Éppen a Navbar menüből navigáltunk!
    // A hook észreveszi a jelet, és VÁR a 'navbarTransitionFinished' eseményre (az 1150ms-ra)
    if (typeof window !== 'undefined' && (window as any).isNavbarTransitioning) {
      const handleNavbarReady = () => setIsReady(true)
      window.addEventListener('navbarTransitionFinished', handleNavbarReady)
      return () => window.removeEventListener('navbarTransitionFinished', handleNavbarReady)
    }

    // 3. ESET: Normál navigáció (Sima gombkattintás az oldalon belül)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsReady(true))
    })
  }, [])

  return isReady
}

export function Loader() {
  const [isLoading, setIsLoading] = useState(true)
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      lenis.stop()
    }
    document.body.style.overflow = 'hidden'

    // Kicsit rövidebb várakozás (2 mp), hogy dinamikusabb legyen az élmény,
    // mivel maga a kilépő animáció is ad hozzá időt.
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    }
  }, [lenis])

  return (
    <AnimatePresence 
      onExitComplete={() => {
        document.body.style.overflow = ''
        if (lenis) {
          lenis.start()
        }
        
        globalLoaderState.isFinished = true
        window.dispatchEvent(new Event('loaderFinished'))
      }}
    >
      {isLoading && (
        <motion.div
          key="preloader"
          // A fekete háttér egyszerűen elhalványul a zoom közben
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
        >
<motion.div
            initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ 
              scale: 40, // 80 helyett 40 - tehermentesíti a renderelést, de az illúzió megmarad
              opacity: 0,
              filter: 'blur(0px)', // BIZTOSÍTÉK: ne akarjon blurt számolni ekkora méretben!
              transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } 
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
            className="flex items-center justify-center will-change-transform"
          >
            <img
              src="/sonaweb-logo-white.png"
              alt="SONAWEB"
              draggable={false}
              className="h-10 w-auto object-contain md:h-16"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
'use client'

import { ReactLenis } from 'lenis/react'
import { ReactNode, useEffect, useMemo, useState } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)

    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Stabil referencia! Enélkül minden renderelés (pl. az isDesktop állapotváltozása
  // mobilon/keskeny nézetben) új objektumot adna át a ReactLenis-nek — az pedig
  // emiatt újrainicializálja a Lenis példányt, ami scroll-to-top villanást okoz.
  const options = useMemo(
    () => ({
      lerp: 0.1,
      duration: 1.5,
      // Csak akkor aktiválja az egérgörgős smooth scrollt, ha asztali gépen vagyunk
      smoothWheel: isDesktop,
    }),
    [isDesktop]
  )

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  )
}
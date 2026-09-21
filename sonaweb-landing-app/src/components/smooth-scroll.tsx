'use client'

import { ReactLenis } from 'lenis/react'
import { ReactNode, useEffect, useMemo, useState } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    const checkDevice = () => setIsDesktop(window.innerWidth >= 768)
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  const options = useMemo(() => ({
    lerp: 0.1,
    duration: 1.5,
    smoothWheel: true,
  }), [])

  // Mobilon, vagy a kezdeti betöltés előtt visszaadjuk az eredeti domot a Lenis wrapper nélkül
  if (!isMounted || !isDesktop) {
    return <>{children}</>
  }

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  )
}
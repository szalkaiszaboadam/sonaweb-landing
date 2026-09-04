'use client'

import { ReactLenis } from 'lenis/react'
import { ReactNode, useEffect, useState } from 'react'

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

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1, 
        duration: 1.5, 
        // Csak akkor aktiválja az egérgörgős smooth scrollt, ha asztali gépen vagyunk
        smoothWheel: isDesktop 
      }}
    >
      {children}
    </ReactLenis>
  )
}
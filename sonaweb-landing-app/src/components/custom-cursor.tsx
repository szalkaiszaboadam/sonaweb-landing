'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

type CursorState = {
  active: boolean
  label: string
}

type CursorContextValue = {
  setCursor: (state: CursorState) => void
  clearCursor: () => void
}

const CursorContext = createContext<CursorContextValue | null>(null)

export function useCustomCursor() {
  const ctx = useContext(CursorContext)
  if (!ctx) {
    return { setCursor: () => { }, clearCursor: () => { } }
  }
  return ctx
}

export function CustomCursorProvider({ children }: { children: ReactNode }) {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  
  const smoothX = useSpring(mouseX, { damping: 24, stiffness: 350, mass: 0.1 })
  const smoothY = useSpring(mouseY, { damping: 24, stiffness: 350, mass: 0.1 })

  const [active, setActive] = useState(false)
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  // ── 1. KÉSLELTETÉS REFERENCIA ──
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setCursor = useCallback((state: CursorState) => {
    // 2. Ha épp be akart csukódni (mert a résen voltál), megszakítjuk a folyamatot
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActive(state.active)
    setLabel(state.label)
  }, [])

  const clearCursor = useCallback(() => {
    // 3. Nem csukjuk be azonnal! Várunk 100ms-ot. 
    // Ha közben átérsz a következő képre, a setCursor megszakítja ezt az időzítőt.
    timeoutRef.current = setTimeout(() => {
      setActive(false)
      setLabel('')
    }, 100) 
  }, [])

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const move = (e: globalThis.MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const hide = () => setVisible(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', hide)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseleave', hide)
    }
  }, [visible, mouseX, mouseY])

  return (
    <CursorContext.Provider value={{ setCursor, clearCursor }}>
      {children}

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99999] hidden md:block"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        transition={{ opacity: { duration: 0.2 } }}
      >
        <motion.div
          className="flex items-center justify-center overflow-hidden rounded-full text-center font-inter text-[14px] font-semibold uppercase leading-[14px] tracking-[-0.4px]"
          animate={{
            width: active ? 112 : 12,
            height: active ? 112 : 12,
            backgroundColor: '#BF2234',
            color: active ? '#F4F2F0' : 'transparent',
          }}
          style={{
            willChange: 'width, height, background-color', 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25, 
            mass: 0.5 
          }}
        >
          <AnimatePresence mode="wait">
            {active && (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30 
                }}
                className="px-2 whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </CursorContext.Provider>
  )
}
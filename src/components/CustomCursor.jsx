import React, { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [cursorText, setCursorText] = useState('')
  const [cursorVariant, setCursorVariant] = useState('default') // 'default' | 'hover' | 'card' | 'hidden'
  const [cursorTheme, setCursorTheme] = useState('default') // 'default' | 'arulis'
  const [isFinePointer, setIsFinePointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring physics for smooth follower ring
  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Only enable custom cursor on devices with fine pointer (mouse / trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)')
    setIsFinePointer(mediaQuery.matches)

    const handleMediaChange = (e) => setIsFinePointer(e.matches)
    mediaQuery.addEventListener('change', handleMediaChange)

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)

      // Detect cursor theme context (e.g., Arulis luxury case study)
      const themeElement = e.target.closest('[data-cursor-theme]')
      const theme = themeElement ? themeElement.getAttribute('data-cursor-theme') : 'default'
      setCursorTheme(theme)

      // Detect cursor targets
      const target = e.target.closest('[data-cursor], button, a, [role="button"]')
      if (target) {
        const customType = target.getAttribute('data-cursor')
        const customLabel = target.getAttribute('data-cursor-text')

        if (customType === 'card' || customType === 'view') {
          setCursorVariant('card')
          setCursorText(customLabel || 'VIEW ↗')
        } else if (customType === 'explore') {
          setCursorVariant('card')
          setCursorText(customLabel || 'EXPLORE')
        } else if (customType === 'none') {
          setCursorVariant('hidden')
          setCursorText('')
        } else {
          setCursorVariant('hover')
          setCursorText('')
        }
      } else {
        setCursorVariant('default')
        setCursorText('')
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
      setCursorVariant('hidden')
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
      setCursorVariant('default')
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible, mouseX, mouseY])

  if (!isFinePointer || !isVisible) return null

  const isArulis = cursorTheme === 'arulis'
  const isAtelier = cursorTheme === 'atelier'
  const isMaison = cursorTheme === 'maison'
  const isAurex = cursorTheme === 'aurex'

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 1. Precise Center Dot (moves immediately with mouse) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: isAurex ? '#C6FF00' : isArulis ? '#D4AF37' : isAtelier ? '#9B5D3E' : isMaison ? '#B87F83' : '#FF4D0A',
          boxShadow: isAurex
            ? '0 0 12px rgba(198, 255, 0, 0.9)'
            : isArulis
            ? '0 0 10px rgba(212, 175, 55, 0.7)'
            : isAtelier
            ? '0 0 10px rgba(155, 93, 62, 0.7)'
            : isMaison
            ? '0 0 10px rgba(184, 127, 131, 0.7)'
            : '0 0 8px #FF4D0A',
        }}
        animate={{
          scale: cursorVariant === 'card' ? 0 : cursorVariant === 'hover' ? 1.5 : 1,
          opacity: cursorVariant === 'hidden' ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* 2. Inertial Follower Ring / Badge */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center font-mono font-bold uppercase tracking-wider text-center"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorVariant === 'card' 
            ? (isArulis || isAtelier || isMaison ? 72 : 84) 
            : cursorVariant === 'hover' ? 44 : 32,
          height: cursorVariant === 'card' 
            ? (isArulis || isAtelier || isMaison ? 72 : 84) 
            : cursorVariant === 'hover' ? 44 : 32,
          backgroundColor:
            cursorVariant === 'card'
              ? (isAurex ? 'rgba(9, 10, 9, 0.96)' : isArulis ? 'rgba(10, 36, 27, 0.94)' : isAtelier ? 'rgba(26, 23, 21, 0.94)' : isMaison ? 'rgba(57, 42, 39, 0.94)' : 'rgba(255, 77, 10, 0.92)')
              : cursorVariant === 'hover'
              ? (isAurex ? 'rgba(198, 255, 0, 0.18)' : isArulis ? 'rgba(212, 175, 55, 0.12)' : isAtelier ? 'rgba(155, 93, 62, 0.15)' : isMaison ? 'rgba(184, 127, 131, 0.15)' : 'rgba(255, 135, 56, 0.15)')
              : (isAurex ? 'rgba(198, 255, 0, 0.06)' : isArulis ? 'rgba(15, 61, 46, 0.08)' : isAtelier ? 'rgba(155, 93, 62, 0.08)' : isMaison ? 'rgba(184, 127, 131, 0.08)' : 'rgba(255, 255, 255, 0.04)'),
          borderColor:
            cursorVariant === 'card'
              ? (isAurex ? 'rgba(198, 255, 0, 0.95)' : isArulis ? 'rgba(212, 175, 55, 0.8)' : isAtelier ? 'rgba(155, 93, 62, 0.8)' : isMaison ? 'rgba(232, 201, 200, 0.8)' : 'rgba(255, 255, 255, 0.6)')
              : cursorVariant === 'hover'
              ? (isAurex ? 'rgba(198, 255, 0, 0.85)' : isArulis ? 'rgba(212, 175, 55, 0.7)' : isAtelier ? 'rgba(155, 93, 62, 0.7)' : isMaison ? 'rgba(184, 127, 131, 0.7)' : 'rgba(255, 77, 10, 0.8)')
              : (isAurex ? 'rgba(198, 255, 0, 0.35)' : isArulis ? 'rgba(15, 61, 46, 0.3)' : isAtelier ? 'rgba(155, 93, 62, 0.3)' : isMaison ? 'rgba(184, 127, 131, 0.3)' : 'rgba(255, 255, 255, 0.35)'),
          borderWidth: cursorVariant === 'card' ? 1 : 1.5,
          scale: cursorVariant === 'hidden' ? 0 : 1,
          opacity: cursorVariant === 'hidden' ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 300,
        }}
      >
        {cursorVariant === 'card' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`text-[10px] sm:text-[11px] tracking-widest text-center px-1 font-bold drop-shadow-sm ${
              isArulis || isAtelier || isMaison ? 'text-[#FAF8F5]' : 'text-white'
            }`}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </div>
  )
}

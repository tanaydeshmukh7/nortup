import React, { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [cursorText, setCursorText] = useState('')
  const [cursorVariant, setCursorVariant] = useState('default') // 'default' | 'hover' | 'card' | 'hidden'
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

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 1. Precise Center Dot (moves immediately with mouse) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FF4D0A] shadow-[0_0_8px_#FF4D0A]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: cursorVariant === 'card' ? 0 : cursorVariant === 'hover' ? 1.5 : 1,
          opacity: cursorVariant === 'hidden' ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* 2. Inertial Follower Ring / Badge */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center font-mono font-bold uppercase"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorVariant === 'card' ? 84 : cursorVariant === 'hover' ? 44 : 32,
          height: cursorVariant === 'card' ? 84 : cursorVariant === 'hover' ? 44 : 32,
          backgroundColor:
            cursorVariant === 'card'
              ? 'rgba(255, 77, 10, 0.92)'
              : cursorVariant === 'hover'
              ? 'rgba(255, 135, 56, 0.15)'
              : 'rgba(255, 255, 255, 0.04)',
          borderColor:
            cursorVariant === 'card'
              ? 'rgba(255, 255, 255, 0.6)'
              : cursorVariant === 'hover'
              ? 'rgba(255, 77, 10, 0.8)'
              : 'rgba(255, 255, 255, 0.35)',
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
            className="text-white text-[11px] tracking-widest text-center px-1 font-bold drop-shadow-sm"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </div>
  )
}

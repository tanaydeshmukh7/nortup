import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

export default function FeaturedWorkCursor({ containerRef }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFinePointer, setIsFinePointer] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  
  const isHoveringRef = useRef(false)
  const hideTimeoutRef = useRef(null)

  // Motion values for smooth pointer following
  const mouseX = useMotionValue(-500)
  const mouseY = useMotionValue(-500)

  // Smooth spring physics for refined tracking
  const springConfig = isReducedMotion
    ? { damping: 100, stiffness: 1000, mass: 0.01 }
    : { damping: 28, stiffness: 350, mass: 0.35 }

  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Only enable on devices with fine pointer and hover capability
    const finePointerMedia = window.matchMedia('(pointer: fine) and (hover: hover)')
    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateCapabilities = () => {
      setIsFinePointer(finePointerMedia.matches)
      setIsReducedMotion(reducedMotionMedia.matches)
    }

    updateCapabilities()

    finePointerMedia.addEventListener('change', updateCapabilities)
    reducedMotionMedia.addEventListener('change', updateCapabilities)

    return () => {
      finePointerMedia.removeEventListener('change', updateCapabilities)
      reducedMotionMedia.removeEventListener('change', updateCapabilities)
    }
  }, [])

  useEffect(() => {
    if (!isFinePointer) return

    const container = containerRef?.current
    if (!container) return

    let isSectionActive = false

    const handlePointerMove = (e) => {
      // Check if pointer is currently over any Featured Work project card
      const targetCard = e.target.closest('[data-featured-card]')

      if (targetCard) {
        // If there was a pending hide timeout from crossing gaps, cancel it
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
          hideTimeoutRef.current = null
        }

        if (!isHoveringRef.current) {
          isHoveringRef.current = true
          // Jump spring to current position so it doesn't fly in from offscreen
          if (typeof smoothX.jump === 'function') {
            smoothX.jump(e.clientX)
            smoothY.jump(e.clientY)
          } else {
            smoothX.set(e.clientX)
            smoothY.set(e.clientY)
          }
          mouseX.set(e.clientX)
          mouseY.set(e.clientY)
          setIsVisible(true)
        } else {
          mouseX.set(e.clientX)
          mouseY.set(e.clientY)
        }
      } else {
        // Pointer is inside section but not over a project card (e.g., header, filter pills, padding)
        if (isHoveringRef.current && !hideTimeoutRef.current) {
          // 40ms debounce to prevent any micro-flicker when moving across tight card grid gaps
          hideTimeoutRef.current = setTimeout(() => {
            isHoveringRef.current = false
            setIsVisible(false)
            hideTimeoutRef.current = null
          }, 40)
        }
      }
    }

    const handleSectionEnter = () => {
      if (!isSectionActive) {
        isSectionActive = true
        window.addEventListener('pointermove', handlePointerMove, { passive: true })
      }
    }

    const handleSectionLeave = () => {
      isSectionActive = false
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      isHoveringRef.current = false
      setIsVisible(false)
      window.removeEventListener('pointermove', handlePointerMove)
    }

    const handleWindowBlur = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      isHoveringRef.current = false
      setIsVisible(false)
    }

    // Attach listener to section container
    container.addEventListener('pointerenter', handleSectionEnter)
    container.addEventListener('pointerleave', handleSectionLeave)
    window.addEventListener('blur', handleWindowBlur)

    // Check if mouse is already inside the section on mount
    try {
      if (container.matches(':hover')) {
        handleSectionEnter()
      }
    } catch {
      // Ignore if :hover check isn't supported in environment
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      container.removeEventListener('pointerenter', handleSectionEnter)
      container.removeEventListener('pointerleave', handleSectionLeave)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [isFinePointer, containerRef, mouseX, mouseY, smoothX, smoothY])

  if (!isFinePointer) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="featured-glass-cursor"
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.82 }}
            transition={{
              duration: isReducedMotion ? 0.05 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              x: smoothX,
              y: smoothY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            className="fixed top-0 left-0 flex items-center justify-center pointer-events-none"
          >
            {/* Frosted Glass Rectangular Box */}
            <div
              data-testid="featured-work-glass-cursor"
              style={{
                width: '144px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 245, 240, 0.14)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                boxShadow:
                  '0 8px 32px 0 rgba(0, 0, 0, 0.28), 0 2px 8px 0 rgba(0, 0, 0, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
              }}
              className="flex items-center justify-center gap-1.5 px-3 text-white select-none whitespace-nowrap"
            >
              <span className="font-sans text-[11.5px] font-medium tracking-[0.15em] uppercase text-white/95 leading-none">
                VIEW PROJECT
              </span>
              <span
                className="text-[13px] font-sans font-light leading-none -mt-0.5 text-white/95"
                aria-hidden="true"
              >
                ↗
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

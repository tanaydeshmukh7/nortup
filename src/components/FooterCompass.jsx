import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * FooterCompass — Scroll-Scrubbed Cinematic Compass Landing Animation
 * 
 * Requirements & Architecture:
 * 1. Scroll-driven: Vertical fall, rotation, contact shadow, and ground pulse
 *    are 100% tied to the user's scroll position via Framer Motion `useScroll`.
 * 2. Speed matching: Scrolling faster moves the compass faster; scrolling slower
 *    moves it slower; stopping scroll halts the compass at its current position;
 *    scrolling up reverses the animation back to the sky.
 * 3. Bottom Landing: The compass lands near the bottom edge of the entire footer,
 *    resting inside a dedicated, reserved landing zone.
 * 4. Zero Overlap: Never obscures contact details, navigation, legal links, or copyright info.
 * 5. Responsive sizing: Uses clamp() to maintain consistent aspect ratio (1024/776).
 * 6. Accessibility: Full prefers-reduced-motion support (instant grounded state).
 */
export default function FooterCompass({ containerRef }) {
  const shouldReduceMotion = useReducedMotion()
  const groundRef = useRef(null)
  const compassRef = useRef(null)

  const [isMobile, setIsMobile] = useState(false)
  const travelRef = useRef(850)

  // Track scroll progress through the footer container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end']
  })

  // Measure dynamic physical travel distance from actual DOM geometry
  useEffect(() => {
    const updateMetrics = () => {
      const mobile = window.innerWidth < 640
      setIsMobile(mobile)

      if (containerRef?.current && groundRef.current) {
        const cRect = containerRef.current.getBoundingClientRect()
        const gRect = groundRef.current.getBoundingClientRect()
        const compassHeight = compassRef.current ? compassRef.current.offsetHeight : (mobile ? 130 : 180)

        // Distance from top of container down to ground contact plane
        const distanceToGround = Math.round(gRect.bottom - cRect.top)
        // Add extra clearance so compass starts fully above the footer container at p = 0
        travelRef.current = Math.max(350, distanceToGround + compassHeight * 0.4)
      }
    }

    updateMetrics()
    window.addEventListener('resize', updateMetrics, { passive: true })

    let ro
    if (typeof ResizeObserver !== 'undefined' && containerRef?.current) {
      ro = new ResizeObserver(updateMetrics)
      ro.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener('resize', updateMetrics)
      if (ro) ro.disconnect()
    }
  }, [containerRef])

  // ===========================================================================
  // Scroll-Scrubbed Transforms (Continuous, Reversible, Zero Autoplay Timers)
  // ===========================================================================

  // Vertical position Y (anchored to landing ground plane: 0 is final resting position)
  const y = useTransform(scrollYProgress, (p) => {
    const travel = travelRef.current
    const bounce = isMobile ? 8 : 14

    // Before footer reaches viewport
    if (p <= 0) return -travel
    // At or beyond the bottom of footer
    if (p >= 1) return 0

    // Stage 2: Natural gravitational descent toward bottom (0.00 -> 0.88)
    if (p < 0.88) {
      const t = p / 0.88
      // Smooth gravitational ease-in curve
      const ease = Math.pow(t, 1.6)
      return -travel * (1 - ease)
    }

    // Stage 4: Landing touchdown and single subtle rebound (0.88 -> 0.94)
    if (p < 0.94) {
      const t = (p - 0.88) / 0.06
      return -bounce * Math.sin((t * Math.PI) / 2)
    }

    // Settling back to ground (0.94 -> 0.98)
    if (p < 0.98) {
      const t = (p - 0.94) / 0.04
      return -bounce * Math.cos((t * Math.PI) / 2)
    }

    // Settled resting state (0.98 -> 1.0)
    return 0
  })

  // Subtle physical tilt while falling, smoothly straightening on touchdown
  const rotate = useTransform(scrollYProgress, (p) => {
    if (p <= 0) return -5
    if (p >= 0.88 && p < 0.94) {
      const t = (p - 0.88) / 0.06
      return 0.5 * Math.sin(t * Math.PI)
    }
    if (p >= 0.94) return 0
    return -5 * (1 - p / 0.88)
  })

  // Opacity: fades in gracefully as soon as footer enters viewport
  const compassOpacity = useTransform(scrollYProgress, (p) => {
    if (p <= 0.01) return 0
    if (p < 0.06) return (p - 0.01) / 0.05
    return 1
  })

  // Physical contact shadow opacity (syncs with distance from ground plane)
  const shadowOpacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.4) return 0
    if (p < 0.88) return 0.15 + 0.75 * Math.pow((p - 0.4) / 0.48, 2)
    if (p < 0.94) return 0.65
    return 0.88
  })

  // Contact shadow scale
  const shadowScale = useTransform(scrollYProgress, (p) => {
    if (p < 0.4) return 0.45
    if (p < 0.88) return 0.45 + 0.6 * ((p - 0.4) / 0.48)
    if (p < 0.94) return 0.88
    return 1.0
  })

  // Burnt-orange floor reflection halo
  const floorGlowOpacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.5) return 0
    if (p < 0.88) return 0.2 + 0.75 * ((p - 0.5) / 0.38)
    if (p < 0.94) return 0.6
    return 0.8
  })

  // Shockwave pulse ring on touchdown
  const shockwaveScale = useTransform(scrollYProgress, (p) => {
    if (p < 0.88) return 0.5
    const t = Math.min(1, (p - 0.88) / 0.1)
    return 0.8 + 1.4 * t
  })

  const shockwaveOpacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.88) return 0
    const t = Math.min(1, (p - 0.88) / 0.1)
    return 0.85 * (1 - t)
  })

  return (
    <div 
      ref={groundRef} 
      className="relative z-10 w-full h-[180px] sm:h-[220px] lg:h-[240px] flex items-end justify-center pointer-events-none select-none my-3 sm:my-5"
    >
      {/* 1. Overhead Ambient Atmospheric Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] lg:w-[600px] h-[190px] sm:h-[230px] rounded-full pointer-events-none select-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 77, 10, 0.22) 0%, rgba(171, 20, 0, 0.08) 45%, transparent 75%)',
          filter: 'blur(50px)',
        }}
      />

      {/* 2. Horizon Ground Plane Line */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[240px] sm:w-[400px] lg:w-[540px] h-px bg-gradient-to-r from-transparent via-[#FF4D0A]/35 to-transparent pointer-events-none" />

      {/* 3. Warm Burnt-Orange Ground Reflection & Floor Halo */}
      <motion.div 
        style={{
          opacity: shouldReduceMotion ? 0.85 : floorGlowOpacity,
          background: 'radial-gradient(ellipse at center, rgba(255, 77, 10, 0.48) 0%, rgba(200, 30, 0, 0.2) 42%, transparent 72%)',
          filter: 'blur(7px)',
        }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[380px] lg:w-[480px] h-[36px] sm:h-[48px] rounded-[100%] pointer-events-none select-none"
      />

      {/* 4. Dynamic Physical Contact Shadow */}
      <motion.div 
        style={{
          opacity: shouldReduceMotion ? 0.88 : shadowOpacity,
          scaleX: shouldReduceMotion ? 1 : shadowScale,
          scaleY: shouldReduceMotion ? 1 : shadowScale,
        }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[190px] sm:w-[250px] lg:w-[290px] h-[18px] sm:h-[24px] rounded-[100%] bg-black/95 blur-[4px] pointer-events-none select-none"
      />

      {/* 5. Touchdown Shockwave Pulse Ring */}
      {!shouldReduceMotion && (
        <motion.div 
          style={{
            opacity: shockwaveOpacity,
            scale: shockwaveScale,
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[170px] sm:w-[230px] lg:w-[270px] h-[20px] sm:h-[26px] rounded-[100%] border border-[#FF4D0A] shadow-[0_0_24px_rgba(255,77,10,0.85)] pointer-events-none select-none"
        />
      )}

      {/* 
        6. Authentic Metallic Compass Emblem
        Anchored in the ground stage. When y = 0, it rests perfectly on the contact shadow.
        When y is negative, it moves upward with scroll, reaching above the footer at p = 0.
      */}
      <motion.div 
        ref={compassRef}
        style={{
          y: shouldReduceMotion ? 0 : y,
          rotate: shouldReduceMotion ? 0 : rotate,
          opacity: shouldReduceMotion ? 1 : compassOpacity,
          width: 'clamp(170px, 18vw, 240px)',
          aspectRatio: '1024 / 776',
        }}
        className="relative z-20 pointer-events-none select-none flex items-end justify-center mb-0.5 drop-shadow-[0_16px_36px_rgba(0,0,0,0.75)]"
      >
        <img 
          src="/assets/hero-compass-figma.png" 
          alt="Northup Studio Brand Compass"
          className="w-full h-full object-contain object-bottom pointer-events-none select-none"
          loading="eager"
          decoding="async"
        />
      </motion.div>
    </div>
  )
}

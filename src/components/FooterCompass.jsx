import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/**
 * FooterCompass — Northup Studio Cinematic Compass Landing Stage (Zone A)
 * 
 * Physics Sequence:
 * 1. Pre-trigger: Inactive above viewport, zero performance overhead.
 * 2. Stage B Trigger: IntersectionObserver triggers once when ~20% of footer is in viewport.
 * 3. Stage C Descent: Descends under apparent gravitational pull (1.16s).
 * 4. Stage D Soft Landing: Ground contact at t = 1.16s, 1 subtle physical bounce (apex at 1.44s), 
 *    small settling movement (1.88s), tightening contact shadow, and expanding orange shockwave pulse ring.
 * 5. Stage E Settled: Stationary resting state with ambient burnt-orange floor glow (2.0s total).
 * 6. Accessibility: Full prefers-reduced-motion support (instant grounded state).
 */
export default function FooterCompass() {
  const stageRef = useRef(null)
  const isInView = useInView(stageRef, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Responsive physical travel distances
  const dropY = isMobile ? -85 : -140
  const bounceY = isMobile ? -10 : -16
  const settleY = isMobile ? -2 : -3

  // Active animation state
  const animationState = shouldReduceMotion 
    ? 'resting' 
    : isInView 
      ? 'animated' 
      : 'initial'

  return (
    <div 
      ref={stageRef} 
      className="relative z-10 w-full flex flex-col items-center justify-end pt-4 sm:pt-6 pb-2 select-none"
    >
      {/* 
        Dedicated Landing Stage Ground Area
        Generous stable height provides ample headroom for descent without clipping
      */}
      <div className="relative w-full max-w-[620px] h-[220px] sm:h-[260px] lg:h-[290px] flex items-end justify-center">

        {/* 1. Overhead Ambient Atmospheric Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] lg:w-[600px] h-[200px] sm:h-[240px] rounded-full pointer-events-none select-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 77, 10, 0.2) 0%, rgba(171, 20, 0, 0.08) 45%, transparent 75%)',
            filter: 'blur(50px)',
          }}
        />

        {/* 2. Horizon Ground Plane Line */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[240px] sm:w-[400px] lg:w-[520px] h-px bg-gradient-to-r from-transparent via-[#FF4D0A]/35 to-transparent pointer-events-none" />

        {/* 3. Warm Burnt-Orange Ground Reflection & Floor Halo */}
        <motion.div 
          initial={{ opacity: shouldReduceMotion ? 0.85 : 0.2 }}
          animate={isInView ? { opacity: 0.85 } : { opacity: 0.2 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[380px] lg:w-[480px] h-[36px] sm:h-[48px] rounded-[100%] pointer-events-none select-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 77, 10, 0.45) 0%, rgba(200, 30, 0, 0.2) 42%, transparent 72%)',
            filter: 'blur(7px)',
          }}
        />

        {/* 4. Dynamic Physical Contact Shadow (tightens and darkens upon touchdown) */}
        <motion.div 
          variants={{
            initial: {
              opacity: 0.1,
              scaleX: 0.5,
              scaleY: 0.5,
              filter: 'blur(16px)',
            },
            resting: {
              opacity: 0.88,
              scaleX: 1,
              scaleY: 1,
              filter: 'blur(5px)',
              transition: { duration: 0.3 }
            },
            animated: {
              opacity: [0.1, 0.98, 0.55, 0.94, 0.88, 0.88],
              scaleX: [0.5, 1.06, 0.86, 1.02, 1, 1],
              scaleY: [0.5, 1.06, 0.86, 1.02, 1, 1],
              filter: [
                'blur(16px)',
                'blur(4px)',
                'blur(9px)',
                'blur(5px)',
                'blur(5px)',
                'blur(5px)'
              ],
              transition: {
                duration: 2.0,
                times: [0, 0.58, 0.72, 0.85, 0.94, 1.0],
                ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn"]
              }
            }
          }}
          initial="initial"
          animate={animationState}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] sm:w-[260px] lg:w-[310px] h-[20px] sm:h-[26px] rounded-[100%] bg-black/95 pointer-events-none select-none"
        />

        {/* 5. Touchdown Shockwave / Orange Energy Ring Pulse */}
        <motion.div 
          variants={{
            initial: {
              opacity: 0,
              scale: 0.5,
            },
            resting: {
              opacity: 0,
              scale: 1,
            },
            animated: {
              opacity: [0, 0, 0.85, 0.35, 0],
              scale: [0.5, 0.5, 0.82, 1.55, 2.25],
              transition: {
                duration: 2.0,
                times: [0, 0.57, 0.59, 0.78, 1.0],
                ease: "easeOut"
              }
            }
          }}
          initial="initial"
          animate={animationState}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180px] sm:w-[240px] lg:w-[290px] h-[22px] sm:h-[28px] rounded-[100%] border border-[#FF4D0A] shadow-[0_0_24px_rgba(255,77,10,0.85)] pointer-events-none select-none"
        />

        {/* 6. Authentic Metallic Compass Graphic (Descends, Lands & Settles) */}
        <motion.div 
          variants={{
            initial: {
              y: dropY,
              opacity: 0,
              rotate: -4.5,
              scale: 0.96,
            },
            resting: {
              y: 0,
              opacity: 1,
              rotate: 0,
              scale: 1,
              transition: { duration: 0.3 }
            },
            animated: {
              y: [dropY, 0, bounceY, 0, settleY, 0],
              opacity: [0, 1, 1, 1, 1, 1],
              rotate: [-4.5, 0, 0.5, 0, 0, 0],
              scale: [0.96, 1, 0.995, 1, 1, 1],
              transition: {
                duration: 2.0,
                times: [0, 0.58, 0.72, 0.85, 0.94, 1.0],
                ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn"]
              }
            }
          }}
          initial="initial"
          animate={animationState}
          className="relative z-10 w-[200px] sm:w-[260px] lg:w-[310px] aspect-[1024/776] pointer-events-none select-none flex items-end justify-center mb-0.5"
        >
          <img 
            src="/assets/hero-compass-figma.png" 
            alt="Northup Studio Brand Compass"
            className="w-full h-full object-contain object-bottom drop-shadow-[0_16px_36px_rgba(0,0,0,0.7)]"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

      </div>
    </div>
  )
}

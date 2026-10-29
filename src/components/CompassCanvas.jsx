import React, { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function CompassCanvas({ className = '' }) {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Restrained, premium spring physics
  const springX = useSpring(mouseX, { stiffness: 80, damping: 22 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 22 })

  // Very gentle 3D tilt: ±2.5 deg, anchored strictly to bottom center
  const rotateY = useTransform(springX, [0, 1], [-2.5, 2.5])
  const rotateX = useTransform(springY, [0, 1], [2, -2])

  useEffect(() => {
    // Only register pointer movement on desktop
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return

    const handleMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [mouseX, mouseY])

  return (
    <div className={`relative w-full h-full flex items-end justify-center select-none ${className}`}>
      
      {/* Background warm radial glowing aura behind the compass */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-[90%] h-[90%] rounded-full bg-gradient-radial from-[#ff4500]/25 via-[#e61a00]/12 to-transparent blur-[80px]" 
        />
      </div>

      {/* Single Brand Compass Graphic: exact 3D artwork matching Figma reference */}
      <motion.img 
        src="/assets/hero-compass-figma.png" 
        alt="Northup Brand Compass" 
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1200,
          transformOrigin: 'bottom center'
        }}
        className="relative z-10 w-full h-full object-contain lg:object-fill object-bottom pointer-events-none select-none drop-shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
      />

    </div>
  )
}

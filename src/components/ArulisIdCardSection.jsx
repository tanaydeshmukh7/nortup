import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Play, Pause, Sparkles, Shield, RotateCcw, VolumeX, Eye, ArrowUpRight } from 'lucide-react'

/**
 * ArulisIdCardSection — Luxury Editorial Edition
 * Inspired by high-end creative studios (Stokt, Made Thought, SocioDesign)
 * 
 * Features:
 * - Fluid 3D perspective tilt with spring physics (GPU-accelerated, zero React re-renders on move)
 * - Restrained specular light sweep / glass sheen across the card
 * - Architectural corner registration marks & micro-borders
 * - Seamless 1.2x accelerated video looping with zero dead frames
 * - Editorial HUD indicator: [ animated dot ] BRAND FILM / PLAYING
 * - Complete elimination of generic controls, orange bubbles, and top-left watermarks
 * - Full viewport awareness via IntersectionObserver (pauses video when scrolled away)
 * - Flawless mobile touch support & prefers-reduced-motion compliance
 */
export default function ArulisIdCardSection() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  // Target playback rate: slightly accelerated for crisp, natural motion
  const PLAYBACK_RATE = 1.2

  // Component state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isActivelyPlaying, setIsActivelyPlaying] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [playProgress, setPlayProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [hasError, setHasError] = useState(false)

  // Detect touch devices
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(isTouch)
  }, [])

  // ---------------------------------------------------------------------------
  // 3D Perspective Tilt Physics via Framer Motion Values & Springs
  // Runs outside React render cycle for 60/120fps buttery performance
  // ---------------------------------------------------------------------------
  const pointerX = useMotionValue(0) // Range: -0.5 to 0.5
  const pointerY = useMotionValue(0) // Range: -0.5 to 0.5

  const springConfig = { damping: 24, stiffness: 180, mass: 0.6 }
  const smoothX = useSpring(pointerX, springConfig)
  const smoothY = useSpring(pointerY, springConfig)

  // Calculate subtle rotation angles (max ±6deg on X, ±8deg on Y)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8])

  // Parallax shift for resting card artwork
  const parallaxX = useTransform(smoothX, [-0.5, 0.5], [-10, 10])
  const parallaxY = useTransform(smoothY, [-0.5, 0.5], [-10, 10])

  // Specular sheen coordinate tracking
  const sheenX = useTransform(smoothX, [-0.5, 0.5], ['-30%', '130%'])
  const sheenY = useTransform(smoothY, [-0.5, 0.5], ['-30%', '130%'])

  // Handle pointer movement across interactive stage
  const handlePointerMove = (e) => {
    if (isTouchDevice || shouldReduceMotion) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    pointerX.set(Math.max(-0.5, Math.min(0.5, x)))
    pointerY.set(Math.max(-0.5, Math.min(0.5, y)))
  }

  // Reset tilt spring physics
  const resetTilt = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  // ---------------------------------------------------------------------------
  // Video Playback Engine
  // ---------------------------------------------------------------------------
  const playVideo = useCallback(() => {
    const vid = videoRef.current
    if (!vid) return

    try {
      vid.playbackRate = PLAYBACK_RATE
    } catch (e) {
      // Ignore if media engine not ready
    }

    const playPromise = vid.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
          if (vid.currentTime > 0.05) {
            setIsActivelyPlaying(true)
          }
        })
        .catch((err) => {
          console.warn('Video playback notice:', err)
          setIsPlaying(false)
          setIsActivelyPlaying(false)
        })
    }
  }, [])

  const pauseAndResetVideo = useCallback(() => {
    const vid = videoRef.current
    if (!vid) return

    vid.pause()
    try {
      vid.currentTime = 0
    } catch (e) {
      // Ignore seek exception
    }
    setIsPlaying(false)
    setIsActivelyPlaying(false)
    setPlayProgress(0)
    setCurrentTime(0)
  }, [])

  // Viewport awareness: automatically pause video if section scrolls off-screen
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && isPlaying) {
          pauseAndResetVideo()
          setIsHovered(false)
          resetTilt()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isPlaying, pauseAndResetVideo])

  // Desktop Hover Handlers
  const handleMouseEnter = () => {
    if (isTouchDevice || shouldReduceMotion) return
    setIsHovered(true)
    playVideo()
  }

  const handleMouseLeave = () => {
    if (isTouchDevice || shouldReduceMotion) return
    setIsHovered(false)
    resetTilt()
    pauseAndResetVideo()
  }

  // Mobile Touch or Direct Card Click Toggle
  const handleCardClick = () => {
    if (isPlaying) {
      pauseAndResetVideo()
      setIsHovered(false)
    } else {
      setIsHovered(true)
      playVideo()
    }
  }

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick()
    }
  }

  // Time update listener
  const handleTimeUpdate = () => {
    const vid = videoRef.current
    if (vid && vid.duration) {
      const cur = vid.currentTime
      setCurrentTime(cur)
      setPlayProgress((cur / vid.duration) * 100)
      if (!isActivelyPlaying && cur > 0.04) {
        setIsActivelyPlaying(true)
      }
    }
  }

  // Format seconds to mm:ss timecode
  const formatTime = (secs) => {
    const s = Math.floor(secs || 0)
    return `00:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <section 
      ref={sectionRef}
      data-cursor-theme="arulis"
      className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto select-none"
    >
      {/* 
        ========================================================================
        EDITORIAL SECTION HEADER
        ========================================================================
      */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>[ 03 · STAFF IDENTITY &amp; DYNAMIC MOTION ]</span>
          </div>
          <h2 className="font-playfair text-[32px] sm:text-[46px] lg:text-[54px] font-normal text-[#1A1D1A] tracking-tight leading-[1.05]">
            Tactile Credentials &amp; <span className="italic font-normal text-[#0F3D2E]">Motion Identity</span>
          </h2>
        </div>

        <p className="font-montserrat text-[#4A5568] text-[14px] sm:text-[15px] max-w-[480px] leading-relaxed">
          The physical clinic staff credential badge paired with the animated brand trajectory. 
          Hover over the ID card to initiate the animated vector reveal reel.
        </p>
      </div>

      {/* 
        ========================================================================
        MAIN INTERACTIVE STAGE & 3D EDITORIAL CANVAS
        ========================================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT / CENTER: Interactive 3D Card Stage (lg:col-span-8) */}
        <div className="lg:col-span-8" style={{ perspective: '1400px' }}>
          <motion.div
            ref={containerRef}
            tabIndex={0}
            role="region"
            aria-label="Interactive Arulis ID Card with brand film reel preview"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onPointerMove={handlePointerMove}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            data-cursor="hover"
            style={shouldReduceMotion ? {} : {
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              scale: isHovered ? 1.012 : 1,
              y: isHovered ? -4 : 0,
            }}
            transition={{
              type: 'spring',
              damping: 24,
              stiffness: 220,
              mass: 0.5,
            }}
            className={`group relative w-full aspect-[16/10] sm:aspect-[16/9.5] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#F6F3EC] to-[#ECE7DE] border border-[#0F3D2E]/15 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/40 transition-shadow duration-500 ${
              isHovered 
                ? 'shadow-[0_28px_80px_-15px_rgba(15,61,46,0.26),0_12px_32px_rgba(0,0,0,0.08)]' 
                : 'shadow-[0_16px_50px_rgba(15,61,46,0.12)]'
            }`}
          >
            {/* 
              ARCHITECTURAL REGISTRATION CORNER TICKS
              Evokes high-end editorial stationery & museum proofing prints
            */}
            <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t border-l border-[#D4AF37]/50 pointer-events-none z-30 transition-opacity duration-300" />
            <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t border-r border-[#D4AF37]/50 pointer-events-none z-30 transition-opacity duration-300" />
            <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 border-b border-l border-[#D4AF37]/50 pointer-events-none z-30 transition-opacity duration-300" />
            <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 border-b border-r border-[#D4AF37]/50 pointer-events-none z-30 transition-opacity duration-300" />

            {/* Subtle inner card border hairline */}
            <div className="absolute inset-0 rounded-[24px] sm:rounded-[32px] border border-white/60 pointer-events-none z-20" />

            {/* Subtle radial ambient warmth */}
            <div 
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)'
              }}
            />

            {/* 
              LAYER 1 — RESTING VISUAL:
              High-resolution Staff ID Badge & Lanyard (`aurelis-id-card.png`)
              Physical parallax shift on hover with smooth crossfade
            */}
            <motion.div 
              style={shouldReduceMotion ? {} : {
                x: parallaxX,
                y: parallaxY,
                translateZ: '18px',
              }}
              className={`absolute inset-0 flex items-center justify-center p-4 sm:p-8 transition-opacity duration-600 ease-in-out z-10 ${
                isActivelyPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <img
                src="/assets/arulis/aurelis-id-card.png"
                alt="Arulis Dental Clinic Staff ID Card & Lanyard Mockup"
                className="w-full h-full object-contain filter drop-shadow-[0_22px_44px_rgba(15,61,46,0.18)] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                loading="eager"
              />
            </motion.div>

            {/* 
              LAYER 2 — ACTIVE VIDEO STAGE:
              H.264 Brand Reel framed seamlessly with zero dead frames & 1.2x speed
            */}
            <div 
              className={`absolute inset-0 flex items-center justify-center bg-[#061711] transition-opacity duration-600 ease-in-out z-10 ${
                isActivelyPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <video
                ref={videoRef}
                src="/video/id_sec_vedio.mp4"
                poster="/assets/arulis/aurelis-id-card.png"
                loop
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={() => {
                  setIsVideoLoaded(true)
                  if (videoRef.current) {
                    videoRef.current.playbackRate = PLAYBACK_RATE
                  }
                }}
                onTimeUpdate={handleTimeUpdate}
                onError={() => setHasError(true)}
                className="w-full h-full object-cover object-center"
              />

              {/* Luxury cinematic vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none" />
            </div>

            {/* 
              LAYER 3 — SPECULAR LIGHT SWEEP / RESTRAINED SHEEN:
              Subtle diagonal champagne reflection gliding smoothly across the card
            */}
            <motion.div
              style={shouldReduceMotion ? {} : {
                x: sheenX,
                y: sheenY,
                translateZ: '30px',
              }}
              className={`absolute -inset-[50%] pointer-events-none z-20 mix-blend-overlay transition-opacity duration-700 ${
                isHovered ? 'opacity-40' : 'opacity-0'
              }`}
            >
              <div 
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.45) 48%, rgba(212,175,55,0.3) 51%, rgba(255,255,255,0.45) 54%, transparent 65%)'
                }}
              />
            </motion.div>

            {/* 
              ==================================================================
              LUXURY PLAYBACK INDICATOR (EDITORIAL HUD)
              Design: [ animated dot ] BRAND FILM / PLAYING
              ==================================================================
            */}
            <div className="absolute bottom-3.5 left-3.5 sm:bottom-6 sm:left-6 z-30 pointer-events-none">
              <motion.div 
                initial={false}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                className={`inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full backdrop-blur-md border transition-all duration-300 font-mono text-[9px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.2em] uppercase ${
                  isActivelyPlaying 
                    ? 'bg-[#061711]/90 border-[#D4AF37]/50 text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                    : isHovered 
                    ? 'bg-[#061711]/80 border-white/20 text-white/95 shadow-md'
                    : 'bg-[#1A1D1A]/75 border-white/10 text-white/80 shadow-sm'
                }`}
              >
                {/* Refined Animated Dot */}
                <span className="relative flex h-2 w-2">
                  {isActivelyPlaying && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-80" />
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 transition-colors duration-300 ${
                    isActivelyPlaying ? 'bg-[#D4AF37]' : isHovered ? 'bg-[#D4AF37]/80' : 'bg-white/50'
                  }`} />
                </span>

                {/* Minimalist Micro State Icon */}
                <span className="text-[#D4AF37]/90 flex items-center">
                  {isActivelyPlaying ? (
                    <Pause className="w-2.5 h-2.5 text-[#D4AF37] fill-[#D4AF37]" />
                  ) : (
                    <Play className="w-2.5 h-2.5 text-[#D4AF37] fill-[#D4AF37]" />
                  )}
                </span>

                {/* Editorial Typography: BRAND FILM / PLAYING */}
                <span className="font-semibold tracking-[0.16em] sm:tracking-[0.2em]">
                  BRAND FILM
                  <span className="text-white/30 mx-1 sm:mx-1.5">/</span>
                  <span className={isActivelyPlaying ? 'text-[#D4AF37]' : 'text-white/85'}>
                    {isActivelyPlaying 
                      ? 'PLAYING' 
                      : isHovered 
                      ? (isTouchDevice ? 'TAP TO START' : 'INITIALIZING')
                      : (isTouchDevice ? 'TAP TO PLAY' : 'READY')}
                  </span>
                </span>

                {/* Refined 1.2x velocity badge (only visible during active playback) */}
                {isActivelyPlaying && (
                  <span className="hidden xs:inline-block text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold tracking-normal">
                    1.2×
                  </span>
                )}
              </motion.div>
            </div>

            {/* 
              TOP-RIGHT ARCHITECTURAL SPEC STAMP
              Restrained, premium editorial label
            */}
            <div className="absolute top-3.5 right-3.5 sm:top-6 sm:right-6 z-30 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#061711]/60 backdrop-blur-md border border-white/10 font-mono text-[10px] sm:text-[11px] text-[#FAF8F5]/80 uppercase tracking-widest">
              <Shield className="w-3 h-3 text-[#D4AF37]" />
              <span>Spec: Physical + Reel</span>
            </div>

            {/* 
              BOTTOM-RIGHT TIMECODE MONITOR
              Minimal time readout like a precision monitor
            */}
            <div className={`absolute bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-30 pointer-events-none ${
              !isActivelyPlaying ? 'hidden sm:block' : 'block'
            }`}>
              <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#061711]/75 backdrop-blur-md border border-white/10 font-mono text-[9px] sm:text-[11px] tracking-wider text-white/80">
                {isActivelyPlaying ? (
                  <>
                    <span className="text-[#D4AF37] font-semibold">{formatTime(currentTime)}</span>
                    <span className="text-white/30">/</span>
                    <span className="text-white/50">00:09</span>
                  </>
                ) : (
                  <span className="text-white/60 tracking-[0.15em] text-[10px]">
                    {isTouchDevice ? 'TAP TO PREVIEW' : 'HOVER TO PREVIEW'}
                  </span>
                )}
              </div>
            </div>

            {/* 
              RAZOR-THIN METALLIC PROGRESS LINE
              Champagne gold hairline gliding along the bottom perimeter
            */}
            {isActivelyPlaying && (
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 z-30 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#B89730] via-[#D4AF37] to-[#FDFBF7] transition-all duration-75"
                  style={{ width: `${playProgress}%` }}
                />
              </div>
            )}
          </motion.div>

          {/* Sub-caption below card */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 font-mono text-[10px] sm:text-[12px] text-[#718096] px-1">
            <span className="tracking-wider">FIG. 02 — STAFF LANYARD &amp; MOTION IDENTITY SYSTEM</span>
            <span className="tracking-widest text-[#A0AEC0]">1920 × 1080 · H.264 · 24 FPS · 1.2× LOOP</span>
          </div>
        </div>

        {/* 
          ======================================================================
          RIGHT COLUMN: TECHNICAL & DESIGN SPECIFICATIONS (lg:col-span-4)
          ======================================================================
        */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Card 1: Physical Specification */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#0F3D2E]/20 transition-colors duration-300">
            <h3 className="font-mono text-[12px] font-bold text-[#0F3D2E] tracking-widest uppercase mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              Tactile Engineering
            </h3>
            <p className="font-montserrat text-[#4A5568] text-[13px] leading-relaxed mb-4">
              Physical credential cards engineered for clinical longevity. Printed on matte recycled polymer with antimicrobial soft-touch coating and debossed gold metallic foil.
            </p>
            <ul className="space-y-2 border-t border-black/5 pt-3 font-mono text-[11px] text-[#2D3748]">
              <li className="flex justify-between items-center py-0.5">
                <span className="text-[#A0AEC0] uppercase tracking-wider">HARDWARE</span>
                <span className="font-semibold text-[#1A1D1A]">Antique Brass Swivel Clasp</span>
              </li>
              <li className="flex justify-between items-center py-0.5">
                <span className="text-[#A0AEC0] uppercase tracking-wider">LANYARD</span>
                <span className="font-semibold text-[#0F3D2E]">Custom Forest Green (#0F3D2E)</span>
              </li>
              <li className="flex justify-between items-center py-0.5">
                <span className="text-[#A0AEC0] uppercase tracking-wider">SECURITY</span>
                <span className="font-semibold text-[#1A1D1A]">Embedded NFC Clinic Access</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Dynamic Motion Rationale */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0F3D2E] text-white border border-[#0F3D2E] shadow-md relative overflow-hidden">
            {/* Background subtle champagne aura */}
            <div 
              className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)'
              }}
            />

            <h3 className="font-mono text-[12px] font-bold text-[#D4AF37] tracking-widest uppercase mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Kinetic Identity
            </h3>
            <p className="font-montserrat text-white/80 text-[13px] leading-relaxed mb-4">
              The Arulis emblem comes alive through kinetic easing — gold particle trajectories trace the anatomical tooth curve, transitioning into the protective crest.
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-white/10 font-mono text-[11px] text-white/70">
              <div className="flex items-center gap-1.5">
                <VolumeX className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Ambient Muted</span>
              </div>
              <span>&middot;</span>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Zero Latency Loop</span>
              </div>
            </div>
          </div>

          {/* Interactive Trigger Button for Touch / Mobile or Quick Toggle */}
          <button
            type="button"
            onClick={handleCardClick}
            data-cursor="hover"
            className="w-full py-3.5 px-5 rounded-full bg-[#1A1D1A] hover:bg-[#0F3D2E] text-white font-mono text-[12px] font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-sm border border-transparent hover:border-[#D4AF37]/30 group active:scale-[0.99]"
          >
            {isPlaying ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-300 group-hover:-rotate-90" />
                <span>Reset Reel Preview</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                <span>Trigger Reel Playback</span>
              </>
            )}
          </button>

        </div>

      </div>

    </section>
  )
}

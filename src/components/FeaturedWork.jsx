import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowDown, Sparkles } from 'lucide-react'
import PosterModal from './PosterModal'

export default function FeaturedWork({ onOpenContact, onNavigate }) {
  const [posterModalOpen, setPosterModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [hoveredId, setHoveredId] = useState(null)

  const categories = [
    { id: 'ALL', label: 'ALL WORK' },
    { id: 'WEB', label: 'WEBDESIGN & DEV' },
    { id: 'BRAND', label: 'BRAND IDENTITY' },
    { id: 'POSTER', label: 'POSTER DESIGN' },
  ]

  // Authentic Northup Studio Project Data
  const projects = [
    {
      id: 'atelier',
      title: 'Atelier',
      categoryTag: 'Webdesign & development',
      category: 'WEB',
      image: '/assets/atelier.jpg',
      alt: 'Atelier Estates Digital Experience',
      type: 'featured-wide', // lg:col-span-8
      inquiry: 'Project Inquiry: Atelier',
      cursorText: 'CASE STUDY ↗',
      route: '/work/atelier-estates',
    },
    {
      id: 'posters',
      title: 'POSTER DESIGN',
      subtitle: 'COLLECTION',
      categoryTag: 'Poster design & art direction',
      category: 'POSTER',
      image: '/assets/posters.jpg',
      alt: 'Poster Design Collection Overview',
      type: 'featured-tall', // lg:col-span-4
      counter: '01 / 06',
      cursorText: 'EXPLORE',
      isPosterModal: true,
    },
    {
      id: 'aurelis',
      title: 'Aurelis',
      categoryTag: 'Brand identity & web development',
      category: 'BRAND',
      secondaryCategory: 'WEB',
      image: '/assets/aurelis.jpg',
      alt: 'Aurelis Dental Brand Identity & Platform',
      type: 'full-wide', // full 12 columns
      inquiry: 'Project Inquiry: Aurelis',
      cursorText: 'CASE STUDY ↗',
      route: '/work/arulis-dental-clinic',
    },
    {
      id: 'cake-studio',
      title: 'Cake Studio',
      categoryTag: 'Web design & development',
      category: 'WEB',
      image: '/assets/cake-studio.jpg',
      alt: 'Cake Studio Platform',
      type: 'grid-3',
      inquiry: 'Project Inquiry: Cake Studio',
      cursorText: 'VIEW ↗',
    },
    {
      id: 'drop-cult',
      title: 'Drop Cult',
      categoryTag: 'Web design & development',
      category: 'WEB',
      image: '/assets/drop-cult.jpg',
      alt: 'Drop Cult Digital Storefront',
      type: 'grid-3',
      inquiry: 'Project Inquiry: Drop Cult',
      cursorText: 'VIEW ↗',
    },
    {
      id: 'aurex',
      title: 'AUREX',
      categoryTag: 'Web design & development',
      category: 'WEB',
      image: '/assets/aurex.jpg',
      alt: 'AUREX Automotive Web Architecture',
      type: 'grid-3',
      inquiry: 'Project Inquiry: AUREX',
      cursorText: 'VIEW ↗',
    },
  ]

  const matchesFilter = (project) => {
    if (activeFilter === 'ALL') return true
    if (activeFilter === 'WEB') return project.category === 'WEB' || project.secondaryCategory === 'WEB'
    if (activeFilter === 'BRAND') return project.category === 'BRAND' || project.secondaryCategory === 'BRAND'
    if (activeFilter === 'POSTER') return project.category === 'POSTER'
    return true
  }

  const handleCardClick = (project, e) => {
    if (project.route && onNavigate) {
      if (e) e.preventDefault()
      onNavigate(project.route)
    } else if (project.isPosterModal) {
      setPosterModalOpen(true)
    } else {
      onOpenContact(project.inquiry)
    }
  }

  return (
    <section id="work" className="relative py-12 sm:py-20 px-2 sm:px-4 lg:px-6 max-w-[1400px] mx-auto scroll-mt-24 select-none">
      
      {/* Section Header & Interactive Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="flex items-center gap-3 sm:gap-4">
          <h2 className="font-hammer text-[38px] sm:text-[50px] lg:text-[62px] font-bold text-black tracking-tight leading-none">
            Featured Work
          </h2>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-black/20 flex items-center justify-center text-black">
            <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
          </div>
        </div>

        {/* Category Filter Pills with Stōkt-style interactive indicator */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => {
            const isActive = activeFilter === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                data-cursor="hover"
                className={`relative px-4 sm:px-5 py-2 rounded-full font-mono text-[12px] sm:text-[13px] font-semibold tracking-wider uppercase transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-black shadow-md'
                    : 'text-black/70 bg-black/5 hover:bg-black/10 hover:text-black border border-black/10'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 rounded-full bg-black -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Projects Showcase Container */}
      <div className="space-y-6 sm:space-y-8">
        
        {/* Row 1: Atelier (col-span-8) + Poster Design (col-span-4) */}
        {(matchesFilter(projects[0]) || matchesFilter(projects[1])) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Atelier Card */}
            {matchesFilter(projects[0]) && (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setHoveredId('atelier')}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleCardClick(projects[0])}
                data-cursor="card"
                data-cursor-text="VIEW ↗"
                className={`${
                  matchesFilter(projects[1]) ? 'lg:col-span-8' : 'lg:col-span-12'
                } relative rounded-3xl overflow-hidden bg-[#15100E] border border-white/[0.1] hover:border-[#FF4D0A]/40 transition-all duration-500 group cursor-pointer aspect-[16/11] lg:aspect-auto lg:h-[632px] shadow-xl ${
                  hoveredId && hoveredId !== 'atelier' ? 'opacity-65 filter brightness-90' : 'opacity-100'
                }`}
              >
                <img 
                  src="/assets/atelier.jpg" 
                  alt="Atelier Estates" 
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/90 via-[#0B0908]/20 to-transparent pointer-events-none" />

                {/* Bottom Title & Badge */}
                <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 flex flex-col items-start gap-3">
                  <h3 className="font-hammer text-[38px] sm:text-[50px] lg:text-[55px] text-[#F5F1ED] tracking-tight leading-none drop-shadow-md">
                    Atelier
                  </h3>
                  <div className="px-5 py-2 rounded-full bg-[#15100E]/85 backdrop-blur-md border border-white/[0.15] text-[#F5F1ED] font-hammer text-[14px] sm:text-[18px] lg:text-[21px] tracking-wide">
                    Webdesign &amp; development
                  </div>
                </div>

                {/* Hover top-right action badge */}
                <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#15100E]/80 backdrop-blur-md border border-white/[0.15] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 text-[#F5F1ED] group-hover:text-[#FF8738] transition-colors" />
                </div>
              </motion.div>
            )}

            {/* Poster Design Card */}
            {matchesFilter(projects[1]) && (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setHoveredId('posters')}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleCardClick(projects[1])}
                data-cursor="card"
                data-cursor-text="EXPLORE"
                className={`${
                  matchesFilter(projects[0]) ? 'lg:col-span-4' : 'lg:col-span-12'
                } relative rounded-3xl overflow-hidden bg-[#15100E] border border-white/[0.1] hover:border-[#FF4D0A]/40 transition-all duration-500 group cursor-pointer aspect-[3/4] lg:aspect-auto lg:h-[632px] shadow-xl ${
                  hoveredId && hoveredId !== 'posters' ? 'opacity-65 filter brightness-90' : 'opacity-100'
                }`}
              >
                <img 
                  src="/assets/posters.jpg" 
                  alt="Poster Design Collection" 
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/95 via-transparent to-transparent pointer-events-none" />

                {/* Top-right index counter */}
                <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-[#0B0908]/85 backdrop-blur-md border border-white/[0.15] text-[#FF8738] font-mono text-[13px] font-bold">
                  01 / 06
                </div>

                {/* Bottom Content Area */}
                <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 flex items-end justify-between">
                  <div>
                    <h3 className="font-jaro text-[32px] sm:text-[42px] leading-tight text-[#F5F1ED] uppercase tracking-wider">
                      POSTER<br />
                      <span className="text-[#FF8738]">DESIGN</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 group/btn">
                    <span className="text-right font-mono text-[10px] sm:text-[11px] text-[#BDB4AE] leading-tight uppercase hidden sm:block">
                      EXPLORE<br />THE<br />COLLECTION
                    </span>
                    <div className="w-12 h-12 rounded-full border border-white/[0.2] group-hover/btn:border-[#FF4D0A] group-hover/btn:bg-[#FF4D0A] flex items-center justify-center transition-all duration-300 shadow-lg">
                      <ArrowUpRight className="w-5 h-5 text-[#F5F1ED] group-hover/btn:rotate-45 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        )}

        {/* Row 2: Aurelis (Full Width) */}
        {matchesFilter(projects[2]) && (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            onMouseEnter={() => setHoveredId('aurelis')}
            onMouseLeave={() => setHoveredId(null)}
            onClick={(e) => handleCardClick(projects[2], e)}
            data-cursor="card"
            data-cursor-text="CASE STUDY ↗"
            className={`relative rounded-3xl overflow-hidden bg-[#15100E] border border-white/[0.1] hover:border-[#FF4D0A]/40 transition-all duration-500 group cursor-pointer aspect-[16/9] lg:aspect-auto lg:h-[632px] shadow-xl ${
              hoveredId && hoveredId !== 'aurelis' ? 'opacity-65 filter brightness-90' : 'opacity-100'
            }`}
          >
            <img 
              src="/assets/aurelis.jpg" 
              alt="Aurelis Dental Brand Identity & Web Development" 
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/90 via-[#0B0908]/20 to-transparent pointer-events-none" />

            {/* Bottom-right Title & Pill Badge */}
            <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 flex flex-col items-end gap-3 text-right">
              <h3 className="font-hammer text-[38px] sm:text-[50px] lg:text-[55px] text-[#F5F1ED] tracking-tight leading-none drop-shadow-md">
                Aurelis
              </h3>
              <div className="px-6 py-2.5 rounded-full bg-[#15100E]/85 backdrop-blur-md border border-white/[0.15] text-[#F5F1ED] font-hammer text-[14px] sm:text-[20px] lg:text-[24px] tracking-wide">
                Brand identity &amp; web development
              </div>
            </div>

            <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#15100E]/80 backdrop-blur-md border border-white/[0.15] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <ArrowUpRight className="w-5 h-5 text-[#F5F1ED] group-hover:text-[#FF8738] transition-colors" />
            </div>
          </motion.div>
        )}

        {/* Row 3: 3-Card Grid (Cake Studio, Drop Cult, AUREX) */}
        {(matchesFilter(projects[3]) || matchesFilter(projects[4]) || matchesFilter(projects[5])) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {[projects[3], projects[4], projects[5]].map((card) => {
              if (!matchesFilter(card)) return null
              const isHovered = hoveredId === card.id
              return (
                <motion.div 
                  layout
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  onMouseEnter={() => setHoveredId(card.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleCardClick(card)}
                  data-cursor="card"
                  data-cursor-text="VIEW ↗"
                  className={`relative rounded-3xl overflow-hidden bg-[#15100E] border border-white/[0.1] hover:border-[#FF4D0A]/40 transition-all duration-500 group cursor-pointer aspect-[452/481] shadow-xl ${
                    hoveredId && !isHovered ? 'opacity-65 filter brightness-90' : 'opacity-100'
                  }`}
                >
                  <img 
                    src={card.image} 
                    alt={card.alt} 
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/90 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-6 left-6 flex flex-col items-start gap-2">
                    <h4 className="font-hammer text-[18px] sm:text-[20px] text-[#F5F1ED] tracking-wide">
                      {card.title}
                    </h4>
                    <div className="px-4 py-1.5 rounded-full bg-[#15100E]/85 backdrop-blur-md border border-white/[0.15] text-[#BDB4AE] font-mono text-[12px]">
                      {card.categoryTag}
                    </div>
                  </div>

                  <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#15100E]/80 backdrop-blur-md border border-white/[0.15] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-[#F5F1ED]" />
                  </div>
                </motion.div>
              )
            })}

          </div>
        )}

      </div>

      {/* Poster Detail Lightbox Modal */}
      <PosterModal 
        isOpen={posterModalOpen} 
        onClose={() => setPosterModalOpen(false)} 
      />
    </section>
  )
}

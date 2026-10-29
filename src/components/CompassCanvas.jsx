import React from 'react'

export default function CompassCanvas({ className = '' }) {
  return (
    <div className={`relative w-full h-full flex items-end justify-center select-none ${className}`}>
      
      {/* Background warm radial glowing aura behind the compass */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[90%] h-[90%] rounded-full bg-gradient-radial from-[#ff4500]/30 via-[#e61a00]/15 to-transparent blur-[80px]" />
      </div>

      {/* Single Brand Compass Graphic: exact 3D artwork matching Figma reference */}
      <img 
        src="/assets/hero-compass-figma.png" 
        alt="Northup Brand Compass" 
        className="relative z-10 w-full h-full object-contain lg:object-fill object-bottom pointer-events-none select-none drop-shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
      />

    </div>
  )
}



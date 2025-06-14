
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

/** 
 * Simple Square Grid Background
 */
const SimpleSquareBackground = () => {
  const rows = 12
  const cols = 20

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="w-full h-full grid gap-[1px] bg-gray-900/20" style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`
      }}>
        {Array.from({ length: rows * cols }, (_, index) => (
          <div
            key={index}
            className="bg-white/5"
          />
        ))}
      </div>
      {/* Noise effect overlay for hero section only */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px',
          animation: 'heroNoise 8s infinite linear'
        }}
      />
    </div>
  )
}

// Slimmer brand text
const CircularText = ({ text }: { text: string }) => (
  <div className="flex justify-center items-center mb-6">
    <div className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs font-medium tracking-wide bg-black/40 backdrop-blur-sm text-cyan-300 select-none">
      {text}
    </div>
  </div>
)

// Gradient text component
const ShinyText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={
    "bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent font-bold " 
    + className
  }>
    {children}
  </span>
)

// Modern hero with simple square background and noise effect
export const ModernHeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative overflow-hidden min-h-[75vh] w-full flex flex-col justify-center items-center py-16 bg-black">
      <SimpleSquareBackground />
      
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none z-10" />

      <div className="relative z-20 flex flex-col w-full items-center px-5">
        <div className="max-w-3xl w-full mx-auto text-center flex flex-col gap-5">
          <CircularText text="Infinite Canvas, Real Collaboration" />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-2">
            <span>
              <ShinyText>Unleash Ideas</ShinyText> 
              <span className="text-cyan-400">.</span>
            </span>
            <br />
            <span className="font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              Together  
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-5 font-medium tracking-tight max-w-xl mx-auto leading-relaxed">
            A secure, real-time, infinite canvas for your next big thing. Instantly sketch, brainstorm, and collaborate—without limits.
          </p>
          
          <div className="flex justify-center items-center mt-2">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-8 py-4 rounded-full font-semibold shadow-xl border-0 hover:from-cyan-300 hover:to-purple-400 hover:scale-105 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400"
              onClick={onGetStarted}
              aria-label="Start Collaborating"
            >
              <span className="flex items-center gap-2 text-lg font-semibold">
                Start Collaborating
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

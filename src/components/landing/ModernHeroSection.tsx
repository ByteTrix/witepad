
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

/** 
 * Interactive Square Grid Background 
 * - On mouse move, highlights the nearest grid square
 */
const InteractiveSquareBackground = () => {
  const rows = 8
  const cols = 16
  const [hovered, setHovered] = useState<{r: number, c: number} | null>(null)

  // Generate grid squares
  return (
    <div className="absolute inset-0 z-0 flex flex-col">
      {[...Array(rows)].map((_, r) => (
        <div className="flex-1 flex flex-row" key={r}>
          {[...Array(cols)].map((_, c) => {
            const isActive = hovered && hovered.r === r && hovered.c === c
            return (
              <div
                key={c}
                className={`flex-1 transition-all duration-200 relative group`}
                style={{
                  minWidth: '0',
                  minHeight: '0',
                  aspectRatio: '1/1',
                  background:
                    isActive
                      ? 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)'
                      : 'rgba(255,255,255,0.02)',
                  boxShadow: isActive
                    ? '0 0 18px 6px #22d3ee44, 0 0 40px 0 #a855f744'
                    : undefined,
                  zIndex: isActive ? 2 : 0,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHovered({ r, c })}
                onMouseMove={() => setHovered({ r, c })}
                onMouseLeave={() => setHovered(null)}
                aria-label={`Square ${r},${c}`}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

// Slimmer, bolder circular brand text
const CircularText = ({ text }: { text: string }) => (
  <div className="flex justify-center items-center mb-6">
    <div className="rounded-full border-2 border-cyan-400/40 px-4 py-1 text-sm font-bold tracking-widest bg-black/40 shadow-md font-satoshi text-cyan-300 select-none">
      {text}
    </div>
  </div>
)

// Lively gradient brand
const ShinyText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={
    "bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent font-extrabold " 
    + className
  }>
    {children}
  </span>
)

// Modern hero
export const ModernHeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative overflow-hidden min-h-[80vh] w-full flex flex-col justify-center items-center py-10 md:py-24 bg-black">
      <InteractiveSquareBackground />
      
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none z-10" />

      <div className="relative z-20 flex flex-col w-full items-center px-5">
        <div className="max-w-4xl w-full mx-auto text-center flex flex-col gap-7">
          <CircularText text="Infinite Canvas, Real Collaboration" />
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-2 transition-all">
            <span>
              <ShinyText>Unleash Ideas</ShinyText> 
              <span className="text-cyan-400">.</span>
            </span>
            <br />
            <span className="font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              Together  
            </span>
          </h1>
          <p className="text-base md:text-xl text-gray-200 mb-6 font-satoshi tracking-tight max-w-2xl mx-auto">
            A secure, real-time, infinite canvas for your next big thing. Instantly sketch, brainstorm, and collaborate—without limits.
          </p>
          <div className="flex justify-center items-center mt-3">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-10 py-5 rounded-full font-bold shadow-xl border-0 hover:from-cyan-300 hover:to-purple-400 hover:scale-105 transition focus-visible:ring-2 focus-visible:ring-cyan-400"
              onClick={onGetStarted}
              aria-label="Start Collaborating"
            >
              <span className="flex items-center gap-3 font-satoshi text-lg font-bold">
                Start Collaborating
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-200" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}


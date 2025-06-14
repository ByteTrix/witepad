
import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import AnimatedBackground from './AnimatedBackground'
import { ClickSpark } from './ClickSpark'
import { StarBorder } from './StarBorder'

// Slimmer brand text
const CircularText = ({ text }: { text: string }) => (
  <div className="flex justify-center items-center mb-6">
    <div className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs font-medium tracking-wide bg-black/40 backdrop-blur-sm text-cyan-300 select-none">
      {text}
    </div>
  </div>
)

// Modern hero with squares background and noise effect
export const ModernHeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative overflow-hidden min-h-[75vh] w-full flex flex-col justify-center items-center py-16 bg-black">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Noise effect overlay for hero section only */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none z-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px',
          animation: 'heroNoise 8s infinite linear'
        }}
      />
      
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none z-10" />

      <div className="relative z-20 flex flex-col w-full items-center px-5">
        <div className="max-w-3xl w-full mx-auto text-center flex flex-col gap-5">
          <CircularText text="Infinite Canvas, Real Collaboration" />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-2">
            <span>
              Unleash Ideas
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
            <ClickSpark>
              <div onClick={onGetStarted}>
                <StarBorder>
                  <span className="flex items-center gap-2 text-lg font-semibold group-hover:text-black transition-colors duration-300">
                    Start Collaborating
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </StarBorder>
              </div>
            </ClickSpark>
          </div>
        </div>
      </div>
    </section>
  )
}

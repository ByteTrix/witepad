
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

// ReactBits-like: CircularText, ShinyText, ClickSpark, VariableProximity, SquareBackground
const CircularText = ({ text, className = "" }: { text: string, className?: string }) => (
  <div className={`flex justify-center items-center mb-8 ${className}`}>
    <svg width="300" height="80">
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        className="fill-cyan-400 text-2xl font-satoshi font-extrabold opacity-95"
        style={{ letterSpacing: 6 }}>
        {text}
      </text>
    </svg>
  </div>
)

const ShinyText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent animate-shiny-text font-extrabold ${className}`}>{children}</span>
)

const ClickSpark = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
  <div onClick={onClick} className="relative cursor-pointer transition-all active:scale-95">{children}</div>
)

const VariableProximity = ({ children }: { children: React.ReactNode }) => (
  <div className="hover:scale-105 active:scale-97 transition-transform duration-150 inline-block">{children}</div>
)

// Square Background Pattern Component
const SquareBackground = () => (
  <div className="absolute inset-0 overflow-hidden opacity-30">
    <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern
          id="squares"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="40"
            height="40"
            fill="none"
            stroke="url(#squareGradient)"
            strokeWidth="1"
            opacity="0.3"
          />
        </pattern>
        <linearGradient id="squareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#squares)" />
    </svg>
    
    {/* Animated floating squares */}
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      >
        <div 
          className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-60"
          style={{
            transform: `rotate(${Math.random() * 45}deg)`
          }}
        />
      </div>
    ))}
  </div>
)

export const ModernHeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative pt-10 md:pt-32 pb-20 min-h-[90vh] flex flex-col justify-center items-center w-full bg-black z-0 select-none transition-all overflow-hidden">
      <SquareBackground />
      
      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-10" />
      
      <div className="relative z-20 text-center max-w-5xl mx-auto space-y-12 px-4">
        <CircularText text="Witepad – Collaborative Canvas" />

        <div className="space-y-10">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-[0.9] flex flex-col gap-4 items-center">
            <span className="block">
              <ShinyText>Draw.</ShinyText>
            </span>
            <span className="block">
              <ShinyText>Share.</ShinyText>
            </span>
            <span className="block">
              <ShinyText>Innovate.</ShinyText>
            </span>
          </h1>
          
          <div className="text-xl md:text-3xl text-gray-200 font-satoshi font-medium max-w-4xl mx-auto leading-relaxed">
            Unleash ideas together. Real‑time, secure, infinite canvas for your team's next big thing.
          </div>
          
          <div className="pt-12 flex justify-center">
            <VariableProximity>
              <ClickSpark onClick={onGetStarted}>
                <Button
                  size="lg"
                  className="group relative bg-gradient-to-r from-cyan-400 to-purple-500 text-black text-xl px-16 py-8 rounded-full font-bold shadow-2xl hover:from-cyan-300 hover:to-purple-400 hover:scale-110 transition-all border-0 hover:shadow-cyan-400/50"
                  tabIndex={0}
                  aria-label="Start Collaborating"
                >
                  <span className="flex items-center gap-3 font-satoshi text-2xl font-bold">
                    Start Collaborating
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </ClickSpark>
            </VariableProximity>
          </div>

          {/* Modern stats section */}
          <div className="pt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { number: '50K+', label: 'Active Users' },
              { number: '1M+', label: 'Drawings Created' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-400 group-hover:text-gray-300 transition-colors font-satoshi">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

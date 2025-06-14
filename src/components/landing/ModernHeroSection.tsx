
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

// Dummy ReactBits components for structure
const CircularText = ({ text, className = "" }: { text: string, className?: string }) => (
  <div className={`flex justify-center items-center mb-4 ${className}`}>
    <svg width="240" height="90">
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        className="fill-cyan-400 text-xl font-satoshi font-bold opacity-85"
        style={{ letterSpacing: 4 }}>
        {text}
      </text>
    </svg>
  </div>
)
const ShinyText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`relative bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent animate-shiny-text font-extrabold ${className}`}>{children}</span>
)
const ScrambleText = ({ text, isVisible }: { text: string, isVisible: boolean }) => {
  // Simple scramble
  const [display, setDisplay] = useState(isVisible ? text : '')
  React.useEffect(() => {
    if (!isVisible) return
    let i = 0
    let scramble = setInterval(() => {
      setDisplay((old) => text.slice(0, i) + '█'.repeat(text.length - i))
      i++
      if (i > text.length) {
        clearInterval(scramble)
        setDisplay(text)
      }
    }, 14)
    return () => clearInterval(scramble)
  }, [isVisible, text])
  return <span className="text-gray-200">{display}</span>
}
const ClickSpark = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  // dummy, just forward
  return <div onClick={onClick} className="relative">{children}</div>
}
const VariableProximity = ({ children }: { children: React.ReactNode }) => (
  <div className="hover:scale-105 active:scale-95 transition-transform duration-150 inline-block">{children}</div>
)

export const ModernHeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [showSubtitle, setShowSubtitle] = useState(false)
  React.useEffect(() => {
    // Delay for scramble animation
    const timer = setTimeout(() => setShowSubtitle(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-4 pt-20 pb-8 bg-black w-full">
      <CircularText text="• Collaborative Whiteboard •" />
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.13]">
          <ShinyText>Draw.</ShinyText>
          <span>{" "}</span>
          <ShinyText>Share.</ShinyText>
          <span>{" "}</span>
          <ShinyText>Innovate.</ShinyText>
        </h1>
        <div className="text-lg md:text-2xl text-gray-300 font-satoshi font-medium min-h-[50px]">
          <ScrambleText
            text="Unleash ideas together. Real‑time, secure, infinite canvas for your team’s next big thing."
            isVisible={showSubtitle}
          />
        </div>
        <div className="pt-7 flex justify-center">
          <VariableProximity>
            <ClickSpark onClick={onGetStarted}>
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-cyan-400 to-purple-500 text-black text-lg px-12 py-6 rounded-full font-semibold shadow-lg hover:from-cyan-300 hover:to-purple-400 hover:scale-105 transition-all"
              >
                <span className="flex items-center gap-2 font-satoshi text-xl font-bold">
                  Start Collaborating
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </ClickSpark>
          </VariableProximity>
        </div>
      </div>
    </section>
  )
}

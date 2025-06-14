
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const ShinyText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10 bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent animate-pulse">
        {children}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-white/20 to-purple-400/20 blur-lg animate-pulse" />
    </span>
  )
}

const DecryptedText = ({ text, className = "" }: { text: string, className?: string }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, text])

  return <span className={className}>{displayText}</span>
}

const CircularText = ({ text, className = "" }: { text: string, className?: string }) => {
  return (
    <div className={`relative w-64 h-64 ${className}`}>
      <svg className="w-full h-full animate-spin" style={{ animationDuration: '20s' }} viewBox="0 0 100 100">
        <defs>
          <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
        </defs>
        <text className="text-xs fill-cyan-400/60">
          <textPath href="#circle">{text}</textPath>
        </text>
      </svg>
    </div>
  )
}

const ClickSpark = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  const [sparks, setSparks] = useState<Array<{ id: number, x: number, y: number }>>([])

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newSpark = { id: Date.now(), x, y }
    setSparks(prev => [...prev, newSpark])
    
    setTimeout(() => {
      setSparks(prev => prev.filter(spark => spark.id !== newSpark.id))
    }, 1000)
    
    onClick?.()
  }

  return (
    <div className="relative" onClick={handleClick}>
      {children}
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="absolute pointer-events-none"
          style={{ left: spark.x, top: spark.y }}
        >
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
        </div>
      ))}
    </div>
  )
}

const Noise = () => {
  return (
    <div className="absolute inset-0 opacity-[0.015] mix-blend-screen">
      <div 
        className="w-full h-full bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px'
        }}
      />
    </div>
  )
}

const Squares = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/10 rotate-45 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  )
}

export const ModernHeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <Noise />
      <Squares />
      
      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-black to-purple-900/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <div className="space-y-12">
          {/* Circular Text */}
          <div className="flex justify-center">
            <CircularText text="• COLLABORATIVE • WHITEBOARD • INNOVATION • " className="opacity-60" />
          </div>

          {/* Main Title */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <ShinyText>Create.</ShinyText>
              <br />
              <ShinyText>Collaborate.</ShinyText>
              <br />
              <ShinyText>Innovate.</ShinyText>
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                <DecryptedText text="The future of collaborative whiteboarding. Real-time sync, infinite canvas, limitless creativity." />
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <ClickSpark onClick={onGetStarted}>
              <Button 
                size="lg"
                className="group relative bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-black text-lg px-12 py-6 h-auto rounded-full shadow-lg hover:shadow-2xl hover:shadow-cyan-400/25 transition-all duration-300 transform hover:scale-105 border-0 font-semibold"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Collaborating
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity" />
              </Button>
            </ClickSpark>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-12 py-6 h-auto rounded-full border-2 border-cyan-400/50 text-white hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 group backdrop-blur-sm"
            >
              <span className="flex items-center gap-3">
                Watch Demo
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse group-hover:animate-bounce" />
              </span>
            </Button>
          </div>

          {/* Stats */}
          <div className="pt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { number: '50K+', label: 'Active Users' },
              { number: '1M+', label: 'Drawings Created' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
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

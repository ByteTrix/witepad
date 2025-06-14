
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export const ModernHeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [decryptedText, setDecryptedText] = useState('')
  const finalText = 'The future of collaborative whiteboarding'

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Decrypt text animation effect
  useEffect(() => {
    let currentIndex = 0
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    const decrypt = () => {
      if (currentIndex < finalText.length) {
        let scrambled = ''
        for (let i = 0; i < finalText.length; i++) {
          if (i < currentIndex) {
            scrambled += finalText[i]
          } else if (i === currentIndex) {
            scrambled += chars[Math.floor(Math.random() * chars.length)]
          } else {
            scrambled += ' '
          }
        }
        setDecryptedText(scrambled)
        
        setTimeout(() => {
          setDecryptedText(finalText.substring(0, currentIndex + 1))
          currentIndex++
          if (currentIndex <= finalText.length) {
            setTimeout(decrypt, 50)
          }
        }, 50)
      }
    }
    
    const timer = setTimeout(decrypt, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Noise Background */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Animated Squares */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Dynamic mouse follower */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.3s ease-out'
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <div className="space-y-8">
          {/* Circular Text Effect */}
          <div className="relative w-80 h-80 mx-auto mb-8">
            <svg className="w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
              <path
                id="circle"
                d="M 160,160 m -120,0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0"
                fill="none"
              />
              <text className="text-sm fill-gray-400">
                <textPath href="#circle" startOffset="0%">
                  • COLLABORATE • CREATE • INNOVATE • COLLABORATE • CREATE • INNOVATE 
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* Shiny Text Effect for Main Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold relative">
              <span className="bg-gradient-to-r from-white via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Witepad
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-1000" />
            </h1>
            
            {/* Decrypted Text */}
            <div className="h-8">
              <p className="text-xl md:text-2xl text-gray-300 font-mono">
                {decryptedText}
              </p>
            </div>
          </div>

          {/* CTA Buttons with ClickSpark effect */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="group relative bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-lg px-12 py-6 h-auto rounded-full shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 border-0 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Collaborating
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
              {/* Click spark effect */}
              <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-150">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
              </div>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-12 py-6 h-auto rounded-full border-2 border-purple-500/50 text-white hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 group relative overflow-hidden"
            >
              <span className="flex items-center gap-3 relative z-10">
                Watch Demo
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse group-hover:animate-bounce" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-cyan-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>

          {/* Stats with Variable Proximity Effect */}
          <div className="pt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { number: '50K+', label: 'Active Users' },
              { number: '1M+', label: 'Drawings Created' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-125"
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
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

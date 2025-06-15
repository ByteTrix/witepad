
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: 'all 0.3s ease-out'
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <div className="space-y-8">
          {/* Animated Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight animate-fade-in">
              Create.
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-white bg-clip-text text-transparent">
                Collaborate.
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Innovate.
              </span>
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl">
                The future of collaborative whiteboarding is here. Real-time sync, infinite canvas, zero limits.
              </p>
              <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="group relative bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-lg px-12 py-6 h-auto rounded-full shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 border-0"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Collaborating
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-12 py-6 h-auto rounded-full border-2 border-purple-500/50 text-white hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 group"
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

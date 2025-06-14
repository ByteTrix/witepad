
import { Palette, Users, Zap, Cloud, Shield, Globe } from 'lucide-react'
import React, { useState } from 'react'

const ScrambleText = ({ text, isVisible }: { text: string, isVisible: boolean }) => {
  const [displayText, setDisplayText] = useState(text)

  React.useEffect(() => {
    if (!isVisible) return

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let iteration = 0

    const interval = setInterval(() => {
      setDisplayText(prev => 
        prev.split('').map((char, index) => {
          if (index < iteration) {
            return text[index]
          }
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')
      )

      if (iteration >= text.length) {
        clearInterval(interval)
      }

      iteration += 1 / 3
    }, 30)

    return () => clearInterval(interval)
  }, [isVisible, text])

  return <span>{displayText}</span>
}

const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <div 
      className={`relative group bg-black border border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight Effect */}
      {isHovered && (
        <div 
          className="absolute inset-0 opacity-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.3), transparent 40%)`
          }}
        />
      )}
      
      {/* Border Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

const ScrollReveal = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref])

  return (
    <div 
      ref={setRef}
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  )
}

export const ModernFeaturesSection = () => {
  const features = [
    {
      icon: Palette,
      title: "Infinite Canvas",
      description: "Draw without limits on an infinite canvas with professional-grade tools and vector graphics.",
      gradient: "from-pink-400 to-rose-400"
    },
    {
      icon: Users,
      title: "Real-time Collaboration", 
      description: "Work together seamlessly with live cursors, instant updates, and team presence indicators.",
      gradient: "from-cyan-400 to-blue-400"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with instant loading and smooth 60fps drawing experience.",
      gradient: "from-yellow-400 to-orange-400"
    },
    {
      icon: Cloud,
      title: "Cloud Sync",
      description: "Automatic saving and syncing across all devices with version history and backup protection.",
      gradient: "from-green-400 to-emerald-400"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption, SSO support, and compliance with industry security standards.",
      gradient: "from-purple-400 to-indigo-400"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your work from anywhere with offline support and global CDN distribution.",
      gradient: "from-teal-400 to-green-400"
    }
  ]

  return (
    <section id="features" className="py-32 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center space-y-6 mb-20">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Everything you need to bring your ideas to life with cutting-edge collaboration tools
              </p>
            </div>
          </ScrollReveal>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} className={`delay-${index * 100}`}>
                <SpotlightCard className="h-full">
                  <div className="p-8 space-y-6 h-full flex flex-col">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-black" />
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                        <ScrambleText text={feature.title} isVisible={true} />
                      </h3>
                      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

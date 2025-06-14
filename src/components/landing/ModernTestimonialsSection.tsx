
import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

const ShapeBlur = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 blur-3xl rounded-full" />
    </div>
  )
}

const ScrollReveal = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
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

export const ModernTestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer at TechCorp",
      content: "Witepad has revolutionized how our design team collaborates. The real-time sync is flawless and the infinite canvas gives us unlimited creative freedom.",
      avatar: "SC",
      gradient: "from-cyan-400 to-blue-400"
    },
    {
      name: "Marcus Rodriguez", 
      role: "Engineering Manager at StartupX",
      content: "We've tried many whiteboard tools, but nothing comes close to Witepad's performance and feature set. It's become essential to our daily workflow.",
      avatar: "MR",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      name: "Emily Watson",
      role: "UX Lead at Innovation Labs", 
      content: "The collaborative features are incredible. Our remote team feels more connected than ever, and the drawing tools are professional-grade.",
      avatar: "EW",
      gradient: "from-green-400 to-emerald-400"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section id="testimonials" className="py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center space-y-6 mb-20">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
                Loved by Teams
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Join thousands of teams who have transformed their collaboration with Witepad
              </p>
            </div>
          </ScrollReveal>

          {/* Testimonials Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="relative bg-black/50 border border-cyan-400/20 backdrop-blur-sm overflow-hidden rounded-3xl group hover:border-cyan-400/40 transition-all duration-500">
                      {/* Shape Blur Effect */}
                      <ShapeBlur className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10 p-12 text-center">
                        {/* Stars */}
                        <div className="flex justify-center gap-1 mb-8">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>

                        {/* Quote */}
                        <blockquote className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8 italic">
                          "{testimonial.content}"
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg`}>
                            {testimonial.avatar}
                          </div>
                          <div className="text-left">
                            <div className="text-lg font-semibold text-white">{testimonial.name}</div>
                            <div className="text-gray-400">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-400 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

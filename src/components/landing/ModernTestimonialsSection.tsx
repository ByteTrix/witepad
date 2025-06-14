
import { Star, Quote } from 'lucide-react'

export const ModernTestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Design Lead @ TechCorp',
      content: 'Witepad transformed how our design team collaborates. The real-time sync is incredible!',
      rating: 5,
      avatar: 'SC'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Product Manager @ StartupXYZ',
      content: 'Finally, a whiteboard tool that actually works. Clean interface, powerful features.',
      rating: 5,
      avatar: 'MR'
    },
    {
      name: 'Emily Thompson',
      role: 'UX Designer @ InnovateLab',
      content: 'The infinite canvas and smooth drawing experience make brainstorming sessions so much better.',
      rating: 5,
      avatar: 'ET'
    }
  ]

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-900/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-l from-cyan-900/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Loved by Teams
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what creative professionals are saying about Witepad
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative"
                style={{ 
                  animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
                }}
              >
                {/* Spotlight Card Effect */}
                <div className="relative p-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 hover:border-purple-500/50 transition-all duration-500 group-hover:transform group-hover:scale-105">
                  {/* Shape blur glow behind card */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Quote icon */}
                  <div className="relative mb-6">
                    <Quote className="h-8 w-8 text-purple-400 group-hover:text-cyan-400 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="space-y-6 relative">
                    <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                      "{testimonial.content}"
                    </p>

                    {/* Rating */}
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-5 w-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

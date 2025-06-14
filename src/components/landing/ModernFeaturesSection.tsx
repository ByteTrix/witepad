
import { Zap, Users, Palette, Download } from 'lucide-react'

export const ModernFeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'See changes instantly as your team collaborates',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with unlimited team members',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Palette,
      title: 'Creative Tools',
      description: 'Rich drawing tools and infinite canvas for your ideas',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Download,
      title: 'Export Anywhere',
      description: 'Save your work in multiple formats',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header with Scramble Text Effect */}
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to bring your ideas to life
            </p>
          </div>

          {/* Features Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Spotlight Card Effect */}
                <div className="relative p-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 hover:border-purple-500/50 transition-all duration-500 group-hover:transform group-hover:scale-105">
                  {/* TrueFocus spotlight effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Shape blur behind icon */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500`} />
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Border glow effect */}
                  <div className="absolute inset-0 rounded-3xl border border-purple-500/0 group-hover:border-purple-500/50 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

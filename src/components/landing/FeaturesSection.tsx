
import { Palette, Users, Zap, Cloud, Shield, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const FeaturesSection = () => {
  const features = [
    {
      icon: Palette,
      title: "Infinite Canvas",
      description: "Draw without limits on an infinite canvas with professional-grade tools and vector graphics.",
      gradient: "from-pink-500 to-rose-500",
      glowColor: "pink"
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with live cursors, instant updates, and team presence indicators.",
      gradient: "from-cyan-500 to-blue-500",
      glowColor: "cyan"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with instant loading and smooth 60fps drawing experience.",
      gradient: "from-yellow-500 to-orange-500",
      glowColor: "yellow"
    },
    {
      icon: Cloud,
      title: "Cloud Sync",
      description: "Automatic saving and syncing across all devices with version history and backup protection.",
      gradient: "from-green-500 to-emerald-500",
      glowColor: "green"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption, SSO support, and compliance with industry security standards.",
      gradient: "from-purple-500 to-indigo-500",
      glowColor: "purple"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your work from anywhere with offline support and global CDN distribution.",
      gradient: "from-teal-500 to-green-500",
      glowColor: "teal"
    }
  ]

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to bring your ideas to life with cutting-edge collaboration tools
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl backdrop-blur-sm relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
                
                <CardContent className="p-8 space-y-6 relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

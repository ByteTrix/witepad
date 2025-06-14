
import { UserPlus, Share2, Brush } from 'lucide-react'

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create",
      description: "Sign up and create your first collaborative whiteboard in seconds",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Share2,
      title: "Invite",
      description: "Share your board with team members and start collaborating instantly",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: Brush,
      title: "Draw",
      description: "Unleash your creativity with powerful drawing tools and real-time sync",
      gradient: "from-green-500 to-emerald-500"
    }
  ]

  return (
    <section className="py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get started in three simple steps and transform the way your team collaborates
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-px bg-gradient-to-r from-purple-500 via-cyan-500 to-green-500 opacity-30" />
            
            {steps.map((step, index) => (
              <div key={index} className="text-center group relative">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                  {index + 1}
                </div>

                {/* Icon Container */}
                <div className="relative mb-8">
                  <div className={`w-32 h-32 mx-auto bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <step.icon className="h-16 w-16 text-white" />
                  </div>
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br ${step.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-300 transition-colors duration-300 max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


import { useState } from 'react'
import { Play, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const DemoPreviewSection = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-900/20 via-transparent to-cyan-900/20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              See It In Action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of real-time collaboration with our interactive demo
            </p>
          </div>

          {/* Demo Container */}
          <div 
            className="relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Demo Frame */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-500">
              {/* Browser Bar */}
              <div className="flex items-center gap-2 p-4 bg-gray-800/50 border-b border-gray-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-sm text-gray-400 bg-gray-700/50 rounded-lg px-4 py-1 inline-block">
                    witepad.app/demo
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 flex items-center justify-center">
                {/* Simulated Drawing Canvas */}
                <div className="absolute inset-4 bg-black/30 rounded-2xl border border-gray-700/50 overflow-hidden">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 opacity-20"
                       style={{
                         backgroundImage: `
                           linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                         `,
                         backgroundSize: '20px 20px'
                       }}
                  />
                  
                  {/* Animated Drawing Elements */}
                  <div className="absolute top-8 left-8 w-24 h-16 border-2 border-purple-400 rounded-lg animate-pulse" />
                  <div className="absolute top-12 right-12 w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full opacity-60 animate-bounce" />
                  <div className="absolute bottom-8 left-1/3 w-32 h-2 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full" />
                  
                  {/* Cursor Indicators */}
                  <div className="absolute top-16 left-24 w-4 h-4 bg-blue-400 rounded-full animate-ping" />
                  <div className="absolute bottom-16 right-24 w-4 h-4 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                </div>

                {/* Play Button Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-black/20' : 'bg-black/40'}`}>
                  <Button 
                    size="lg"
                    className={`group relative bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full p-8 transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
                  >
                    <Play className="h-8 w-8 ml-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute -bottom-4 -right-4 flex gap-4">
              <Button 
                size="sm"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full p-3"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}

import { Github, Twitter, Linkedin, Mail, PenTool } from 'lucide-react'
import { ClickSpark } from './ClickSpark'

const Noise = () => {
  return (
    <div className="absolute inset-0 opacity-[0.02] mix-blend-screen">
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
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/5 rotate-45 animate-pulse"
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

export const ModernFooter = () => {
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' }
  ]

  const footerLinks = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Integrations', 'API']
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press']
    },
    {
      title: 'Support',
      links: ['Help Center', 'Contact', 'Status', 'Community']
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Security', 'Cookies']
    }
  ]

  return (
    <footer className="bg-black border-t border-cyan-400/20 relative overflow-hidden">
      <Noise />
      <Squares />
      
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-900/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-900/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/25">
                  <PenTool className="h-5 w-5 text-black" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Witepad
                </span>
              </div>
              
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                The future of collaborative whiteboarding. Create, share, and innovate together with teams around the world.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <ClickSpark key={index}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className="w-12 h-12 bg-gray-900 hover:bg-gradient-to-br hover:from-cyan-400 hover:to-purple-500 rounded-xl flex items-center justify-center text-gray-400 hover:text-black transition-all duration-300 group border border-gray-800 hover:border-cyan-400/50"
                    >
                      <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </a>
                  </ClickSpark>
                ))}
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerLinks.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-semibold text-white text-lg">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Witepad. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Made with ❤️ for creative teams</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

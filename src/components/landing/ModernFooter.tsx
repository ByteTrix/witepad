
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { PenTool } from 'lucide-react'

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
    <footer className="bg-black border-t border-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-900/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-cyan-900/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <PenTool className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Witepad
                </span>
              </div>
              
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                The future of collaborative whiteboarding. Create, share, and innovate together with teams around the world.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 bg-gray-900 hover:bg-gradient-to-br hover:from-purple-600 hover:to-cyan-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 group"
                  >
                    <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </a>
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
                          className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline"
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
          <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
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

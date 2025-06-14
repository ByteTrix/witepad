
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { AuthDialog } from './AuthDialog'
import { useNavigate } from 'react-router-dom'
import GooeyNav from '@/blocks/Components/GooeyNav/GooeyNav'
import { PenTool } from 'lucide-react'

export const Header = ({ flat = false }: { flat?: boolean }) => {
  const { user, signOut } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'Demo', href: '#demo' },
    { label: 'Testimonials', href: '#testimonials' }
  ]

  return (
    <>
      {/* Modern floating glass navbar */}
      <nav className="fixed left-1/2 top-6 z-[99] -translate-x-1/2 w-[98vw] max-w-5xl rounded-2xl shadow-2xl bg-black/85 ring-2 ring-cyan-400/15 backdrop-blur-2xl px-6 py-2 flex items-center justify-between transition-all border border-cyan-400/10 gap-2">
        {/* Logo/brand */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform">
            <PenTool className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent tracking-tight select-none">
            Witepad
          </span>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center text-sm">
          <GooeyNav 
            items={navItems}
            colors={[1,2,3,4]}
            initialActiveIndex={0}
          />
        </div>

        <div className="flex items-center gap-2">
          {!user && (
            <Button
              size="sm"
              className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black px-6 py-1 rounded-full shadow-lg hover:scale-105 transition"
              onClick={() => setAuthDialogOpen(true)}
            >
              Get Started
            </Button>
          )}
        </div>
      </nav>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <div className="h-20 md:h-24" /> {/* Spacer for floating nav */}
    </>
  )
}

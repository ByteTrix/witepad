
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeroSection } from '@/components/landing/HeroSection'
import { AuthDialog } from '@/components/AuthDialog'

const Index = () => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  useEffect(() => {
    // If authenticated, redirect to documents
    if (user) {
      navigate('/documents')
    }
  }, [user, navigate])

  const handleGetStarted = () => {
    setShowAuthDialog(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400/30 border-t-cyan-400 mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-purple-400/20 mx-auto"></div>
          </div>
          <p className="text-gray-300 text-lg">Loading Witepad...</p>
        </div>
      </div>
    )
  }
  if (!user) {
    return (
      <>
        <HeroSection onGetStarted={handleGetStarted} />
        <AuthDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog} 
        />
      </>
    )
  }

  // This should not render as authenticated users are redirected.
  return null
}

export default Index

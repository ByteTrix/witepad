
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { AuthDialog } from '@/components/AuthDialog'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useDocuments } from '@/hooks/useDocuments'

// Import new modern landing page components
import { ModernHeroSection } from '@/components/landing/ModernHeroSection'
import { ModernFeaturesSection } from '@/components/landing/ModernFeaturesSection'
import { ModernDemoSection } from '@/components/landing/ModernDemoSection'
import { ModernTestimonialsSection } from '@/components/landing/ModernTestimonialsSection'
import { ModernFooter } from '@/components/landing/ModernFooter'

const Index = () => {
  const { user, isLoading } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const navigate = useNavigate();
  const { createDocument } = useDocuments()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-cyan-500/20 mx-auto"></div>
          </div>
          <p className="text-gray-300 text-lg">Loading Witepad...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        
        <ModernHeroSection onGetStarted={() => setAuthDialogOpen(true)} />
        <ModernFeaturesSection />
        <ModernDemoSection />
        <ModernTestimonialsSection />
        <ModernFooter />
        
        <AuthDialog 
          open={authDialogOpen} 
          onOpenChange={setAuthDialogOpen} 
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-black">
      <Header />
      <div className="pt-20 h-screen">
        <div className="container mx-auto p-6">
          <div className="flex flex-col items-center justify-center gap-12 pt-20">
            <div className="text-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome back to Witepad
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                Continue creating and collaborating on beautiful diagrams and sketches with your team
              </p>
            </div>
            
            <div className="flex gap-6">
              <Button 
                size="lg"
                onClick={() => navigate('/documents')}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full px-8 py-4 text-lg hover:scale-105 transition-all duration-200"
              >
                My Documents
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => {
                  const createAndNavigate = async () => {
                    const doc = await createDocument('Untitled Drawing')
                    if (doc) {
                      navigate(`/editor/${doc.id}`)
                    }
                  }
                  createAndNavigate()
                }}
                className="rounded-full border-2 border-purple-500/50 text-white hover:bg-purple-500/10 hover:border-purple-400 px-8 py-4 text-lg hover:scale-105 transition-all duration-200"
              >
                New Document
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index

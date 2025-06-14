import { TldrawEditor } from '@/components/TldrawEditor'
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { AuthDialog } from '@/components/AuthDialog'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Palette, Zap, Users, Cloud } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDocuments } from '@/hooks/useDocuments'

const Index = () => {
  const { user, isLoading } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const navigate = useNavigate();
  const { createDocument } = useDocuments()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading Witepad...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Create. Collaborate. Draw.
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A modern, collaborative drawing platform built for teams and individuals who want to bring their ideas to life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setAuthDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-lg px-8"
              >
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setAuthDialogOpen(true)}
                className="text-lg px-8"
              >
                Sign In
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Powerful Drawing Tools</h3>
                <p className="text-muted-foreground">
                  Professional drawing tools with advanced features for creating detailed diagrams and artwork.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Real-time Collaboration</h3>
                <p className="text-muted-foreground">
                  Work together in real-time with your team. See changes instantly as they happen.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Cloud Storage</h3>
                <p className="text-muted-foreground">
                  Your drawings are automatically saved and synced across all your devices.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <AuthDialog 
          open={authDialogOpen} 
          onOpenChange={setAuthDialogOpen} 
        />
      </div>
    )
  }
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="pt-16 h-screen">
        <div className="container mx-auto p-6">
          <div className="flex flex-col items-center justify-center gap-8 pt-12">
            <h1 className="text-3xl font-bold text-center">Welcome to Witepad</h1>
            <p className="text-center text-muted-foreground max-w-2xl">
              Create and collaborate on beautiful diagrams and sketches
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg"
                onClick={() => navigate('/documents')}
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
